import axios from 'axios';

// Verifica onde o frontend está sendo executado.
//
// Se estiver no nosso computador (localhost),
// usamos o backend local.
//
// Se estiver publicado no Render,
// usamos o backend publicado no Render.
const baseURL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'https://curso-rocketseat.onrender.com';

export const api = axios.create({
    baseURL: baseURL
});