import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
popupSubMessage:string='';
  @Input() title: string = 'Modal';
  @Output() close = new EventEmitter<void>();
  breakForm!:FormGroup;
  @Output() updated = new EventEmitter<void>();
  submitted = false;
  descriptionOptions=[{"value":'ALL',"label":"ALL"},{"value":'P1',"label":"P1"},{"value":'P2',"label":"P2"},{"value":'P3',"label":"P3"},{"value":'P4',"label":"P4"}]
 constructor(private fb: FormBuilder,  private router:Router,
     private decry:EncryptionService,
     @Inject(Admin_TOKEN) private _adminService: ICommonService,
     private _sessionStoreage:SessionStorageService ) {
    this.breakForm = this.fb.group({
      BreakId: [0],
      ProcessCategory:['',[Validators.required]],
      Description: ['', [Validators.required, Validators.maxLength(450)]],
      TotalMinutes: ['', Validators.required],     
      IsActive: [false]
    });
  }
  
onSubmit():void{
   this.submitted = true;
    if (this.breakForm.valid) {
      console.log('Form submitted:', this.breakForm.value);
    } else {
      this.breakForm.markAllAsTouched();
    }
  const userdetail = this._sessionStoreage.getItem('UserProfile') || "";
  const user = JSON.parse(this.decry.decrypt(userdetail));  



  
  const request={
    "BreakId" :this.breakForm.get("BreakId")?.value ,
    "Description":this.breakForm.get("Description")?.value,
    "TotalMinutes":this.breakForm.get("TotalMinutes")?.value,   
    "IsActive":this.breakForm.get("IsActive")?.value,
    "CreatedDate":new Date(),
    "CreatedBy":user.user_Id
  }
  console.log(request);
  this._adminService.AddBreakDetail(request).subscribe({
    next: res => {
      this.popupMessage = "Add and update Break detail";
      this.popupSubMessage = res.Data.message;
      res.Data; this.updated.emit();
      this.showPopup = true;
    },
    error:err=>{}
  })

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
