import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BorradorNoticia, CATEGORIAS, Noticia } from '../../modelos/noticia';
import { Noticias } from '../../servicios/noticias';
import { ErroresFormulario, ReglasFormulario, Validacion } from '../../servicios/validacion';

/**
 * Panel de redacción: gestión básica de noticias (crear y eliminar).
 *
 * El formulario usa enlace en dos vías con [(ngModel)]: el objeto `borrador`
 * y los campos de la plantilla son la misma información, de modo que no hay
 * que leer el DOM con getElementById para saber qué escribió el usuario.
 */
@Component({
  selector: 'app-redaccion',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './redaccion.html',
})
export class Redaccion {
  private readonly servicio = inject(Noticias);
  private readonly validacion = inject(Validacion);

  readonly categorias = CATEGORIAS;
  readonly catalogo = this.servicio.todas;
  readonly totalPropias = this.servicio.totalPropias;

  /** Modelo del formulario, enlazado en dos vías con la plantilla. */
  borrador: BorradorNoticia = this.borradorVacio();

  /** Mensajes de error por campo; la plantilla los muestra bajo cada uno. */
  readonly errores = signal<ErroresFormulario>({});

  /** Aviso de resultado tras crear o eliminar. */
  readonly aviso = signal<{ texto: string; tipo: 'exito' | 'info' } | null>(null);

  /** Reglas de cada campo: una prueba y el mensaje si la prueba falla. */
  private readonly reglas: ReglasFormulario = {
    titulo: [
      { prueba: this.validacion.obligatorio, mensaje: 'El titular es obligatorio.' },
      {
        prueba: this.validacion.longitudMinima(15),
        mensaje: 'El titular debe tener al menos 15 caracteres.',
      },
    ],
    categoria: [
      { prueba: this.validacion.obligatorio, mensaje: 'Selecciona una categoría.' },
    ],
    resumen: [
      { prueba: this.validacion.obligatorio, mensaje: 'La descripción breve es obligatoria.' },
      {
        prueba: this.validacion.longitudMinima(30),
        mensaje: 'La descripción debe tener al menos 30 caracteres.',
      },
    ],
    contenido: [
      { prueba: this.validacion.obligatorio, mensaje: 'El contenido es obligatorio.' },
      {
        prueba: this.validacion.longitudMinima(120),
        mensaje: 'El contenido debe tener al menos 120 caracteres.',
      },
    ],
  };

  constructor() {
    this.servicio.cargar();
  }

  private borradorVacio(): BorradorNoticia {
    return { titulo: '', categoria: '', resumen: '', contenido: '', autor: '' };
  }

  /** Valida un campo al salir de él, sin esperar al envío. */
  revisar(campo: keyof BorradorNoticia): void {
    const valor = String(this.borrador[campo] ?? '');
    const reglas = this.reglas[campo];
    if (!reglas) return;

    // Un campo vacío al salir se deja neutro: el error se muestra al enviar.
    const mensaje = valor.trim() === '' ? '' : this.validacion.revisarCampo(valor, reglas);
    this.errores.update((actuales) => ({ ...actuales, [campo]: mensaje }));
  }

  /** Crea la noticia si todos los campos son válidos. */
  publicar(): void {
    const errores = this.validacion.revisarFormulario(
      this.borrador as unknown as Record<string, string>,
      this.reglas,
    );
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) {
      this.aviso.set(null);
      return;
    }

    const nueva = this.servicio.crear(this.borrador);
    this.aviso.set({
      texto: `✔ Publicada. «${nueva.titulo}» ya aparece en el listado de noticias.`,
      tipo: 'exito',
    });
    this.limpiar();
  }

  limpiar(): void {
    this.borrador = this.borradorVacio();
    this.errores.set({});
  }

  /** Elimina una noticia propia tras confirmar. */
  eliminar(noticia: Noticia): void {
    if (!confirm(`¿Eliminar «${noticia.titulo}»? Esta acción no se puede deshacer.`)) return;
    this.servicio.eliminar(noticia.id);
    this.aviso.set({ texto: 'La noticia fue eliminada.', tipo: 'info' });
  }

  claseCategoria(noticia: Noticia): string {
    return this.servicio.claseCategoria(noticia.categoria);
  }

  nombreCategoria(noticia: Noticia): string {
    return this.servicio.nombreCategoria(noticia.categoria);
  }
}
