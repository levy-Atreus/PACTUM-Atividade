// test/mocha.setup.js
// Este arquivo será carregado ANTES dos seus testes
const { settings } = require('pactum'); 

// *** ADICIONE ESTA LINHA ***
// Configura a URL base do Pactum para a porta correta do servidor de testes (porta 3000)
settings.setBaseUrl('http://localhost:3000'); 

// Desativa o Flows Server, o que resolve o problema de autenticação do Flows Server
// Embora a linha abaixo tenha sido comentada, a forma correta de desativar é geralmente:
settings.setFlowsServer({ enabled: false });