import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Noticia } from '../../modelos/noticia';
import { Favoritos } from '../../servicios/favoritos';
import { Noticias } from '../../servicios/noticias';

/**
 * Tarjeta de noticia: el componente más reutilizado del proyecto. Aparece en
 * la página de inicio, en el listado, en favoritos y en las noticias
 * relacionadas del detalle.
 *
 * Muestra los dos sentidos del enlace de datos entre componentes:
 *   - @Input  recibe la noticia desde el componente padre  (padre -> hijo)
 *   - @Output avisa al padre que el guardado cambió        (hijo -> padre)
 */
@Component({
  selector: 'app-tarjeta-noticia',
  imports: [RouterLink, DatePipe],
  templateUrl: './tarjeta-noticia.html',
})
export class TarjetaNoticia {
  /** Noticia que se va a dibujar. La entrega el padre con [noticia]="n". */
  @Input({ required: true }) noticia!: Noticia;

  /**
   * Avisa al padre si la noticia quedó guardada (true) o se retiró (false).
   * La página de favoritos lo escucha para confirmar la acción, porque allí
   * la tarjeta desaparece de la rejilla y conviene decir qué pasó. Las demás
   * vistas no necesitan escucharlo: leen el estado de la señal del servicio.
   */
  @Output() guardadoCambiado = new EventEmitter<boolean>();

  private readonly servicioNoticias = inject(Noticias);
  readonly favoritos = inject(Favoritos);

  /** Clase CSS que pinta el color de la sección. */
  get claseCategoria(): string {
    return this.servicioNoticias.claseCategoria(this.noticia.categoria);
  }

  /** Nombre visible de la sección. */
  get nombreCategoria(): string {
    return this.servicioNoticias.nombreCategoria(this.noticia.categoria);
  }

  /** Guarda o retira la noticia y notifica el resultado al padre. */
  alternarGuardado(): void {
    const quedaGuardada = this.favoritos.alternar(this.noticia.id);
    this.guardadoCambiado.emit(quedaGuardada);
  }
}
