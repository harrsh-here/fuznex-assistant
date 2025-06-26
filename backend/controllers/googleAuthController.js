// controllers/googleAuthController.js

require('dotenv').config();
const { Issuer, generators } = require('openid-client');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

async function getGoogleClient() {
  // discover Google’s endpoints
  const googleIssuer = await Issuer.discover('https://accounts.google.com');
  return new googleIssuer.Client({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_CALLBACK_URL],
    response_types:['code'],
  });
}

// ↪ GET /api/auth/google
exports.googleLogin = async (req, res) => {
  const client = await getGoogleClient();
  const state  = generators.state();
  const nonce  = generators.nonce();

  const authUrl = client.authorizationUrl({
    scope: 'openid email profile',
    state,
    nonce,
  });
  res.redirect(authUrl);
};

// ↪ GET /api/auth/google/callback
exports.googleCallback = async (req, res) => {
  const client   = await getGoogleClient();
  const params   = client.callbackParams(req);
  const tokenSet = await client.callback(
    process.env.GOOGLE_CALLBACK_URL,
    params,
    { state: generators.state(), nonce: generators.nonce() }
  );
  const userinfo = await client.userinfo(tokenSet.access_token);

  // find or create
  let user = await User.findOne({ where: { email: userinfo.email } });
  if (!user) {
    user = await User.create({
      name:               userinfo.name || userinfo.email.split('@')[0],
      email:              userinfo.email,
      password:           null,
      provider:           'google',
      provider_id:        userinfo.sub,
      oauth_access_token: tokenSet.access_token,
      oauth_refresh_token: tokenSet.refresh_token || null,
      role:               'user',
    });
  }

  // issue JWTs
  const accessToken  = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET,         { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // redirect back to your SPA
  const redirectUrl = new URL(process.env.FRONTEND_URL);
  redirectUrl.pathname = '/auth/success';
  redirectUrl.searchParams.set('accessToken',  accessToken);
  redirectUrl.searchParams.set('refreshToken', refreshToken);

  res.redirect(redirectUrl.toString());
};
