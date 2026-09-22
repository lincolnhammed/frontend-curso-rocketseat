import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

export default function Tasks() {
    const navigate = useNavigate();

    // Guarda os dados do usuário que fez login.
    const [usuario, setUsuario] = useState(null);

    // Guarda a lista de tarefas que veio do backend.
    const [tasks, setTasks] = useState([]);

    // ============================================================
    // FORMULÁRIO PARA CRIAR UMA TAREFA
    // ============================================================

    // Guarda os dados que o usuário está digitando
    // para criar uma nova tarefa.
    const [novaTask, setNovaTask] = useState({
        titulo: '',
        descricao: '',
        prioridade: ''
    });

    // ============================================================
    // FORMULÁRIO PARA EDITAR UMA TAREFA
    // ============================================================

    // Guarda o ID da tarefa que está sendo editada.
    // Se for null, nenhuma tarefa está sendo editada.
    const [editandoId, setEditandoId] = useState(null);

    // Guarda os dados que o usuário está alterando.
    const [taskEditada, setTaskEditada] = useState({
        titulo: '',
        descricao: '',
        prioridade: ''
    });

    // ============================================================
    // CARREGAR PÁGINA
    // ============================================================

    // Quando a página abre, verificamos se existe um usuário logado.
    useEffect(() => {
        const usuarioSalvo = sessionStorage.getItem('usuario');

        // Se não existe usuário salvo, mandamos para o login.
        if (!usuarioSalvo) {
            navigate('/login');
            return;
        }

        // Transformamos o texto do sessionStorage novamente em objeto.
        const usuarioObjeto = JSON.parse(usuarioSalvo);

        setUsuario(usuarioObjeto);

        // Depois de saber quem está logado,
        // buscamos as tarefas.
        handleListTasks();
    }, []);

    // ============================================================
    // LISTAR TAREFAS
    // ============================================================

    // Busca as tarefas no backend.
    async function handleListTasks() {
        try {
            const usuarioSalvo = sessionStorage.getItem('usuario');

            if (!usuarioSalvo) {
                navigate('/login');
                return;
            }

            const usuarioObjeto = JSON.parse(usuarioSalvo);

            const response = await api.get('/tasks/lista', {
                auth: {
                    username: usuarioObjeto.username,
                    password: usuarioObjeto.password
                }
            });

            // Quando não existem tarefas,
            // o backend retorna 204.
            if (response.status === 204) {
                setTasks([]);
                return;
            }

            setTasks(response.data);

        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    }

    // ============================================================
    // CRIAR TAREFA
    // ============================================================

    // Atualiza os campos da nova tarefa
    // conforme o usuário vai digitando.
    function handleNovaTaskChange(event) {
        const { name, value } = event.target;

        setNovaTask({
            ...novaTask,
            [name]: value
        });
    }

    // Envia a nova tarefa para o backend.
    async function handleCriarTask(event) {

        // Impede que o navegador recarregue a página
        // quando o formulário for enviado.
        event.preventDefault();

        try {
            const usuarioSalvo = sessionStorage.getItem('usuario');

            if (!usuarioSalvo) {
                navigate('/login');
                return;
            }

            const usuarioObjeto = JSON.parse(usuarioSalvo);

            // Fazemos um POST para criar a tarefa.
            //
            // O objeto novaTask vai no corpo da requisição.
            await api.post(
                '/tasks/',
                {
                    titulo: novaTask.titulo,
                    descricao: novaTask.descricao,
                    priority: novaTask.prioridade
                },
                {
                    auth: {
                        username: usuarioObjeto.username,
                        password: usuarioObjeto.password
                    }
                }
            );

            // Depois de criar a tarefa,
            // limpamos os campos do formulário.
            setNovaTask({
                titulo: '',
                descricao: '',
                prioridade: ''
            });

            // Buscamos novamente as tarefas
            // para mostrar a nova tarefa na tela.
            handleListTasks();

        } catch (error) {
            console.error('Erro ao criar tarefa:', error);

            if (error.response) {
                console.error(
                    'Resposta do servidor:',
                    error.response.data
                );
            }
        }
    }

    // ============================================================
    // EDITAR TAREFA
    // ============================================================

    // Quando clicamos em "Editar",
    // colocamos a tarefa no formulário.
    function handleEditar(task) {
        setEditandoId(task.id);

        setTaskEditada({
            titulo: task.titulo || '',
            descricao: task.descricao || '',
            prioridade: task.priority || ''
        });
    }

    // Atualiza o estado conforme o usuário digita
    // no formulário de edição.
    function handleChange(event) {
        const { name, value } = event.target;

        setTaskEditada({
            ...taskEditada,
            [name]: value
        });
    }

    // ============================================================
    // SALVAR EDIÇÃO
    // ============================================================

    // Envia a alteração para o Spring Boot.
    async function handleSalvar() {
        try {
            const usuarioSalvo = sessionStorage.getItem('usuario');

            if (!usuarioSalvo) {
                navigate('/login');
                return;
            }

            const usuarioObjeto = JSON.parse(usuarioSalvo);

            // Aqui está o nosso PUT.
            //
            // O ID vai para:
            // @PutMapping("/{id}")
            //
            // E taskEditada vai no:
            // @RequestBody
            await api.put(
                `/tasks/${editandoId}`,
                {
                    titulo: taskEditada.titulo,
                    descricao: taskEditada.descricao,
                    priority: taskEditada.prioridade
                },
                {
                    auth: {
                        username: usuarioObjeto.username,
                        password: usuarioObjeto.password
                    }
                }
            );

            // Depois de salvar, saímos do modo de edição.
            setEditandoId(null);

            // Limpamos o formulário.
            setTaskEditada({
                titulo: '',
                descricao: '',
                prioridade: ''
            });

            // Buscamos novamente as tarefas
            // para mostrar os dados atualizados.
            handleListTasks();

        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);

            if (error.response) {
                console.error(
                    'Resposta do servidor:',
                    error.response.data
                );
            }
        }
    }

    // ============================================================
    // CANCELAR EDIÇÃO
    // ============================================================

    // Cancela a edição sem enviar nada para o backend.
    function handleCancelar() {
        setEditandoId(null);

        setTaskEditada({
            titulo: '',
            descricao: '',
            prioridade: ''
        });
    }

    // ============================================================
    // LOGOUT
    // ============================================================

    // Remove o usuário do navegador e volta para a Home.
    function handleLogout() {
        sessionStorage.removeItem('usuario');

        navigate('/');
    }

    // Enquanto o usuário ainda não foi carregado,
    // não mostramos a página.
    if (!usuario) {
        return null;
    }

    return (
        <div>
            <h1>Minhas tarefas</h1>

            <p>
                Usuário logado: <strong>{usuario.username}</strong>
            </p>

            <button onClick={handleLogout}>
                Sair
            </button>

            <hr />

            {/* =====================================================
                FORMULÁRIO PARA CRIAR TAREFA
            ===================================================== */}

            <h2>Nova tarefa</h2>

            <form onSubmit={handleCriarTask}>

                {/* Campo para o título */}
                <input
                    type="text"
                    name="titulo"
                    value={novaTask.titulo}
                    onChange={handleNovaTaskChange}
                    placeholder="Título"
                />

                <br />

                {/* Campo para a descrição */}
                <textarea
                    name="descricao"
                    value={novaTask.descricao}
                    onChange={handleNovaTaskChange}
                    placeholder="Descrição"
                />

                <br />

                {/* Campo para a prioridade */}
                <input
                    type="text"
                    name="prioridade"
                    value={novaTask.prioridade}
                    onChange={handleNovaTaskChange}
                    placeholder="Prioridade"
                />

                <br />

                {/* Ao clicar, o formulário chama handleCriarTask */}
                <button type="submit">
                    Criar tarefa
                </button>

            </form>

            <hr />

            {/* =====================================================
                LISTA DE TAREFAS
            ===================================================== */}

            {tasks.length === 0 ? (
                <p>Você não possui tarefas.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task.id}>

                        {editandoId === task.id ? (

                            // --------------------------------
                            // MODO DE EDIÇÃO
                            // --------------------------------
                            <div>
                                <h3>Editar tarefa</h3>

                                <input
                                    type="text"
                                    name="titulo"
                                    value={taskEditada.titulo}
                                    onChange={handleChange}
                                    placeholder="Título"
                                />

                                <br />

                                <textarea
                                    name="descricao"
                                    value={taskEditada.descricao}
                                    onChange={handleChange}
                                    placeholder="Descrição"
                                />

                                <br />

                                <input
                                    type="text"
                                    name="prioridade"
                                    value={taskEditada.prioridade}
                                    onChange={handleChange}
                                    placeholder="Prioridade"
                                />

                                <br />

                                <button onClick={handleSalvar}>
                                    Salvar
                                </button>

                                <button onClick={handleCancelar}>
                                    Cancelar
                                </button>
                            </div>

                        ) : (

                            // --------------------------------
                            // MODO NORMAL
                            // --------------------------------
                            <div>
                                <h3>{task.titulo}</h3>

                                <p>
                                    {task.descricao}
                                </p>

                                <p>
                                    Prioridade: {task.priority}
                                </p>

                                <button
                                    onClick={() => handleEditar(task)}
                                >
                                    Editar
                                </button>
                            </div>
                        )}

                        <hr />

                    </div>
                ))
            )}
        </div>
    );
}