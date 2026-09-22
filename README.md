# Todo List - Frontend

Frontend desenvolvido em React para complementar a aplicação Todo List desenvolvida em Java e Spring Boot.

O principal objetivo deste projeto é demonstrar a integração entre uma API REST backend e uma interface web.

## Tecnologias

- React
- JavaScript
- Vite
- React Router
- Axios
- HTML
- CSS

## Funcionalidades

- Cadastro de usuário
- Login
- Criação de tarefas
- Listagem de tarefas
- Atualização de tarefas
- Logout
- Integração com a API REST

## Integração com o Backend

O frontend consome a API REST desenvolvida com Java e Spring Boot através do Axios.

### Backend

```text
https://curso-rocketseat.onrender.com
```

### Frontend

```text
https://frontend-curso-rocketseat.onrender.com
```

Em ambiente local, o frontend utiliza o backend:

```text
http://localhost:8080
```

## Rotas

```text
/           → Página inicial
/login      → Login
/cadastro   → Cadastro
/tasks      → Tarefas
```

## Estrutura

```text
src/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Cadastro.jsx
│   └── Tasks.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
```

## Como executar

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O frontend será disponibilizado pelo Vite, normalmente em:

```text
http://localhost:5173
```

## Objetivo

Este frontend foi desenvolvido como complemento da API backend, permitindo demonstrar na prática a comunicação entre uma aplicação React e uma API REST desenvolvida com Java e Spring Boot.

O foco principal do projeto está no desenvolvimento backend.
