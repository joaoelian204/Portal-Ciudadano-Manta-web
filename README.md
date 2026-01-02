# 🏛️ Portal Ciudadano Manta ... 

Sistema de Gestión Ciudadana del GAD Municipal de Manta, Ecuador.

[![ISO 9241-11](https://img.shields.io/badge/ISO-9241--11-blue)](https://www.iso.org/standard/63500.html)
[![ISO 9241-210](https://img.shields.io/badge/ISO-9241--210-blue)](https://www.iso.org/standard/77520.html)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan)](https://tailwindcss.com/)

---

## 📋 Descripción

Portal web moderno y accesible que facilita la interacción entre la ciudadanía y el Gobierno Autónomo Descentralizado de Manta, cumpliendo con estándares internacionales de usabilidad ISO 9241-11 y diseño centrado en el usuario ISO 9241-210.

---

## ✨ Características Principales

### 🎯 Cumplimiento ISO 9241-11 (Usabilidad)
- **Eficiencia**: Acceso rápido mediante búsqueda inteligente y atajos
- **Eficacia**: Navegación clara con breadcrumbs e indicadores visuales
- **Satisfacción**: Diseño moderno, responsive y personalizable

### 👥 Cumplimiento ISO 9241-210 (Diseño Centrado en Usuario)
- Interfaz intuitiva basada en necesidades reales
- Feedback visual inmediato
- Ayuda contextual
- Flujos de trabajo optimizados

### ♿ Accesibilidad Web
- Modo de accesibilidad integrado
- Navegación por teclado (ARIA compliant)
- Contraste WCAG AA
- Textos alternativos en imágenes
- Soporte de lectores de pantalla

### 🌐 Multilingüe
- Español (ES)
- English (EN)
- Kichwa (QU)

### 📱 Responsive Design
- Optimizado para móviles, tablets y desktop
- Menu hamburguesa en dispositivos móviles
- Grids adaptables

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
src/
├── components/
│   ├── Navbar.vue          # Cabecera con búsqueda, idioma, accesibilidad
│   ├── Sidebar.vue         # Menú lateral expandible con submenús
│   ├── Footer.vue          # Pie de página institucional
│   └── ServiceCard.vue     # Tarjetas de servicios
├── views/
│   └── Home.vue            # Vista principal
├── interfaces/
│   ├── IApi.ts
│   ├── IEncuesta.ts
│   ├── IPortal.ts
│   ├── IReporte.ts
│   └── IUsuario.ts
└── App.vue                 # Componente raíz
```

### Funcionalidades Implementadas

#### ✅ 1. Formulario Principal (INICIO)

**Cabecera (Navbar)**
- Logo institucional con enlace a inicio
- Nombre del sistema
- Barra de búsqueda inteligente
- Selector de idioma (ES/EN/QU)
- Botón de accesibilidad
- Breadcrumb de ubicación
- Navegación responsive

**Menú Lateral (Sidebar)**
- Menú expandible/contraíble
- Iconos representativos
- Submenús contextuales:
  - Panel Principal
  - Servicios (Trámites, Pagos, Certificados)
  - Reportes (Nuevo, Mis reportes, Seguimiento)
  - Participación (Encuestas, Foros, Propuestas)
  - Mi Perfil
  - Ayuda
- Atajos rápidos
- Indicador de sección activa

**Pie de Página (Footer)**
- Información institucional
- Enlaces rápidos
- Soporte y contacto
- Políticas y términos de uso
- Redes sociales

#### 🚧 2. Formulario Usuarios (EN DESARROLLO)
- Inicio de sesión
- Registro de nuevos usuarios
- Gestión de perfiles
- Recuperación de contraseña
- Bloqueo temporal de sesión
- Términos de uso
- Tema dinámico (claro/oscuro)

#### 🚧 3. Formulario Registro Tabla Maestra (PLANEADO)
- Entrada de datos validada
- Combobox y listas desplegables
- Validación en tiempo real
- Autocompletado inteligente
- Botones: Nuevo, Actualizar, Filtrar, Limpiar
- Historial de cambios
- Filtros dinámicos
- Navegación por teclado
- Sistema de notificaciones

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
