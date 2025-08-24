const BACKEND_URL = "https://english-course-pwa-backend.onrender.com";

async function cargarLeccion(num){
    const res = await fetch(`lecciones/leccion${num}.json`);
    const data = await res.json();
    document.getElementById("app").innerText = data.contenido;
}

async function cargarTest(num){
    const res = await fetch(`tests/test${num}.json`);
    const data = await res.json();
    console.log(data);
}

cargarLeccion(1);
