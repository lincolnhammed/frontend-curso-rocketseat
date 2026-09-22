// Importa o StrictMode do React.
// Ele ajuda a encontrar possíveis problemas durante o desenvolvimento.
import { StrictMode } from 'react'

// Importa a função que cria a aplicação React.
import { createRoot } from 'react-dom/client'

// Importa o BrowserRouter.
// Ele permite que o React controle as rotas da aplicação,
// como:
// /
// /login
// /cadastro
// /tasks
import { BrowserRouter } from 'react-router-dom'

// Importa o CSS global da aplicação.
import './index.css'

// Importa o componente principal da nossa aplicação.
import App from './App.jsx'


// Procura no HTML o elemento que possui id="root"
// e coloca nossa aplicação React dentro dele.
createRoot(document.getElementById('root')).render(

  // StrictMode envolve nossa aplicação
  // para ajudar a detectar problemas durante o desenvolvimento.
  <StrictMode>

    {/* 
      BrowserRouter permite que nossa aplicação
      trabalhe com URLs diferentes.
      
      Por exemplo:
      http://localhost:5173/
      http://localhost:5173/login
      http://localhost:5173/cadastro
      http://localhost:5173/tasks
    */}
    <BrowserRouter>

      {/* 
        App é o componente principal da aplicação.
        As páginas e rotas serão organizadas dentro dele.
      */}
      <App />

    </BrowserRouter>

  </StrictMode>,
)

