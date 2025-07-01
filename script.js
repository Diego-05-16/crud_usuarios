
const formularioUsuario = document.getElementById("formularioUsuario");
const listaUsuarios = document.getElementById("listaUsuarios");
const botonAgregar = document.getElementById("botonAgregar");
const botonCancelar = document.getElementById("botonCancelar");


const API_URL = "http://localhost/crud-usuarios/api.php";  

let usuarios = [];
let indiceEdicion = -1;


function limpiarFormulario() {
    formularioUsuario.nombre.value = "";
    formularioUsuario.apellido.value = "";
    formularioUsuario.direccion.value = "";
    formularioUsuario.email.value = "";
    formularioUsuario.contrasena.value = "";
    formularioUsuario.fechaCreacion.value = "";
    formularioUsuario.fechaActualizacion.value = "";
    indiceEdicion = -1;
    botonAgregar.style.backgroundColor = "#16a34a";
    botonAgregar.innerHTML = '<i class="fas fa-plus"></i> Agregar';
    botonCancelar.classList.add("hidden");
}


function mostrarUsuarios() {
    listaUsuarios.innerHTML = "";
    usuarios.forEach((usuario, indice) => {
        const fila = document.createElement("tr");
        fila.classList.add("fila-usuario");

        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.direccion}</td>
            <td>${usuario.email}</td>
            <td class="font-mono select-text">${usuario.contrasena}</td>
            <td>${usuario.fechaCreacion}</td>
            <td>${usuario.fechaActualizacion}</td>
            <td class="acciones">
                <button class="editarUsuario" data-id="${usuario.id}" aria-label="Editar usuario ${usuario.nombre} ${usuario.apellido}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="eliminarUsuario eliminar" data-id="${usuario.id}" aria-label="Eliminar usuario ${usuario.nombre} ${usuario.apellido}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        listaUsuarios.appendChild(fila);
    });

    document.querySelectorAll(".editarUsuario").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            editarUsuario(id);
        });
    });

    document.querySelectorAll(".eliminarUsuario").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            eliminarUsuario(id);
        });
    });
}

/**
 * Carga los datos de un usuario en el formulario para su edición.
 * @param {string} id - El ID del usuario a editar.
 */
function editarUsuario(id) {
    const usuario = usuarios.find(user => user.id == id);
    if (usuario) {
        indiceEdicion = usuarios.indexOf(usuario);
        formularioUsuario.nombre.value = usuario.nombre;
        formularioUsuario.apellido.value = usuario.apellido;
        formularioUsuario.direccion.value = usuario.direccion;
        formularioUsuario.email.value = usuario.email;
        formularioUsuario.contrasena.value = usuario.contrasena;
        formularioUsuario.fechaCreacion.value = usuario.fechaCreacion;
        formularioUsuario.fechaActualizacion.value = usuario.fechaActualizacion;

        botonAgregar.style.backgroundColor = "#ca8a04"; 
        botonAgregar.innerHTML = '<i class="fas fa-save"></i> Guardar';

        botonCancelar.classList.remove("hidden");
    }
}

/**
 * Agrega un nuevo usuario a la base de datos a través de la API.
 * @param {object} usuario - El objeto usuario a agregar.
 */
async function agregarUsuario(usuario) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        const result = await response.json();
        if (result.success) {
            console.log(result.message);
            await cargarUsuarios();
        } else {
            alert("Error al agregar usuario: " + result.message);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("Ocurrió un error de conexión con el servidor.");
    }
}

/**
 * Guarda los cambios de un usuario editado en la base de datos.
 * @param {object} usuario - El objeto usuario con los datos actualizados.
 */
async function guardarEdicion(usuario) {
    usuario.id = usuarios[indiceEdicion].id;

    try {
        const response = await fetch(API_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        const result = await response.json();
        if (result.success) {
            console.log(result.message);
            await cargarUsuarios(); 
            limpiarFormulario(); 
        } else {
            alert("Error al guardar la edición: " + result.message);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("Ocurrió un error de conexión con el servidor.");
    }
}


async function eliminarUsuario(id) {
    const usuario = usuarios.find(user => user.id == id);
    if (usuario && confirm(`¿Está seguro que desea eliminar al usuario "${usuario.nombre} ${usuario.apellido}"?`)) {
        try {
            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
                console.log(result.message);
                await cargarUsuarios();
                if (indiceEdicion !== -1 && usuarios[indiceEdicion].id == id) {
                    limpiarFormulario();
                }
            } else {
                alert("Error al eliminar usuario: " + result.message);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Ocurrió un error de conexión con el servidor.");
        }
    }
}


async function cargarUsuarios() {
    try {
        const response = await fetch(API_URL, { method: 'GET' });
        const result = await response.json();
        if (result.success) {
            usuarios = result.data;
            mostrarUsuarios();
        } else {
            console.error("Error al cargar usuarios:", result.message);
        }
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("No se pudo conectar con la base de datos. Asegúrate de que XAMPP esté corriendo.");
    }
}


formularioUsuario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = formularioUsuario.nombre.value.trim();
    const apellido = formularioUsuario.apellido.value.trim();
    const direccion = formularioUsuario.direccion.value.trim();
    const email = formularioUsuario.email.value.trim();
    const contrasena = formularioUsuario.contrasena.value.trim();
    const fechaCreacion = formularioUsuario.fechaCreacion.value;
    const fechaActualizacion = formularioUsuario.fechaActualizacion.value;

    if (!nombre || !apellido || !direccion || !email || !contrasena || !fechaCreacion || !fechaActualizacion) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    const usuario = {
        nombre,
        apellido,
        direccion,
        email,
        contrasena,
        fechaCreacion,
        fechaActualizacion,
    };

    if (indiceEdicion === -1) {
        agregarUsuario(usuario);
    } else {
        guardarEdicion(usuario);
    }

    limpiarFormulario();
});

botonCancelar.addEventListener("click", () => {
    limpiarFormulario();
});

document.addEventListener("DOMContentLoaded", cargarUsuarios);