let drageedTask = null;

//para enviar com o enter
document.getElementById('taskInput').addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        addTask();
    }
});

function addTask(){
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();


    if(taskText == '') return;

    const taskElement = document.createElement('div');
    taskElement.className = 'taskElement';
    taskElement.innerHTML = `
        ${taskText}<span style="float: right; cursor: pointer;" >X</span> `; //para mostrar o texto da tarefa e o X para remover

 //para remover a tarefa
taskElement.querySelector('span').onclick = () => taskElement.remove();

// para editar task
taskElement.ondblclick = function() {
    let textoAtual = taskElement.childNodes[0].textContent.trim(); //pega o texto atual da tarefa, trim para remover espaços em branco

    let novoTexto = prompt("Cometeu um erro? Editar Tarefa:", textoAtual);

    if(novoTexto && novoTexto.trim() !== ""){ //verifica se o novo texto não é vazio
        taskElement.childNodes [0].textContent = novoTexto + " "; //atualiza o texto da tarefa, adiciona um espaço que mantem o X alinhado
        saveTasks(); 
    }
};

//para arrastar a tarefa
taskElement.setAttribute('draggable', true);
taskElement.addEventListener('dragstart', () => {
    drageedTask = taskElement;
    setTimeout(() => {
        taskElement.style.display = 'none';
    }, 0); //para carregar o drop
});

taskElement.addEventListener('dragend', () => {
    taskElement.style.display = "block";
    drageedTask = null;
  });

     document.getElementById("todo").appendChild(taskElement);
  taskInput.value = "";
  saveTasks(); //salvar as tarefas no localStorage
}

// colunas de tarefas- mover
document.querySelectorAll(".task-column").forEach(column => {
  column.addEventListener("dragover", (e) => e.preventDefault());

  column.addEventListener("drop", (e) => {
  e.preventDefault();
  if (drageedTask) {
    column.appendChild(drageedTask);
    saveTasks(); //salvar as tarefas no localStorage
  }
    });
});

// para salvar as tarefas no localStorage
function saveTasks(){
    let tarefas = {
        todo: [],
        inpro: [],
        done: []  
    };


    document.querySelectorAll("#todo .taskElement").forEach(function(t){
        tarefas.todo.push(t.innerText.replace("X","").trim()); //pega as tasks da coluna to do e remove o X e salva a tarefa, trim para remover espaços em branco
    });

    document.querySelectorAll("#inpro .taskElement").forEach(function(t){
        tarefas.inpro.push(t.innerText.replace("X","").trim());  //igual as outras
    });

    document.querySelectorAll("#done .taskElement").forEach(function(t){ //LEMBRA: forEach percorre list
        tarefas.done.push(t.innerText.replace("X","").trim()); //igual as outras
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas)); //salva no navegador, objeto em texto
}

//criando as task
function createTask(texto, colunaId){
    const taskElement = document.createElement('div');
    taskElement.className = 'taskElement';

    taskElement.innerHTML = `
        ${texto}<span style="float: right; cursor: pointer;">x</span>
    `;
// p remov
    taskElement.querySelector('span').onclick = () => {
        taskElement.remove();
        saveTasks();
    };

// p editar
    taskElement.ondblclick = function() {
        let textoAtual = taskElement.childNodes[0].textContent.trim();

        let novoTexto = prompt("Editar tarefa:", textoAtual);

        if(novoTexto && novoTexto.trim() !== ""){
            taskElement.childNodes[0].textContent = novoTexto + " ";
            saveTasks();
        }
    };

// p arrastar
    taskElement.setAttribute('draggable', true); 

    taskElement.addEventListener('dragstart', () => { //ao pegar p arrastar
        drageedTask = taskElement; 
        setTimeout(() => { 
            taskElement.style.display = 'none'; //p não ficar aparecdo enquanto arrasta
        }, 0);
    });

    taskElement.addEventListener('dragend', () => {  //ao soltar
        taskElement.style.display = "block";
        drageedTask = null;
    });

    document.getElementById(colunaId).appendChild(taskElement); //adicionar na colun certa
}

// para carregar as tarefas do localStorage
function loadTasks(){
    let dados = JSON.parse(localStorage.getItem("tarefas")); //texto em objeto

    if(!dados) return; 

    dados.todo.forEach(function(t){
        createTask(t, "todo"); 
    });

    dados.inpro.forEach(function(t){
        createTask(t, "inpro");
    });

    dados.done.forEach(function(t){
        createTask(t, "done");
    });
}

window.onload = function(){ //carregar as tasks qnd carregar a pgna
    loadTasks(); 
};