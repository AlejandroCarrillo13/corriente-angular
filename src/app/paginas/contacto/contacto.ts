import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Almacenamiento } from '../../servicios/almacenamiento';
import { ErroresFormulario, ReglasFormulario, Validacion } from '../../servicios/validacion';

/** Datos del formulario de contacto. */
interface MensajeContacto {
  nombre: string;
  correo: string;
  telefono: string;
  motivo: string;
  mensaje: string;
}

/**
 * Página de contacto con validaciones y mensaje de confirmación.
 *
 * La diferencia de fondo con la entrega 2 está en quién toca la pantalla: allí
 * el código de validación agregaba clases y creaba elementos en el DOM; aquí
 * solo actualiza la señal `errores` y la plantilla decide qué mostrar.
 */
@Component({
  selector: 'app-contacto',
  imports: [FormsModule, RouterLink],
  templateUrl: './contacto.html',
})
export class Contacto {
  private readonly validacion = inject(Validacion);
  private readonly almacenamiento = inject(Almacenamiento);

  readonly LIMITE_MENSAJE = 600;

  /** Modelo enlazado en dos vías con los campos de la plantilla. */
  datos: MensajeContacto = this.vacio();

  readonly errores = signal<ErroresFormulario>({});
  readonly enviado = signal(false);
  readonly nombreEnviado = signal('');

  private readonly reglas: ReglasFormulario = {
    nombre: [
      { prueba: this.validacion.obligatorio, mensaje: 'Escribe tu nombre completo.' },
      {
        prueba: this.validacion.longitudMinima(5),
        mensaje: 'El nombre debe tener al menos 5 caracteres.',
      },
    ],
    correo: [
      { prueba: this.validacion.obligatorio, mensaje: 'El correo es obligatorio.' },
      {
        prueba: this.validacion.correo,
        mensaje: 'Escribe un correo válido, por ejemplo nombre@dominio.com',
      },
    ],
    telefono: [
      {
        prueba: this.validacion.telefonoOpcional,
        mensaje: 'El teléfono debe tener entre 7 y 15 dígitos.',
      },
    ],
    motivo: [{ prueba: this.validacion.obligatorio, mensaje: 'Selecciona un motivo.' }],
    mensaje: [
      { prueba: this.validacion.obligatorio, mensaje: 'Cuéntanos qué necesitas.' },
      {
        prueba: this.validacion.longitudMinima(20),
        mensaje: 'El mensaje debe tener al menos 20 caracteres.',
      },
    ],
  };

  private vacio(): MensajeContacto {
    return { nombre: '', correo: '', telefono: '', motivo: '', mensaje: '' };
  }

  /** Valida un campo al salir de él. */
  revisar(campo: keyof MensajeContacto): void {
    const valor = this.datos[campo] ?? '';
    const reglas = this.reglas[campo];
    if (!reglas) return;
    const mensaje = valor.trim() === '' ? '' : this.validacion.revisarCampo(valor, reglas);
    this.errores.update((actuales) => ({ ...actuales, [campo]: mensaje }));
  }

  /** Indica si un campo quedó válido, para pintar el borde verde. */
  valido(campo: keyof MensajeContacto): boolean {
    return (this.datos[campo] ?? '').trim() !== '' && !this.errores()[campo];
  }

  enviar(): void {
    this.enviado.set(false);

    const errores = this.validacion.revisarFormulario(
      this.datos as unknown as Record<string, string>,
      this.reglas,
    );
    if (this.datos.mensaje.length > this.LIMITE_MENSAJE) {
      errores['mensaje'] = `El mensaje supera los ${this.LIMITE_MENSAJE} caracteres.`;
    }
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    // No hay servidor en este proyecto: el mensaje se registra en el navegador.
    this.guardarMensaje();

    this.nombreEnviado.set(this.datos.nombre.trim().split(' ')[0]);
    this.enviado.set(true);
    this.borrar();
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  borrar(): void {
    this.datos = this.vacio();
    this.errores.set({});
  }

  /** Conserva los 20 mensajes más recientes. */
  private guardarMensaje(): void {
    const historial = this.almacenamiento.leer<MensajeContacto[]>('mensajes', []);
    this.almacenamiento.escribir('mensajes', [{ ...this.datos }, ...historial].slice(0, 20));
  }
}
