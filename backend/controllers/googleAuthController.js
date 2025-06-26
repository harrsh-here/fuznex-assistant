require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

function generateRandomString(len = 16) {
  return crypto.randomBytes(len).toString('hex');
}

let googleClient = null;

async function getGoogleClient() {
  if (googleClient) return googleClient;

  console.log('🔍 Discovering Google OAuth Issuer...');
  const { Issuer } = await import('openid-client');
  const googleIssuer = await Issuer.discover('https://accounts.google.com');

  googleClient = new googleIssuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_CALLBACK_URL],
    response_types: ['code'],
  });

  console.log('✅ Google OAuth client initialized');
  return googleClient;
}

exports.googleLogin = async (req, res) => {
  try {
    console.log('➡️ Initiating Google login...');
    const client = await getGoogleClient();
    const state = generateRandomString();
    const nonce = generateRandomString();

    const authUrl = client.authorizationUrl({
      scope: 'openid email profile',
      state,
      nonce,
    });

    console.log('🔗 Redirecting user to Google auth URL...');
    res.redirect(authUrl);
  } catch (err) {
    console.error('❌ Error during Google login:', err);
    res.status(500).send('Internal Server Error during Google login');
  }
};

exports.googleCallback = async (req, res) => {
  try {
    console.log('↩️ Google OAuth callback triggered');
    const client = await getGoogleClient();
    const params = client.callbackParams(req);

    console.log('🔁 Exchanging code for tokens...');
    const tokenSet = await client.callback(process.env.GOOGLE_CALLBACK_URL, params);
    console.log('✅ Tokens received:', tokenSet);

    console.log('👤 Fetching user info...');
    const userinfo = await client.userinfo(tokenSet.access_token);
    console.log('✅ User info received:', userinfo);

    let user = await User.findOne({ where: { email: userinfo.email } });
    if (!user) {
      console.log('🆕 New user - creating in DB');
      const randomPassword = crypto.randomBytes(20).toString('hex');

      user = await User.create({
        name: userinfo.name || userinfo.email.split('@')[0],
        email: userinfo.email,
        password: randomPassword,
        provider: 'google',
        provider_id: userinfo.sub,
        oauth_access_token: tokenSet.access_token,
        oauth_refresh_token: tokenSet.refresh_token || null,
        role: 'user',
      });

      console.log('✅ User created:', user.user_id);
    } else {
      console.log('👤 Existing user found:', user.user_id);
    }

    const accessToken = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: user.user_id },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🔐 Tokens generated for user');

    const redirectTo = new URL(`${process.env.FRONTEND_URL}/auth/success`);
    redirectTo.searchParams.set('accessToken', accessToken);
    redirectTo.searchParams.set('refreshToken', refreshToken);

    console.log('🌐 Redirecting to frontend:', redirectTo.toString());
    return res.redirect(redirectTo.toString());
  } catch (err) {
    console.error('❌ Google OAuth Error:', err);
    res.status(500).send('Internal Server Error during Google OAuth');
  }
};
