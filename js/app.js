const BACKEND_URL = "https://english-course-pwa-backend.onrender.com";

async function cargarLeccion(num){
const BACKEND_URL = "https://english-course-pwa-backend.onrender.com";
    const data = await res.json();
    document.getElementById("app").innerText = data.contenido;
}

async function cargarTest(num){
const BACKEND_URL = "https://english-course-pwa-backend.onrender.com";
    const data = await res.json();
    console.log(data);
}

cargarLeccion(1);
