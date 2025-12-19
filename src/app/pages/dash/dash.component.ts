import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { MatTableDataSource } from '@angular/material/table';
import { AdminDashboardDetailUI } from '../../Models/AdminDashboardDetailUI';
import { FinancialYearComponent } from '../../common/financial-year/financial-year.component';
import { UserComponent } from '../../common/user/user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from "@angular/material/tooltip";
export  const DASH_TOKEN=new InjectionToken<IDashBoardServices>('DASH_TOKEN');
    
    ModuleRegistry.registerModules([ AllCommunityModule ]);
@Component({
    selector: 'app-dash',
    imports: [AgGridAngular, FormsModule, MatIconModule, MatFormFieldModule, MatDatepickerModule, CommonModule, ReactiveFormsModule, FinancialYearComponent, UserComponent, MatTooltip],
    templateUrl: './dash.component.html',
    styleUrl: './dash.component.css',
    providers:[provideNativeDateAdapter(),
       {
                  provide: DASH_TOKEN,
                  useClass: DashBoardServices,
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
  rowData: any;
  private gridApi!: GridApi;
  carddashboard: any;
  gridData: any;
  showPanel:boolean=false;
  showCompletedPanel:boolean=false;
  showOverduePanel:boolean=false;
  showInprogressPanel:boolean=false;
  showNotAssignmentPanel:boolean=false;
  financialyear:any;
user:any;

userList:any;
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
 isLoading:boolean=false;
  constructor(@Inject(DASH_TOKEN) private dashService: IDashBoardServices) {

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
BindDashboardDetail(val){

  console.log (val)
  this.dashService.getadmindashboarddetail(val).subscribe({
      next:res=>{
        
      //   this.dataSource= new MatTableDataSource<AdminDashboardDetailUI>(res.Data);
      // this.dataSource.paginator = this.paginator;
    },
      error:err=>{console.log(err.message)}
    })
}
handlefinancialYearEvent(financialYear:any)
{
 this.financialyear=financialYear;
}
handleuserEvent(user:any)
{
  this.user=user;  
}
onMouseEnter(assignmentType: 'T' | 'C' | 'O' | 'I' | 'N'):void{
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
    next:res=>{this.gridData=res.Data},
    error:err=>{console.log(err)}
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
    this.dashService.GetPendingLotDetail().subscribe({
      next: res => { this.BindGrid(res.Data); console.log(this.rowData) },
      error: err => { console.log(err) }
    });
  }
  columnDefs: any;
  ngOnInit(): void {
    this.PendingLots();
    this.BindDashBoard();
  }

  BindGrid(data: any) {
    this.rowData = data;
    if (data && data.length > 0) {
     this.columnDefs = Object.keys(data[0]).map((key, index) => {
  // Customize header name
  const header = key.replace(/_/g, ' ').toUpperCase();

  // Example: custom display names or field formats
  const customHeaders: any = {
    companyCode: 'Company Code',
    Company_Name: 'Company Name',
    Payroll_Input_Type: 'Payroll Input Type',
    Lot_Number:'Lot Number',
    headCount:'Head Count',
    inputSubmittedDate:'Input Submitted Date',
    processCategory:'Process Category',
    assignedTo:'Assigned To',
    allottmentTo:'Allotted To',
    qcVerifiedDatetime:'QC Verified Datetime',
    EstimateTime:'Estimate Time(min)'
  };

  // Example: custom value formatting
  const customFormatters: any = {
    qcVerifiedDatetime: (params: any) => new Date(params.value).toLocaleDateString(),
    inputSubmittedDate: (params: any) => new Date(params.value).toLocaleDateString(),
    allottmentTo: (params: any) => new Date(params.value).toLocaleDateString(),
    
  };

  // Example: custom column settings (width, pinned, hidden)
  const customConfig: any = {
    companyCode: { pinned: 'left', minWidth: 150 },
    Company_Name: { pinned: 'left', minWidth: 200 },
  
    doj: { minWidth: 150, cellStyle: { color: 'blue' } }
  };

  return {
    headerName: customHeaders[key] || header,
    field: key,
    minWidth: customConfig[key]?.minWidth || 120,
    pinned: customConfig[key]?.pinned || (index < 3 ? 'left' : null),
    hide: key === 'internal_id', // Example: hide certain fields
    tooltipValueGetter: (params: any) => this.getColumnTooltip(params, key),
    valueFormatter: customFormatters[key],
    cellStyle: customConfig[key]?.cellStyle,
  };
});

      // this.columnDefs = Object.keys(data[0]).map((key, index) => ({
      //   headerName: key.replace(/_/g, ' ').toUpperCase(),
      //   field: key,
      //   minWidth: 120,
      //   pinned: index < 3 ? 'left' : null,
      //   tooltipValueGetter: (params) => this.getColumnTooltip(params, key),
      // }));
    }
  }
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
