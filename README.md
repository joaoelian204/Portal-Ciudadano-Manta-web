# 🏛️ Portal Ciudadano Manta

**Plataforma de Gestión y Participación Ciudadana del GAD Municipal de Manta**

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 📋 Descripción

Portal Ciudadano Manta es una plataforma web moderna, accesible e interactiva diseñada para fortalecer la comunicación entre la ciudadanía y el Gobierno Autónomo Descentralizado (GAD) Municipal de Manta, Ecuador. 

La plataforma permite a los ciudadanos:
- 📰 **Consultar noticias** y comunicados oficiales del municipio
- 📝 **Participar en encuestas** ciudadanas con geolocalización
- 🚨 **Reportar problemas** urbanos con ubicación en mapa
- 👤 **Gestionar su perfil** y seguir el estado de sus reportes

Cumple con estándares internacionales de usabilidad **ISO 9241-11** y diseño centrado en el usuario **ISO 9241-210**.

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Vue.js** | 3.x | Framework progresivo con Composition API |
| **TypeScript** | 5.x | Tipado estático para JavaScript |
| **Vite** | 6.x | Build tool ultrarrápido con HMR |
| **Tailwind CSS** | 4.x | Framework CSS utility-first |
| **Vue Router** | 4.x | Enrutamiento SPA oficial |
| **Pinia** | 2.x | Gestión de estado global |
| **Vue I18n** | 9.x | Internacionalización (ES/EN/QU) |
| **Leaflet** | 1.x | Mapas interactivos |

### Backend & Base de Datos
| Tecnología | Descripción |
|------------|-------------|
| **Supabase** | Backend as a Service (BaaS) |
| **PostgreSQL** | Base de datos relacional |
| **Row Level Security** | Seguridad a nivel de fila |
| **Supabase Storage** | Almacenamiento de archivos |
| **Supabase Auth** | Autenticación y autorización |

### Herramientas de Desarrollo
| Herramienta | Uso |
|-------------|-----|
| **ESLint** | Linting de código |
| **Prettier** | Formateo de código |
| **Git** | Control de versiones |
| **Vercel/Netlify** | Despliegue continuo |

---

## ✨ Características Principales

### 🎯 Módulos del Sistema
- **🏠 Home**: Panel principal con servicios y accesos rápidos
- **📰 Noticias**: Sistema de noticias con vista detallada
- **📊 Encuestas**: Participación ciudadana con geolocalización
- **🚨 Reportes**: Reporte de problemas con ubicación en mapa
- **👤 Mi Perfil**: Gestión de cuenta de usuario
- **⚙️ Panel Admin**: Gestión de contenido (noticias, encuestas, reportes)

### ♿ Accesibilidad Web (WCAG AA)
- Navegación por teclado completa
- Soporte para lectores de pantalla
- Alto contraste y textos legibles
- Textos alternativos en imágenes

### 🌐 Multilingüe
- 🇪🇸 Español (ES)
- 🇺🇸 English (EN)  
- 🇪🇨 Kichwa (QU)

### 📱 Diseño Responsive
- Optimizado para móviles, tablets y desktop
- Menú adaptable según dispositivo

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Cuenta de Supabase (gratis)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/joaoelian204/Portal-Ciudadano-Manta-web.git

# Navegar al directorio
cd portalCiudadanoManta

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

### 🌐 Despliegue en Netlify

#### Opción 1: Despliegue Automático desde GitHub

1. **Conectar con GitHub**
   - Ve a [Netlify](https://www.netlify.com)
   - Haz clic en "Add new site" → "Import an existing project"
   - Selecciona "GitHub" y autoriza Netlify
   - Elige el repositorio `Portal-Ciudadano-Manta-web`

2. **Configuración de Build**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`
   
3. **Variables de Entorno**
   - Ve a "Site settings" → "Environment variables"
   - Agrega tus variables de Supabase:
     ```
     VITE_SUPABASE_URL=tu_supabase_url
     VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
     ```

4. **Deploy**
   - Haz clic en "Deploy site"
   - Netlify detectará automáticamente el archivo `netlify.toml`
   - Cada push a la rama `main` desplegará automáticamente

#### Opción 2: Despliegue Manual con Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login en Netlify
netlify login

# Inicializar proyecto
netlify init

# Deploy manual
netlify deploy --prod
```

#### Configuración Adicional en Netlify

**Variables de Entorno Requeridas:**
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase

**Features Habilitadas:**
- ✅ Continuous Deployment (CD)
- ✅ HTTPS automático
- ✅ Redirects para SPA
- ✅ Headers de seguridad
- ✅ Caché optimizado
- ✅ Deploy previews para PRs

### Configuración de Supabase

1. Crea una cuenta en [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ejecuta el script SQL desde `supabase-schema.sql` en el SQL Editor
4. Copia las credenciales (URL y ANON KEY) al archivo `.env`
5. Consulta `SUPABASE_INTEGRATION.md` para la guía completa

**📘 Ver guía detallada:** [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)

---

## 🎨 Tecnologías

### Frontend
- **Vue 3**: Framework progresivo de JavaScript (Composition API)
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Build tool ultrarrápido
- **Tailwind CSS 4**: Framework CSS utility-first
- **Pinia**: Gestión de estado global
- **Vue Router**: Enrutamiento SPA
- **Vue I18n**: Internacionalización (ES/EN/QU)

### Backend & Database
- **Supabase**: Backend as a Service
  - PostgreSQL Database
  - Authentication & Authorization
  - Row Level Security (RLS)
  - Storage para archivos
  - Real-time subscriptions
  
### Estándares de Usabilidad
- **ISO 9241-11**: Estándar de usabilidad
- **ISO 9241-210**: Diseño centrado en el usuario
- **WCAG 2.1 AA**: Accesibilidad web

---

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

---

## 📞 Contacto y Soporte

**GAD Municipal de Manta**
- 📍 Dirección: Manta, Manabí, Ecuador
- ☎️ Teléfono: (05) 2622-300
- 📧 Email: contacto@manta.gob.ec
- ⏰ Horario: Lun - Vie: 08:00 - 17:00

---

## 📄 Documentación Adicional

- 📘 [Documentación completa del sistema](./SISTEMA_ISO.md)
- 🎯 [Métricas de usabilidad ISO 9241-11](./SISTEMA_ISO.md#métricas-de-usabilidad)
- 👥 [Diseño centrado en usuario ISO 9241-210](./SISTEMA_ISO.md#diseño-centrado-en-el-usuario)

---

## 🔐 Licencia

© 2025 GAD Municipal de Manta. Todos los derechos reservados.

---

## 👨‍💻 Desarrollado con ❤️ para la ciudadanía de Manta

**Versión**: 1.0.0  
**Última actualización**: 18 de octubre de 2025
