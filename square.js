// For Square Integration
var { ApiClient } = require('square-connect');

const defaultClient = ApiClient.instance;

// Set sandbox url
defaultClient.basePath = 'https://connect.squareup.com';

// Configure OAuth2 access token for authorization: oauth2
var oauth2 = defaultClient.authentications['oauth2'];

// Set sandbox access token
oauth2.accessToken = process.env.SQUARE_API_TOKEN;

module.exports = {
    defaultClient
};