import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provideToastr } from 'ngx-toastr'; // if you're using ngx-toastr
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/Shared/AuthInterceptor';
;

 // update path as needed
 if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr(),
   // provideAgGrid(), // 
    { provide: LocationStrategy, useClass: HashLocationStrategy }
    
]
}).catch(err => console.error(err));


