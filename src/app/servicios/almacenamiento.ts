import { Injectable } from '@angular/core';

/**
 * Envoltura de localStorage.
 *
 * Es el mismo módulo de la entrega 2 convertido en servicio inyectable. El
 * decorador @Injectable con providedIn: 'root' registra una única instancia
 * para toda la aplicación, de modo que cualquier componente que lo pida en su
 * constructor recibe ese mismo objeto.
 */
@Injectable({ providedIn: 'root' })
export class Almacenamiento {
  /** Prefijo para no chocar con otras aplicaciones del mismo dominio. */
  private readonly prefijo = 'corriente.';

  /** Indica si el navegador permite escribir en el almacenamiento local. */
  disponible(): boolean {
    try {
      const prueba = this.prefijo + 'prueba';
      localStorage.setItem(prueba, '1');
      localStorage.removeItem(prueba);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Lee un valor y lo convierte de texto JSON al objeto original.
   * El genérico <T> conserva el tipo del valor por defecto, así que quien
   * llama no tiene que hacer conversiones manuales.
   */
  leer<T>(clave: string, porDefecto: T): T {
    try {
      const crudo = localStorage.getItem(this.prefijo + clave);
      return crudo === null ? porDefecto : (JSON.parse(crudo) as T);
    } catch (error) {
      console.warn(`No se pudo leer '${clave}' del almacenamiento:`, error);
      return porDefecto;
    }
  }

  /** Guarda un valor serializándolo como JSON. */
  escribir<T>(clave: string, valor: T): boolean {
    try {
      localStorage.setItem(this.prefijo + clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.warn(`No se pudo guardar '${clave}':`, error);
      return false;
    }
  }

  /** Elimina una clave del almacenamiento. */
  borrar(clave: string): void {
    try {
      localStorage.removeItem(this.prefijo + clave);
    } catch (error) {
      console.warn(`No se pudo borrar '${clave}':`, error);
    }
  }
}
