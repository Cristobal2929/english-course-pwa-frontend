
const API_URL = 'https://english-course-pwa-backend.onrender.com/api';
const NUM_LECCIONES = 20;

const listaLecciones = document.getElementById('lista-lecciones');
const listaTests = document.getElementById('lista-tests');
const contenidoContainer = document.getElementById('contenido-container');
const loginSection = document.getElementById('login-section');
const mainContent = document.getElementById('main-content');
const logoutButton = document.getElementById('logout-button');

function showSection(sectionId) {
    const sections = { lecciones: document.getElementById('lecciones'), tests: document.getElementById('tests') };
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
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            alert('¡Login exitoso!');
            checkAuth();
        } else {
            alert(`Error de login: ${data.error}`);
        }
    } catch (error) {
        alert('Error de conexión con el servidor.');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    alert('Sesión cerrada.');
    checkAuth();
}

async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        loginSection.style.display = 'none';
        mainContent.style.display = 'block';
        cargarLecciones();
        cargarTests();
        showSection('lecciones');
    } else {
        loginSection.style.display = 'block';
        mainContent.style.display = 'none';
    }
}

async function cargarLecciones() {
    listaLecciones.innerHTML = '';
    for (let i = 1; i <= NUM_LECCIONES; i++) {
        const li = document.createElement('li');
        li.textContent = `Lección ${i}`;
        li.onclick = () => abrirLeccion(i);
        listaLecciones.appendChild(li);
    }
}

async function abrirLeccion(n) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, inicia sesión para acceder a las lecciones.');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/lecciones/${n}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            const data = await res.json();
            alert(`Error: ${data.error}`);
            return;
        }
        
        const items = await res.json();
        contenidoContainer.style.display = 'block';
        contenidoContainer.innerHTML = `<button class="back-button" onclick="showSection('lecciones')">← Volver</button><h2>Lección ${n}</h2><div id="leccion-content"></div>`;
        const leccionContent = document.getElementById('leccion-content');
        items.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'content-item';
            div.innerHTML = `<h3>${idx + 1}. ${item.palabra}</h3><p>${item.traduccion}</p>`;
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = `${API_URL}/audios/leccion${n}_item${idx + 1}.mp3`;
            div.appendChild(audio);
            leccionContent.appendChild(div);
        });
        showSection('contenido-leccion');
    } catch (error) {
        alert(`Error al cargar la lección: ${error}`);
    }
}

async function cargarTests() {
    listaTests.innerHTML = '';
    for (let i = 1; i <= NUM_LECCIONES; i++) {
        const li = document.createElement('li');
        li.textContent = `Test Lección ${i}`;
        li.onclick = () => abrirTest(i);
        listaTests.appendChild(li);
    }
}

async function abrirTest(n) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, inicia sesión para acceder a los tests.');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/tests/${n}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            const data = await res.json();
            alert(`Error: ${data.error}`);
            return;
        }

        const items = await res.json();
        let puntaje = 0;
        contenidoContainer.style.display = 'block';
        contenidoContainer.innerHTML = `<button class="back-button" onclick="showSection('tests')">← Volver</button><h2>Test Lección ${n}</h2><div id="test-content"></div><p id="test-result">Puntaje: 0/${items.length}</p>`;
        const testContent = document.getElementById('test-content');
        const testResult = document.getElementById('test-result');

        items.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'content-item test-container';
            div.innerHTML = `<h3>${idx + 1}. ${item.pregunta}</h3><input type="text" data-correct-answer="${item.respuesta.toLowerCase()}" placeholder="Tu respuesta"><button>Revisar</button><p class="result"></p>`;
            const button = div.querySelector('button');
            const input = div.querySelector('input');
            const resultP = div.querySelector('.result');
            
            button.onclick = () => {
                const userAnswer = input.value.trim().toLowerCase();
                const correctAnswer = input.getAttribute('data-correct-answer');
                if (userAnswer === correctAnswer) {
                    resultP.textContent = '✔ Correcto';
                    resultP.className = 'result correct';
                    input.disabled = true;
                    button.disabled = true;
                    puntaje++;
                } else {
                    resultP.textContent = `✖ Incorrecto. La respuesta correcta es: ${item.respuesta}`;
                    resultP.className = 'result incorrect';
                }
                testResult.textContent = `Puntaje: ${puntaje}/${items.length}`;
            };
            testContent.appendChild(div);
        });
        showSection('contenido-test');
    } catch (error) {
        alert(`Error al cargar el test: ${error}`);
    }
}

checkAuth();
