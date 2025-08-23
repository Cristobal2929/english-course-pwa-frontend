// Este es el URL de la API de tu backend en Render.
// Es la única línea que debes cambiar si la dirección del backend cambia.
const API_BASE_URL = 'https://english-course-pwa-backend.onrender.com/api';

const NUM_LECCIONES = 20;

const listaLecciones = document.getElementById('lista-lecciones');
const listaTests = document.getElementById('lista-tests');
const contenidoContainer = document.getElementById('contenido-container');
const loginSection = document.getElementById('login-section');
const mainContent = document.getElementById('main-content');
const logoutButton = document.getElementById('logout-button');

function showSection(sectionId) {
    const sections = {
        lecciones: document.getElementById('lecciones-section'),
        tests: document.getElementById('tests-section')
    };
    for (const id in sections) {
        sections[id].style.display = id === sectionId ? 'block' : 'none';
    }
    if (sectionId === 'lecciones' || sectionId === 'tests') {
        contenidoContainer.innerHTML = '';
        contenidoContainer.style.display = 'none';
    }
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            alert('Login exitoso!');
            localStorage.setItem('token', data.token); // Guardar el token si se necesita
            loginSection.style.display = 'none';
            mainContent.style.display = 'block';
            showSection('lecciones');
        } else {
            alert(data.message || 'Error en el login.');
        }
    } catch (error) {
        alert('Error de conexión con el servidor. Por favor, revisa la URL.');
    }
}

async function getLecciones() {
    const response = await fetch(`${API_BASE_URL}/lecciones`);
    const data = await response.json();
    return data;
}

async function getLeccion(leccionId) {
    const response = await fetch(`${API_BASE_URL}/lecciones/${leccionId}`);
    const data = await response.json();
    return data;
}

async function getAudio(texto) {
    const response = await fetch(`${API_BASE_URL}/audio/${texto}`);
    return response.blob();
}

async function renderLecciones() {
    const lecciones = await getLecciones();
    listaLecciones.innerHTML = '';
    lecciones.forEach(leccion => {
        const li = document.createElement('li');
        li.textContent = leccion.titulo;
        li.dataset.id = leccion.id;
        li.addEventListener('click', () => renderLeccion(leccion.id));
        listaLecciones.appendChild(li);
    });
    showSection('lecciones');
}

async function renderLeccion(leccionId) {
    const leccion = await getLeccion(leccionId);
    contenidoContainer.innerHTML = '';
    leccion.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.pregunta} - ${item.respuesta}`;
        const audioBtn = document.createElement('button');
        audioBtn.textContent = '▶️';
        audioBtn.addEventListener('click', async () => {
            const audioBlob = await getAudio(item.pregunta);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        });
        contenidoContainer.appendChild(p);
        contenidoContainer.appendChild(audioBtn);
    });
    contenidoContainer.style.display = 'block';
}

function handleLogout() {
    localStorage.removeItem('token');
    loginSection.style.display = 'block';
    mainContent.style.display = 'none';
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
});

document.getElementById('lecciones-link').addEventListener('click', renderLecciones);
document.getElementById('tests-link').addEventListener('click', () => showSection('tests'));
document.getElementById('logout-button').addEventListener('click', handleLogout);

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        loginSection.style.display = 'none';
        mainContent.style.display = 'block';
        renderLecciones();
    } else {
        loginSection.style.display = 'block';
        mainContent.style.display = 'none';
    }
});

