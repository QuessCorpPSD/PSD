import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit, Optional } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
export  const Admin_TOKEN=new InjectionToken<ICommonService>('Admin_TOKEN');
@Component({
    selector: 'app-break',
    imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, MatTableModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
    templateUrl: './break.component.html',
    styleUrl: './break.component.css',
    providers: [{
            provide: Admin_TOKEN,
            useClass: CommonService,
        }]
})

export class BreakComponent implements OnInit {

  dataSource:any=[];
  displayedColumns: string[] = ['description',  'startTime','endTime','remarks','actions'];
  editIndex: number | null = null;
  editableRow: any = {};
  globalbreak:any;
  constructor(@Inject(Admin_TOKEN) private _adminService: ICommonService,
private router:Router,
    private decry:EncryptionService,  
  @Optional()   public dialogRef: MatDialogRef<BreakComponent>,
   @Optional() @Inject(MAT_DIALOG_DATA) public data: any  ,
    private _sessionStoreage:SessionStorageService ){}
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    
    
  if (!userdetail){ 
     this._sessionStoreage.removeItem('UserProfile');
  this._sessionStoreage.clear();
  
  //this.router.navigateByUrl('/Login');
  }
  else {
    const user = JSON.parse(this.decry.decrypt(userdetail));
    const today_Date = new Date();
    this.getBreakDetailByEmployee(user.user_Id, today_Date)
    
  }
    
    //this._adminService.
  }
  autoSelectRows() {
  this.dataSource = this.dataSource.map((row, i) => ({
    ...row,
    description: this.globalbreak[i]?.breakId ?? ''
  }));
}
  editRow(index: number) {
    this.editIndex = index;
    this.editableRow = { ...this.dataSource[index] };
  }
Onsubmit():void{
  const data=this.dataSource.data;
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    if(userdetail)
    {
      const user = JSON.parse(this.decry.decrypt(userdetail));
      const request = {
        "employeeBreakRequest": data,
        "UserId": user.user_Id
      }
      this._adminService.AddBulkEmployeeBreak(request).subscribe({
        next: res => {
          this.closeDialog()
          //console.log(JSON.stringify(request));
        },
        error: err => console.log(err.message)
      })


    }
}
  saveRow(element) {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    if(userdetail)
    {const user = JSON.parse(this.decry.decrypt(userdetail)); 
const today_Date=new Date(); 
    const request={
      "userId":user.user_Id,
      "userBreakId":element.userBreakId,
      "BreakId":element.breakId,
      "StartTime":element.startTime,
      "EndTime":element.endTime,
      "Remarks":element.remarks,
      "description":element.description
    }
    
    this._adminService.AddEmployeeBreak(request).subscribe({
      next:res=>{
         this.globalbreak=res.Data;
        this.dataSource=new MatTableDataSource<any>(res.Data)
      },
      error:err=>{console.log(err)}
    })

    }
    
    // this.dataSource[index] = this.editableRow;
    // this.dataSource = [...this.dataSource]; // Refresh table
    // this.cancelEdit();
  }
  addRow() {
    const newRow = { description: '', startTime: '', endTime: '', remarks: '' };
    const data = this.dataSource.data;
  data.push(newRow);
  this.dataSource.data = [...data];
   // this.dataSource.push({ description: '', startTime: '', endTime: '', remarks: '' });
    //this.dataSource = [...this.dataSource]; // refresh table
      const userdetail = this._sessionStoreage.getItem('UserProfile');
const today_Date = new Date();
console.log(this.dataSource);
if (userdetail) {
  const user = JSON.parse(this.decry.decrypt(userdetail));
  //this.getBreakDetailByEmployee(user.user_Id, today_Date);
}
  
  }

  removeRow(index: number) {
     const data = this.dataSource.data; // get the array
  data.splice(index, 1); // remove the row
  this.dataSource.data = [...data]; //
    // this.dataSource.splice(index, 1);
    // this.dataSource = [...this.dataSource];
  }
 getBreakDetailByEmployee(userId, date): void {
  this._adminService.GetEmployeeBreakByDate(userId, date).subscribe({
    next: res => {
      const breakData = res.Data;
      // use breakData here as needed
      console.log(breakData);
     this.globalbreak=res.Data;
      this.dataSource=new MatTableDataSource<any>(res.Data);
      //this.autoSelectRows();
    },
    error: err => {
      console.error('Error fetching break details:', err);
    }
  });
}
closeDialog() {
  
      this.dialogRef.close({ success: true, message: 'Saved successfully!' });
   
  }

  cancelEdit() {
    this.editIndex = null;
    this.editableRow = {};
  }
}
