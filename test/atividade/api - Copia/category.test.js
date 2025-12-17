const { spec, request } = require('pactum');

// 1. Configuração de URL e Headers Globais para este arquivo
request.setBaseUrl('http://lojaebac.ebaconline.art.br');
request.setDefaultHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

let token; 
let categoryId;

describe('Testes de API - Categorias EBAC', () => {

    beforeEach(async () => {
        // 1. AUTENTICAÇÃO - Captura o token na raiz
        const loginRes = await spec()
            .post('/public/authUser')
            .withJson({
                "email": "admin@admin.com",
                "password": "admin123"
            })
            .expectStatus(200);
        
        // Salvando o token com o prefixo Bearer para as próximas chamadas
        token = `Bearer ${loginRes.body.token || loginRes.body.data.token}`;

        // 2. CRIAÇÃO DE CATEGORIA (Massa de teste)
        const categoryRes = await spec()
            .post('/api/addCategory')
            .withHeaders("Authorization", token)
            .withJson({
                "name": `Categoria Temporaria ${Date.now()}`
            })
            .expectStatus(200);
        
        // Captura o ID da categoria criada para usar nos testes de PUT e DELETE
        categoryId = categoryRes.body._id || categoryRes.body.data._id;
    });

    // TESTE 1: ADIÇÃO
    it('API - deve adicionar uma nova categoria', async () => {
        const newCategory = "Automação e Testes"; 
        
        await spec()
            .post('/api/addCategory')
            .withHeaders("Authorization", token)
            .withJson({ "name": newCategory })
            .expectStatus(200)
            .expectJson('success', true);
    });

    // TESTE 2: EDIÇÃO
    it('API - deve editar a categoria corretamente', async () => {
        const nomeAtualizado = `Editada ${Date.now()}`;

        await spec()
            .put(`/api/editCategory/${categoryId}`) 
            .withHeaders("Authorization", token)
            .withJson({ "name": nomeAtualizado })
            .expectStatus(200) 
            .expectJson('success', true);
    });

    // TESTE 3: DELEÇÃO
    it('API - deve deletar a categoria corretamente', async () => {
        await spec()
            .delete(`/api/deleteCategory/${categoryId}`)
            .withHeaders("Authorization", token)
            .expectStatus(200) 
            .expectJson('success', true);
    });
});