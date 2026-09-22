import axios from 'axios';

export const api = axios.create({
  // Se estiver rodando o Java localmente:
  baseURL: 'http://localhost:8080', 
  
  // Se o backend já estiver publicado no Render, use a URL do Render:
  // baseURL: 'https://seu-app-spring.onrender.com'
});