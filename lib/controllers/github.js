const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })
  .get('/login/callback', async (req, res) => {
    /*
      TODO:
     * get code
     * exchange code for token
     * get info from github about user with token
     * get existing user if there is one
     * if not, create one
     * create jwt
     * set cookie and redirect
     */
    const { code } = req.query;
    const token = await exchangeCodeForToken(code);
    const profile = await getGithubProfile(token);
    let user = await GithubUser.findByUsername(profile.username);

    if (!user) {
      user = await GithubUser.insert(profile);
    }
    return user;

    // const resp = await fetch('https://github.com/login/oauth/access_token', {
    //   method: 'POST',
    //   // header will be key value pair
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   // body stringified
    //   body: JSON.stringify({
    //     client_id: process.env.CLIENT_ID,
    //     client_secret: process.env.CLIENT_SECRET,
    //     code,
    //   }),
    //   const { access_token } = await resp.json();
    //   return access_token;
  })
  .get('/dashboard', authenticate, async (req, res) => {
    // require req.user
    // get data about user and send it as json
    res.json(req.user);
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
