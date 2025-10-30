import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export  const DASH_TOKEN=new InjectionToken<IDashBoardServices>('DASH_TOKEN');
    
    ModuleRegistry.registerModules([ AllCommunityModule ]);
@Component({
    selector: 'app-dash',
    imports: [AgGridAngular, FormsModule, CommonModule],
    templateUrl: './dash.component.html',
    styleUrl: './dash.component.css',
    providers:[
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
    domLayout: 'normal'
  };
  rowData:any;
   private gridApi!: GridApi;

  constructor(@Inject(DASH_TOKEN) private dashService: IDashBoardServices){

  }
   onRowClicked(event: RowClickedEvent) {
    console.log('Row clicked:', event.data);
    alert(`You clicked on ${event.data.make} (${event.data.model})`);
  }
 
  
 onExport() {
    this.gridApi.exportDataAsCsv(); // ⬇️ Downloads CSV
  }
   pageSize = 5; // default
  pageSizeOptions = [5,10, 20, 30, 50,100];
  currentPage = 1;
  totalPages = 1;

  gridData = [
    { process_Category: 'P1', totalAssignment: 12 },
    { process_Category: 'P2', totalAssignment: 7 },
    { process_Category: 'P3', totalAssignment: 3 },
    { process_Category: 'P4', totalAssignment: 3 }
  ];

  // Cards config (6 cards)
  cards = [
    { key: 'T', title: 'Total' , value: 124, gradient: 'conic-gradient(from 140deg at 70.81% 15.58%, #4446CE 0deg, #212784 360deg)' },
    { key: 'C', title: 'Completed', value: 98,  gradient: 'conic-gradient(from 140deg at 70.81% 15.58%, #0D825D 0deg, #084430 360deg)' },
    { key: 'O', title: 'Overdue', value: 5,   gradient: 'conic-gradient(from 140deg at 70.81% 15.58%, #820D7A 0deg, #44082F 360deg)' },
    { key: 'I', title: 'In Progress ', value: 14, gradient: 'conic-gradient(from 140deg at 70.81% 15.58%, #D7D733 0deg, #909021 360deg)' },
    { key: 'N', title: 'Not Allotted ', value: 7, gradient: 'conic-gradient(from 140deg at 70.81% 15.58%, #D32F2F 0deg, #7B1F1F 360deg)' },
    { key: 'X', title: ' Yet to Come', value: 2, gradient: 'conic-gradient(from 140deg at 70.81% 15.58%, #556B2F 0deg, #2F4F2F 360deg)' }
  ];

  // currently hovered / opened panel key
  hoveredKey: string | null = null;
  // for touch devices allow toggling panels on click
  clickedKey: string | null = null;

  onMouseEnter(key: string) {
    this.hoveredKey = key;
    // clear click when hovering so hover takes precedence
    this.clickedKey = null;
  }

  onMouseLeave() {
    this.hoveredKey = null;
  }

  onCardClick(key: string) {
    // toggle clicked panel
    this.clickedKey = this.clickedKey === key ? null : key;
  }

  isPanelVisible(key: string) {
    return this.hoveredKey === key || this.clickedKey === key;
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

   PendingLots():void
  {
   this.dashService.GetPendingLotDetail().subscribe({
    next:res=>{this.BindGrid(res.Data); console.log(this.rowData)},
    error:err=>{console.log(err)}
   }) ;
  }
columnDefs:any;
  ngOnInit(): void {
    this.PendingLots();
  }

  BindGrid(data: any) {
    this.rowData = data;
    if (data && data.length > 0) {      
      this.columnDefs = Object.keys(data[0]).map((key,index) => ({
        headerName: key.replace(/_/g, ' ').toUpperCase(),
        field: key,
        minWidth: 120,
         pinned: index < 3 ? 'left' : null,
         tooltipValueGetter: (params) => this.getColumnTooltip(params, key),
      }));
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
