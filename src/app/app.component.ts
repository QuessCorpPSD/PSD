import { Component } from '@angular/core';


import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SPD Web UI';
  constructor() {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.log('Navigated to:', event.url);
    //   }
    // });
}
}