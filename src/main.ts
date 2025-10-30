import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provideToastr } from 'ngx-toastr'; // if you're using ngx-toastr
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/Shared/AuthInterceptor';

import { enableProdMode, importProvidersFrom } from '@angular/core';


import { themeQuartz } from 'ag-grid-community';

 // update path as needed
 if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}
if ((window as any).ENABLE_PROD_MODE) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes,withHashLocation()),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr(),
    //  provideGlobalGridOptions({
    //   theme: themeQuartz.withParams({
    //     // customize new theme system
    //     headerBackgroundColor: '#f5f5f5',
    //     headerTextColor: '#333',
    //     inputBorder: '1px solid #ccc',
    //     inputBorderRadius: 6,
    //   }),
    //   defaultColDef: {
    //     sortable: true,
    //     resizable: true,
    //     floatingFilter: true,
    //     filter: 'agTextColumnFilter'
    //   }
    // }),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
    
]
}).catch(err => console.error(err));


