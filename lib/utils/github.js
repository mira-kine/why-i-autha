const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  // TODO: Implement me!
  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    // header will be key value pair
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // body stringified
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  });
  const { access_token } = await resp.json();
  return access_token;
};

const getGithubProfile = async (token) => {
  // TODO: Implement me!
  // get user info from gH using the access token to access the API
  // on behalf of user
};

module.exports = { exchangeCodeForToken, getGithubProfile };
