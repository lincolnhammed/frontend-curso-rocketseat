// Importamos Routes e Route do React Router.
//
// Routes contém todas as rotas da aplicação.
// Route define cada endereço e qual página será exibida.
import { Routes, Route } from 'react-router-dom';

// Importamos nossas páginas.
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Tasks from './pages/Tasks.jsx';


export default function App() {

  return (

    <Routes>

      {/* Página inicial */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Página de Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Página de Cadastro */}
      <Route
        path="/cadastro"
        element={<Cadastro />}
      />

      {/* Página das Tasks */}
      <Route
        path="/tasks"
        element={<Tasks />}
      />

    </Routes>

  );
}

