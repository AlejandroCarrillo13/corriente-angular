import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TarjetaNoticia } from '../../componentes/tarjeta-noticia/tarjeta-noticia';
import { Noticia } from '../../modelos/noticia';
import { Favoritos } from '../../servicios/favoritos';
import { Noticias } from '../../servicios/noticias';

/**
 * Lista personalizada de noticias guardadas.
 *
 * Es la vista donde más se nota la ventaja de las señales: `guardadas` cruza
 * el catálogo con los identificadores del servicio de favoritos, de modo que
 * al quitar una estrella la tarjeta desaparece de la rejilla sin escribir una
 * sola línea para redibujar, que era lo que hacía la función `dibujar()` de
 * la entrega 2.
 */
@Component({
  selector: 'app-pagina-favoritos',
  imports: [TarjetaNoticia, RouterLink],
  templateUrl: './favoritos.html',
})
export class PaginaFavoritos {
  private readonly servicio = inject(Noticias);
  readonly favoritos = inject(Favoritos);

  readonly guardadas = computed<Noticia[]>(() => {
    const ids = this.favoritos.lista();
    return this.servicio.todas().filter((noticia) => ids.includes(noticia.id));
  });

  /** Texto del indicador que explica dónde vive la lista. */
  readonly aviso = computed(() => {
    if (!this.favoritos.almacenamientoDisponible()) {
      return '◆ Este navegador no permite guardar datos locales';
    }
    const total = this.guardadas().length;
    return `◆ Guardadas en localStorage · ${total} ${total === 1 ? 'noticia' : 'noticias'}`;
  });

  /** Mensaje breve que confirma la última acción sobre la lista. */
  readonly confirmacion = signal('');

  constructor() {
    this.servicio.cargar();
  }

  /**
   * Recibe el evento @Output de la tarjeta. Aquí sí hace falta: al quitar una
   * estrella la tarjeta desaparece de la rejilla, de modo que sin este aviso
   * el usuario no tendría confirmación de lo que acaba de hacer.
   */
  alGuardarCambiar(quedaGuardada: boolean): void {
    this.confirmacion.set(quedaGuardada ? '' : 'Noticia retirada de tu lista.');
  }

  vaciar(): void {
    this.confirmacion.set('');
    const total = this.guardadas().length;
    if (total === 0) return;
    if (confirm(`¿Quitar las ${total} noticias guardadas? Esta acción no se puede deshacer.`)) {
      this.favoritos.vaciar();
    }
  }
}
