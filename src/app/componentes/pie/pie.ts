import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CATEGORIAS } from '../../modelos/noticia';

/**
 * Pie de página con la información general del medio.
 * Al ser un componente, el bloque se escribe una vez y se repite en las seis
 * vistas desde la plantilla raíz de la aplicación.
 */
@Component({
  selector: 'app-pie',
  imports: [RouterLink],
  templateUrl: './pie.html',
})
export class Pie {
  /** Las secciones se recorren desde el modelo, no se escriben a mano. */
  readonly categorias = CATEGORIAS;

  readonly paginas = [
    { texto: 'Inicio', ruta: '/' },
    { texto: 'Noticias', ruta: '/noticias' },
    { texto: 'Favoritos', ruta: '/favoritos' },
    { texto: 'Redacción', ruta: '/redaccion' },
    { texto: 'Contacto', ruta: '/contacto' },
  ];

  readonly anio = new Date().getFullYear();
}
