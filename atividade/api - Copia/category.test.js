// test.js
const { spec, request } = require('pactum');
request.setBaseUrl('http://lojaebac.ebaconline.art.br');

let token; 
let categoryId;
beforeEach(async () => {
    // 1. AUTENTICAÇÃO
    token = await spec()
        .post('/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.token')

    // 2. CRIAÇÃO DE CATEGORIA PARA EDIÇÃO/DELEÇÃO
    categoryId = await spec()
        .post('/api/addCategory')
        .withHeaders("Authorization", token)
        .withJson({
            "name": `Categoria Temporaria ${Date.now()}`
        })
        .expectStatus(200)
        .returns('data._id'); 
});


// TESTE 1: ADIÇÃO DE NOVA CATEGORIA 
it('API - deve adicionar uma nova categoria', async () => {
    const newCategory = "Automação e Testes"; 
    
    await spec()
        .post('/api/addCategory')
        .withHeaders("Authorization", token)
        .withJson({
            "name": newCategory
        })
        .expectStatus(200)
        .expectJson('success', true)
        .expectJson('data.name', newCategory)
});

// TESTE 2: EDIÇÃO DE CATEGORIA
it('API - deve editar a categoria corretamente', async () => {
    const nomeAtualizado = `Categoria Editada em ${Date.now()}`;

    await spec()
        .put(`/api/editCategory/${categoryId}`) 
        .withHeaders("Authorization", token)
        .withJson({
            "name": nomeAtualizado 
        })
        .expectStatus(200) 
        //.expectJson('success', true)
        //.expectJson('data.name', nomeAtualizado);
});

// TESTE 3: DELEÇÃO DE CATEGORIA
it('API - deve deletar a categoria corretamente', async () => {
    await spec()
        .delete(`/api/deleteCategory/${categoryId}`)
        .withHeaders("Authorization", token)
        .expectStatus(200)
        .expectJson('success', true);
});
