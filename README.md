# Nidia Nahas - Portfolio/CV

Un portafolio profesional moderno y responsivo para arquitecta, construido con Next.js. Incluye un panel de administración para gestión de contenido.

## 🚀 Características

- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Multiidioma**: Soporte para Español, Portugués e Inglés
- **Panel de Administración**: Gestión completa del contenido
- **Demo 3D**: Visualización interactiva con Three.js
- **Portafolio Interactivo**: Galería de proyectos con modal
- **SEO Optimizado**: Meta tags y estructura semántica

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **3D**: React Three Fiber + Three.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth con estado del cliente
- **Database**: Firebase Firestore
- **Editor WYSIWYG**: @uiw/react-md-editor (Markdown)
- **Icons**: React Icons
- **Deployment**: Firebase Hosting (static export)

## 🔒 Configuración de Firebase

### Firebase Authentication

El proyecto utiliza **Firebase Authentication** para el login del panel de administración:

- **Método**: Email y contraseña
- **Usuario Admin**: `admin@nidia-cv.com`
- **Protección**: Componente ProtectedRoute que verifica estado de autenticación
- **Sesiones**: Manejo de estado del cliente con Firebase Auth

### Firestore Security Rules

El proyecto incluye reglas de seguridad de Firestore que permiten:

- **Lectura pública** de todo el contenido del CV para el sitio web
- **Escritura restringida** solo al administrador autenticado
- **Colecciones protegidas** para gestión de contenido

### Variables de Entorno

Crear un archivo `.env.local` con las credenciales de Firebase:

```env
# Firebase Configuration (desde Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# Admin Credentials (para desarrollo)
ADMIN_EMAIL=admin@nidia-cv.com
ADMIN_PASSWORD=tu_password_admin
```

**Nota**: Las credenciales ya están configuradas en `.env.local` para desarrollo.

⚠️ **Importante**: Nunca commiteas el archivo `.env.local` al repositorio. Asegúrate de que esté en `.gitignore`.

### Deploy de Firebase

```bash
# Desplegar reglas de Firestore
firebase deploy --only firestore:rules

# Desplegar hosting
firebase deploy --only hosting
```

## 📋 Roadmap - Panel de Administración

> 📊 **Progreso Total**: 4/13 Fases (30%) | Última actualización: 27 Octubre 2024
>
> Para ver el roadmap detallado, consulta [ROADMAP.md](ROADMAP.md)

### � Fase 1: Autenticación y Seguridad ✅ COMPLETADA

- [x] Sistema de Login con Firebase Auth
- [x] Validación de credenciales y permisos
- [x] Protección de rutas admin
- [x] Logout seguro

**Ubicación**: `/admin/login` | **Docs**: [PHASE_1_README.md](PHASE_1_README.md)

### 🟢 Fase 2: Panel de Administración Base ✅ COMPLETADA

- [x] Dashboard principal con overview
- [x] Sidebar de navegación con iconos
- [x] Layout responsive
- [x] Header con usuario y logout

**Ubicación**: `/admin/dashboard` | **Build**: ✅ 14 rutas estáticas

### � Fase 3: Gestión de Información Personal ✅ COMPLETADA

- [x] Edición de perfil (nombre, título, ubicación, email, LinkedIn)
- [x] **Editor WYSIWYG** para Objetivo Profesional
- [x] Validación de contenido
- [x] Guardado automático en Firestore

**Ubicación**: `/admin/personal` | **Editor**: Markdown (@uiw/react-md-editor)

**Firestore**: `personal/profile`

### � Fase 4: Gestión de Experiencia Laboral ✅ COMPLETADA

- [x] CRUD completo (crear, leer, actualizar, eliminar)
- [x] Tabla de experiencias con acciones
- [x] **Editor WYSIWYG** para descripciones
- [x] Campos: Puesto, empresa, ubicación, fechas, tecnologías, descripción
- [x] Validación y auto-guardado

**Ubicación**: `/admin/experience` | **Firestore**: `experiences`

### 🟡 Fase 5: Gestión de Portafolio ⏳ PRÓXIMA

- [ ] CRUD de proyectos
- [ ] **Editor WYSIWYG** para descripciones
- [ ] Upload de imágenes a Firebase Storage
- [ ] Galería de imágenes por proyecto
- [ ] Reordenamiento drag & drop
- [ ] Campos: Título, descripción, categoría, tecnologías, imágenes, enlace

**Ubicación**: `/admin/portfolio` | **Firestore**: `portfolio`

**Estimado**: 1 semana | **Deps**: Firebase Storage

### 🟡 Fase 6: Gestión de Educación y Certificaciones ⏳ PRÓXIMA

**6a. Educación**

- [ ] CRUD de formación académica
- [ ] Campos: Institución, título, período, descripción
- [ ] Ubicación: `/admin/education` | Firestore: `education`

**6b. Certificaciones**

- [ ] CRUD de certificaciones y cursos
- [ ] Campos: Nombre, institución, fecha, certificado #, enlace de verificación
- [ ] Ubicación: `/admin/certifications` | Firestore: `certifications`

**Estimado**: 1 semana

### � Fase 7: Gestión de Software & Habilidades ⏳ PRÓXIMA

