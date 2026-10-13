import { Injectable } from '@angular/core';

/** Una regla es una prueba más el mensaje que se muestra si la prueba falla. */
export interface Regla {
  prueba: (valor: string) => boolean;
  mensaje: string;
}

/** Mapa de campo -> lista de reglas que debe cumplir. */
export type ReglasFormulario = Record<string, Regla[]>;

/** Mapa de campo -> mensaje de error, vacío si el campo es válido. */
export type ErroresFormulario = Record<string, string>;

/**
 * Reglas de validación compartidas por el formulario de contacto y el de
 * creación de noticias.
 *
 * Es el mismo módulo de la entrega 2, con una diferencia importante: allí la
 * validación manipulaba el DOM directamente (agregaba clases, insertaba el
 * mensaje de error bajo el campo). Aquí solo calcula qué campos fallan y
 * devuelve un objeto de errores; la plantilla decide cómo mostrarlo mediante
 * enlace de propiedades. La lógica queda separada de la presentación y se
 * puede probar sin abrir un navegador.
 */
@Injectable({ providedIn: 'root' })
export class Validacion {
  /** Texto + arroba + dominio + punto + extensión de dos o más letras. */
  private readonly PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  /** El campo tiene contenido distinto de espacios en blanco. */
  obligatorio = (valor: string): boolean => valor.trim().length > 0;

  /** El valor cumple el formato de un correo electrónico. */
  correo = (valor: string): boolean => this.PATRON_CORREO.test(valor.trim());

  /** El texto alcanza la longitud mínima exigida. */
  longitudMinima = (minimo: number) => (valor: string): boolean => valor.trim().length >= minimo;

  /** Teléfono opcional: si viene, debe tener entre 7 y 15 dígitos. */
  telefonoOpcional = (valor: string): boolean => {
    const limpio = valor.replace(/[\s()+-]/g, '');
    return limpio === '' || /^\d{7,15}$/.test(limpio);
  };

  /**
   * Valida un solo campo.
   * @returns el mensaje de la primera regla incumplida, o cadena vacía
   */
  revisarCampo(valor: string, reglas: Regla[]): string {
    for (const regla of reglas) {
      if (!regla.prueba(valor)) return regla.mensaje;
    }
    return '';
  }

  /**
   * Valida un formulario completo.
   * @param valores mapa de campo -> valor escrito por el usuario
   * @param reglas  mapa de campo -> reglas que debe cumplir
   * @returns mapa de campo -> mensaje; solo contiene los campos con error
   */
  revisarFormulario(valores: Record<string, string>, reglas: ReglasFormulario): ErroresFormulario {
    const errores: ErroresFormulario = {};
    for (const campo of Object.keys(reglas)) {
      const mensaje = this.revisarCampo(valores[campo] ?? '', reglas[campo]);
      if (mensaje) errores[campo] = mensaje;
    }
    return errores;
  }
}
