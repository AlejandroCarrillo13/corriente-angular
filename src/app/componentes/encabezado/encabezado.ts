import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Favoritos } from '../../servicios/favoritos';

/** Un enlace del menú principal. */
interface EnlaceMenu {
  texto: string;
  ruta: string;
}

/**
 * Cabecera común a todas las vistas: barra de fecha, logotipo, menú de
 * navegación, buscador y acceso a la lista de guardados.
 *
 * En la entrega 2 este bloque se insertaba con innerHTML desde un módulo de
 * JavaScript. Aquí es un componente: su plantilla está en un archivo HTML
 * aparte, el enrutador marca el enlace activo sin código propio y el contador
 * de guardados se actualiza solo porque lee una señal del servicio.
 */
@Component({
  selector: 'app-encabezado',
  imports: [RouterLink, RouterLinkActive, FormsModule, DatePipe],
  templateUrl: './encabezado.html',
})
export class Encabezado {
  /** El servicio es público porque la plantilla lee su contador. */
  readonly favoritos = inject(Favoritos);
  private readonly router = inject(Router);

  /** Menú principal: las cinco páginas que exige el enunciado. */
  readonly paginas: EnlaceMenu[] = [
    { texto: 'Inicio', ruta: '/' },
    { texto: 'Noticias', ruta: '/noticias' },
    { texto: 'Favoritos', ruta: '/favoritos' },
    { texto: 'Redacción', ruta: '/redaccion' },
    { texto: 'Contacto', ruta: '/contacto' },
  ];

  /** Texto del buscador. Enlazado en dos vías con [(ngModel)]. */
  termino = '';

  /** Fecha de hoy, ya formateada para la barra superior. */
  readonly hoy = new Date();

  /**
   * Lleva al listado pasando el término como parámetro de consulta.
   * El listado lo lee y aplica la búsqueda al cargar.
   */
  buscar(): void {
    const texto = this.termino.trim();
    this.router.navigate(['/noticias'], {
      queryParams: texto ? { q: texto } : {},
    });
  }
}
