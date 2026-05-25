<p align="center">
  <img src="public/assets/logo-netpolix.png" alt="NetPolix Logo" width="200">
</p>

<h1 align="center">🎬 NetPolix</h1>

<p align="center">
  <strong>Plataforma de Gestión Comercial de Películas y Series</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Licencia-ISC-blue?style=for-the-badge" alt="License">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Activo-00FF88?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Versión-1.0.0-00D4FF?style=flat-square" alt="Version">
</p>

---

## 📋 Descripción

**NetPolix** es una plataforma web completa para la gestión comercial de películas y series. Permite a los administradores gestionar un catálogo multimedia, a los gerentes visualizar reportes de ventas, y a los clientes registrados explorar, comprar y alquilar contenido con un sistema de puntos de fidelidad.

### ✨ Características Principales

| Módulo | Funcionalidades |
|--------|----------------|
| 🎬 **Catálogo** | Gestión completa de películas, series y colecciones con filtros avanzados |
| 🛒 **Comercio** | Sistema de compra y alquiler con carrito de compras |
| ⭐ **Puntos** | Programa de fidelidad con acumulación y redención de puntos |
| 👥 **Referidos** | Sistema de referidos con bonificación de puntos |
| 📊 **Reportes** | Dashboard con gráficos de ventas, rankings y estadísticas |
| 📤 **Importación** | Carga masiva de películas desde archivos Excel |
| 🔐 **Autenticación** | JWT con control de acceso basado en roles |
| ⭐ **Calificaciones** | Sistema de rating para películas (excelente, buena, regular, mala) |

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura **cliente-servidor** con API REST, frontend vanilla y persistencia en **PostgreSQL** mediante **Prisma ORM**:

```
netpolix/
│
├── server.js                    ← Punto de entrada (Express, puerto 3001 por defecto)
├── prisma/
│   ├── schema.prisma            ← Modelo de datos (10 tablas)
│   └── seed.js                  ← Carga inicial desde server/data/*.json
├── .env.example                 ← Plantilla de variables de entorno
├── docs/
│   └── diagrama-er-netpolix.png ← Diagrama entidad-relación
│
├── server/                      ← 🔵 BACKEND
│   ├── config/
│   │   └── defaults.js          ← Constantes y valores por defecto
│   ├── middleware/
│   │   ├── auth.js              ← JWT: generación y validación de tokens
│   │   └── roles.js             ← Control de acceso por rol
│   ├── routes/
│   │   ├── auth.routes.js       ← Login, registro, perfil
│   │   ├── movies.routes.js     ← CRUD películas + calificación
│   │   ├── series.routes.js     ← CRUD series
│   │   ├── people.routes.js     ← CRUD personas (actores, directores)
│   │   ├── categories.routes.js ← CRUD categorías
│   │   ├── languages.routes.js  ← CRUD idiomas
│   │   ├── classifications.routes.js ← CRUD clasificaciones
│   │   ├── collections.routes.js    ← CRUD colecciones
│   │   ├── clients.routes.js    ← Gestión de clientes
│   │   ├── orders.routes.js     ← Compras y alquileres
│   │   ├── reports.routes.js    ← Reportes y rankings
│   │   ├── config.routes.js     ← Configuración del sistema
│   │   └── upload.routes.js     ← Importación masiva Excel
│   ├── utils/
│   │   ├── prismaClient.js      ← Cliente Prisma (PostgreSQL)
│   │   └── excelParser.js       ← Parser de archivos Excel
│   └── data/                    ← 📦 Datos iniciales (JSON, solo para seed)
│       ├── users.json
│       ├── movies.json
│       ├── series.json
│       ├── collections.json
│       ├── orders.json
│       ├── people.json
│       ├── categories.json
│       ├── languages.json
│       ├── classifications.json
│       └── config.json
│
├── public/                      ← 🟡 FRONTEND
│   ├── index.html               ← Landing page pública
│   ├── login.html               ← Inicio de sesión
│   ├── register.html            ← Registro de clientes
│   ├── js/
│   │   ├── api.js               ← Cliente HTTP centralizado
│   │   ├── auth.js              ← Guardián de autenticación
│   │   └── components/          ← Componentes reutilizables
│   │       ├── notifications.js ← Notificaciones toast
│   │       ├── sidebar.js       ← Barra lateral dinámica
│   │       ├── table.js         ← Tablas dinámicas
│   │       ├── modal.js         ← Modales
│   │       ├── charts.js        ← Gráficos (Chart.js)
│   │       └── fileUpload.js    ← Drag & drop de archivos
│   ├── css/                     ← Sistema de diseño
│   │   ├── variables.css        ← Tokens de diseño
│   │   ├── base.css             ← Estilos base
│   │   ├── components.css       ← Componentes UI
│   │   ├── layout.css           ← Layout principal
│   │   ├── landing.css          ← Landing page
│   │   ├── dashboard.css        ← Dashboards
│   │   ├── forms.css            ← Formularios
│   │   ├── animations.css       ← Animaciones y efectos
│   │   └── client-catalog.css   ← Catálogo premium
│   ├── admin/                   ← 👑 Panel del administrador
│   ├── manager/                 ← 📊 Panel del gerente
│   └── client/                  ← 🛒 Panel del cliente
│
└── uploads/                     ← Archivos temporales (Excel)
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)
- **PostgreSQL** instalado en Windows (recomendado), puerto `5433`

### Base de datos (PostgreSQL + Prisma)

1. Copia las variables de entorno:

```bash
copy .env.example .env
```

2. Instala PostgreSQL en Windows y crea la base (ver guía abajo). Credenciales del proyecto:

- Host: `localhost` · Puerto: `5433`
- Usuario: `netpolix` · Contraseña: `netpolix2024` · Base: `netpolix`
- En `.env`: `DATABASE_URL=postgresql://netpolix:netpolix2024@localhost:5433/netpolix`

