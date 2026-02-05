import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AgGridAngular } from "ag-grid-angular";
import type { ColDef, GridApi, GridOptions, GridReadyEvent, PaginationChangedEvent, RowClickedEvent } from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  provideGlobalGridOptions,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";
import { IDashBoardServices } from '../../Repository/IDashBoardService';
import { DashBoardServices } from '../../Service/DashBoardService';
import { AdminDashboardDetailUI } from '../../Models/AdminDashboardDetailUI';
import { FinancialYearComponent } from '../../common/financial-year/financial-year.component';
import { UserComponent } from '../../common/user/user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from "@angular/material/tooltip";
import { IAssignmentService } from '../../Repository/IAssignment.service';
import { AssignmentService } from '../../Service/Assignment.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { filter } from 'rxjs';
import { IInvoiceRepository } from '../../Repository/IInvoiceRepository';
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { InvoiceRepository } from '../../Service/InvoiceRepository';
export const DASH_TOKEN = new InjectionToken<IDashBoardServices>('DASH_TOKEN');
export const AUTH_TOKEN = new InjectionToken<IAssignmentService>('AUTH_TOKEN');
export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
import * as XLSX from 'xlsx';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-dash',
  imports: [AgGridAngular, FormsModule, MatTableModule, MatIconModule, MatFormFieldModule, MatDatepickerModule, CommonModule, ReactiveFormsModule, FinancialYearComponent, UserComponent, MatTooltip, MatPaginatorModule, MatCheckboxModule, MatCardModule],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.css',
  providers: [provideNativeDateAdapter(),
  {
    provide: DASH_TOKEN,
    useClass: DashBoardServices,
  },
  {
    provide: AUTH_TOKEN,
    useClass: AssignmentService,
  },
  {
    provide: Invoice_TOKEN,
    useClass: InvoiceRepository,
  }
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashComponent implements OnInit {
  public gridOptions: GridOptions = {
    theme: 'legacy',// 👈 Force legacy theme mode,
    suppressHorizontalScroll: false,
    domLayout: 'normal',
    rowHeight: 28 // default is 25–32 depending on theme

  };
  rowPendingData: any;
  rowCompletedData: any;
  private gridApi!: GridApi;
  carddashboard: any;
  gridData: any;
  showPanel: boolean = false;
  showCompletedPanel: boolean = false;
  showOverduePanel: boolean = false;
  showInprogressPanel: boolean = false;
  showNotAssignmentPanel: boolean = false;
  financialyear: any;
  user: any;
  userdetail: any;
  pendingLots: any;
  InvoiceAlloted: any;
  iseditClicked = false;
  reqNo: string = '';
  @ViewChild('PeningLotPaginator') PeningLot_paginator!: MatPaginator;
  @ViewChild('InvoiceAlotPaginator') InvoiceAlot_paginator!: MatPaginator;
  userList: any;
  AllotedTo?: number;
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  isLoading: boolean = false;
  constructor(@Inject(DASH_TOKEN) private dashService: IDashBoardServices, @Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository,
    @Inject(AUTH_TOKEN) private _authService: IAssignmentService, private toastr: ToastrService
    , private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,) {

  }

  displayedInvoiceColumns: string[] = ['edit', 'Serial_No'
    , 'Req_No'
    , 'Company_Code'
    , 'Pay_Period'
    , 'Map_name'
    , 'Employee_Head_Count'
    , 'Net_CTC'
    , 'NetPay'
    , 'Invoice_Category'
    , 'Invoice_Type'
    , 'State_name'
    , 'RequestedBy'
    , 'RequestedDate'
    , 'Initiation_Remarks'
    , 'AssignedTo'
    , 'Rejected_On'
    , 'Rejected_By'
    , 'InvoiceCreatedOn'
  ]

  selection = new SelectionModel<any>(true, []);

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.InvoiceAlloted.filteredData.some(row => row.Req_No === sel.Req_No
      )
    );
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

  onRowClicked(event: RowClickedEvent) {
    console.log('Row clicked:', event.data);
    alert(`You clicked on ${event.data.make} (${event.data.model})`);
  }
  GetDatashboardByFilter(): void {
    const fromdates = this.range.get('start')?.value;
    const Todates = this.range.get('end')?.value;
    if (fromdates && !Todates) {
      alert("Please select To Date");
      return;
    }

    if (!fromdates && Todates) {
      alert("Please select From Date");
      return;
    }
    const request = {
      FilterType: 'A',
      FinancialYear: this.financialyear ? this.financialyear.financial_Year_Name : null,
      UserId: this.user ? this.user.user_Id : null,
      FromDate: fromdates,
      ToDate: Todates
    };

    this.BindDashboardDetail(request);
  }
  BindDashboardDetail(val) {

    console.log(val)
    this.dashService.getadmindashboarddetail(val).subscribe({
      next: res => {
        this.rowCompletedData = res.Data;
        //   this.dataSource= new MatTableDataSource<AdminDashboardDetailUI>(res.Data);
        // this.dataSource.paginator = this.paginator;
      },
      error: err => { console.log(err.message) }
    })
  }


  BindInvoiceAllot() {
    console.log('BindInvoiceAllot');
    const request = {
      "InvoiceType": 0,
      "ActionType": "E",
      "userId": this.userdetail.user_Id
    }
    console.log(request);
    this._invoiceService.GetAllInvoiceAllotDetails(request).subscribe({
      next: res => {
        console.log(res.Data.data);
        this.InvoiceAlloted = new MatTableDataSource<any>(Array.isArray(res.Data.data) ? res.Data.data : []);
        this.InvoiceAlloted.paginator = this.InvoiceAlot_paginator;
      },
      error: err => { }
    });
  }
  onExportInvoice() {
    const request = {
      "InvoiceType": 0,
      "ActionType": "E",
      "userId": this.userdetail.user_Id
    }
    console.log(request);
    this._invoiceService.GetAllInvoiceAllotDetails(request).subscribe({
      next: res => {
        console.log(res.Data.data);
        const ws = XLSX.utils.json_to_sheet(res.Data.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Table");
        XLSX.writeFile(wb, "InvoiceAllotExport.xlsx");
      },
      error: err => { }
    });
  }
  closeclick() {
    this.iseditClicked = false;
  }

  EditClick(reqNo: string, userId: number) {
    this.AllotedTo = userId;
    this.reqNo = reqNo;
    this.iseditClicked = true;
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
        console.log(message);

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

  handlefinancialYearEvent(financialYear: any) {
    this.financialyear = financialYear;
  }
  handleuserEvent(user: any) {
    this.user = user;
    console.log(this.user);
  }
  onMouseEnter(assignmentType: 'T' | 'C' | 'O' | 'I' | 'N'): void {
    this.BindDashBoard();
    this.showPanel = false;
    this.showCompletedPanel = false;
    this.showOverduePanel = false;
    this.showInprogressPanel = false;
    this.showNotAssignmentPanel = false;
    switch (assignmentType) {
      case 'T':
        this.showPanel = true;
        break;
      case 'C':
        this.showCompletedPanel = true;
        break;
      case 'O':
        this.showOverduePanel = true;
        break;
      case 'I':
        this.showInprogressPanel = true;
        break;
      case 'N':
        this.showNotAssignmentPanel = true;
        break;
    }
    this.dashService.getCategoryLotDetail(assignmentType).subscribe({
      next: res => { this.gridData = res.Data },
      error: err => { console.log(err) }
    })
  }

  onExport() {
    this.gridApi.exportDataAsCsv(); // ⬇️ Downloads CSV
  }
  pageSize = 5; // default
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentPage = 1;
  totalPages = 1;


  BindDashBoard() {
    this.dashService.getadmindashboard().subscribe({
      next: res => { this.carddashboard = res.Data; },
      error: err => { console.log(err.message) }
    })
  }






  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.updatePaginationInfo();
  }

  onPaginationChanged(event: PaginationChangedEvent) {
    this.updatePaginationInfo();
  }

  onPrevPage() {
    if (this.gridApi.paginationGetCurrentPage() > 0)
      this.gridApi.paginationGoToPreviousPage();
  }

  onNextPage() {
    const current = this.gridApi.paginationGetCurrentPage();
    const total = this.gridApi.paginationGetTotalPages();
    if (current < total - 1)
      this.gridApi.paginationGoToNextPage();
  }

  updatePaginationInfo() {
    if (!this.gridApi) return;
    this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    this.totalPages = this.gridApi.paginationGetTotalPages();
  }

  // if user changes page size manual

  PendingLots(): void {
    this.dashService.getadminPendingLot().subscribe({
      next: res => { this.BindGrid(res.Data); },
      error: err => { console.log(err) }
    });
  }
  columnDefs: any;
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.PendingLots();
    this.BindDashBoard();

    const request = {
      FilterType: null,
      FinancialYear: null,
      UserId: 0,
      FromDate: null,
      ToDate: null
    };

    this.BindDashboardDetail(request);
    this.BindPendingLot();
    //this.BindInvoiceAllot();
  }

  BindPendingLot(): void {
    this.isLoading = true; // Optional: Add loading indicator

    this.dashService.getadminPendingLot().subscribe({
      next: (res) => {
        if (res && res.Data) {
          //console.log('Pending Lots:', res.Data);       
          this.pendingLots = new MatTableDataSource<any>(res.Data);
          // Optional: assign to variable
          this.pendingLots.paginator = this.PeningLot_paginator
        } else {
          console.warn('No pending lot data received.');
        }
      },
      error: (err) => {
        // console.error('Failed to fetch pending lots:', err);
        //this.toastr.error('Unable to load pending lots. Please try again later.', 'Error');
      },
      complete: () => {
        this.isLoading = false; // Optional: stop loading indicator
      }
    });
  }

  BindGrid(data: any[]) {
    this.rowPendingData = data;

    if (!data || data.length === 0) {
      return;
    }

    const customHeaders: any = {
      company_Code: 'Company Code',
      company_Name: 'Company Name',
      location: 'Business Unit Location',
      payroll_Input_Type: 'Payroll Input Type',
      lot_Number: 'Lot Number',
      input_Headcount: 'Head Count',
      inputSubmittedDate: 'Input Submitted Date',
      process_Category: 'Process Category',
      asssignedTo: 'Assigned To',
      allottedDateTime: 'Allotted DateTime',
      qC_Verified_DateTime: 'QC Verified Datetime',
      timeTaken: 'Estimate Time (min)'
    };

    const customFormatters: any = {
      inputSubmittedDate: (params: any) =>
        params.value ? new Date(params.value).toLocaleString() : '',
      allottedDateTime: (params: any) =>
        params.value ? new Date(params.value).toLocaleString() : '',
      qC_Verified_DateTime: (params: any) =>
        params.value ? new Date(params.value).toLocaleString() : '',
    };

    const customConfig: any = {
      company_Code: { pinned: 'left', minWidth: 150 },
      company_Name: { pinned: 'left', minWidth: 220 },
    };

    // ✅ 1. Build DATA columns first
    const dataColumns = Object.keys(customHeaders).map((key, index) => ({
      headerName: customHeaders[key],
      field: key,
      minWidth: customConfig[key]?.minWidth || 130,
      pinned: customConfig[key]?.pinned || null,
      valueFormatter: customFormatters[key],
      tooltipValueGetter: (params: any) =>
        params.value ? params.value.toString() : '',
    }));

    // 2. Define Input & Output columns
    const actionColumns = [
      {
        headerName: 'Input',
        width: 90,
        pinned: 'left',
        filter: false,
        cellRenderer: () => `
    <span style="cursor:pointer; display:inline-flex; align-items:center;">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.6 0.545455C6.6 0.244208 6.33137 0 6 0C5.66863 0 5.4 0.244208 5.4 0.545455V6.86497L4.02426 5.61431C3.78995 5.40129 3.41005 5.40129 3.17574 5.61431C2.94142 5.82732 2.94142 6.17268 3.17574 6.38569L5.57531 8.56712C5.57675 8.56844 5.57821 8.56975 5.57967 8.57106C5.63628 8.6216 5.70117 8.65987 5.77033 8.68588C5.84055 8.71236 5.9175 8.72705 5.9982 8.72727L6 8.72727L6.0018 8.72727C6.16478 8.72684 6.31247 8.66733 6.42033 8.57106C6.42179 8.56975 6.42325 8.56844 6.42469 8.56712L8.82426 6.38569C9.05858 6.17268 9.05858 5.82732 8.82426 5.61431C8.58995 5.40129 8.21005 5.40129 7.97574 5.61431L6.6 6.86497V0.545455Z"
          fill="#302CB3" />
        <path
          d="M0.6 8.18182C0.931371 8.18182 1.2 8.42603 1.2 8.72727V10.3636C1.2 10.6649 1.46863 10.9091 1.8 10.9091H10.2C10.5314 10.9091 10.8 10.6649 10.8 10.3636V8.72727C10.8 8.42603 11.0686 8.18182 11.4 8.18182C11.7314 8.18182 12 8.42603 12 8.72727V10.3636C12 11.2674 11.1941 12 10.2 12H1.8C0.805887 12 0 11.2674 0 10.3636V8.72727C0 8.42603 0.268629 8.18182 0.6 8.18182Z"
          fill="#302CB3" />
      </svg>
    </span>
  `,
        onCellClicked: (params: any) => this.InputDownload(params.data)
      },
      {
        headerName: 'Output',
        width: 30,
        pinned: 'left',
        filter: false,
        cellRenderer: () => `
    <span style="cursor:pointer; display:inline-flex; align-items:center;">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.6 0.545455C6.6 0.244208 6.33137 0 6 0C5.66863 0 5.4 0.244208 5.4 0.545455V6.86497L4.02426 5.61431C3.78995 5.40129 3.41005 5.40129 3.17574 5.61431C2.94142 5.82732 2.94142 6.17268 3.17574 6.38569L5.57531 8.56712C5.57675 8.56844 5.57821 8.56975 5.57967 8.57106C5.63628 8.6216 5.70117 8.65987 5.77033 8.68588C5.84055 8.71236 5.9175 8.72705 5.9982 8.72727L6 8.72727L6.0018 8.72727C6.16478 8.72684 6.31247 8.66733 6.42033 8.57106C6.42179 8.56975 6.42325 8.56844 6.42469 8.56712L8.82426 6.38569C9.05858 6.17268 9.05858 5.82732 8.82426 5.61431C8.58995 5.40129 8.21005 5.40129 7.97574 5.61431L6.6 6.86497V0.545455Z"
          fill="#302CB3" />
        <path
          d="M0.6 8.18182C0.931371 8.18182 1.2 8.42603 1.2 8.72727V10.3636C1.2 10.6649 1.46863 10.9091 1.8 10.9091H10.2C10.5314 10.9091 10.8 10.6649 10.8 10.3636V8.72727C10.8 8.42603 11.0686 8.18182 11.4 8.18182C11.7314 8.18182 12 8.42603 12 8.72727V10.3636C12 11.2674 11.1941 12 10.2 12H1.8C0.805887 12 0 11.2674 0 10.3636V8.72727C0 8.42603 0.268629 8.18182 0.6 8.18182Z"
          fill="#302CB3" />
      </svg>
    </span>
  `,
        onCellClicked: (params: any) => this.OutPutFileDownload(params.data)
      }
    ];

    // 3. Assign columnDefs ONCE
    this.columnDefs = [...actionColumns, ...dataColumns];
  }



  OutPutFileDownload(element: any): void {
    this.isLoading = true;

    const request = {
      companyId: element.company_Id,
      companycode: element.company_Code,
      pay_period_Id: element.pay_Period_Id,
      pay_period: element.pay_period,
      lotNumber: element.lot_Number,
      payroll_input_type: "Q"
    };

    this._authService.OutPutFileDownload(request).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.StatusCode === 200) {
          const base64 = res.Data?.file;

          if (base64 && base64 !== "No") {
            this.downloadExcelFromBase64(base64, element.lot_Number, "Output");
          }
          else {
            this.toastr.error(res.Data?.fileName, "Error");
          }
        } else {

          console.error('Unexpected status code:', res.StatusCode);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Download error:', error);
      }
    });
  }

  InputDownload(element) {
    this.isLoading = true;
    var request = {
      "companycode": element.company_Id,
      "pay_period_Id": element.pay_Period_Id,
      "lotNumber": element.lot_Number,
      "InputType": element.payroll_Input_Type
    }
    this._authService.InputFileDownload(request).subscribe({
      next: res => {
        if (res.StatusCode == 200) {
          const data = res.Data;
          var base64 = data.file;
          this.downloadExcelFromBase64(base64, element.lot_Number, "Input")
          this.isLoading = false;
        }

      },
      error: error => console.error('Error:', error)
    })

  }

  downloadExcelFromBase64(base64String: string, fileName: string, FileType): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}_${FileType}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }


  //   BindGrid(data: any) {
  //     this.rowData = data;
  //     if (data && data.length > 0) {
  //      this.columnDefs = Object.keys(data[0]).map((key, index) => {
  //   // Customize header name
  //   const header = key.replace(/_/g, ' ').toUpperCase();

  //   // Example: custom display names or field formats
  //   const customHeaders: any = {
  //     companyCode: 'Company Code',
  //     Company_Name: 'Company Name',
  //     Payroll_Input_Type: 'Payroll Input Type',
  //     Lot_Number:'Lot Number',
  //     headCount:'Head Count',
  //     inputSubmittedDate:'Input Submitted Date',
  //     processCategory:'Process Category',
  //     assignedTo:'Assigned To',
  //     allottmentTo:'Allotted To',
  //     qcVerifiedDatetime:'QC Verified Datetime',
  //     EstimateTime:'Estimate Time(min)'
  //   };

  //   // Example: custom value formatting
  //   const customFormatters: any = {
  //     qcVerifiedDatetime: (params: any) => new Date(params.value).toLocaleDateString(),
  //     inputSubmittedDate: (params: any) => new Date(params.value).toLocaleDateString(),
  //     allottmentTo: (params: any) => new Date(params.value).toLocaleDateString(),

  //   };

  //   // Example: custom column settings (width, pinned, hidden)
  //   const customConfig: any = {
  //     companyCode: { pinned: 'left', minWidth: 150 },
  //     Company_Name: { pinned: 'left', minWidth: 200 },

  //     doj: { minWidth: 150, cellStyle: { color: 'blue' } }
  //   };

  //   return {
  //     headerName: customHeaders[key] || header,
  //     field: key,
  //     minWidth: customConfig[key]?.minWidth || 120,
  //     pinned: customConfig[key]?.pinned || (index < 3 ? 'left' : null),
  //     hide: key === 'internal_id', // Example: hide certain fields
  //     tooltipValueGetter: (params: any) => this.getColumnTooltip(params, key),
  //     valueFormatter: customFormatters[key],
  //     cellStyle: customConfig[key]?.cellStyle,
  //   };
  // });

  //       // this.columnDefs = Object.keys(data[0]).map((key, index) => ({
  //       //   headerName: key.replace(/_/g, ' ').toUpperCase(),
  //       //   field: key,
  //       //   minWidth: 120,
  //       //   pinned: index < 3 ? 'left' : null,
  //       //   tooltipValueGetter: (params) => this.getColumnTooltip(params, key),
  //       // }));
  //     }
  //   }
  getColumnTooltip(params: any, key: string): string {
    const value = params.value ?? '(No Data)';
    switch (key.toLowerCase()) {
      case 'comanyName':
        return `💰 Salary: ₹${value}`;
      case 'department':
        return `🏢 Department: ${value}`;
      case 'joining_date':
        return `📅 Joined on: ${value}`;
      default:
        return `${params.colDef.headerName}: ${value}`;
    }
  }
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    minWidth: 150,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    tooltipComponentParams: { color: '#1976d2' }
  };

}
