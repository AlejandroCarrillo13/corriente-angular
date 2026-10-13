/**
 * Contrato de datos de una noticia.
 *
 * En la entrega 2 las noticias eran objetos de JavaScript sin tipo: un error
 * de escritura en un nombre de propiedad solo aparecía al ejecutar la página.
 * Al declarar la interfaz, TypeScript verifica en tiempo de compilación que
 * las plantillas y los servicios usen los nombres correctos.
 */
export interface Noticia {
  id: number;
  titulo: string;
  categoria: ClaveCategoria;
  resumen: string;
  contenido: string;
  cita: string;
  autor: string;
  /** Fecha en formato ISO corto: 2026-10-13 */
  fecha: string;
  /** Minutos estimados de lectura */
  lectura: number;
  destacada: boolean;
  principal: boolean;
  /** Marca las noticias creadas desde el panel de redacción */
  propia?: boolean;
}

/** Las cuatro secciones del medio. */
export type ClaveCategoria = 'tecnologia' | 'ciencia' | 'negocios' | 'cultura';

/** Metadatos de presentación de cada sección. */
export interface Categoria {
  clave: ClaveCategoria;
  nombre: string;
  /** Clase CSS que aplica el color de la sección */
  clase: string;
}

export const CATEGORIAS: Categoria[] = [
  { clave: 'tecnologia', nombre: 'Tecnología', clase: 'tec' },
  { clave: 'ciencia', nombre: 'Ciencia', clase: 'cie' },
  { clave: 'negocios', nombre: 'Negocios', clase: 'neg' },
  { clave: 'cultura', nombre: 'Cultura', clase: 'cul' },
];

/** Datos que entrega el formulario de creación del panel de redacción. */
export interface BorradorNoticia {
  titulo: string;
  categoria: ClaveCategoria | '';
  resumen: string;
  contenido: string;
  autor: string;
}
