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
    // baseUrl: `http://youverify-status.local/api/v1/`,
    baseUrl: extras.baseUrl
};

module.exports = cachetCredentials;

// Allow use of default import syntax in TypeScript
// module.exports.default = cachetCredentials;