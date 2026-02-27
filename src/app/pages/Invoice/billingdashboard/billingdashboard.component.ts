
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
import * as XLSX from 'xlsx';

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

@Component({
  selector: 'app-billingdashboard',
  imports: [MatPaginatorModule, CommonModule,AgGridAngular, UserComponent, MatTableModule, MatCardModule, MatTooltipModule, MatCheckboxModule],
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


  // AG grid

  public gridOptions: GridOptions = {
    theme: 'legacy',
    suppressHorizontalScroll: false,
    domLayout: 'normal',
    rowHeight: 35,

    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    animateRows: true,
    pagination: true,
    rowMultiSelectWithClick: true,
    enableBrowserTooltips: false
  };

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    minWidth: 80,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    filterParams: {
      textMatcher: ({ value, filterText }) => {
        if (!filterText) return true;

        // convert cell value safely to string
        const cellValue = value != null
          ? value.toString().toLowerCase()
          : '';

        // split by comma
        const searchTerms = filterText
          .split(',')
          .map(term => term.trim().toLowerCase())
          .filter(term => term); // remove empty

        // OR condition (match any)
        return searchTerms.some(term =>
          cellValue.includes(term)
        );
      }
    },
    tooltipValueGetter: (params: any) =>
      params.value != null ? params.value.toString() : '',

    tooltipComponentParams: {
      tooltipClass: 'ag-tooltip'
    }
  };

  BillingDasData: any;
  //columnDefs: any;

  pageSize = 5; // default
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentPage = 1;
  totalPages = 1;

  columnDefs: ColDef[] = [
  {
    colId: 'edit',
    headerName: 'Edit',
    width: 25,
    pinned: 'left',
    sortable: false,
    filter: false,
    suppressSizeToFit: true,
    lockPinned: true, // ⭐ prevents user from unpinning

    tooltipValueGetter: () => 'Edit',

    cellRenderer: () => {
      return `<img src="assets/icons/edit.svg"
                   style="cursor:pointer;width:22px;height:22px;" />`;
    },

    onCellClicked: (params: any) => {
      this.EditClick(params.data.req_No, params.data.assignedTo);
    }
  },

  // 🔹 Req_No (static)
  {
    field: 'req_No',
    headerName: 'Req ID',
    pinned: 'left',
    lockPinned: true,
    minWidth: 80
  },

  // 🔹 RequestDatetime (static)
  {
    field: 'requestDatetime',
    headerName: 'Req Date & Time',
    pinned: 'left',
    lockPinned: true,
    minWidth: 80
  },

  // 🔹 Company_Code (static)
  {
    field: 'company_Code',
    headerName: 'Company Code',
    pinned: 'left',
    lockPinned: true,
    minWidth: 120
  },
  // 🔹 Company_Name (static)
  {
    field: 'company_Name',
    headerName: 'Company Name',
    minWidth: 120
  },
  { field: 'lotNo', headerName: 'LOT', minWidth: 120 },

  { field: 'hc', headerName: 'HC', minWidth: 100 },

  {
    field: 'reqUserName',
    headerName: 'Req User Name',
    minWidth: 180
  },

  {
    field: 'assignedTo',
    headerName: 'Assigned To',
    minWidth: 160
  },

  {
    field: 'allocationDatetime',
    headerName: 'Allotted Date & Time',
    minWidth: 200
  },

  {
    field: 'invoice_Created_Date',
    headerName: 'Closed Date & Time',
    minWidth: 200
  }
];


  private gridApi!: GridApi;

  //AG grid

  userList: any;
  AllotedTo?: number;
  InvoiceAlloted: any;
  iseditClicked = false;
  userdetail: any;
  reqNo: string = '';
  user: any;
  selection = new SelectionModel<any>(true, []);
  @ViewChild('InvoiceAlotPaginator') InvoiceAlot_paginator!: MatPaginator;
  constructor(@Inject(DASH_TOKEN) private dashService: IDashBoardServices, @Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }
  displayedInvoiceColumns: string[] = ['edit'
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
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindInvoiceAllot();
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

  BindInvoiceAllot() {
    console.log('BindInvoiceAllot');
    console.log(this.userdetail)

    const loggedInUser = this.userdetail.user_Id === 263 ? 0 : this.userdetail.user_Id;
    console.log(loggedInUser)
    this._invoiceService.BillingDashboard(loggedInUser).subscribe({
      next: res => {
        console.log(res.Data);
        this.BillingDasData = Array.isArray(res.Data) ? res.Data : [];
        this.InvoiceAlloted = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        this.InvoiceAlloted.paginator = this.InvoiceAlot_paginator;
      },
      error: err => { }
    });
  }

   //AG grid
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.updatePaginationInfo();
  }

  onPaginationChanged(event: PaginationChangedEvent) {
    this.updatePaginationInfo();
  }

  updatePaginationInfo() {
    if (!this.gridApi) return;
    this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    this.totalPages = this.gridApi.paginationGetTotalPages();
  }

  //AG Grid


  handleuserEvent(user: any) {
    this.user = user;
    console.log(this.user);
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
}
