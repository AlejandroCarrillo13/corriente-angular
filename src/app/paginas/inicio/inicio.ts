import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TarjetaNoticia } from '../../componentes/tarjeta-noticia/tarjeta-noticia';
import { Noticia } from '../../modelos/noticia';
import { Noticias } from '../../servicios/noticias';

/**
 * Página de inicio.
 *
 * Los tres bloques de la portada se declaran como señales derivadas
 * (computed). No hay que llamarlas ni refrescarlas: cuando el catálogo cambia
 * —por ejemplo, al publicar una noticia desde el panel de redacción— Angular
 * recalcula el valor y vuelve a dibujar solo lo que haga falta.
 */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, TarjetaNoticia, DatePipe],
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly servicio = inject(Noticias);

  readonly catalogo = this.servicio.todas;

  /** Noticia principal: la marcada en el JSON o, en su defecto, la primera. */
  readonly principal = computed<Noticia | undefined>(() => {
    const todas = this.catalogo();
    return todas.find((n) => n.principal) ?? todas[0];
  });

  /** Cuatro titulares para la columna «También hoy». */
  readonly secundarias = computed<Noticia[]>(() =>
    this.catalogo()
      .filter((n) => n.id !== this.principal()?.id)
      .slice(0, 4),
  );

  /**
   * Tres destacadas. Si el archivo trae menos de tres marcadas, se completa
   * con las más recientes para que la rejilla nunca quede incompleta.
   */
  readonly destacadas = computed<Noticia[]>(() => {
    const principal = this.principal();
    const candidatas = this.catalogo().filter((n) => n.id !== principal?.id);
    const marcadas = candidatas.filter((n) => n.destacada);
    const resto = candidatas.filter((n) => !n.destacada);
    return [...marcadas, ...resto].slice(0, 3);
  });

  constructor() {
    this.servicio.cargar();
  }

  nombreCategoria(noticia: Noticia): string {
    return this.servicio.nombreCategoria(noticia.categoria);
  }

  claseCategoria(noticia: Noticia): string {
    return this.servicio.claseCategoria(noticia.categoria);
  }
}
