import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from "@angular/material/tooltip";
import { AddComponent } from './add/add.component';
import { MatDialog } from '@angular/material/dialog';

import { AgGridAngular } from 'ag-grid-angular';

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
import { CommonModule } from '@angular/common';
ModuleRegistry.registerModules([ AllCommunityModule ]);
@Component({
    selector: 'gst-invoice',
    imports: [AgGridAngular,CommonModule],
    templateUrl: './gst-invoice.component.html',
    styleUrl: './gst-invoice.component.css'
})
export class GstInvoiceComponent {
  public gridOptions: GridOptions = {
      theme: 'legacy',// 👈 Force legacy theme mode,
      suppressHorizontalScroll: false,
      domLayout: 'normal',
       rowHeight: 28 // default is 25–32 depending on theme
    
    };
    rowData: any;
   columnDefs: any;
    pageSize = 5; // default
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentPage = 1;
  totalPages = 1;
  private gridApi!: GridApi;
   defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    minWidth: 150,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    tooltipComponentParams: { color: '#1976d2' }
  };
}