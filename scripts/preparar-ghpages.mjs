/**
 * Prepara el resultado de la compilación para GitHub Pages.
 *
 * Angular genera una aplicación de una sola página: todas las rutas se
 * resuelven en el navegador a partir de index.html. GitHub Pages, en cambio,
 * es un servidor de archivos estáticos: si alguien entra directamente a
 * /corriente-angular/noticias, busca una carpeta con ese nombre, no la
 * encuentra y responde con su página de error.
 *
 * La solución estándar es dejar una copia de index.html llamada 404.html.
 * GitHub Pages la devuelve ante cualquier ruta desconocida, la aplicación
 * arranca igual y el enrutador resuelve la dirección pedida.
 *
 * El archivo .nojekyll evita que GitHub procese la carpeta con Jekyll, que
 * de lo contrario ignoraría los archivos y carpetas que empiezan por guion
 * bajo.
 */
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SALIDA = join(process.cwd(), 'dist', 'corriente-angular', 'browser');
const INDICE = join(SALIDA, 'index.html');

if (!existsSync(INDICE)) {
  console.error(`No se encontró ${INDICE}. Ejecuta primero "ng build".`);
  process.exit(1);
}

copyFileSync(INDICE, join(SALIDA, '404.html'));
writeFileSync(join(SALIDA, '.nojekyll'), '');

console.log('Listo: se generaron 404.html y .nojekyll en', SALIDA);
