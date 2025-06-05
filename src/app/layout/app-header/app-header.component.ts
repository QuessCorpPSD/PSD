import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthServiceService } from '../../Service/auth-service.service';
import {OverlayModule} from '@angular/cdk/overlay';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../Shared/encryption.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [OverlayModule,MatTooltipModule ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppHeaderComponent implements OnInit {
  username!:string;
  employeeId:any;
  name!:string;
  isOpen = false;
constructor(
  private _authService:AuthServiceService,
 private sessionStorageService: SessionStorageService,
private _encry:EncryptionService,){

}
show(){
  this.isOpen=true;
}

ngOnInit(): void {
  const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!)); 
this.name=user.userName;
  this.username="Name : "+ user.userName +" - "+user.employeeID;


 
}
}
