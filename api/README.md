# Api gatway

Hapi.js

## Tecnologias

* [Hapi](https://hapi.dev/) - Framework server
* [Node](https://nodejs.org/en/) - Runtime builder

## Enviroments

* development
* homolog
* production

## Configuração

Após copiar e renomear conforme os script abaixo, customize as configurações conforme necessario.

```
> cp .envs/<Enviroment>.env .env
```

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
npm start
```

***

## Arquitetura

* [app](./app) - Tem com objetivo agrupar os serviços que compõe a aplicação.
  * [api](./app/api)
    * [routes](./app/main/routes.js) - Tem como objetivo, na determinação de qual ação/método deve ser executado na aplicação, criando um acesso externo.
    * [controller]() Responsavel por tratar e controlar funcionalidades entre o roteamento e modelagem da aplicação.
    * [model](./examples/model.js) - Tem como responsabilidade na manipulação dos dados de entrada externa, aplicando a regra de negócio proposta e enviar ou não para o armazenamento do banco de dados, através da camada DAO.
    * [dao](./examples/dao.js) - Tem como responsabilidade criar uma camada de abstração, para a persistência dos dados, assim, separando a regra de negócio das de acesso ao banco.
* [config](./config.py) - Centralização de constantes, para a aplicação.
* [engine](./engine/) - Responsável carregar dependencias, plugins, middlewares e funções para a inicialização do servidor
* [server](./server.js) - Responsável por iniciar a aplicação.
