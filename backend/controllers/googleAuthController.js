// controllers/googleAuthController.js

require('dotenv').config();
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../models/User');

function generateRandomString(len = 16) {
  return crypto.randomBytes(len).toString('hex');
}

let googleClient = null;

async function getGoogleClient() {
  if (googleClient) return googleClient;

  // 👇 Dynamically import the ESM-only module right here:
  const clientModule = await import('openid-client');
const Issuer = clientModule.default?.Issuer || clientModule.Issuer;


  // Now Issuer is defined, so this will work:
  const googleIssuer = await Issuer.discover('https://accounts.google.com');

  googleClient = new googleIssuer.Client({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_CALLBACK_URL],
    response_types:['code'],
  });

  return googleClient;
}

exports.googleLogin = async (req, res) => {
  const client = await getGoogleClient();
  const state  = generateRandomString();
  const nonce  = generateRandomString();

  const authUrl = client.authorizationUrl({
    scope: 'openid email profile',
    state,
    nonce,
  });

  res.redirect(authUrl);
};

exports.googleCallback = async (req, res) => {
  const client   = await getGoogleClient();
  const params   = client.callbackParams(req);
  const tokenSet = await client.callback(process.env.GOOGLE_CALLBACK_URL, params);
  const userinfo = await client.userinfo(tokenSet.access_token);

  let user = await User.findOne({ where: { email: userinfo.email } });
  if (!user) {
    user = await User.create({
      name:                userinfo.name || userinfo.email.split('@')[0],
      email:               userinfo.email,
      password:            null,
      provider:            'google',
      provider_id:         userinfo.sub,
      oauth_access_token:  tokenSet.access_token,
      oauth_refresh_token: tokenSet.refresh_token || null,
      role:                'user',
    });
  }

  const accessToken  = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET,         { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  res.json({ message: 'Google login successful', accessToken, refreshToken, user });
};
