import { Component } from '@angular/core';

import { IndexComponent } from './account/index/index.component';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IndexComponent,RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SPD Web UI';
  constructor(private router: Router) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.log('Navigated to:', event.url);
    //   }
    // });
}
}