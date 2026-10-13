import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TarjetaNoticia } from '../../componentes/tarjeta-noticia/tarjeta-noticia';
import { Noticia } from '../../modelos/noticia';
import { Favoritos } from '../../servicios/favoritos';
import { Noticias } from '../../servicios/noticias';

/**
 * Vista de una noticia completa.
 *
 * El identificador llega como parámetro de la ruta (/noticia/:id). En la
 * entrega 2 se leía de la barra de direcciones con URLSearchParams; aquí lo
 * entrega el enrutador a través de ActivatedRoute, que además avisa cuando el
 * parámetro cambia sin recargar la página —por ejemplo, al abrir una noticia
 * relacionada desde esta misma vista.
 */
@Component({
  selector: 'app-detalle',
  imports: [RouterLink, TarjetaNoticia, DatePipe],
  templateUrl: './detalle.html',
})
export class Detalle {
  private readonly servicio = inject(Noticias);
  private readonly ruta = inject(ActivatedRoute);
  readonly favoritos = inject(Favoritos);

  private readonly id = signal(0);
  /** true mientras el catálogo todavía no ha llegado. */
  readonly cargando = signal(true);

  readonly noticia = computed<Noticia | undefined>(() => this.servicio.porId(this.id()));

  /** Párrafos del cuerpo: el JSON separa cada uno con una línea en blanco. */
  readonly parrafos = computed<string[]>(() =>
    (this.noticia()?.contenido ?? '').split('\n\n').filter((texto) => texto.trim().length > 0),
  );

  /**
   * Tres noticias de la misma sección. Si la sección tiene pocas, se completa
   * con las demás del catálogo.
   */
  readonly relacionadas = computed<Noticia[]>(() => {
    const actual = this.noticia();
    if (!actual) return [];
    const otras = this.servicio.todas().filter((n) => n.id !== actual.id);
    const mismaSeccion = otras.filter((n) => n.categoria === actual.categoria);
    const resto = otras.filter((n) => n.categoria !== actual.categoria);
    return [...mismaSeccion, ...resto].slice(0, 3);
  });

  /** Iniciales del autor para el círculo de la firma. */
  readonly iniciales = computed(() =>
    (this.noticia()?.autor ?? '')
      .split(' ')
      .map((parte) => parte[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );

  constructor() {
    this.servicio.cargar().then(() => {
      this.cargando.set(false);
      this.actualizarTitulo();
    });

    this.ruta.paramMap.subscribe((parametros) => {
      this.id.set(Number(parametros.get('id')));
      this.actualizarTitulo();
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  /** El titular pasa al título del documento, útil para marcadores e historial. */
  private actualizarTitulo(): void {
    const actual = this.noticia();
    document.title = actual ? `${actual.titulo} · Corriente` : 'Corriente';
  }

  claseCategoria(noticia: Noticia): string {
    return this.servicio.claseCategoria(noticia.categoria);
  }

  nombreCategoria(noticia: Noticia): string {
    return this.servicio.nombreCategoria(noticia.categoria);
  }

  alternarGuardado(id: number): void {
    this.favoritos.alternar(id);
  }
}
