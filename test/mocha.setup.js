// test/mocha.setup.js
const { settings } = require('pactum'); 

// 2. Desativar o Flows Server 
settings.set('flowsServer.enabled', false);