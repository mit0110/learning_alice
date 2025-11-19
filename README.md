# 🐰 Adivina la Palabra - Alicia en el País de las Maravillas

Mini sitio web interactivo para enseñar predicción de palabras mediante aprendizaje por refuerzo en el aula (5º/6º grado).

## 📋 Descripción

Este proyecto es una aplicación web educativa que simula un sistema de aprendizaje por refuerzo simple. Los estudiantes deben adivinar palabras faltantes en frases inspiradas en "Alicia en el País de las Maravillas". El sistema proporciona retroalimentación visual inmediata mediante un indicador de progreso que va de rojo (muy lejos) a verde (muy cerca).

## 🎯 Características

- **Interfaz playful** inspirada en el estilo surrealista de Alicia
- **Retroalimentación visual** con barra de progreso animada
- **Frases educativas** basadas en el cuento clásico
- **Modo offline** completamente funcional (sin necesidad de internet)
- **Diseño responsive** para proyección en clase

## 🚀 Cómo ejecutar en localhost

### Opción 1: Abrir directamente en el navegador

1. Navega hasta la carpeta del proyecto en tu explorador de archivos
2. Haz doble clic en el archivo `index.html`
3. El sitio se abrirá automáticamente en tu navegador predeterminado

### Opción 2: Usar un servidor local (recomendado)

#### Con Python 3:

```bash
# Navega hasta la carpeta del proyecto
cd /ruta/a/learning_alice

# Inicia un servidor HTTP simple
python3 -m http.server 8000
```

Luego abre tu navegador y visita: `http://localhost:8000`

#### Con Node.js (http-server):

```bash
# Instala http-server globalmente (solo la primera vez)
npm install -g http-server

# Navega hasta la carpeta del proyecto
cd /ruta/a/learning_alice

# Inicia el servidor
http-server -p 8000
```

Luego abre tu navegador y visita: `http://localhost:8000`

#### Con Visual Studio Code (Live Server):

1. Instala la extensión "Live Server" en VS Code
2. Abre la carpeta del proyecto en VS Code
3. Haz clic derecho en `index.html` → "Open with Live Server"

## 📁 Estructura del proyecto

```
learning_alice/
│
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos y diseño visual
├── app.js             # Lógica de la aplicación
└── README.md          # Este archivo
```

## 🎮 Cómo usar en clase

1. **Proyecta la aplicación** en una pantalla o pizarra interactiva
2. **Muestra la frase** con la palabra oculta
3. **Los estudiantes sugieren palabras** que podrían completar la frase
4. **Escribe cada sugerencia** en el campo de texto y presiona ENVIAR
5. **Observa el indicador de progreso** que muestra qué tan cerca está la respuesta
6. **Continúa iterando** hasta encontrar la palabra correcta o muy cercana

## 🔧 Cómo funciona (Versión actual - Iteración 1)

En esta primera iteración:
- El sistema muestra frases con una palabra oculta
- Cuando el estudiante envía una respuesta, se genera un **puntaje aleatorio** entre 0% y 100%
- El indicador de progreso se mueve según el puntaje
- Después de 2 segundos, aparece automáticamente una nueva frase

**Próximas iteraciones incluirán:**
- Cálculo real de similitud usando distancia de Levenshtein
- Modo online con API de Claude para similitud semántica
- Panel de profesor para configurar frases personalizadas
- Modo proyector de pantalla completa


## 📝 Notas para el profesor

- **Duración recomendada:** 5-8 segundos por intento
- **Frases incluidas:** 8 frases inspiradas en Alicia
- **Nivel de dificultad:** Ajustado para 5º-6º grado
- **Modo actual:** Sistema de puntuación aleatorio (solo para demostración)

## 🔮 Roadmap

- [ ] Implementar algoritmo de Levenshtein para similitud léxica
- [ ] Agregar integración con API de Claude para similitud semántica
- [ ] Crear panel de administración para profesores
- [ ] Implementar modo proyector de pantalla completa
- [ ] Agregar sistema de logros y estadísticas
- [ ] Permitir carga de frases personalizadas

## 📄 Licencia

Este proyecto es de uso educativo y libre para escuelas y educadores.

---

**Creado para el aprendizaje interactivo en el aula** 🎓✨
