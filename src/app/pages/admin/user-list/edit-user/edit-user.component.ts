import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, InjectionToken, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ICommonService } from '../../../../Repository/ICommonService';
import { CommonService } from '../../../../Service/CommonService';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


const common= InjectionToken<ICommonService>;
@Component({
    selector: 'app-edit-user',
    imports: [MatFormFieldModule, MatSelectModule, CommonModule, MatInputModule, ReactiveFormsModule, FormsModule],
    templateUrl: './edit-user.component.html',
    styleUrl: './edit-user.component.css',
    providers: [
        {
            provide: common,
            useClass: CommonService,
        }
    ]
})
export class EditUserComponent {
AddUser!:FormGroup;
  ProcessCategory:any;
  roles:any;
  reporting:any;
  teamLead:any;
  Managers:any;
  fun_head:any;
  accessType:any;
  ispasswordmatch:boolean=false;
  constructor(private fb:FormBuilder,
 @Inject(common)private _commonService:ICommonService,
 private sessionStorageService: SessionStorageService,
 private _encry:EncryptionService,
 public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
 ){
    
  }


  onTeamSelectChange()
  {
   
   const selected = this.AddUser.get('TeamLeadUserId')?.value;
   
    this._commonService.GetUserById(selected).subscribe({
      next:res=>{
        if(res.StatusCode==200)
        {
          const email = res.Data.mail_Id;
          this.AddUser.patchValue({
            TeamLeadEmailId: email
          })
        }
      }
    })
   
  }
  onFunHeadSelectChange()
  {
    
   const selected = this.AddUser.get('Fun_Manager_User_Id')?.value;
   
    this._commonService.GetUserById(selected).subscribe({
      next:res=>{
        if(res.StatusCode==200)
        {
          const email = res.Data.mail_Id;
          this.AddUser.patchValue({
            Fun_Manager_Email_Id: email
          })
        }
      }
    })
   
  }
   onManagerSelectChange()
  {   
   const selected = this.AddUser.get('Manager_User_Id')?.value;  
    this._commonService.GetUserById(selected).subscribe({
      next:res=>{
        if(res.StatusCode==200)
        {
          const email = res.Data.mail_Id;
          this.AddUser.patchValue({
            Manager_Email_Id: email
          })
        }
      }
    })
   
  }
  allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
ngOnInit(): void {
  this.BindProcessCategory();
  this.GetRoles();
  this.GetReporting();
  this.GetAccessType();
  //this.GetTeamLeader();
  //this.GetManager();
  this.GetFunHead();
    this._commonService.GetAllTeamLeader(this.data.teamLead_User_Id).subscribe({
      next:res=>{
        if(res.StatusCode==200)
        {
          this.teamLead = res.Data
        
        }
      }
    });
    this._commonService.GetManagerByUserId(this.data.manager_User_Id).subscribe({
      next: res => { this.Managers = res.Data ;},
      error: err => { console.log(err) }
    })
  const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!)); 
    console.log(this.data);
    this.AddUser=this.fb.group({
      "Name":new FormControl(this.data.name,Validators.required),     
      "Mail_Id":new FormControl(this.data.mail_Id,Validators.required),
      "Access_Type_Id":new FormControl(this.data.access_Type_Id,Validators.required),
      "IsActive":new FormControl(this.data.isActive,Validators.required),
      "Role_Id":new FormControl(this.data.role_Id,Validators.required),
      "EmployeeID":new FormControl(this.data.employeeID,[Validators.required,Validators.pattern(/^[0-9]+$/)]),
      "TeamLeadUserId":new FormControl(this.data.teamLead_User_Id,Validators.required),
      "TeamLeadEmailId":new FormControl(this.data.teamLead_Email_Id,Validators.required),
      "Manager_User_Id":new FormControl(this.data.manager_User_Id,Validators.required),
      "Manager_Email_Id":new FormControl(this.data.manager_Email_Id,Validators.required),
      "Fun_Manager_User_Id":new FormControl(this.data.fun_Head_UserId,Validators.required),
      "Fun_Manager_Email_Id":new FormControl(this.data.fun_Head_EmailId,Validators.required),
      "Process_Category":new FormControl(this.data.process_Category,Validators.required),
      "Reporting_To":new FormControl(this.data.reporting_To,Validators.required       
      ),
      "CreatedBy":new FormControl(user.user_Id)
    })

 
}
  BindProcessCategory() {
    this._commonService.GetProcessCategory().subscribe({
      next: res => { this.ProcessCategory = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetRoles() {
    this._commonService.GetRoles().subscribe({
      next: res => { this.roles = res.Data },
      error: err => { console.log(err) }
    })
  }
  GetAccessType() {
    this._commonService.GetAccessType().subscribe({
      next: res => { this.accessType = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetTeamLeader() {
    this._commonService.GetTeamLeader().subscribe({
      next: res => { this.teamLead = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetManager() {
    this._commonService.GetMangers().subscribe({
      next: res => { this.Managers = res.Data ;console.log(this.Managers)},
      error: err => { console.log(err) }
    })
  }
    GetFunHead() {
    this._commonService.GetFun_Head().subscribe({
      next: res => { this.fun_head = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetReporting() {
    this._commonService.GetReporting().subscribe({
      next: res => { this.reporting = res.Data },
      error: err => { console.log(err) }
    })
  }
  onInputBlurChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this._commonService.GetUserByEmployeeId(value).subscribe({
      next: res => { //this.reporting = res.Data
        if(res.Data.length>0)
        {
          alert("Employee ID Already  exists");
          this.AddUser.patchValue({
            EmployeeID:null
          })
        }
       },
      error: err => { console.log(err) }
    })
}
onSubmit() {
  if (this.AddUser.invalid) {
    this.AddUser.markAllAsTouched(); // show all errors
    return;
  }

const password=this.AddUser.get('ConPassword')?.value;
const Conpassword=this.AddUser.get('ConPassword')?.value;

if(password != Conpassword)
{
  alert("Password and Confirm Password are not equal");
  return;
}
  

  this._commonService.UserCreate(this.AddUser.value).subscribe({
    next:res=>{ if(res.StatusCode==200)
    {
      alert(res.Data.error_Message);
      this.AddUser.reset();
    }
    },
    error:err=>{console.log(err)}
  })
}


}
