/* Accediendo Al DOM */
const textArea = document.getElementById('tarea');
const botonFormulario = document.querySelector('#formulario');
const almacenarTareas = document.getElementById('lista-tareas');
let renderStorage = false;

/* Eventos Del Usuario Y El Sistema */
eventosUsuario();

function eventosUsuario() {
    document.addEventListener('DOMContentLoaded', obtenerDatosLocalStorage);
    botonFormulario.addEventListener('submit', escribirTarea);
    almacenarTareas.addEventListener('click', estadoTarea);
}

/* Funcionalidad Para Validar Datos En El Local Storage */
function obtenerDatosLocalStorage() {
    let tareasLocalStorage;

    if (localStorage.getItem('tareas') === null) {
        tareasLocalStorage = [];
        renderStorage = true;
    } else {
        tareasLocalStorage = JSON.parse(localStorage.getItem('tareas'));

        if (renderStorage === false) {
            renderizarDatosLocalStorage(tareasLocalStorage);
            renderStorage = true;
        }
    }

    return tareasLocalStorage;
}

/* Funcionalidad Para Renderizar los datos que existan en el local storage */
function renderizarDatosLocalStorage(contenidoLocalStorage) {
    contenidoLocalStorage.forEach((tarea, index) => {
        li = document.createElement('li');
        editar = document.createElement('a');
        seleccionar = document.createElement('a');
        eliminar = document.createElement('a');

        editar.classList.add('editar-tarea');
        seleccionar.classList.add('seleccionar-tarea');
        eliminar.classList.add('borrar-tarea');

        li.innerHTML = tarea;
        editar.innerHTML = '🖊';
        seleccionar.innerHTML = '✔';
        eliminar.innerHTML = 'X';

        li.appendChild(editar);
        li.appendChild(seleccionar);
        li.appendChild(eliminar);
        almacenarTareas.appendChild(li);
    });
}

/* Funcionalidad Para Obtener El Texto De La Tarea */
function escribirTarea(e) {
    e.preventDefault();

    if (textArea.value !== '') {
        agregarTareaLocalStorage();
        textArea.value = '';
    } else {
        console.log();
        window.confirm('La Tarea Escrita Es Una Cadena De Texto Vacia, Por Ende, No Se Va A Agregar Una Tarea.');
    }
}

/* Funcionalidad Para Guardar Tarea En El Local Storage */
function agregarTareaLocalStorage() {
    /* Funcionalidad Para Editar Una Tarea Existente */
    if (botonFormulario.classList.contains('editar-tarea-form')) {
        let arrayLocalStorage, posicionElemento, tareasLocalStorage;

        arrayLocalStorage = obtenerDatosLocalStorage();

        for (let index = 0; index < arrayLocalStorage.length; index++) {
            if (arrayLocalStorage[index] === 'No Actualizaste La Tarea #' + (index + 1)) {
                posicionElemento = arrayLocalStorage.indexOf('No Actualizaste La Tarea #' + (index + 1));
            }
        }

        arrayLocalStorage.splice(posicionElemento, 1, textArea.value);
        localStorage.setItem('tareas', JSON.stringify(arrayLocalStorage));
        almacenarTareas.innerHTML = '';

        tareasLocalStorage = JSON.parse(localStorage.getItem('tareas'));
        renderizarDatosLocalStorage(tareasLocalStorage);

        botonFormulario.classList.remove('editar-tarea-form');
    } else {
        let arrayLocalStorage = obtenerDatosLocalStorage();
        arrayLocalStorage.push(textArea.value);

        renderizarDOM(textArea.value);
        localStorage.setItem('tareas', JSON.stringify(arrayLocalStorage));
    }
}

/* Funcionalidad Para Renderizar En El Dom Cada Tarea */
function renderizarDOM(textAreaDOM) {
    li = document.createElement('li');
    editar = document.createElement('a');
    seleccionar = document.createElement('a');
    eliminar = document.createElement('a');

    editar.classList.add('editar-tarea');
    seleccionar.classList.add('seleccionar-tarea');
    eliminar.classList.add('borrar-tarea');

    li.innerHTML = textAreaDOM;
    editar.innerHTML = '🖊';
    seleccionar.innerHTML = '✔';
    eliminar.innerHTML = 'X';

    li.appendChild(editar);
    li.appendChild(seleccionar);
    li.appendChild(eliminar);
    almacenarTareas.appendChild(li);
}

/* Funcionalidad Para Conocer El Estado De Una Tarea */
function estadoTarea(e) {
    e.preventDefault();
    const elementoDOM = e.target.parentElement;

    if (e.target.classList.contains('editar-tarea')) {
        editarTareaDOM(elementoDOM);

    } else if (e.target.classList.contains('seleccionar-tarea')) {
        seleccionarTareaDOM(elementoDOM);

    } else if (e.target.classList.contains('borrar-tarea')) {
        eliminarTareaDOM(elementoDOM);
    }
}

/* Funcionalidad Para Editar Una Tarea */
function editarTareaDOM(stringDOM) {
    if (!stringDOM.classList.contains('nueva')) {
        let DOM = stringDOM.textContent;
        let cadena, arrayLocalStorage, posicionElemento;

        cadena = DOM.substr(0, (DOM.length - 4));
        textArea.value = cadena;

        arrayLocalStorage = obtenerDatosLocalStorage();
        posicionElemento = arrayLocalStorage.indexOf(cadena);

        for (let index = 0; index < arrayLocalStorage.length; index++) {
            if (index === posicionElemento) {
                arrayLocalStorage.splice(posicionElemento, 1, ('No Actualizaste La Tarea #' + (index + 1)));
            }
        }

        localStorage.setItem('tareas', JSON.stringify(arrayLocalStorage));
        botonFormulario.classList.add('editar-tarea-form');
    } else {
        window.confirm('No Se Puede Editar Mientras El CheckBox Este Activo.');
    }
}

/* Funcionalidad Para Seleccionar Una Tarea */
function seleccionarTareaDOM(contenidoSeleccionado) {
    /* Activa o desactiva una clase con un click*/
    if (!botonFormulario.classList.contains('editar-tarea-form')) {
        contenidoSeleccionado.classList.toggle('nueva');
    } else {
        window.confirm('No Se Puede Activar El CheckBox Mientras Se Este Editando.');
    }
}

/* Funcionalidad Para Eliminar Una Tarea Del DOM */
function eliminarTareaDOM(contenidoAeliminar) {
    if (!botonFormulario.classList.contains('editar-tarea-form')) {

        if (window.confirm('Seguro Desea Eliminar La Tarea')) {
            contenidoAeliminar.remove();
            eliminarLocalStorage(contenidoAeliminar.textContent);
        }

    } else {
        window.confirm('No Se Puede Remover Una Tarea Mientras Se Este Editando.');
    }
}

/* Funcionalidad Para Eliminar Una Tarea Del Local Storage */
function eliminarLocalStorage(stringDOM) {
    let cadena, arrayLocalStorage, posicionElemento;

    cadena = stringDOM.substr(0, (stringDOM.length - 4));
    arrayLocalStorage = obtenerDatosLocalStorage();
    posicionElemento = arrayLocalStorage.indexOf(cadena);

    /* Recibe la posicion que se va a eliminar y su expancion */
    arrayLocalStorage.splice(posicionElemento, 1);
    localStorage.setItem('tareas', JSON.stringify(arrayLocalStorage));
}