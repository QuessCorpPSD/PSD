import { Component, Input, OnInit,CUSTOM_ELEMENTS_SCHEMA, signal, InjectionToken, Inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';

import { AppHeaderComponent } from '../app-header/app-header.component';
import { AuthServiceService } from '../../Service/auth-service.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [CommonModule, RouterModule,AppHeaderComponent ],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css',  
  schemas:[CUSTOM_ELEMENTS_SCHEMA ]
  
})
export class MasterComponent implements  OnInit {
  username = '';
  menuCode:string='1';
  
constructor( private _sessionStoreage:SessionStorageService,  private router: Router,){

}
 isActive(route: string): boolean {    
    return this.router.url === route;
  }
  onNavigate(event: Event,menuId:any) {
    // console.log(menuId);
    //  this.menuId=menuId
    //  this.menuCode.emit(this.menuId.toString());
   }
   Logout():void{
    this._sessionStoreage.removeItem("userId");
    this._sessionStoreage.clear();
    this.router.navigateByUrl('/Login');
   }
  ngOnInit(): void {

   
   
    
  }
  receiveData(data: string) {

  //  console.log('Master data received the values : '+data)
    this.menuCode = data; // Update parent property with received data
  }
}
