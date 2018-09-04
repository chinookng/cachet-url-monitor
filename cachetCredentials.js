//-------- Cachet Credentials-----------
const extras = require('./config.json');

const cachetCredentials = {
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Cachet-Token': extras.token,
        'Connection': 'keep-alive',
        'Time-zone': extras.timezone
    },   
    baseUrl: extras.baseUrl
};

module.exports = cachetCredentials;