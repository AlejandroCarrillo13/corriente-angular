import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Filtros, Orden } from '../../componentes/filtros/filtros';
import { TarjetaNoticia } from '../../componentes/tarjeta-noticia/tarjeta-noticia';
import { Noticia } from '../../modelos/noticia';
import { Noticias } from '../../servicios/noticias';

/**
 * Listado completo de noticias con filtro, búsqueda, ordenamiento y paginación.
 *
 * El estado de la vista vive en cinco señales. La cadena de cálculo es
 * declarativa: `resultado` depende del catálogo y de los criterios, y
 * `visibles` depende de `resultado` y de la página. Cambiar un criterio
 * actualiza la pantalla sin que haya que llamar a ninguna función de dibujo,
 * que era lo que hacía el método `dibujar()` de la entrega 2.
 */
@Component({
  selector: 'app-listado',
  imports: [Filtros, TarjetaNoticia, RouterLink],
  templateUrl: './listado.html',
})
export class Listado {
  private readonly servicio = inject(Noticias);
  private readonly ruta = inject(ActivatedRoute);

  readonly categoria = signal('todas');
  readonly termino = signal('');
  readonly orden = signal<Orden>('recientes');
  readonly pagina = signal(1);
  readonly porPagina = 8;

  /** Noticias que cumplen los criterios actuales, ya ordenadas. */
  readonly resultado = computed<Noticia[]>(() => {
    const texto = this.termino().toLowerCase().trim();
    const categoria = this.categoria();

    const filtradas = this.servicio.todas().filter((noticia) => {
      const coincideCategoria = categoria === 'todas' || noticia.categoria === categoria;
      const coincideTexto =
        !texto ||
        noticia.titulo.toLowerCase().includes(texto) ||
        noticia.resumen.toLowerCase().includes(texto);
      return coincideCategoria && coincideTexto;
    });

    // Se ordena sobre una copia para no alterar el catálogo del servicio.
    return [...filtradas].sort((a, b) => {
      if (this.orden() === 'antiguas') return a.fecha.localeCompare(b.fecha);
      if (this.orden() === 'titulo') return a.titulo.localeCompare(b.titulo, 'es');
      return b.fecha.localeCompare(a.fecha);
    });
  });

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.resultado().length / this.porPagina)),
  );

  /** Páginas disponibles, para dibujar los botones de paginación. */
  readonly paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1),
  );

  /** Subconjunto que se muestra en la página actual. */
  readonly visibles = computed<Noticia[]>(() => {
    const actual = Math.min(this.pagina(), this.totalPaginas());
    const desde = (actual - 1) * this.porPagina;
    return this.resultado().slice(desde, desde + this.porPagina);
  });

  constructor() {
    this.servicio.cargar();

    // La vista acepta parámetros en la dirección para llegar ya filtrada
    // desde el pie de página (?categoria=ciencia) o desde el buscador (?q=café).
    this.ruta.queryParamMap.subscribe((parametros) => {
      this.categoria.set(parametros.get('categoria') ?? 'todas');
      this.termino.set(parametros.get('q') ?? '');
      this.pagina.set(1);
    });
  }

  cambiarCategoria(clave: string): void {
    this.categoria.set(clave);
    this.pagina.set(1);
  }

  cambiarTermino(texto: string): void {
    this.termino.set(texto);
    this.pagina.set(1);
  }

  cambiarOrden(criterio: Orden): void {
    this.orden.set(criterio);
  }

  irAPagina(numero: number): void {
    if (numero < 1 || numero > this.totalPaginas()) return;
    this.pagina.set(numero);
    window.scrollTo({ top: 240, behavior: 'smooth' });
  }

  /** Devuelve la vista a su estado inicial. */
  limpiarFiltros(): void {
    this.categoria.set('todas');
    this.termino.set('');
    this.pagina.set(1);
  }
}
