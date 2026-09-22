// useState permite guardar informações dentro do componente.
import { useState } from 'react';

// Link permite criar links para outras páginas.
// useNavigate permite mudar de página através do JavaScript.
import { Link, useNavigate } from 'react-router-dom';

// Nosso Axios configurado.
import { api } from '../services/api';


export default function Login() {

  // useNavigate permite mudar a URL.
  //
  // Exemplo:
  // navigate('/tasks')
  //
  // muda para:
  // http://localhost:5173/tasks
  const navigate = useNavigate();


  // Guarda o username e a senha digitados.
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });


  // Guarda mensagens de erro.
  const [erro, setErro] = useState('');


  // Executada quando o usuário digita
  // em algum campo.
  function handleChange(e) {

    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });

  }


  // Executada quando o formulário é enviado.
  async function handleSubmit(e) {

    // Impede o navegador de recarregar a página.
    e.preventDefault();

    setErro('');


    try {

      /*
        Seu backend ainda não possui um endpoint /login.

        Por isso fazemos uma requisição para /tasks/lista
        usando Basic Auth.

        Se username e senha estiverem corretos,
        o backend permite a requisição.
      */

      const response = await api.get('/tasks/lista', {

        auth: {
          username: loginData.username,
          password: loginData.password
        }

      });


      /*
        Se chegou aqui, significa que o backend
        aceitou as credenciais.

        Guardamos o usuário no sessionStorage.

        O sessionStorage permite que outras páginas
        da aplicação recuperem essas informações.
      */

      sessionStorage.setItem(
        'usuario',
        JSON.stringify({
          username: loginData.username,
          password: loginData.password
        })
      );


      /*
        Depois do login vamos para a página de Tasks.
      */

      navigate('/tasks');


    } catch (err) {

      // Se o backend respondeu com erro.
      if (err.response) {

        if (typeof err.response.data === 'string') {

          setErro(err.response.data);

        } else {

          setErro(
            err.response.data.message ||
            'Usuário ou senha incorretos.'
          );

        }

      } else {

        setErro(
          'Não foi possível conectar ao servidor.'
        );

      }

    }

  }


  return (

    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        fontFamily: 'sans-serif'
      }}
    >

      <h1>
        Login
      </h1>


      {/* Mostra o erro somente quando existir. */}
      {erro && (

        <p style={{ color: 'red' }}>
          {erro}
        </p>

      )}


      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={loginData.username}
          onChange={handleChange}
          required
        />


        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={loginData.password}
          onChange={handleChange}
          required
        />


        <button type="submit">
          Entrar
        </button>

      </form>


      <p>
        Ainda não possui uma conta?
      </p>


      {/* Link para a página de cadastro. */}
      <Link to="/cadastro">

        <button>
          Criar conta
        </button>

      </Link>


      <br />
      <br />


      {/* Link para voltar para a página inicial. */}
      <Link to="/">
        Voltar
      </Link>

    </div>

  );
}

