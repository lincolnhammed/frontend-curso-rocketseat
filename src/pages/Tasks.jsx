import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

export default function Tasks() {
    const navigate = useNavigate();

    // Guarda os dados do usuário que fez login.
    const [usuario, setUsuario] = useState(null);

    // Guarda a lista de tarefas que veio do backend.
    const [tasks, setTasks] = useState([]);

    // Guarda o ID da tarefa que está sendo editada.
    // Se for null, nenhuma tarefa está sendo editada.
    const [editandoId, setEditandoId] = useState(null);

    // Guarda os dados que o usuário está alterando.
    const [taskEditada, setTaskEditada] = useState({
        titulo: '',
        descricao: '',
        prioridade: ''
    });

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

        // Depois de saber quem está logado, buscamos as tarefas.
        handleListTasks();
    }, []);

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

            // Quando não existem tarefas, o backend retorna 204.
            if (response.status === 204) {
                setTasks([]);
                return;
            }

            setTasks(response.data);

        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    }

    // Quando clicamos em "Editar", colocamos a tarefa no formulário.
    function handleEditar(task) {
        setEditandoId(task.id);

        setTaskEditada({
            titulo: task.titulo || '',
            descricao: task.descricao || '',
            prioridade: task.priority || ''
        });
    }

    // Atualiza o estado conforme o usuário digita.
    function handleChange(event) {
        const { name, value } = event.target;

        setTaskEditada({
            ...taskEditada,
            [name]: value
        });
    }

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

            // Buscamos novamente as tarefas para mostrar os dados atualizados.
            handleListTasks();

        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);

            if (error.response) {
                console.error('Resposta do servidor:', error.response.data);
            }
        }
    }

    // Cancela a edição sem enviar nada para o backend.
    function handleCancelar() {
        setEditandoId(null);

        setTaskEditada({
            titulo: '',
            descricao: '',
            prioridade: ''
        });
    }

    // Remove o usuário do navegador e volta para a Home.
    function handleLogout() {
        sessionStorage.removeItem('usuario');

        navigate('/');
    }

    // Enquanto o usuário ainda não foi carregado, não mostramos a página.
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

                                <button onClick={() => handleEditar(task)}>
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