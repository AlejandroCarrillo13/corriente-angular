import { Routes } from '@angular/router';

/**
 * Tabla de rutas de la aplicación.
 *
 * Cada página se declara con loadComponent, que descarga su código la primera
 * vez que se visita la ruta (carga diferida). Así el archivo inicial que baja
 * el navegador contiene solo la cabecera, el pie y la portada, y el resto
 * llega a medida que el usuario navega.
 *
 * La ruta del detalle lleva el identificador como parámetro (/noticia/3), que
 * el componente lee con ActivatedRoute.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Corriente · Noticias en movimiento',
    loadComponent: () => import('./paginas/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'noticias',
    title: 'Todas las noticias · Corriente',
    loadComponent: () => import('./paginas/listado/listado').then((m) => m.Listado),
  },
  {
    path: 'noticia/:id',
    title: 'Detalle de la noticia · Corriente',
    loadComponent: () => import('./paginas/detalle/detalle').then((m) => m.Detalle),
  },
  {
    path: 'favoritos',
    title: 'Mis noticias guardadas · Corriente',
    loadComponent: () =>
      import('./paginas/favoritos/favoritos').then((m) => m.PaginaFavoritos),
  },
  {
    path: 'redaccion',
    title: 'Panel de redacción · Corriente',
    loadComponent: () => import('./paginas/redaccion/redaccion').then((m) => m.Redaccion),
  },
  {
    path: 'contacto',
    title: 'Contacto · Corriente',
    loadComponent: () => import('./paginas/contacto/contacto').then((m) => m.Contacto),
  },
  // Cualquier dirección desconocida vuelve a la portada.
  { path: '**', redirectTo: '' },
];
