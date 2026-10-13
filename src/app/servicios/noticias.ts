import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { BorradorNoticia, CATEGORIAS, ClaveCategoria, Noticia } from '../modelos/noticia';
import { Almacenamiento } from './almacenamiento';
import { Favoritos } from './favoritos';

/**
 * Servicio del catálogo de noticias.
 *
 * Reúne las dos fuentes de datos del proyecto:
 *   1. data/noticias.json  -> contenido base, de solo lectura
 *   2. localStorage        -> noticias creadas desde el panel de redacción
 *
 * El catálogo se expone como señal (signal). Cuando el panel de redacción
 * crea o elimina una noticia, la señal cambia y Angular vuelve a dibujar
 * automáticamente todas las vistas que la están leyendo, sin que ningún
 * componente tenga que avisarle a otro.
 */
@Injectable({ providedIn: 'root' })
export class Noticias {
  private readonly http = inject(HttpClient);
  private readonly almacenamiento = inject(Almacenamiento);
  private readonly favoritos = inject(Favoritos);

  private readonly CLAVE_PROPIAS = 'propias';
  private readonly RUTA_JSON = 'data/noticias.json';

  /** Catálogo completo. Privado para escritura, público solo para lectura. */
  private readonly catalogo = signal<Noticia[]>([]);
  readonly todas = this.catalogo.asReadonly();

  /** Señal derivada: se recalcula sola cuando cambia el catálogo. */
  readonly totalPropias = computed(() => this.catalogo().filter((n) => n.propia).length);

  /** Evita volver a pedir el archivo en cada navegación. */
  private cargaEnCurso: Promise<void> | null = null;

  /**
   * Carga el catálogo una sola vez por sesión.
   * HttpClient reemplaza al fetch de la entrega 2: devuelve un observable que
   * aquí se convierte en promesa para poder esperarlo con await.
   */
  cargar(): Promise<void> {
    if (!this.cargaEnCurso) {
      this.cargaEnCurso = this.descargar();
    }
    return this.cargaEnCurso;
  }

  private async descargar(): Promise<void> {
    try {
      const base = await firstValueFrom(this.http.get<Noticia[]>(this.RUTA_JSON));
      this.catalogo.set([...this.propias(), ...base]);
    } catch (error) {
      console.error('No se pudo cargar el catálogo de noticias:', error);
      this.catalogo.set(this.propias());
    }
  }

  /** Noticias creadas por el usuario, recuperadas del navegador. */
  private propias(): Noticia[] {
    return this.almacenamiento.leer<Noticia[]>(this.CLAVE_PROPIAS, []);
  }

  /** Busca una noticia por su identificador. */
  porId(id: number): Noticia | undefined {
    return this.catalogo().find((noticia) => noticia.id === id);
  }

  /**
   * Agrega una noticia creada por el usuario.
   * El identificador se calcula a partir del mayor existente para no chocar
   * con los del archivo base.
   */
  crear(borrador: BorradorNoticia): Noticia {
    const ids = this.catalogo().map((n) => n.id);
    const nueva: Noticia = {
      id: ids.length ? Math.max(...ids) + 1 : 1,
      titulo: borrador.titulo,
      categoria: borrador.categoria as ClaveCategoria,
      resumen: borrador.resumen,
      contenido: borrador.contenido,
      cita: '',
      autor: borrador.autor.trim() || 'Redacción Corriente',
      fecha: new Date().toISOString().slice(0, 10),
      lectura: Math.max(1, Math.round(borrador.contenido.split(/\s+/).length / 200)),
      destacada: false,
      principal: false,
      propia: true,
    };

    this.almacenamiento.escribir(this.CLAVE_PROPIAS, [nueva, ...this.propias()]);
    this.catalogo.update((actual) => [nueva, ...actual]);
    return nueva;
  }

  /**
   * Elimina una noticia propia. Las del archivo base no se pueden borrar
   * porque son el contenido de referencia del proyecto.
   */
  eliminar(id: number): boolean {
    const noticia = this.porId(id);
    if (!noticia?.propia) return false;

    this.almacenamiento.escribir(
      this.CLAVE_PROPIAS,
      this.propias().filter((n) => n.id !== id),
    );
    this.catalogo.update((actual) => actual.filter((n) => n.id !== id));
    this.favoritos.quitar(id); // no dejar favoritos huérfanos
    return true;
  }

  /** Nombre visible de una categoría. */
  nombreCategoria(clave: ClaveCategoria): string {
    return CATEGORIAS.find((c) => c.clave === clave)?.nombre ?? clave;
  }

  /** Clase CSS del color asignado a una categoría. */
  claseCategoria(clave: ClaveCategoria): string {
    return CATEGORIAS.find((c) => c.clave === clave)?.clase ?? 'tec';
  }
}
