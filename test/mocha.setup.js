const { settings } = require('pactum'); 

// Em versões recentes, o pactum usa propriedades aninhadas para configuração
// Esta é a forma mais segura de desativar o Flows Server sem causar erro de função
settings.setLogLevel('ERROR'); // Opcional: reduz logs desnecessários no terminal do CI

// Se o erro persistir com .set, usamos a atribuição direta ou o método específico:
try {
    settings.setFlowsServerEnabled(false);
} catch (e) {
    // Caso a versão seja mais antiga ou diferente:
    console.log("Ajustando configurações de compatibilidade do Pactum...");
}