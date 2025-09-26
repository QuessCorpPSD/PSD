import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { ManagerComponent } from "../../../common/manager/manager.component";
import { TeamleaderComponent } from "../../../common/teamleader/teamleader.component";
import { EmployeeComponent } from '../../../common/employee/employee.component';
import { IAssignmentService } from '../../../Repository/IAssignment.service';
import { AssignmentService } from '../../../Service/Assignment.service';

export  const COMM_TOKEN=new InjectionToken<IAssignmentService>('COMM_TOKEN');
@Component({
  selector: 'app-revok',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ManagerComponent,
    TeamleaderComponent,
    EmployeeComponent
],
  templateUrl: './revok.component.html',
  styleUrl: './revok.component.css',
    providers:[{
      
              provide: COMM_TOKEN,
              useClass: AssignmentService,
            
    }]
})
export class RevokComponent implements OnInit {
teamlederId!:any;
ManagerSelected:any;
employeeDetail:any;
RevokDetails:any;
userDetail:any;
constructor(@Inject(COMM_TOKEN) private _commonService: IAssignmentService, private _sessionStorage: SessionStorageService
, private decry:EncryptionService)
{

}

  ngOnInit(): void {
    const user = this._sessionStorage.getItem('UserProfile');
    if (user){
      this.userDetail = JSON.parse(this.decry.decrypt(user));
    }
    else {
      console.warn('User Profile not found in Session');
    }
  }
  Revok(emp){
    const request={
      "InputLot_Id":emp.inputLot_Id,
      "Company_Id":emp.company_Id,
      "Pay_Period_Id":emp.pay_Period_Id,
      "Lot_Number":emp.lot_Number,
      "userId":this.employeeDetail.user_Id,
      "CreatedBy":this.userDetail.user_Id
    }
    
    this._commonService.AssignmentRevok(request).subscribe({
      next:res=>{ 
        const data=res.Data;
        alert(data.messages);
        this._commonService.RevokDetail(this.employeeDetail.user_Id).subscribe({
        next:res=>{this.RevokDetails=res.Data},
        error:err=>{console.log(err)}
      })
       },
      error:err=>{}
    })
  }
  RevokDetail():void{

    if(!this.ManagerSelected)
    {
      alert('Select Manager');
      return;
    }
    if(!this.teamlederId)
    {
      alert('Select TeamLeader');
      return;
    }
    if(!this.employeeDetail)
    {
      alert('Select Employee');
      return;
    }
      this._commonService.RevokDetail(this.employeeDetail.user_Id).subscribe({
        next:res=>{this.RevokDetails=res.Data},
        error:err=>{console.log(err)}
      })
  }
  ManagerSelectedvalue(event)
  {
    this.ManagerSelected=event.user_Id;
  }
  TeamLeaderSelectedvalue(event)
  {
    this.teamlederId=event.user_Id;
  }
  EmployeeSelected(event){
    this.employeeDetail=event;
  }

}