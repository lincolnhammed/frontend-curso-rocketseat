import { useState } from 'react';

// Link permite navegar para outra página.
// useNavigate permite navegar através do JavaScript.
import { Link, useNavigate } from 'react-router-dom';

// Nosso Axios configurado.
import { api } from '../services/api';


export default function Cadastro() {

  // Permite mudar a URL através do JavaScript.
  const navigate = useNavigate();


  // Dados do formulário de cadastro.
  const [formData, setFormData] = useState({
    username: '',
    nome: '',
    password: ''
  });


  // Mensagem de sucesso.
  const [mensagem, setMensagem] = useState('');


  // Mensagem de erro.
  const [erro, setErro] = useState('');


  // Executada quando o usuário altera algum campo.
  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  }


  // Executada quando o formulário é enviado.
  async function handleSubmit(e) {

    // Impede o navegador de recarregar a página.
    e.preventDefault();

    setMensagem('');
    setErro('');


    try {

      /*
        Enviamos os dados para o Spring Boot.

        Endpoint:

        POST /users/
      */

      const response = await api.post(
        '/users/',
        formData
      );


      // Mostra mensagem de sucesso.

      setMensagem(
        `Usuário ${response.data.nome || response.data.username} cadastrado com sucesso! 🎉`
      );


      /*
        Como o usuário acabou de criar a conta,
        vamos considerá-lo autenticado.

        Guardamos temporariamente username e senha
        no sessionStorage para utilizar nas Tasks.
      */

      sessionStorage.setItem(
        'usuario',
        JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      );


      /*
        Depois do cadastro vamos para /tasks.
      */

      navigate('/tasks');


    } catch (err) {

      if (err.response) {

        if (typeof err.response.data === 'string') {

          setErro(err.response.data);

        } else {

          setErro(
            err.response.data.message ||
            JSON.stringify(err.response.data)
          );

        }

      } else {

        setErro(
          'Não foi possível conectar ao servidor Spring Boot.'
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
        Criar conta
      </h1>


      {/* Mensagem de sucesso */}
      {mensagem && (

        <p style={{ color: 'green' }}>
          {mensagem}
        </p>

      )}


      {/* Mensagem de erro */}
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
          value={formData.username}
          onChange={handleChange}
          required
        />


        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={formData.nome}
          onChange={handleChange}
          required
        />


        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
        />


        <button type="submit">
          Cadastrar
        </button>

      </form>


      <p>
        Já possui uma conta?
      </p>


      {/* Link para Login */}
      <Link to="/login">

        <button>
          Entrar
        </button>

      </Link>


      <br />
      <br />


      {/* Link para voltar para Home */}
      <Link to="/">
        Voltar
      </Link>

    </div>

  );
}