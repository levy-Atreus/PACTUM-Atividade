// test.js

const { spec, request } = require('pactum'); 
request.setBaseUrl('http://lojaebac.ebaconline.art.br');

let token;  
let productId; 
let categoryId; 

// --- SETUP ---
beforeEach(async () => {
    token = await spec()
        .post('/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.token');

    // SETUP: CRIAÇÃO DE CATEGORIA
    categoryId = await spec()
        .post('/api/addCategory')
        .withHeaders("Authorization", token)
        .withJson({
            "name": `Categoria Requisito ${Date.now()}`
        })
        .expectStatus(200)
        .returns('data._id'); 


    // 2. CRIAÇÃO DE PRODUTO PARA EDIÇÃO/DELEÇÃO
    productId = await spec()
        .post('/api/addProduct')
        .withHeaders("Authorization", token)
        .withJson({
            "name": `Produto Temporario ${Date.now()}`,
            "price": 50.00, 
            "quantity": 10.00, 
            "description": "Produto de Teste Automatizado", 
            "categories": [categoryId]
        })
        .expectStatus(200) 
        .returns('data._id'); 
});

// TESTE 1: ADIÇÃO DE NOVO PRODUTO
it('API - deve adicionar um novo produto', async () => {
    const newProductName = "Livro de Testes de Automação"; 
    const newProductPrice = 75.90;

    await spec()
        .post('/api/addProduct') 
        .withHeaders("Authorization", token) 
        .withJson({
            "name": newProductName, 
            "price": newProductPrice, 
            "quantity": 5.00, 
            "description": "Novo produto para teste completo", 
            "categories": [categoryId]
        })
        .expectStatus(200) 
        .expectJson('success', true) 
        .expectJson('data.name', newProductName) 
        .expectJson('data.price', newProductPrice); 
});

// TESTE 2: EDIÇÃO DE PRODUTO (CORRIGIDO)
it('API - deve editar o produto corretamente', async () => {
    const nomeAtualizado = `Produto Editado Nome Simples ${Date.now()}`;
    
    await spec()
        .put(`/api/editProduct/${productId}`) 
        .withHeaders("Authorization", token)
        .withJson({

            "name": nomeAtualizado, 
        })
        .expectStatus(200) 
        .expectJson('success', true)
        .expectJson('message', 'product updated'); 
});

// TESTE 3: DELEÇÃO DE PRODUTO 
it('API - deve deletar o produto corretamente', async () => {
    await spec()
        .delete(`/api/deleteProduct/${productId}`) 
        .withHeaders("Authorization", token)
        .expectStatus(200) 
        .expectJson('success', true);
});
