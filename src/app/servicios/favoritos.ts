import { Injectable, computed, inject, signal } from '@angular/core';

import { Almacenamiento } from './almacenamiento';

/**
 * Lista de noticias guardadas por el usuario.
 *
 * Se almacenan únicamente los identificadores, no los objetos completos: si
 * una noticia cambia de titular, la lista refleja el cambio en lugar de
 * conservar una copia desactualizada.
 *
 * La lista vive en una señal. Esto resuelve con una línea un problema que en
 * la entrega 2 exigía código manual: el contador de la cabecera, las estrellas
 * de las tarjetas y la página de favoritos leen la misma señal, de modo que
 * al guardar una noticia en cualquier vista los tres se actualizan solos.
 */
@Injectable({ providedIn: 'root' })
export class Favoritos {
  private readonly almacenamiento = inject(Almacenamiento);
  private readonly CLAVE = 'favoritos';

  private readonly ids = signal<number[]>(this.leerIniciales());

  /** Identificadores guardados, en solo lectura para los componentes. */
  readonly lista = this.ids.asReadonly();

  /** Señal derivada que alimenta el contador de la cabecera. */
  readonly total = computed(() => this.ids().length);

  private leerIniciales(): number[] {
    const guardados = this.almacenamiento.leer<number[]>(this.CLAVE, []);
    return Array.isArray(guardados) ? guardados.map(Number) : [];
  }

  /** Escribe en el navegador y actualiza la señal en un solo paso. */
  private guardar(nuevos: number[]): void {
    this.ids.set(nuevos);
    this.almacenamiento.escribir(this.CLAVE, nuevos);
  }

  /** Indica si una noticia ya está guardada. */
  esta(id: number): boolean {
    return this.ids().includes(id);
  }

  /** Agrega un identificador si no estaba. */
  agregar(id: number): void {
    if (!this.esta(id)) this.guardar([...this.ids(), id]);
  }

  /** Retira un identificador de la lista. */
  quitar(id: number): void {
    this.guardar(this.ids().filter((guardado) => guardado !== id));
  }

  /**
   * Interruptor: guarda si no estaba y retira si ya estaba.
   * @returns el estado resultante (true = quedó guardada)
   */
  alternar(id: number): boolean {
    if (this.esta(id)) {
      this.quitar(id);
      return false;
    }
    this.agregar(id);
    return true;
  }

  /** Vacía por completo la lista. */
  vaciar(): void {
    this.guardar([]);
  }

  /** Indica si el navegador permite guardar datos locales. */
  almacenamientoDisponible(): boolean {
    return this.almacenamiento.disponible();
  }
}
