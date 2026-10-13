import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Encabezado } from './componentes/encabezado/encabezado';
import { Pie } from './componentes/pie/pie';

/**
 * Componente raíz: la plantilla común de toda la aplicación.
 *
 * La cabecera y el pie se declaran una sola vez aquí, y <router-outlet> es el
 * hueco donde el enrutador inserta la página que corresponde a la dirección
 * actual. Por eso al navegar entre vistas el navegador no recarga la página
 * completa: solo se reemplaza el contenido de ese hueco.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado, Pie],
  template: `
    <app-encabezado />
    <main>
      <router-outlet />
    </main>
    <app-pie />
  `,
})
export class App {}
