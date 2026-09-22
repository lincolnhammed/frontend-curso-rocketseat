
// Importamos o Link do React Router.
//
// O Link permite navegar para outra URL
// sem recarregar toda a página.
import { Link } from 'react-router-dom'


// Componente da página inicial.
export default function Home() {

  return (

    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}
    >

      <h1>
        Todo List 🚀
      </h1>

      <p>
        Gerencie suas tarefas.
      </p>


      {/*
        Link funciona parecido com um botão ou link HTML,
        mas é próprio do React Router.

        to="/login"
        significa que queremos navegar para:

        http://localhost:5173/login
      */}
      <Link to="/login">

        <button>
          Entrar
        </button>

      </Link>


      {/*
        Agora fazemos a mesma coisa para o cadastro.

        Ao clicar, a URL será:

        http://localhost:5173/cadastro
      */}
      <Link to="/cadastro">

        <button>
          Cadastrar
        </button>

      </Link>

    </div>

  );
}

