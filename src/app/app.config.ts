import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeEsCo from '@angular/common/locales/es-CO';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

// Registra los datos de localización de Colombia para que el pipe `date`
// escriba los meses y los días de la semana en español.
registerLocaleData(localeEsCo, 'es-CO');

/**
 * Configuración de arranque de la aplicación.
 *
 * Aquí se registran los proveedores globales: el enrutador con la tabla de
 * rutas, el cliente HTTP que usa el servicio de noticias para leer el archivo
 * JSON, y el idioma con el que se formatean fechas y números.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // Al cambiar de página el navegador vuelve arriba, como en un sitio normal.
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
};
