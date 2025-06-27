require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Issuer } = require('openid-client');
const User = require('../models/User');

let googleClient = null;

async function getGoogleClient() {
  if (googleClient) return googleClient;

  const googleIssuer = await Issuer.discover('https://accounts.google.com');
  googleClient = new googleIssuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_CALLBACK_URL],
    response_types: ['code'],
  });

  return googleClient;
}

function generateRandomString(len = 16) {
  return crypto.randomBytes(len).toString('hex');
}

exports.googleLogin = async (req, res) => {
  try {
    const client = await getGoogleClient();
    const state = generateRandomString();
    const nonce = generateRandomString();

    req.session.oauthState = state;
    req.session.oauthNonce = nonce;

    const authUrl = client.authorizationUrl({
      scope: 'openid email profile',
      state,
      nonce,
    });

    console.log('[OAuth] Redirecting to:', authUrl);
    res.redirect(authUrl);
  } catch (err) {
    console.error('[OAuth] Error initiating Google login:', err);
    res.status(500).send('Error initiating Google login');
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const client = await getGoogleClient();
    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      process.env.GOOGLE_CALLBACK_URL,
      params,
      {
        state: req.session.oauthState,
        nonce: req.session.oauthNonce,
      }
    );

    const userinfo = await client.userinfo(tokenSet.access_token);

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
    }

    const accessToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.user_id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    const redirectTo = new URL(`${process.env.FRONTEND_URL.replace(/\/+$/, '')}/auth/success`);
    redirectTo.searchParams.set('accessToken', accessToken);
    redirectTo.searchParams.set('refreshToken', refreshToken);

    return res.redirect(redirectTo.toString());
  } catch (err) {
    console.error('[OAuth] Google callback error:', err);
    res.status(500).send('OAuth callback failed');
  }
};
