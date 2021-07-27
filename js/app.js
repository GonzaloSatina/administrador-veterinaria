// NUEVO: Crear DB
let DB;


const nombreInput = document.querySelector('#nombre');
// const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const emailInput = document.querySelector('#email');
const asuntoInput = document.querySelector('#asunto');
const mensajeInput = document.querySelector('#mensaje');

// Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');

// Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')
formulario.addEventListener('submit', nuevaCita);


let editando = false;


// NUEVO: 
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    crearDB();
});

// Eventos
function eventListeners() {
    nombreInput.addEventListener('change', datosCita);
    // propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    emailInput.addEventListener('change', datosCita);
    asuntoInput.addEventListener('change', datosCita);
    mensajeInput.addEventListener('change', datosCita);

}

const citaObj = {
    nombre: '',
    // propietario: '',
    telefono: '',
    email: '',
    asunto: '',
    mensaje: ''
}


function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
    citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas  {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }
}

class UI {
    constructor()  {
        this.textoHeading();
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Si es de tipo error agrega una clase
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas() { // Se puede aplicar destructuring desde la función...

        this.limpiarHTML();

        // NUEVO : 
        const objectStore = DB.transaction('citas').objectStore('citas');

        const total = objectStore.count();
        total.onsuccess = function() {
            console.log(total.result);
        }

        // retorna un objeto request o petición, 
        objectStore.openCursor().onsuccess = function(e) {
                // cursor se va a ubicar en el registro indicado para accede ra los datos
                const cursor = e.target.result;

                if (cursor) {

                    // const {nombre, propietario, telefono, email, asunto, mensaje, id } = cursor.value;

                    const divCita = document.createElement('div');
                    divCita.classList.add('cita', 'p-3');
                    divCita.dataset.id = id;

                    // scRIPTING DE LOS ELEMENTOS...
                    const nombreParrafo = document.createElement('h2');
                    nombreParrafo.classList.add('card-title', 'font-weight-bolder');
                    nombreParrafo.innerHTML = `${nombre}`;

                    // const propietarioParrafo = document.createElement('p');
                    // // // propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

                    const telefonoParrafo = document.createElement('p');
                    telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

                    const emailParrafo = document.createElement('p');
                    emailParrafo.innerHTML = `<span class="font-weight-bolder">email: </span> ${email}`;

                    const asuntoParrafo = document.createElement('p');
                    asuntoParrafo.innerHTML = `<span class="font-weight-bolder">asunto: </span> ${asunto}`;

                    const mensajeParrafo = document.createElement('p');
                    mensajeParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${mensaje}`;

                    // Agregar un botón de eliminar...
                    const btnEliminar = document.createElement('button');
                    btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
                    btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                    btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

                    // Añade un botón de editar...
                    const btnEditar = document.createElement('button');
                    btnEditar.onclick = () => cargarEdicion(cursor.value);

                    btnEditar.classList.add('btn', 'btn-info');
                    btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

                    // Agregar al HTML
                    divCita.appendChild(nombreParrafo);
                    // divCita.appendChild(propietarioParrafo);
                    divCita.appendChild(telefonoParrafo);
                    divCita.appendChild(emailParrafo);
                    divCita.appendChild(asuntoParrafo);
                    divCita.appendChild(mensajeParrafo);
                    divCita.appendChild(btnEliminar)
                    divCita.appendChild(btnEditar)

                    contenedorCitas.appendChild(divCita);

                } // fin de if


            } // Fin de función de cursor...
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }


}


const administrarCitas = new Citas();

console.log(administrarCitas);
const ui = new UI(administrarCitas);

function nuevaCita(e) {
    e.preventDefault();

    // const {nombre, propietario, telefono, email, asunto, mensaje } = citaObj;

    // Validar
    // if( nombre === '' || propietario === '' || telefono === '' || email === ''  || asunto === '' || mensaje === '' ) {
    ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

    return;
}

if (editando) {

    // NUEVO: 
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    // console.log(objectStore);
    const peticion = objectStore.put(citaObj);

    transaction.oncomplete = () => {

        console.log('Editado Correctamente.')

        // Mover el código aqui..
        // Estamos editando
        administrarCitas.editarCita({...citaObj });

        ui.imprimirAlerta('Guardado Correctamente');

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        editando = false;
    }

    transaction.onerror = () => {
        console.log('Hubo un errorr.')
    }


} else {
    // Nuevo Registrando

    // Generar un ID único
    citaObj.id = Date.now();

    // Añade la nueva cita
    administrarCitas.agregarCita({...citaObj });


    // NUEVO: 
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    // console.log(objectStore);
    const peticion = objectStore.add(citaObj);

    transaction.oncomplete = () => {
        console.log('Cita agregada!');

        // Mostrar mensaje de que todo esta bien...
        ui.imprimirAlerta('Se agregó correctamente')

    }

    transaction.onerror = () => {
        console.log('Hubo un error!');
    }
}


// Imprimir el HTML de citas
ui.imprimirCitas();

// Reinicia el objeto para evitar futuros problemas de validación
reiniciarObjeto();

// Reiniciar Formulario
formulario.reset();




}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.nombre = '';
    // citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.email = '';
    citaObj.asunto = '';
    citaObj.mensaje = '';
}


function eliminarCita(id) {


    // NUEVO:
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    const resultado = objectStore.delete(id);

    // console.log( objectStore);
    // console.log( resultado);


    transaction.oncomplete = () => {
        console.log(`Cita  ${id} fue eliminado`);
        administrarCitas.eliminarCita(id);
        ui.imprimirCitas()
    }


    transaction.onerror = () => {
        console.log('Hubo un error!');
    }

}

function cargarEdicion(cita) {

    // const {nombre, propietario, telefono, email, asunto, mensaje, id } = cita;

    // Reiniciar el objeto
    citaObj.nombre = nombre;
    // // citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.email = email
    citaObj.asunto = asunto;
    citaObj.mensaje = mensaje;
    citaObj.id = id;

    // Llenar los Inputs
    nombreInput.value = nombre;
    // // propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    emailInput.value = email;
    asuntoInput.value = asunto;
    mensajeInput.value = mensaje;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}


// Código de IndexedDB
function crearDB() {
    // crear base de datos con la versión 1
    const crearDB = window.indexedDB.open('citas', 1);

    // si hay un error, lanzarlo
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }

    // si todo esta bien, asignar a database el resultado
    crearDB.onsuccess = function() {
        console.log('Citas Listo!');

        // guardamos el resultado
        DB = crearDB.result;

        // mostrar citas al cargar
        ui.imprimirCitas()
    }

    // este método solo corre una vez
    crearDB.onupgradeneeded = function(e) {
        // el evento que se va a correr tomamos la base de datos
        const db = e.target.result;


        // definir el objectstore, primer parametro el nombre de la BD, segundo las opciones
        // keypath es de donde se van a obtener los indices
        const objectStore = db.createObjectStore('citas', { keyPath: 'id', autoIncrement: true });

        //createindex, nombre y keypath, 3ro los parametros
        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('cliente', 'cliente', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('email', 'email', { unique: false });
        objectStore.createIndex('asunto', 'asunto', { unique: false });
        objectStore.createIndex('mensaje', 'mensaje', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });



        console.log('Database creada y lista');
    }
}