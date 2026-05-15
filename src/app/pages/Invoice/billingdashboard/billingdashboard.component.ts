
import { Component, Inject, InjectionToken, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from '../../../common/user/user.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IDashBoardServices } from '../../../Repository/IDashBoardService';
import { IAssignmentService } from '../../../Repository/IAssignment.service';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { DashBoardServices } from '../../../Service/DashBoardService';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
export const DASH_TOKEN = new InjectionToken<IDashBoardServices>('DASH_TOKEN');
export const AUTH_TOKEN = new InjectionToken<IAssignmentService>('AUTH_TOKEN');
export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { finalize, interval, Subscription } from 'rxjs';
import { SignalrService } from '../../../Shared/SignalrService';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatProgressBar} from '@angular/material/progress-bar';
@Component({
  selector: 'app-billingdashboard',
  imports: [MatPaginatorModule,MatProgressBar,ReactiveFormsModule,MatFormFieldModule,MatDatepickerModule, CommonModule, UserComponent, MatTableModule, MatCardModule, MatTooltipModule, MatCheckboxModule,FormsModule],
  templateUrl: './billingdashboard.component.html',
  styleUrl: './billingdashboard.component.css',
  providers: [provideNativeDateAdapter(),
    {
      provide: DASH_TOKEN,
      useClass: DashBoardServices,
    },

    {
      provide: Invoice_TOKEN,
      useClass: InvoiceRepository,
    }
  ]
})
export class BillingdashboardComponent implements OnInit,OnDestroy {
  userList: any;
  AllotedTo?: number;
  InvoiceAlloted: any;
  iseditClicked = false;
  userdetail: any;
  reqNo: string = '';
  user: any;
  selection = new SelectionModel<any>(true, []);
  isLoading = false;
  searchText: string = '';
  selectedTemplate: string = '';
  template: string = "";
  start: Date | null = null;
  end: Date | null = null;
    progressValue = 0;
  @ViewChild('InvoiceAlotPaginator') InvoiceAlot_paginator!: MatPaginator;
  constructor(@Inject(DASH_TOKEN) private dashService: IDashBoardServices, @Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,private signalr:SignalrService) { }
  displayedInvoiceColumns: string[] = ['revoked','edit','status'
    , 'Req_No'
    , 'RequestDatetime'
    , 'Company_Code'
    , 'Company_Name'
    , 'LotNo'
    , 'HC'
    , 'ReqUserName'
    , 'AssignedTo'
    , 'AllocationDatetime'
    , 'Invoice_Created_Date'
  ]
  TemplateOptions = [
    { value: 'Not Allotted', Text: 'Not Allotted' },
    { value: 'Pending', Text: 'Pending' },
    { value: 'Completed', Text: 'Completed' }
  ];
  private timerSub!: Subscription;
  startTimer() {
    if (!this.timerSub || this.timerSub.closed) {
      this.timerSub = interval(60000).subscribe(() => {
         this.BindInvoiceAllot();
      });
    }
  }
   stopTimer() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }
