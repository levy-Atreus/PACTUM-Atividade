// test/mocha.setup.js
// Este arquivo será carregado ANTES dos seus testes
const { settings } = require('pactum'); 

// Desativa o Flows Server, o que resolve o problema de infraestrutura
settings.setFlowsServer({ enabled: false });