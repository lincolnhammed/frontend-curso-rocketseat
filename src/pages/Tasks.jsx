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
        prioridade: '',
        startAt: '',
        endAt: ''
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
        prioridade: '',
        startAt: '',
        endAt: ''
    });

    // ============================================================
    // CARREGAR A PÁGINA
    // ============================================================

    // Executa quando a página /tasks é aberta.
    useEffect(() => {
        // Pegamos o usuário que foi salvo no sessionStorage
        // durante o login/cadastro.
        const usuarioSalvo = sessionStorage.getItem('usuario');

        // Se não existe usuário, voltamos para o login.
        if (!usuarioSalvo) {
            navigate('/login');
            return;
        }

        // O sessionStorage guarda texto.
        // JSON.parse transforma esse texto novamente em objeto.
        const usuarioObjeto = JSON.parse(usuarioSalvo);

        setUsuario(usuarioObjeto);

        // Depois de confirmar o usuário,
        // buscamos as tarefas dele.
        handleListTasks();
    }, []);

    // ============================================================
    // LISTAR TAREFAS
    // ============================================================

    // Busca as tarefas do usuário no backend.
    async function handleListTasks() {
        try {
            const usuarioSalvo = sessionStorage.getItem('usuario');

            // Se o usuário não estiver mais salvo,
            // voltamos para o login.
            if (!usuarioSalvo) {
                navigate('/login');
                return;
            }

            const usuarioObjeto = JSON.parse(usuarioSalvo);

            // GET /tasks/lista
            //
            // O username e password são enviados
            // através da autenticação Basic Auth.
            const response = await api.get('/tasks/lista', {
                auth: {
                    username: usuarioObjeto.username,
                    password: usuarioObjeto.password
                }
            });

            // Se o backend retornar 204,
            // significa que não existem tarefas.
            if (response.status === 204) {
                setTasks([]);
                return;
            }

            // Guarda as tarefas recebidas do backend.
            setTasks(response.data);

        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    }

    // ============================================================
    // CRIAR TAREFA
    // ============================================================

    // Atualiza o estado conforme o usuário digita
    // nos campos da nova tarefa.
    function handleNovaTaskChange(event) {
        const { name, value } = event.target;

        // O operador ... copia os dados que já existem.
        //
        // [name]: value altera somente o campo
        // que foi modificado.
        setNovaTask({
            ...novaTask,
            [name]: value
        });
    }

    // Envia a nova tarefa para o backend.
    async function handleCriarTask(event) {

        // Impede o navegador de recarregar a página
        // quando o formulário for enviado.
        event.preventDefault();

        try {
            const usuarioSalvo = sessionStorage.getItem('usuario');

            // Verifica novamente se o usuário está logado.
            if (!usuarioSalvo) {
                navigate('/login');
                return;
            }

            const usuarioObjeto = JSON.parse(usuarioSalvo);

            // POST /tasks/
            //
            // Aqui enviamos os dados da nova tarefa
            // para o nosso controller Spring Boot.
            await api.post(
                '/tasks/',
                {
                    titulo: novaTask.titulo,
                    descricao: novaTask.descricao,
                    priority: novaTask.prioridade,

                    // datetime-local já produz um formato
                    // compatível com LocalDateTime do Java.
                    startAt: novaTask.startAt,
                    endAt: novaTask.endAt
                },
                {
                    // Autenticação Basic Auth.
                    auth: {
                        username: usuarioObjeto.username,
                        password: usuarioObjeto.password
                    }
                }
            );

            // Depois de criar a tarefa,
            // limpamos o formulário.
            setNovaTask({
                titulo: '',
                descricao: '',
                prioridade: '',
                startAt: '',
                endAt: ''
            });

            // Buscamos novamente as tarefas
            // para mostrar a nova tarefa na tela.
            handleListTasks();

        } catch (error) {
            console.error('Erro ao criar tarefa:', error);

            // Se o backend enviou uma resposta de erro,
            // mostramos essa resposta no console.
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
    // colocamos os dados da tarefa no formulário.
    function handleEditar(task) {
        setEditandoId(task.id);

        setTaskEditada({
            titulo: task.titulo || '',
            descricao: task.descricao || '',
            prioridade: task.priority || '',
            startAt: task.startAt || '',
            endAt: task.endAt || ''
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

    // Envia as alterações para o Spring Boot.
    async function handleSalvar() {
        try {
            const usuarioSalvo = sessionStorage.getItem('usuario');

            // Se o usuário não estiver logado,
            // voltamos para o login.
            if (!usuarioSalvo) {
                navigate('/login');
                return;
            }

            const usuarioObjeto = JSON.parse(usuarioSalvo);

            // PUT /tasks/{id}
            //
            // O ID da tarefa vai para:
            // @PathVariable UUID id
            //
            // Os dados vão para:
            // @RequestBody TaskModel taskModel
            await api.put(
                `/tasks/${editandoId}`,
                {
                    titulo: taskEditada.titulo,
                    descricao: taskEditada.descricao,
                    priority: taskEditada.prioridade,
                    startAt: taskEditada.startAt,
                    endAt: taskEditada.endAt
                },
                {
                    auth: {
                        username: usuarioObjeto.username,
                        password: usuarioObjeto.password
                    }
                }
            );

            // Sai do modo de edição.
            setEditandoId(null);

            // Limpa o formulário de edição.
            setTaskEditada({
                titulo: '',
                descricao: '',
                prioridade: '',
                startAt: '',
                endAt: ''
            });

            // Busca novamente as tarefas
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

    function handleCancelar() {
        // Sai do modo de edição.
        setEditandoId(null);

        // Limpa os campos.
        setTaskEditada({
            titulo: '',
            descricao: '',
            prioridade: '',
            startAt: '',
            endAt: ''
        });
    }

    // ============================================================
    // LOGOUT
    // ============================================================

    function handleLogout() {
        // Remove o usuário salvo no navegador.
        sessionStorage.removeItem('usuario');

        // Volta para a página inicial.
        navigate('/');
    }

    // Enquanto o usuário ainda não foi carregado,
    // não mostramos a página.
    if (!usuario) {
        return null;
    }

    // ============================================================
    // TELA
    // ============================================================

    return (
        <div>

            <h1>Minhas tarefas</h1>

            <p>
                Usuário logado:{' '}
                <strong>{usuario.username}</strong>
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

                {/* Campo do título */}
                <input
                    type="text"
                    name="titulo"
                    value={novaTask.titulo}
                    onChange={handleNovaTaskChange}
                    placeholder="Título"
                />

                <br />

                {/* Campo da descrição */}
                <textarea
                    name="descricao"
                    value={novaTask.descricao}
                    onChange={handleNovaTaskChange}
                    placeholder="Descrição"
                />

                <br />

                {/* Campo da prioridade */}
                <input
                    type="text"
                    name="prioridade"
                    value={novaTask.prioridade}
                    onChange={handleNovaTaskChange}
                    placeholder="Prioridade"
                />

                <br />

                {/* Data e hora de início */}
                <label>
                    Data e hora de início:
                </label>

                <br />

                <input
                    type="datetime-local"
                    name="startAt"
                    value={novaTask.startAt}
                    onChange={handleNovaTaskChange}
                />

                <br />

                {/* Data e hora de término */}
                <label>
                    Data e hora de término:
                </label>

                <br />

                <input
                    type="datetime-local"
                    name="endAt"
                    value={novaTask.endAt}
                    onChange={handleNovaTaskChange}
                />

                <br />

                {/* Envia o formulário */}
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

                            // =====================================
                            // MODO DE EDIÇÃO
                            // =====================================

                            <div>

                                <h3>Editar tarefa</h3>

                                {/* Título */}
                                <input
                                    type="text"
                                    name="titulo"
                                    value={taskEditada.titulo}
                                    onChange={handleChange}
                                    placeholder="Título"
                                />

                                <br />

                                {/* Descrição */}
                                <textarea
                                    name="descricao"
                                    value={taskEditada.descricao}
                                    onChange={handleChange}
                                    placeholder="Descrição"
                                />

                                <br />

                                {/* Prioridade */}
                                <input
                                    type="text"
                                    name="prioridade"
                                    value={taskEditada.prioridade}
                                    onChange={handleChange}
                                    placeholder="Prioridade"
                                />

                                <br />

                                {/* Data de início */}
                                <label>
                                    Data e hora de início:
                                </label>

                                <br />

                                <input
                                    type="datetime-local"
                                    name="startAt"
                                    value={taskEditada.startAt}
                                    onChange={handleChange}
                                />

                                <br />

                                {/* Data de término */}
                                <label>
                                    Data e hora de término:
                                </label>

                                <br />

                                <input
                                    type="datetime-local"
                                    name="endAt"
                                    value={taskEditada.endAt}
                                    onChange={handleChange}
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

                            // =====================================
                            // MODO NORMAL
                            // =====================================

                            <div>

                                <h3>{task.titulo}</h3>

                                <p>
                                    {task.descricao}
                                </p>

                                <p>
                                    Prioridade: {task.priority}
                                </p>

                                <p>
                                    Início: {task.startAt}
                                </p>

                                <p>
                                    Término: {task.endAt}
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