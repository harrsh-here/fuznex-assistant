require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Generate secure random string
function generateRandomString(len = 32) {
  return crypto.randomBytes(len).toString('hex');
}

let googleClient = null;
async function getGoogleClient() {
  if (googleClient) return googleClient;
  const { Issuer } = await import('openid-client');
  const googleIssuer = await Issuer.discover('https://accounts.google.com');

  googleClient = new googleIssuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_CALLBACK_URL],
    response_types: ['code'],
  });

  return googleClient;
}

// STEP 1: Redirect to Google Login
exports.googleLogin = async (req, res) => {
  try {
    const client = await getGoogleClient();
    const state = generateRandomString();
    const nonce = generateRandomString();

    // Save state + nonce in secure cookies
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 5 * 60 * 1000 // 5 min
    });

    res.cookie('oauth_nonce', nonce, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 5 * 60 * 1000
    });

    const authUrl = client.authorizationUrl({
      scope: 'openid email profile',
      state,
      nonce,
    });

    console.log('🔐 Redirecting to Google:', authUrl);
    return res.redirect(authUrl);
  } catch (err) {
    console.error('Error generating Google Auth URL:', err);
    res.status(500).send('Internal Server Error during Google OAuth Login');
  }
};

// STEP 2: Google Callback → Exchange Code for Tokens
exports.googleCallback = async (req, res) => {
  try {
    const client = await getGoogleClient();
    const params = client.callbackParams(req);

    // Extract state/nonce from cookies
    const expectedState = req.cookies['oauth_state'];
    const expectedNonce = req.cookies['oauth_nonce'];

    if (!expectedState || !expectedNonce) {
      console.warn('⚠️ Missing state/nonce cookie');
      return res.status(400).send('Missing OAuth state or nonce');
    }

    console.log('🔄 Verifying callback with:', {
      expectedState,
      receivedState: params.state,
      expectedNonce,
    });

    // Validate state and nonce
    const tokenSet = await client.callback(
      process.env.GOOGLE_CALLBACK_URL,
      params,
      { state: expectedState, nonce: expectedNonce }
    );

    const userinfo = await client.userinfo(tokenSet.access_token);
    console.log('✅ Google user info:', userinfo);

    let user = await User.findOne({ where: { email: userinfo.email } });

    if (!user) {
      user = await User.create({
        name: userinfo.name || userinfo.email.split('@')[0],
        email: userinfo.email,
        password: crypto.randomBytes(20).toString('hex'),
        provider: 'google',
        provider_id: userinfo.sub,
        oauth_access_token: tokenSet.access_token,
        oauth_refresh_token: tokenSet.refresh_token || null,
        role: 'user',
      });
      console.log('👤 Created new Google user:', user.email);
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

    const redirectTo = new URL(`${process.env.FRONTEND_URL}/auth/success`);
    redirectTo.searchParams.set('accessToken', accessToken);
    redirectTo.searchParams.set('refreshToken', refreshToken);

    // Clear cookies after use
    res.clearCookie('oauth_state');
    res.clearCookie('oauth_nonce');

    console.log('🔁 Redirecting back to frontend:', redirectTo.toString());
    return res.redirect(redirectTo.toString());
  } catch (err) {
    console.error('❌ Google OAuth Callback Error:', err);
    res.status(500).send('Internal Server Error during Google OAuth');
  }
};
