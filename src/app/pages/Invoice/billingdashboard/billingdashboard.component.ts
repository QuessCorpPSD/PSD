
import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { finalize } from 'rxjs';
import { SignalrService } from '../../../Shared/SignalrService';
@Component({
  selector: 'app-billingdashboard',
  imports: [MatPaginatorModule, CommonModule, UserComponent, MatTableModule, MatCardModule, MatTooltipModule, MatCheckboxModule,FormsModule],
  templateUrl: './billingdashboard.component.html',
  styleUrl: './billingdashboard.component.css',
  providers: [
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
export class BillingdashboardComponent implements OnInit {
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
  @ViewChild('InvoiceAlotPaginator') InvoiceAlot_paginator!: MatPaginator;
  constructor(@Inject(DASH_TOKEN) private dashService: IDashBoardServices, @Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,private signalr:SignalrService) { }
  displayedInvoiceColumns: string[] = ['edit','status'
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
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
     this.signalr.startConnection();

    this.signalr.onGridUpdate(() => {
      this.BindInvoiceAllot();
    });
   
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
    
    this._invoiceService.BillingDashboardExport(loggedInUser, flag)
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
    

    const loggedInUser = [263, 3].includes(this.userdetail.user_Id)  ? 0  : this.userdetail.user_Id;
    
    this._invoiceService.BillingDashboard(loggedInUser, 'Search').subscribe({
      next: res => {
        
        this.InvoiceAlloted = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        this.InvoiceAlloted.paginator = this.InvoiceAlot_paginator;
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
