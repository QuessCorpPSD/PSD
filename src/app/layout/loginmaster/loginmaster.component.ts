import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastNoAnimation, ToastrService } from 'ngx-toastr';
import { IAuthServiceService } from '../../Repository/iauth-service.service';
import { AuthServiceService } from '../../Service/auth-service.service';
      

import { NgOptimizedImage } from '@angular/common'
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';



    
const auth= InjectionToken<IAuthServiceService>;
@Component({
  selector: 'app-loginmaster',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './loginmaster.component.html',
  styleUrl: './loginmaster.component.css',
  encapsulation: ViewEncapsulation.None ,
  providers: [
      {
        provide: auth,
        useClass: AuthServiceService,
      }
    ]
})
export class LoginmasterComponent {
username:string = ''
  password:string = '' 
  isPasswordVisible = false; 
  isSubmitting:boolean = false;
  Name:string='';
  userDeviceData!:string;
    
  validationErrors:Array<any> = [];
  
   
  constructor(
    @Inject(auth)private _authService:IAuthServiceService, 
  private toastr: ToastrService,
  private router: Router,
  private _encry:EncryptionService,
  private sessionStorageService: SessionStorageService,
      
  @Inject(DOCUMENT) private document: Document
  ) {
   
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
  
    }
    togglePassword() {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
   
  ngOnInit(): void {
   
    //console.log(this.deviceInfo);
  }



 

  validateLogin(): void {

    if(this.username=='' || this.username == undefined)
    {
      this.toastr.error("Please Enter Employee Code","Error")
      return ;
    }    

    if(this.password=='' || this.password == undefined)
      {
        this.toastr.error("Please Enter Password","Error")
        return ;
      }


    var login = {
      "username": this.username,
      "password": this.password
    };

          this._authService.ValidateLogin(login).subscribe((loginStatus)=>{ 
            if(loginStatus.Data.error_Message =="" && loginStatus.Data.user_Id>0 )
            {            
             // console.log(loginStatus.Data)
              
             // localStorage.setItem('userId',loginStatus.Data.user_Id);
             this.sessionStorageService.setItem('userId', loginStatus.Data.user_Id);
            this.sessionStorageService.setItem('employeeID', loginStatus.Data.employeeID);
              this.Name=loginStatus.Data.userName;   
              var userProfile={
                "UserName" : loginStatus.Data.userName,
                "EmployeeCode" : loginStatus.Data.employeeId,
                "userId":loginStatus.Data.user_Id
              }
              this.sessionStorageService.setItem('UserProfile',this._encry.encrypt(JSON.stringify(loginStatus.Data)));
             // sessionStorage.setItem('employeeCode',loginStatus.Data.emp);           
              this._authService.setUsername(this.Name);
              this.router.navigateByUrl('/Master/Home');
            }
            else{
              this.toastr.error(loginStatus.Data.error_Message, "Error");
              this.router.navigate(['/Login']);
            }
          },error=>{
            this.toastr.error("Please check Interner", "Error");
          })
    
      // this._Auth.authenticate(login).subscribe((response)=>
      // {
      //   console.log(response);
      //   if (response.StatusCode == 200) {
      //     let data = response.Data;
      //     console.log("data");
      //     console.log(data);
      //     if (data.error_Message == "") {
      //       this.router.navigate(['/Home']);
      //     }
      //     else {
      //       this.router.navigate(['/Login']);
      //       this.toastr.error(data.error_Message, "Error");
      //     }
      //   }
      //   else {
      //     this.router.navigate(['/Login']);
      //     this.toastr.error("User Name and Password are mismatched !!!", "Error");
      //   }
      // });
  }
}

