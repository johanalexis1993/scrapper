# scrapper – Proyecto de Web Scraping

**scrapper** es un backend sencillo y modular en Node.js pensado para scraping web (por ejemplo, de Instant Gaming). El proyecto incorpora buenas prácticas de estructura y manejo de errores profesional, centralizando los errores como en sistemas desarrollados con Go.

---

## 🚀 Características principales

- **Node.js + Express:** Backend para scraping con estructura profesional.
- **Centralización de errores:** Eliminación del patrón tradicional de try/catch, usando un sistema centralizado de manejo de errores, inspirado en Go.
- **Organización clara:** Código modular en las carpetas `/src/api`, `/src/utils`, y `/src/config`.
- **Variables sensibles en .env**
- **Dependencias y scripts definidos en package.json**

---

## ⚡ Puesta en marcha

### Requisitos

- Node.js >= 18
- MongoDB (local o Atlas)

### Instalación

```bash
npm i
```

### Variables necesarias en `.env`

```
DB_URL=mongodb+srv://...
```

### Ejecución en desarrollo

```bash
npm run dev
```

---

## 📦 Estructura del proyecto

```
scrapper/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   ├── config/
│   ├── utils/
├── index.js
├── package.json
├── .env
```

---

## 🛡️ Manejo de errores

El backend utiliza un sistema **centralizado para el manejo de errores**, eliminando el patrón clásico de try/catch manual y permitiendo una gestión más robusta y profesional de las excepciones. Los errores en los controladores y procesos principales delegan a funciones específicas en `/src/utils/handleErr.js`, siguiendo un patrón similar al de proyectos desarrollados en Go:

```js
// src/utils/handleErr.js
const handleErr = (res, error = {}) => {
  const status = error.status || error.statusCode || 500
  const message = error.msg || error.message || 'Error interno del servidor'
  console.error('Error:', { status, message, stack: error.stack || null })
  return res.status(status).json({ error: message })
}
module.exports = { handleErr }
```

Y en tus controladores:

```js
const { handleErr } = require('../utils/handleErr')
// ...
try {
  // lógica principal
} catch (err) {
  handleErr(res, err)
}
```

**El patrón de try/catch genérico se ha eliminado** y sustituido por un flujo centralizado y consistente en todo el backend.

---

## 📖 Documentación técnica

- **Endpoints básicos:** *(Describe aquí tus rutas principales si las expones públicamente)*
- **Seguridad:** Variables de entorno, control de dependencias.
- **Errores:** Manejo específico y centralizado como estándar profesional.

---

## 🗺️ Roadmap

- Mejorar paginado del scraping.
- Añadir logging avanzado y guardado de errores críticos.
- Automatizar scraping sobre distintas webs.

---

## 👨‍💻 Autor

**Johan Alexis**  
Desarrollador Full-Stack  
Enfoque en arquitectura clara, rendimiento y aprendizaje continuo.
