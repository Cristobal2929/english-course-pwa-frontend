#!/usr/bin/env python3
import os
import subprocess

# --- Rutas ---
BASE_DIR = os.path.expanduser("~/english-course-pwa")
BACKEND_DIR = os.path.join(BASE_DIR, "english-course-pwa-backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "english-course-pwa-frontend")
NEW_BACKEND_URL = "https://english-course-pwa-backend.onrender.com"

# --- Paso 1: Backend ---
print("🚀 Actualizando backend...")

bot_file = os.path.join(BACKEND_DIR, "botm.py")
if os.path.exists(bot_file):
    with open(bot_file, "r") as f:
        content = f.read()
    if "CORS(" not in content:
        content = "from flask_cors import CORS\n" + content
        content = content.replace("app = Flask(__name__)", "app = Flask(__name__)\nCORS(app)")
    if "@app.route(\"/\")" not in content:
        content += "\n@app.route('/', methods=['GET'])\ndef root():\n    return 'Backend activo', 200\n"
    with open(bot_file, "w") as f:
        f.write(content)
    print(f"⚡ Backend actualizado: {bot_file}")

# Commit y push backend
os.chdir(BACKEND_DIR)
subprocess.run(["git", "add", "."])
commit = subprocess.run(["git", "commit", "-m", "Fullstack: actualizar backend"], capture_output=True, text=True)
if "nothing to commit" not in commit.stdout:
    subprocess.run(["git", "push", "origin", "main"])
    print("🚀 Backend subido a GitHub")

# --- Paso 2: Frontend ---
print("🚀 Actualizando frontend...")

files_modified = 0
for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(".js") or file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            new_content = content.replace("http://localhost:5000", NEW_BACKEND_URL)
            new_content = new_content.replace("https://english-course-pwa-backend.onrender.com", NEW_BACKEND_URL)
            if new_content != content:
                with open(path, "w") as f:
                    f.write(new_content)
                files_modified += 1
                print(f"⚡ Actualizado: {path}")

print(f"✅ Archivos modificados en frontend: {files_modified}")

# Commit y push frontend
os.chdir(FRONTEND_DIR)
subprocess.run(["git", "add", "."])
commit = subprocess.run(["git", "commit", "-m", "Fullstack: actualizar frontend"], capture_output=True, text=True)
if "nothing to commit" not in commit.stdout:
    subprocess.run(["git", "push", "origin", "main"])
    print("🚀 Frontend subido a GitHub")

# --- Paso 3: Zip para Nefryti ---
zip_path = os.path.join(FRONTEND_DIR, "frontend_nefryti.zip")
subprocess.run(["zip", "-r", zip_path, "."], cwd=FRONTEND_DIR)
print(f"📦 Frontend comprimido listo para Nefryti: {zip_path}")

print("🎉 Fullstack actualizado completo!")
print(f"🌐 Backend Render: {NEW_BACKEND_URL}")