- [ ] CRUD de habilidades técnicas
- [ ] Campos: Nombre, categoría, nivel de competencia (1-5), años de experiencia
- [ ] Reordenamiento drag & drop
- [ ] Categorización (Software, Habilidades Blandas, etc.)

**Ubicación**: `/admin/skills` | **Firestore**: `skills`

**Estimado**: 3-4 días

### 🔵 Fase 8: Sistema de Traducciones ⏳ FUTURO

- [ ] Gestor de idiomas (Español, Portugués, Inglés)
- [ ] Editor de traducciones por sección
- [ ] Validación de traducciones completas
- [ ] Import/Export de traducciones

**Ubicación**: `/admin/translations` | **Firestore**: `translations`

### � Fases 9-13: Backend, API, Testing y Deployment ⏳ FUTURO

- [ ] **Fase 9**: API Backend RESTful
- [ ] **Fase 10**: Preview y sistema de versiones
- [ ] **Fase 11**: Configuración avanzada y backups
- [ ] **Fase 12**: Testing completo y optimizaciones
- [ ] **Fase 13**: CI/CD y monitoreo

---

## 🎯 Secciones Editables (Resumen)

| Sección                     | Estado   | WYSIWYG | Ubicación         | Firestore          |
| --------------------------- | -------- | ------- | ----------------- | ------------------ |
| **Objetivo Profesional**    | ✅ Hecho | ✅ Sí   | `/personal`       | `personal/profile` |
| **Experiencia Profesional** | ✅ Hecho | ✅ Sí   | `/experience`     | `experiences`      |
| **Portafolio**              | ⏳ Próx. | ✅ Sí   | `/portfolio`      | `portfolio`        |
| **Educación**               | ⏳ Próx. | ❌ No   | `/education`      | `education`        |
| **Certificaciones**         | ⏳ Próx. | ❌ No   | `/certifications` | `certifications`   |
| **Software & Habilidades**  | ⏳ Próx. | ❌ No   | `/skills`         | `skills`           |

## 🏃‍♂️ Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm/yarn/pnpm

### Instalación

1. **Clona el repositorio**

```bash
git clone <repository-url>
cd nidia_cv
```

2. **Instala dependencias**

```bash
npm install
```

3. **Configura variables de entorno**

```bash
cp .env.example .env.local
```

4. **Ejecuta el servidor de desarrollo**

```bash
npm run dev
```

5. **Accede al sitio**
   - Portfolio público: [http://localhost:3000](http://localhost:3000)
   - Panel admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Acceso al Panel de Administración

1. Ve a `/admin/login`
2. Ingresa las credenciales de administrador
3. Serás redirigido al dashboard de administración

**Credenciales por defecto:**

- Email: `admin@nidia-cv.com`
- Password: `admin123`

## 📁 Estructura del Proyecto

```
nidia_cv/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Panel de administración
│   │   │   ├── layout.js      # Layout compartido del admin
│   │   │   ├── login/         # Página de login
│   │   │   └── dashboard/     # Dashboard principal
│   │   ├── api/               # API Routes
│   │   │   └── auth/          # Autenticación (login/logout)
│   │   ├── components/        # Componentes React
│   │   └── globals.css        # Estilos globales
│   ├── middleware.js.disabled # Middleware deshabilitado (static export)
│   ├── components/            # Componentes compartidos
│   │   └── ProtectedRoute.js  # Componente de protección de rutas
│   ├── lib/                   # Utilidades
│   │   └── firebase.js        # Configuración Firebase
│   └── data/                  # Datos estáticos
├── .firebase/                 # Configuración Firebase
├── firestore.rules           # Reglas de seguridad Firestore
├── firestore.indexes.json    # Índices de Firestore
├── firebase.json             # Configuración Firebase
├── public/                   # Assets estáticos
├── tailwind.config.js        # Configuración Tailwind
└── package.json
```

## 📚 Documentación

### 📋 Guías Principales

- **[ROADMAP.md](ROADMAP.md)** - Roadmap completo de todas las 13 fases
- **[SECCIONES_EDITABLES.md](SECCIONES_EDITABLES.md)** - Descripción detallada de las 6 secciones editables
- **[SPRINT_PLAN.md](SPRINT_PLAN.md)** - Plan de implementación para Fases 5, 6 y 7
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Estado actual del proyecto y KPIs

### 🔐 Documentación de Fase 1 (Autenticación)

- **[PHASE_1_README.md](PHASE_1_README.md)** - Guía completa de autenticación
- **[PHASE_1_INDEX.md](PHASE_1_INDEX.md)** - Índice de todos los documentos de Fase 1
- **[PHASE_1_TESTS.md](PHASE_1_TESTS.md)** - 12 tests completos de validación
- **[SECURITY_FIX_LOGIN.md](SECURITY_FIX_LOGIN.md)** - Documentación del fix de seguridad
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Guía de configuración de Firebase
- **[QUICKSTART.md](QUICKSTART.md)** - Inicio rápido en 5 minutos

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Nidia Nahas - [LinkedIn](https://www.linkedin.com/in/nidia-nahas/)

Enlace del proyecto: [https://nidia-nahas-cv.vercel.app/](https://nidia-nahas-cv.vercel.app/)