> Si no tienes otro PostgreSQL en el puerto 5432, puedes usar el puerto por defecto `5432` y cambiar `DB_PORT` y `DATABASE_URL` en `.env`.

3. Crea el usuario y la base de datos en PostgreSQL (SQL Shell o pgAdmin):

```sql
CREATE USER netpolix WITH PASSWORD 'netpolix2024' LOGIN CREATEDB;
CREATE DATABASE netpolix OWNER netpolix;
GRANT ALL PRIVILEGES ON DATABASE netpolix TO netpolix;
```

4. Crea tablas y carga datos desde `server/data/*.json`:

```bash
npm install
npm run db:setup
```

**Ver datos:** usa **pgAdmin 4** (programa de escritorio) o `npm run db:studio` → http://localhost:5555. El puerto **5433** es solo para PostgreSQL, no se abre en el navegador como una web.

Comandos útiles:

| Comando | Descripción |
|---------|-------------|
| `npm run db:push` | Sincroniza `prisma/schema.prisma` → PostgreSQL |
| `npm run db:seed` | Migra JSON → PostgreSQL |
| `npm run db:setup` | `generate` + `push` + `seed` |
| `npm run db:studio` | Interfaz visual en http://localhost:5555 |

Ver el [modelo relacional](#-modelo-de-datos-postgresql) más abajo.

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Yina-programmer/NETPOLIX.git

# 2. Entrar al directorio
cd NETPOLIX

# 3. Instalar dependencias y preparar la DB (ver sección anterior)
npm install
npm run db:setup

# 4. Ejecutar el servidor
npm run dev
```

### Acceso

| Qué | URL / herramienta |
|-----|-------------------|
| **App NetPolix** | http://localhost:3001 |
| **Prisma Studio** (ver/editar datos) | `npm run db:studio` → http://localhost:5555 |
| **pgAdmin 4** (administrar PostgreSQL) | Menú Inicio → pgAdmin 4 |
| **PostgreSQL** (motor de BD) | `localhost:5433` — no se abre en el navegador |

> Si el puerto 3000 está ocupado (p. ej. por Docker), la app usa **3001** (`PORT` en `.env`).

---

## 🔑 Credenciales de Demo

La aplicación incluye usuarios precargados para probar cada rol:

| Rol | Email | Contraseña | Acceso |
|-----|-------|------------|--------|
| 👑 **Admin** | `admin@netpolix.com` | `Admin123` | Gestión completa del sistema |
| 📊 **Gerente** | `gerente@netpolix.com` | `Gerente123` | Reportes y estadísticas |
| 🛒 **Cliente** | `cliente@netpolix.com` | `Cliente1` | Catálogo, compras y perfil |

---

## 👤 Roles y Permisos

```mermaid
graph LR
    subgraph "👑 Administrador"
        A1[CRUD Películas/Series]
        A2[CRUD Personas/Categorías]
        A3[Gestión de Usuarios]
        A4[Penalizar Clientes]
        A5[Configurar Precios]
        A6[Importar Excel]
        A7[Ver Reportes]
    end

    subgraph "📊 Gerente"
        G1[Reportes de Ventas]
        G2[Rankings Populares]
        G3[Rankings de Rating]
        G4[Gráficos de Ingresos]
    end

    subgraph "🛒 Cliente"
        C1[Navegar Catálogo]
        C2[Comprar/Alquilar]
        C3[Calificar Películas]
        C4[Historial de Pedidos]
        C5[Gestionar Perfil]
        C6[Acumular Puntos]
    end
```

---

## 📡 API REST — Endpoints

### 🔐 Autenticación (`/api/auth`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/auth/login` | Público | Iniciar sesión |
| `POST` | `/api/auth/register` | Público | Registrar nuevo cliente |
| `GET` | `/api/auth/profile` | Autenticado | Obtener perfil |
| `PUT` | `/api/auth/profile` | Autenticado | Actualizar perfil |

### 🎬 Películas (`/api/movies`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/movies` | Público | Listar con filtros |
| `GET` | `/api/movies/:id` | Público | Detalle con actores |
| `POST` | `/api/movies` | Admin | Crear película |
| `PUT` | `/api/movies/:id` | Admin | Actualizar película |
| `DELETE` | `/api/movies/:id` | Admin | Eliminar (soft delete) |
| `POST` | `/api/movies/:id/rate` | Cliente | Calificar película |

### 📺 Series (`/api/series`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/series` | Público | Listar series |
| `GET` | `/api/series/:id` | Público | Detalle de serie |
| `POST` | `/api/series` | Admin | Crear serie |
| `PUT` | `/api/series/:id` | Admin | Actualizar serie |
| `DELETE` | `/api/series/:id` | Admin | Eliminar serie |

### 🛒 Pedidos (`/api/orders`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/orders` | Cliente | Crear pedido |
| `GET` | `/api/orders` | Admin/Gerente | Listar pedidos |
| `GET` | `/api/orders/my` | Autenticado | Mis pedidos |

### 📊 Reportes (`/api/reports`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/reports/sales` | Gerente/Admin | Reporte de ventas |
| `GET` | `/api/reports/sales-by-type` | Gerente/Admin | Ventas por tipo |
| `GET` | `/api/reports/ranking/popular` | Gerente/Admin | Top 10 populares |
| `GET` | `/api/reports/ranking/rated` | Gerente/Admin | Top 10 calificados |

### Otros Endpoints

| Recurso | Ruta Base | Operaciones |
|---------|-----------|-------------|
| 👥 Personas | `/api/people` | CRUD (actores, directores, productores) |
| 🏷️ Categorías | `/api/categories` | CRUD |
| 🌐 Idiomas | `/api/languages` | CRUD |
| 🔖 Clasificaciones | `/api/classifications` | CRUD |
| 📦 Colecciones | `/api/collections` | CRUD |
| 👤 Clientes | `/api/clients` | Listar, penalizar |
| ⚙️ Configuración | `/api/config` | Leer/Actualizar precios y puntos |
| 📤 Importación | `/api/upload` | Subir Excel, descargar plantilla |

---

## 💰 Sistema de Puntos

| Acción | Puntos |
|--------|--------|
| Compra de contenido | +25 pts |
| Alquiler de contenido | +10 pts |
| Referir un nuevo cliente | +50 pts |
| Redención | 100 pts = $1 de descuento |

Los puntos se configuran dinámicamente desde el panel de administración.

---

## 🛠️ Stack Tecnológico

### Backend

| Tecnología | Uso |
|------------|-----|
| **Node.js** | Runtime de JavaScript |
| **Express 4.21** | Framework web y API REST |
| **JSON Web Tokens** | Autenticación stateless |
| **bcryptjs** | Hash de contraseñas |
| **multer** | Upload de archivos |
| **xlsx** | Lectura/escritura de Excel |
| **PostgreSQL** | Base de datos relacional |
| **Prisma ORM** | Acceso a datos, migraciones y seed |
| **dotenv** | Variables de entorno |

### Frontend

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3** | Diseño con variables, gradientes, glassmorphism |
| **JavaScript ES6+** | Lógica del cliente (Vanilla, sin frameworks) |
| **Chart.js** | Gráficos en el dashboard de reportes |
| **Google Fonts** | Tipografías Inter y Outfit |

### Diseño

| Elemento | Detalle |
|----------|---------|
| 🎨 **Tema** | Dark mode con acentos neón (azul `#00D4FF` + rojo `#FF0054`) |
| ✨ **Efectos** | Glassmorphism, neon glow, micro-animaciones |
| 📱 **Responsive** | Adaptado para desktop, tablet y móvil |
| 🧩 **Componentes** | Sistema modular (sidebar, tablas, modales, charts, notificaciones) |

---

## 🗄️ Modelo de datos (PostgreSQL)

NetPolix persiste la información en **PostgreSQL** con **Prisma ORM**. El diseño tiene **10 tablas** y una relación formal con clave foránea: **un usuario tiene muchos pedidos** (`User` → `Order`).

<p align="center">
  <img src="docs/diagrama-er-netpolix.png" alt="Diagrama entidad-relación NetPolix" width="900">
  <br>
  <em>Diagrama entidad-relación — diseño conceptual del catálogo y las ventas</em>
</p>

### Relación principal (FK en base de datos)

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| **User** → **Order** | 1 : N | Un usuario realiza cero o muchos pedidos. `Order.userId` referencia `User.id`. |

### Tablas y campos principales

| Tabla | Campos clave | Descripción |
|-------|--------------|-------------|
| **User** | `id`, `documentId` (UK), `email` (UK), `password`, `role`, `points`, `referralCode`, `penalized`, `active` | Admin, gerente y clientes |
| **Order** | `id`, `userId` (FK), `type`, `itemType`, `itemId`, `price`, `pointsEarned` | Compras y alquileres |
| **Movie** | `id`, `isan` (UK), `title`, `year`, `duration`, `classification`, `categories[]`, `salePrice`, `rentalPrice`, `avgRating`, `active` | Películas del catálogo |
| **Series** | `id`, `title`, `season`, `categories[]`, `salePrice`, `rentalPrice`, `active` | Series por temporadas |
| **Collection** | `id`, `title`, `videos[]`, `salePrice` | Paquetes de películas/series |
| **Person** | `id`, `name`, `birthDate`, `roles[]` | Actores, directores, productores |
| **Category** | `id`, `name` (UK), `description` | Géneros (Drama, Acción, etc.) |
| **Classification** | `id`, `type` (UK), `description` | Clasificación por edad (G, PG, R…) |
| **Language** | `id`, `name` (UK), `code` (UK) | Idiomas de audio y subtítulos |
| **Config** | `id` (= 1), `movieRentalPrice`, `movieSalePrice`, `pointsPerRental`, `pointsPerSale` | Precios y reglas de puntos |

> **UK** = único · **FK** = clave foránea · Los campos `categories[]`, `videos[]`, `roles[]` son arreglos en PostgreSQL.

### Relaciones lógicas (sin FK en PostgreSQL)

Estas conexiones se resuelven en la aplicación (IDs o textos guardados en campos y arrays):

| Desde | Hacia | Cómo se enlaza |
|-------|-------|----------------|
| **Order** | Movie / Series / Collection | `itemId` + `itemType` (`movie`, `series`, `collection`) |
| **Movie** | Classification | `Movie.classification` = `Classification.type` |
| **Movie / Series** | Category | Array `categories[]` |
| **Movie / Series** | Person | Arrays `actors[]`, `directors[]`, `producers[]` |
| **Collection** | Movie / Series | Array `videos[]` con IDs de contenido |
| **Config** | Pedidos / catálogo | Precios por defecto y puntos por compra o alquiler |

### Diagrama interactivo (Mermaid)

```mermaid
erDiagram
    User ||--o{ Order : "tiene"

    User {
        string id PK
        string documentId UK
        string email UK
        string role
        int points
        boolean penalized
        boolean active
    }

    Order {
        string id PK
        string userId FK
        string type
        string itemType
        string itemId
        float price
        int pointsEarned
    }

    Movie {
        string id PK
        string isan UK
        string title
        int year
        string classification
        float salePrice
        float rentalPrice
        float avgRating
        boolean active
    }

    Series {
        string id PK
        string title
        int season
        float salePrice
        float rentalPrice
        boolean active
    }

    Collection {
        string id PK
        string title
        string videos
        float salePrice
    }

    Person {
        string id PK
        string name
        string birthDate
        string roles
    }

    Category {
        string id PK
        string name UK
        string description
    }

    Classification {
        string id PK
        string type UK
    }

    Language {
        string id PK
        string name UK
        string code UK
    }

    Config {
        int id PK
        float movieRentalPrice
        float movieSalePrice
        int pointsPerRental
        int pointsPerSale
    }

    Order }o..o| Movie : "itemType movie"
    Order }o..o| Series : "itemType series"
    Order }o..o| Collection : "itemType collection"
    Movie }o..o| Classification : "classification"
    Movie }o..o{ Category : "categories"
    Series }o..o{ Category : "categories"
    Movie }o..o{ Person : "cast crew"
    Collection }o..o{ Movie : "videos"
    Collection }o..o{ Series : "videos"
```

> En el diagrama de la imagen, la línea sólida **User — Order** es la única FK. Las demás son referencias lógicas del dominio.

### Vista por módulos

```mermaid
flowchart TB
    subgraph Catálogo["Catálogo"]
        M[Movie]
        S[Series]
        C[Collection]
        P[Person]
        CAT[Category]
        CLS[Classification]
    end

    subgraph Usuarios["Usuarios"]
        U[User]
    end

    subgraph Ventas["Ventas"]
        O[Order]
    end

    U -->|"1:N"| O
    O --> M
    O --> S
    O --> C
    M --> CLS
    M --> CAT
    M --> P
    C --> M
```

Definición completa: [`prisma/schema.prisma`](prisma/schema.prisma).

---

## 🔄 Flujo de Compra

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant A as API
    participant DB as PostgreSQL

    C->>F: Navega al catálogo
    F->>A: GET /api/movies
    A->>DB: prisma.movie.findMany()
    DB-->>A: Lista de películas
    A-->>F: JSON response
    F-->>C: Renderiza catálogo premium

    C->>F: Click "Comprar"
    F->>F: Agrega al carrito (localStorage)
    C->>F: Finalizar compra
    F->>A: POST /api/orders
    A->>DB: Verifica User + Config + ítem
    A->>DB: transaction Order + puntos
    A-->>F: Orden exitosa
    F-->>C: Notificación de éxito
```

---

## 🤝 Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**. Consulta el archivo `package.json` para más detalles.

---

<p align="center">
  Hecho con ❤️ por <a href="https://github.com/Yina-programmer"><strong>Yina-programmer</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🎬-NetPolix-00D4FF?style=for-the-badge" alt="NetPolix">
</p>
