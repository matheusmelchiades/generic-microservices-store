# Store Service
Hapi.js

## Tecnologias

* [Hapi](https://hapi.dev/) - Framework server
* [Node](https://nodejs.org/en/) - Runtime builder
* [Jest](https://jestjs.io/en/) - Testing Framework

## Enviroments

* development
* homolog
* production

## Instalação

```bash
> yarn
ou
> npm i
```

## Desenvolvimento

```bash
> yarn run dev
ou
> npm run dev
```

## Iniciar aplicação

```
> yarn start
ou
> npm start
```

## Iniciar testes

```
> yarn test
ou
> npm test
```


***

## Arquitetura

* [app](./app) - Tem com objetivo agrupar os serviços que compõe a aplicação.
  * [api](./app/api)
    * [routes](./app/main/routes.js) - Tem como objetivo, na determinação de qual ação/método deve ser executado na aplicação, criando um acesso externo.
    * [controller]() Responsavel por tratar e controlar funcionalidades entre o roteamento e modelagem da aplicação.
    * [model](./examples/model.js) - Tem como responsabilidade na manipulação dos dados de entrada externa, aplicando a regra de negócio proposta e enviar ou não para o armazenamento do banco de dados, através da camada DAO.
    * [dao](./examples/dao.js) - Tem como responsabilidade criar uma camada de abstração, para a persistência dos dados, assim, separando a regra de negócio das de acesso ao banco.
  * [services](./app/api/services) - Tem com objetivo centralizar serviços como socket, email e entre outros.
* [config](./config.js) - Centralização de constantes, para a aplicação.
* [engine](./engine/) - Responsável carregar dependencias, plugins, middlewares e funções para a inicialização do servidor
* [server](./server.js) - Responsável por iniciar a aplicação.
