const axios = require('axios');

// const { CallClient, VideoStreamRenderer, LocalVideoStream } = require('@azure/communication-calling');
// const { AzureCommunicationTokenCredential } = require('@azure/communication-common');
const _httpRequestClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 1500,
  headers: {
    'Accept': 'application',
    //'Authorization': 'token <your-token-here> -- https://docs.GitHub.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
  }
})

export default _httpRequestClient
