import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { ModelComponent } from '../../model/model.component';
export  const Admin_TOKEN=new InjectionToken<ICommonService>('Admin_TOKEN');
@Component({
  selector: 'app-break-add',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ModelComponent],
  templateUrl: './break-add.component.html',
  styleUrl: './break-add.component.css',
  providers:[{
                provide: Admin_TOKEN,
                useClass: CommonService,
              }]
})
export class BreakAddComponent implements OnInit {
 isModalOpen = false;
@Input() isOpen: boolean = false;
showPopup=false;
popupMessage:string='';
timeInvalid:boolean=false;
popupSubMessage:string='';
  @Input() title: string = 'Modal';
  @Output() close = new EventEmitter<void>();
  breakForm!:FormGroup;
 popupType:string='';
  submitted = false;
 
  descriptionOptions=[{"value":'ALL',"label":"ALL"},{"value":'P1',"label":"P1"},{"value":'P2',"label":"P2"},{"value":'P3',"label":"P3"},{"value":'P4',"label":"P4"}]
 constructor(private fb: FormBuilder,  private router:Router,
     private decry:EncryptionService,
     @Inject(Admin_TOKEN) private _adminService: ICommonService,
     private _sessionStoreage:SessionStorageService ) {
  this.breakForm = this.fb.group(
  {
    BreakId: this.fb.control(0),
    ProcessCategory: this.fb.control('', { validators: [Validators.required] }),
    Description: this.fb.control('', { validators: [Validators.required, Validators.maxLength(450)] }),
    StartTime: this.fb.control('', { validators: [Validators.required] }),
    EndTime: this.fb.control('', { validators: [Validators.required] }),
    IsActive: this.fb.control(true, { validators: [Validators.required] }),
  },
  { validators: this.timeRangeValidator } // ✅ still valid here
);
  }
timeRangeValidator(group: FormGroup) {
  const start = group.get('StartTime')?.value;
  const end = group.get('EndTime')?.value;

  if (start && end && start >= end) {
    return { timeInvalid: true } as ValidationErrors;  // 👈 strongly typed
  }
  return null;
}
  type:any;
onSubmit():void{
   const userdetail = this._sessionStoreage.getItem('UserProfile') || "";
  const user = JSON.parse(this.decry.decrypt(userdetail)); 
   this.submitted = true;
    if (this.breakForm.valid) {
      const request={
    "BreakId" :this.breakForm.get("BreakId")?.value ,
    "ProcessCategory":this.breakForm.get("ProcessCategory")?.value,
    "Description":this.breakForm.get("Description")?.value,
    "StartTime":this.breakForm.get("StartTime")?.value, 
    "EndTime":this.breakForm.get("EndTime")?.value,   
    "IsActive":this.breakForm.get("IsActive")?.value,
    "CreatedDate":new Date(),
    "CreatedBy":user.user_Id
  }
  //console.log(request);
  this._adminService.AddBreakDetail(request).subscribe({
    next: res => {
      this.popupMessage = "Add and update Break detail";
      this.popupSubMessage = res.Data.message;
      if(res.Data.statusCode!=200)
      {
        this.popupType="error";
        this.type="error"
      }
      else{
        
        this.popupType="success";
        this.type="success"
      }
      res.Data; 
      //this.close.emit();
      this.showPopup = true;
    },
    error:err=>{
      this.popupType="error";
      if (err.status === 400) {
      this.popupMessage = "Bad request: Please check input.";
    } else if (err.status === 401) {
      this.popupMessage = "Unauthorized: Please log in again.";
    } else if (err.status === 404) {
      this.popupMessage = "Not found: Resource missing.";
    } else if (err.status === 500) {
      this.popupMessage = "Server error: Please try later.";
    }
    }
  })
    } else {
      this.breakForm.markAllAsTouched();
    }
}
 HandleClose(event){
event.close();
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    if (!userdetail) {
      this._sessionStoreage.removeItem('UserProfile');
      this._sessionStoreage.clear();

      this.router.navigateByUrl('/Login')
    }

  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
