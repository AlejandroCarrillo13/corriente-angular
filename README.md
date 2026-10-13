# Corriente — Plataforma web de noticias (Angular)

Entrega final del módulo **Desarrollo de Front-end**
(Institución Universitaria Politécnico Grancolombiano).

Aplicación web tipo periódico que permite explorar un catálogo de noticias, consultar
el detalle de cada una, guardarlas en una lista de favoritos, crear y eliminar
publicaciones propias y escribir a la redacción mediante un formulario con
validaciones.

- **Aplicación desplegada:** https://USUARIO.github.io/corriente-angular/
- **Repositorio:** https://github.com/USUARIO/corriente-angular
- **Video explicativo:** https://youtu.be/ENLACE

## Ejecutar en local

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:4200
```

Para compilar la versión de producción:

```bash
npm run build          # salida en dist/corriente-angular/browser
npm run build:ghpages  # misma compilación con la ruta base de GitHub Pages
```

## Estructura del proyecto

```
corriente-angular/
├── public/
│   ├── data/noticias.json      Catálogo base (12 noticias)
│   └── favicon.ico
├── scripts/
│   └── preparar-ghpages.mjs    Genera 404.html y .nojekyll tras compilar
├── src/
│   ├── index.html              Documento único de la aplicación
│   ├── main.ts                 Punto de arranque
│   ├── styles.css              Sistema visual completo (variables y componentes)
│   └── app/
│       ├── app.ts              Componente raíz: cabecera + router-outlet + pie
│       ├── app.config.ts       Proveedores: enrutador, HttpClient, idioma es-CO
│       ├── app.routes.ts       Tabla de rutas con carga diferida
│       ├── modelos/
│       │   └── noticia.ts      Interfaces Noticia y Categoria
│       ├── servicios/
│       │   ├── almacenamiento.ts   Envoltura de localStorage
│       │   ├── noticias.ts         Catálogo, creación y borrado (señales)
│       │   ├── favoritos.ts        Lista de guardados (señales)
│       │   └── validacion.ts       Reglas de los formularios
│       ├── componentes/
│       │   ├── encabezado/     Menú de navegación y contador de guardados
│       │   ├── pie/            Pie de página
│       │   ├── tarjeta-noticia/  Tarjeta reutilizable (@Input / @Output)
│       │   └── filtros/        Barra de filtros del listado (@Input / @Output)
│       └── paginas/
│           ├── inicio/         Portada, destacadas y llamados a la acción
│           ├── listado/        Filtro, búsqueda, orden y paginación
│           ├── detalle/        Noticia completa y relacionadas
│           ├── favoritos/      Lista personalizada y estado vacío
│           ├── redaccion/      Crear y eliminar noticias
│           └── contacto/       Formulario con validaciones
└── .github/workflows/deploy.yml   Despliegue automático en GitHub Pages
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/noticias` | Listado completo (acepta `?categoria=` y `?q=`) |
| `/noticia/:id` | Detalle de una noticia |
| `/favoritos` | Lista personalizada |
| `/redaccion` | Panel de creación y eliminación |
| `/contacto` | Formulario de contacto |

## Conceptos de Angular aplicados

- **Componentes independientes** (standalone) para cada página y cada pieza reutilizable.
- **Enlace de datos:** interpolación `{{ }}`, enlace de propiedad `[noticia]`, enlace de
  evento `(click)` y enlace en dos vías `[(ngModel)]`.
- **Comunicación entre componentes:** `@Input()` del padre al hijo y `@Output()` con
  `EventEmitter` del hijo al padre.
- **Servicios inyectables** con `providedIn: 'root'` para el catálogo, los favoritos,
  el almacenamiento y las validaciones.
- **Señales** (`signal`, `computed`) como estado reactivo compartido: al guardar una
  noticia, el contador de la cabecera y la página de favoritos se actualizan solos.
- **Enrutador** con carga diferida (`loadComponent`), parámetros de ruta y parámetros
  de consulta.
- **HttpClient** para leer el catálogo desde el archivo JSON local.

## Tecnologías

Angular 20 · TypeScript · CSS3 (variables personalizadas y CSS Grid) · localStorage ·
JSON local. Sin librerías de interfaz externas: la hoja de estilos es la misma que se
diseñó en la entrega 1 y se implementó en la entrega 2.

## Despliegue

El flujo `.github/workflows/deploy.yml` compila y publica en cada envío a `main`.
Primer despliegue:

1. Crear en GitHub un repositorio **público** llamado `corriente-angular`.
2. Subir el proyecto:

   ```bash
   git init
   git add .
   git commit -m "Entrega 3: implementación en Angular"
   git branch -M main
   git remote add origin https://github.com/USUARIO/corriente-angular.git
   git push -u origin main
   ```

3. En el repositorio, entrar a **Settings → Pages** y en *Build and deployment*
   elegir **Source: GitHub Actions**.
4. Esperar a que termine el flujo en la pestaña **Actions**. La aplicación queda
   en `https://USUARIO.github.io/corriente-angular/`.

Si el repositorio se llama distinto, hay que cambiar la ruta base en el guion
`build:ghpages` del `package.json` para que coincida con el nombre nuevo.
