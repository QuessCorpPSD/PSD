import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastNoAnimation, ToastrService } from 'ngx-toastr';
import { IAuthServiceService } from '../../Repository/iauth-service.service';
import { AuthServiceService } from '../../Service/auth-service.service';
      


import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { TokenService } from '../../Shared/TokenService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BreakdetailsComponent } from './breakdetails/breakdetails.component';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';



    
const auth= InjectionToken<IAuthServiceService>;
@Component({
    selector: 'app-loginmaster',
    imports: [FormsModule, CommonModule, RouterLink,ReactiveFormsModule],
    templateUrl: './loginmaster.component.html',
    styleUrl: './loginmaster.component.css',
    encapsulation: ViewEncapsulation.None,
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
    ipAddress: string = '::1';
 computername:string='';
  validationErrors:Array<any> = [];
  Isvalid:boolean=true;
    timeLeft !:number;              // OTP expiry in seconds
  timer!: Subscription;
  isResendDisabled = false;
  otpForm!: FormGroup;
  serverOtp: string = '';
  otpExpiryTime!: number;
 errorMessage = '';
  isOtpExpired = false;
  ExpireRemarks=false;
  constructor(
    @Inject(auth)private _authService:IAuthServiceService, 
  private toastr: ToastrService,
  private router: Router,
  private _encry:EncryptionService,
  private sessionStorageService: SessionStorageService,
  private tokenservice:TokenService ,
  private http:HttpClient  ,
  private fb: FormBuilder,
  private dialog: MatDialog
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
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
     formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${this.pads(m)}:${this.pads(s)}`;
  }
validateOtp() {
  const enteredOtp = this.otpForm.get('otp')?.value?.trim();

  // Check Expiry
  if (this.isOtpExpired) {
    this.isResendDisabled=true;
    alert("OTP expired. Please resend again.")
   this.ExpireRemarks=true;
   this.timer.unsubscribe();
   this.isResendDisabled = false;
   this.timeLeft=0;
    return;
  }
  // Check correctness (convert both sides to string)
  if (enteredOtp?.toString() === this.serverOtp?.toString()) {
    this.errorMessage = '';

       if (this.getUserRole(this.userdata.role_Id)=='admin') {
          this.router.navigateByUrl('/Master/dashboard');
        } else {      
          this.router.navigateByUrl('/Master/Home');
        }
  } else {
    this.errorMessage = 'Invalid OTP. Please try again.';
    this.isResendDisabled=false;
    this.ExpireRemarks=true;
  }
}



  pads(v: number) {
    return v < 10 ? '0' + v : v;
  }
     startTimer() {
      this.timeLeft = Math.floor((this.otpExpiryTime - Date.now()) / 1000);
    this.isResendDisabled = true;
    this.timeLeft = 1*60;

    this.timer = interval(1000).subscribe(() => {
      this.timeLeft--;

     if (this.timeLeft <= 0) {
         this.timer.unsubscribe();
        this.isOtpExpired = true;
      }
    });
  }
   ngOnDestroy() {
    this.timer?.unsubscribe();
  }
  ngOnInit(): void {

    if (this.sessionStorageService.getItem('UserProfile')) {
      this.sessionStorageService.removeItem('UserProfile');
      this.sessionStorageService.clear();
      this.tokenservice.clearTokens();
    }
    if (!this.router.navigated) {
      location.reload(); // Only if you need hard reload
    }
    $.ajax({
      url: 'http://localhost:7000',
      type: 'GET',
      cache: false,
      success: (response) => {
        this.computername = response;
        console.log("Computer Name:", response);
      },
      error: (xhr, status, error) => {
        console.error('Error fetching data:', error);
      }
    });
  }
 
 getIpAddress(): void {
    this.http.get('https://api.ipify.org?format=json').subscribe({
      next: (res: any) => {
        this.ipAddress = res.ip;
      },
      error: (err) => {
        console.log('Error fetching IP:', err);
      }
    });
  }
   roleIdGroups: Record<Role, number[]> = {
  [Role.Admin]: [1,12, 14,11, 20,38, 52, 263],
  [Role.SOP]: [0],
  [Role.Manager]: [] // fallback
};
 
getUserRole(roleId: number): Role {
  for (const role in this.roleIdGroups) {
    if (this.roleIdGroups[role as Role].includes(roleId)) {
      return role as Role;
    }
  }
  return Role.Manager;
}
 userdata:any;
ResendOTP(){
 
    const login = {
    username: this.username,
    password: this.password,
    ipAddress:this.ipAddress,
    Cname:this.computername,
  };
  
  this._authService.ValidateLogin(login).subscribe({
    next: (loginStatus) => {
      const data = loginStatus.Data;
      this.userdata = loginStatus.Data;
      if (data.error_Message === "" && data.user_Id > 0) {
        this.Name = data.userName;
       // this.sessionStorageService.setItem('UserProfile', this._encry.encrypt(JSON.stringify(data)));
        this.userdata=data;
        this.Isvalid=false;
        this.timeLeft= 2*60;
        this.isResendDisabled=true;
        this.startTimer();
        if (this.getUserRole(data.role_Id)=='admin') {
          //this.router.navigateByUrl('/Master/dashboard');
        } else {
      //  const dialogRef=   this.dialog.open(BreakdetailsComponent, {
      //       width: '90%',
      //       height: '90vh', // adjust size
      //       disableClose: true, // prevent closing by clicking outside
      //       data: { example: 'Hello from parent!' } // optional data
      //     });
      //     dialogRef.afterClosed().subscribe(result => {
      //       console.log('Dialog closed with result:', result);
      //       if (result?.success) {
      //         // do something, e.g., refresh table
      //       }
      //     });
         // this.router.navigateByUrl('/Master/Home');
        }
      } else {
        this.toastr.error(data.error_Message || "Invalid credentials", "Error");
       // this.router.navigate(['/Login']);
      }
    },
    error: (err) => {
      console.error(err);
      this.toastr.error(err.message, "Error");
    }
  });
}
 validateLogin(): void {
  if (!this.username || this.username.trim() === '') {
    this.toastr.error("Please Enter Employee Code", "Error");
    return;
  }

  if (!this.password || this.password.trim() === '') {
    this.toastr.error("Please Enter Password", "Error");
    return;
  } 
   const login = {
    username: this.username,
    password: this.password,
    ipAddress:this.ipAddress,
    Cname:this.computername,
  };
  
  this._authService.ValidateLogin(login).subscribe({
    next: (loginStatus) => {
      const data = loginStatus.Data;
      //console.log(data);
      if (data.error_Message === "" && data.user_Id > 0) {
        this.Name = data.userName;
        this.sessionStorageService.setItem('UserProfile', this._encry.encrypt(JSON.stringify(data)));
        this.tokenservice.setTokens(
          this._encry.encrypt(data.token),
          this._encry.encrypt(data.refreshtoken)
        );
        // this.Isvalid=false;
        // this.timeLeft= data.expirytime;
        // this.otpExpiryTime = Date.now() + (this.timeLeft * 1000);        
        // this.serverOtp=data.otp;
        // this.isResendDisabled=true;
        // this.startTimer();
        if (this.getUserRole(data.role_Id)=='admin') {
          this.router.navigateByUrl('/Master/dashboard');
        } else {
      //  const dialogRef=   this.dialog.open(BreakdetailsComponent, {
      //       width: '90%',
      //       height: '90vh', // adjust size
      //       disableClose: true, // prevent closing by clicking outside
      //       data: { example: 'Hello from parent!' } // optional data
      //     });
      //     dialogRef.afterClosed().subscribe(result => {
      //       console.log('Dialog closed with result:', result);
      //       if (result?.success) {
      //         // do something, e.g., refresh table
      //       }
      //     });
          this.router.navigateByUrl('/Master/Home');
        }
      } else {
        this.toastr.error(data.error_Message || "Invalid credentials", "Error");
       // this.router.navigate(['/Login']);
      }
    },
    error: (err) => {
      console.error(err);
      this.toastr.error(err.message, "Error");
    }
  });
}
convertToMMSS(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${this.pad(minutes)}:${this.pad(seconds)}`;
}

pad(value: number): string {
  return value < 10 ? '0' + value : value.toString();
}

}
enum Role {
  Admin = 'admin',
  SOP = 'SOP',
  Manager = 'manager'
}
