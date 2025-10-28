# 🛡️ Testes de API e Contrato - Loja EBAC com PactumJS

Este repositório contém as suítes de testes de automação para os serviços de **Produtos** e **Categorias** de uma aplicação e-commerce, utilizando o framework **PactumJS** para testes funcionais de API (Black-Box) e para a implementação de **Consumer-Driven Contracts (CDC)**.

O projeto atende aos requisitos do exercício do módulo de Automação de API e Contrato.

## ⚙️ Tecnologias Utilizadas

| Ferramenta | Descrição |
| :--- | :--- |
| **[PactumJS](https://pactumjs.com/)** | Framework principal para automação de API, execução de testes e validação de contratos. |
| **Node.js** | Ambiente de execução. |
| **[Mocha](https://mochajs.org/)** | Test Runner utilizado pelo PactumJS. |
| **[Pactum Flow Plugin](https://pactumjs.com/docs/reporters/pactum-flow-plugin)** | Plugin para geração de relatórios e visualização de testes. |

## 🚀 Como Executar o Projeto

Para rodar os testes localmente, siga os passos abaixo:

### Pré-Requisitos

* Node.js (versão 14+ recomendada).
* Um ambiente de simulação (Mock Server) em execução na porta `4000` para os testes de Contrato.
    * *Nota: O próprio Pactum inicia e encerra o Mock Server (porta 4000) automaticamente antes e depois dos testes de Contrato.*

### 1. Instalação de Dependências

Navegue até o diretório raiz do projeto e instale as dependências:

```bash
npm install

Teste, Comando, Descrição
Todos os Testes, npm test,Executa todos os testes (API Funcional e Contrato).
API Funcional, npm run api-test, Executa apenas os testes que batem na API real (CRUD de Produtos e Categorias).
Contrato (CDC), npm run contract-test, Executa apenas os testes de Contrato (Mock Server).

/test/atividade - test
├── /api - Copia            # Testes Funcionais (API Real)
│   ├── category.test.js    # Testes CRUD: Adicionar, Editar e Deletar Categoria
│   └── product.test.js     # Testes CRUD: Adicionar, Editar e Deletar Produto
└── /contract - Copia       # Testes de Contrato (Mock Server)
    ├── addCategory.test.js # Contrato para Adicionar Categoria (Requisito CDC)
    └── addProduct.test.js  # Contrato para Adicionar Produto (Requisito CDC)

Serviço, Métodos Testados (API Real), Teste de Contrato (CDC), Requisito Atendido
Produtos, "addProduct, editProduct, deleteProduct (CRUD Completo)", ✅ addProduct,CDC para ao menos 1 método.
Categorias, "addCategory, editCategory, deleteCategory (CRUD Completo)", ✅ addCategory,CDC para ao menos 1 método.

