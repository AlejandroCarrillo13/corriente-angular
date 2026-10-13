import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CATEGORIAS } from '../../modelos/noticia';

/** Criterios de ordenamiento disponibles en el listado. */
export type Orden = 'recientes' | 'antiguas' | 'titulo';

/**
 * Barra de filtros del listado: chips de categoría, buscador y selector de
 * orden.
 *
 * Es un componente "tonto": no conoce el catálogo ni decide nada. Recibe el
 * estado actual por @Input y avisa de cada cambio por @Output. La página del
 * listado es la que guarda el estado y aplica los criterios, de modo que esta
 * barra podría reutilizarse en otra vista sin arrastrar lógica de negocio.
 */
@Component({
  selector: 'app-filtros',
  imports: [FormsModule],
  templateUrl: './filtros.html',
})
export class Filtros {
  /** Categoría seleccionada ('todas' o la clave de una sección). */
  @Input() categoria = 'todas';

  /** Término de búsqueda escrito por el usuario. */
  @Input() termino = '';

  /** Criterio de ordenamiento activo. */
  @Input() orden: Orden = 'recientes';

  @Output() categoriaCambiada = new EventEmitter<string>();
  @Output() terminoCambiado = new EventEmitter<string>();
  @Output() ordenCambiado = new EventEmitter<Orden>();

  readonly categorias = CATEGORIAS;

  seleccionarCategoria(clave: string): void {
    this.categoriaCambiada.emit(clave);
  }

  /** Se dispara en cada tecla para que la búsqueda filtre mientras se escribe. */
  escribirTermino(valor: string): void {
    this.terminoCambiado.emit(valor);
  }

  cambiarOrden(valor: string): void {
    this.ordenCambiado.emit(valor as Orden);
  }
}