IsRevokPermission:boolean=false;
  isRevokoption()
  {
    const firstRow = this.InvoiceAlloted?.data?.[0];
 // console.log(firstRow);
  this.IsRevokPermission = !!firstRow?.isedit;

  }
  

  ngOnDestroy() {
    this.stopTimer();
  }
 invoiceRevoked():void{
if (this.selection.selected.length == 0) {
      alert("Please Select atleast one row");
      return;
    }
   

    const distinctReqNo = [...new Set(this.selection.selected.map((x: any) => x.req_No))];

if (distinctReqNo.length > 1) {
  this.selection.clear();
  alert('Multiple Req No selection is not allowed');
  return;
} 

this.isLoading=true;
    this._invoiceService.InvoiceRequestRevok(this.selection.selected[0].req_No,this.selection.selected[0].invoiceType,this.userdetail.user_Id).subscribe({
      next:res=>{
        console.log(res.Data);
        alert(res.Data.error_Message);
        this.isLoading=false;
        this.selection.clear();
        this.BindInvoiceAllot();
        return;
      },
      error:err=>{
        this.isLoading=false;
      }
    })
this.isLoading=false;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
   
    this.start=null;
    this.end=null;
      this.BindInvoiceAllot();
   // this.startTimer();

    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'visible') {
    //     this.startTimer();
    //   } else {
    //     this.stopTimer();
    //   }
    // });
  //   interval(60000).subscribe(() => {    
  //   this.BindInvoiceAllot();
  // });
    //  this.signalr.startConnection();

    // this.signalr.onGridUpdate(() => {
     
    // });
   
  }
  
  onTemplateChange(searchText: string = ''): void {

    this.template = this.selectedTemplate;

    const filterValue = `${this.template}|${searchText}`;

    this.InvoiceAlloted.filterPredicate = (data: any, filter: string): boolean => {

      const [template, searchText = ''] = filter.split('|');
      const searchValues = searchText
        .toLowerCase()
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);


      let templateMatch = true;
      console.log('Selected', template);
      switch (template) {
        case 'Not Allotted':
          templateMatch = data.status == 'Not Allotted';
          break;

        case 'Pending':
          templateMatch = data.status == 'Pending';
          break;

        case 'Completed':
          templateMatch = data.status == 'Completed';
          break;
      }

      const textMatch =
        searchValues.length === 0 ||
        searchValues.some(search =>
          Object.values(data).some(val =>
            String(val).toLowerCase().includes(search)
          )
        );

      return templateMatch && textMatch;
    };

    this.InvoiceAlloted.filter = filterValue;
  }

  onExportInvoice() {
    this.isLoading = true;
    const loggedInUser = [263, 3].includes(this.userdetail.user_Id) ? 0 : this.userdetail.user_Id;
    const flag = "Export";
    const request={
      "userId":loggedInUser,
      "flag":"Export",
      "fromDate":this.start,
      "toDate":this.end
    }
    
    this._invoiceService.BillingDashboardExport(request)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName);
          } else {
            console.error('Unexpected status code', res.StatusCode);
          }
        },
        error: error => {
          console.error('Error:', error);
          this.isLoading = false;
        }
      });
  }

  applyFilter(searchText: string = '') {

    this.onTemplateChange(searchText);
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
    this.isLoading = false;
  }

  
  BindInvoiceAllot() {   
    
 const fromdates = this.start // this.range.get('start')?.value;
  const Todates =this.end //this.range.get('end')?.value;
    const loggedInUser =this.userdetail.user_Id //[263, 3].includes(this.userdetail.user_Id)  ? 0  : this.userdetail.user_Id;
    const request={
      "userId":loggedInUser,
      "flag":"Search",
      "fromDate":fromdates,
      "toDate":Todates
    }
    
    this._invoiceService.BillingDashboard(request).subscribe({
      next: res => {
       
        this.InvoiceAlloted = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        this.InvoiceAlloted.paginator = this.InvoiceAlot_paginator;
        console.log( this.InvoiceAlloted);
        this.isRevokoption();
      },
      error: err => { }
    });
  }
  handleuserEvent(user: any) {
    this.user = user;
    
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.InvoiceAlloted.data.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.InvoiceAlloted.data.length;
    return numSelected > 0 && numSelected < numRows;
  }
  EditClick(reqNo: string, userId: number) {
    this.AllotedTo = userId;
    this.reqNo = reqNo;
    this.iseditClicked = true;
  }
  closeclick() {
    this.iseditClicked = false;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.InvoiceAlloted.data.forEach((row: any) => this.selection.select(row));
    }
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }
  Save() {
    if (!this.reqNo) {
      alert('Request No cannot be null');
      return;
    }
    if (!this.user.user_Id) {
      alert('UserId cannot be null');
      return;
    }
    this.dashService.SaveInvoiceAllotEdit(this.reqNo, this.user.user_Id).subscribe({
      next: res => {
        const error = res.Data;
        const message = error?.[0]?.[""];
        

        if (message === 'Updated successfully') {
          alert('Updated successfully');
        }
        else {
          alert('Update Failed.');
        }
      },
      error: err => { console.error(err); }
    });
  }
}
