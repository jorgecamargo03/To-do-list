    // Referências principais
    const add = document.getElementById('add');
    const mensagem = document.getElementById('mensagem');
    const txtinput = document.getElementById('txtInput');
    const novotxt = document.getElementById('txtnovo');
    const editar = document.getElementById('edit');
    const listaTarefa = document.getElementById('lista-tarefa');

    let itemEmEdicao = null;

    // Adiciona tarefa ao clicar ou pressionar Enter
    add.addEventListener('click', adicionarTarefa);
    txtinput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') add.click();
    });

    // Atualiza contador ao marcar/desmarcar tarefa
    document.addEventListener('change', (e) => {
        if (e.target.matches('#lista-tarefa input[type="checkbox"]')) {
            atualizarContador();
        }
    });

    // Editar ou remover tarefas
    document.addEventListener('click', (e) => {
        const target = e.target;

        if (target.closest('.edit')) {
            iniciarEdicao(target);
        }
        if (target.closest('.delete')) {
            removerTarefa(target);
        }
    });

    // Função: Adicionar tarefa
    function adicionarTarefa() {
        const input = txtinput.value.trim();

        if (input === '') {
            mostrarMensagem('Escreva algo por favor!', 'darkred');
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox">
            <span class="texto-tarefa">${input}</span>
            <button class="edit"><i class="fas fa-edit fa-2x"></i></button>
            <button class="delete"><i class="fas fa-trash fa-2x"></i></button>
        `;

        listaTarefa.appendChild(li);
        salvarTarefas()
        txtinput.value = '';
        mostrarMensagem('Adicionado com sucesso!', 'darkgreen');
        atualizarContador();
    }

    // Função: Remover tarefa
    function removerTarefa(elem) {
        const sim = confirm('Deseja Exlcuir?')
        if(sim){
            const li = elem.closest('li');
            if (li) {
                li.remove();
                salvarTarefas()
                mostrarMensagem('Tarefa removida', 'darkred');
                atualizarContador();
        }
        }
    }

    // Função: Iniciar edição
    function iniciarEdicao(elem) {
        const li = elem.closest('li');
        const texto = li.querySelector('.texto-tarefa');

        if (!texto) return;

        itemEmEdicao = texto;

        txtinput.style.display = 'none';
        novotxt.style.display = 'inline-block';
        add.style.display = 'none';
        editar.style.display = 'inline-block';

        novotxt.value = texto.textContent.trim();
    }

    // Botão de salvar edição
    editar.onclick = () => {
        const novoTexto = novotxt.value.trim();
        if (itemEmEdicao && novoTexto !== '') {
            itemEmEdicao.textContent = novoTexto;
            salvarTarefas()
            mostrarMensagem('Tarefa editada com sucesso!', 'darkblue');
            resetarCampos();
            atualizarContador();
            novotxt.value = '';
            itemEmEdicao = null;
        }
    };

    // Função: Resetar campos
    function resetarCampos() {
        txtinput.style.display = 'inline-block';
        novotxt.style.display = 'none';
        add.style.display = 'inline-block';
        editar.style.display = 'none';
    }

    // Função: Mostrar mensagens
    function mostrarMensagem(msg, cor) {
        mensagem.textContent = msg;
        mensagem.style.color = cor;
    }

    // Função: Atualizar contador
    function atualizarContador() {
        const checkboxes = document.querySelectorAll('#lista-tarefa input[type="checkbox"]');
        const feitas = [...checkboxes].filter(cb => cb.checked).length;
        const incompletas = checkboxes.length - feitas;
        document.getElementById('feitas').textContent = feitas;
        document.getElementById('incompletas').textContent = incompletas;
    }
    function salvarTarefas() {
        const tarefas = [];
        const itens = document.querySelectorAll('#lista-tarefa li');
    
        itens.forEach(item => {
            const texto = item.querySelector('.texto-tarefa').textContent;
            const feito = item.querySelector('input[type="checkbox"]').checked;
    
            tarefas.push({ texto, feito });
        });
    
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }




    function carregarTarefas() {
        const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefasSalvas.forEach(({ texto, feito }) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${feito ? 'checked' : ''}>
                <span class="texto-tarefa">${texto}</span>
                <button class="edit"><i class="fas fa-edit fa-2x"></i></button>
                <button class="delete"><i class="fas fa-trash fa-2x"></i></button>
            `;
            listaTarefa.appendChild(li);
        });
    
        atualizarContador();
    }
    carregarTarefas();