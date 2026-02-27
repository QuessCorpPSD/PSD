import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { OtherincomeService } from '../../../Service/Process/otherincome.service';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';


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
  selector: 'app-otherincome',
  standalone: true,
  imports: [ AgGridAngular, MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, MatTooltipModule, PayPeriodComponent, AlertpopupComponent],
  templateUrl: './otherincome.component.html',
  styleUrl: './otherincome.component.css'
})
export class OtherincomeComponent {

  // AG grid

  public gridOptions: GridOptions = {
    theme: 'legacy',
    suppressHorizontalScroll: false,
    domLayout: 'normal',
    rowHeight: 46,
    headerHeight: 48,

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
    minWidth: 150,
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

  OtherIncomeData: any[] = [];
  //columnDefs: any;

  pageSize = 5; // default
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentPage = 1;
  totalPages = 1;

  columnDefs: ColDef[] = [

    // ✅ Action (Delete)
    {
      colId: 'Action',
      headerName: 'Action',
      width: 90,
      minWidth: 80,
      maxWidth: 100,
      pinned: 'left',
      sortable: false,
      filter: false,
      suppressSizeToFit: true,
      lockPinned: true,
      tooltipValueGetter: () => 'Delete',

      cellRenderer: () =>
        `<button class="ag-btn-delete">
         <span class="material-icons">delete</span>
       </button>`,

      onCellClicked: (params: any) => {
        this.deleteClick(params.data);
      }
    },

    // ✅ SNo (auto index)
    {
      headerName: 'SNo',
      width: 80,
      minWidth: 70,
      maxWidth: 90,
      pinned: 'left',
      valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
      sortable: false,
      filter: false
    },

    // ✅ Company Code
    {
      field: 'Company_Code',
      headerName: 'Company Code',
      width: 150,
      filter: 'agTextColumnFilter'
    },

    // ✅ Employee Code
    {
      field: 'Employee_Code',
      headerName: 'Employee Code',
      width: 150,
      filter: 'agTextColumnFilter'
    },

    // ✅ Employee Name
    {
      field: 'Employee_Name',
      headerName: 'Employee Name',
      width: 180,
      filter: 'agTextColumnFilter'
    },

    // ✅ Band Name
    {
      field: 'Band_name',
      headerName: 'Band Name',
      width: 140,
      filter: 'agTextColumnFilter'
    },

    // ✅ Gender
    {
      field: 'Gender',
      headerName: 'Gender',
      width: 110,
      filter: 'agTextColumnFilter'
    },

    // ✅ Incentive Pay Period
    {
      field: 'Increment_Pay_Period',
      headerName: 'Incentive Pay Period',
      width: 190,
      filter: 'agTextColumnFilter'
    },

    // ✅ Pay Period
    {
      field: 'Pay_Period',
      headerName: 'Pay Period',
      width: 140,
      filter: 'agTextColumnFilter'
    }
  ];

  private gridApi!: GridApi;

  //AG grid

  selectedCompanyId: any;
  selectedCompanyCode: any;
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  itadjust: any;
  itadjusts: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedcompanycode: any;
  payperiodId: any;
  payperiods: string = '';
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  filteredRows: any[] = [];
  paginatedData: any[] = [];

  // pageSize = 10;
  // currentPage = 0;
  isUploadGridVisible = false;

  constructor(private dialog: MatDialog, private decry: EncryptionService, private service: OtherincomeService,
    private _sessionStoreage: SessionStorageService) { }

  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'CompanyCode', 'Employee Code', 'Employee Name', 'Band Name', 'Gender', 'Incentive Pay Period', 'Pay Period'
  ];


  uploadedData: any[] = [];

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild('paginator') paginator!: MatPaginator;

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  // Method to close popup
  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;

  }


  // AddPOOpen() {
  //   this.dialog.open(OtherincomeAddComponent, {
  //     width: '83%',
  //     height: '81vh',
  //     disableClose: true,
  //     data: { example: 'Hello from parent!' }
  //   });
  // }


  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    if (!this.payperiodId) {
      alert('Please Select Payperiod');
      return;
    }
    this.isLoading = true;


    this.isUploadGridVisible = true;

    const payload = {
      Company_id: this.selectedCompanyId?.toString() ?? '',
      Pay_Frequency_Id: this.payperiodId?.toString() ?? ''
    };

    this.service.Search(payload).subscribe({
      next: (res) => {
        this.isLoading = true;
        this.itadjusts = res.Data.data?.Table0 ?? [];
        this.itadjust = res.Data.message;

        if (!this.itadjusts || this.itadjusts.length === 0) {
          alert(this.itadjust);
          this.dataSource.data = [];
          this.isLoading = false;
        }

        this.OtherIncomeData = this.itadjusts; 
        this.dataSource = new MatTableDataSource(this.itadjusts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.uploadDisplayedColumns = [
          'Action', 'SNo', 'CompanyCode', 'Employee Code', 'Employee Name', 'Band Name', 'Gender', 'Incentive Pay Period', 'Pay Period'
        ];

      },

      error: (err) => {
        this.isLoading = false;
        console.error('Error loading itadjusts release data', err);
      },

    });

  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.payPeriodType = "All";

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


  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChange(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);


    this.service.Upload(formData).subscribe({
      next: (res) => {
        this.isLoading = true;


        // ✅ handle case when Data is null
        if (!res || !res.Data) {
          alert('Upload request processed. Server did not return any data.');
          this.isLoading = false;

          return;
        }


        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;

          return;
        }

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Row(s) Uploaded Successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;


          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          this.isLoading = true;

          alert('Failed to import');
          const rawErr = res?.Data?.errors?.[0];
          let errorArray: any[] = [];
          try {
            if (typeof rawErr === 'string') {
              const tryJson = JSON.parse(rawErr);
              errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }
          } catch {
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || item?.Validation || ''
          }));


          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_otherincome.xlsx');
          this.isLoading = false;

          return;
        }

        // ✅ Fallback if no specific case matched
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          // ⚙️ Handle case where API returns message but no data (your current case)
          if (res?.Message) {
            alert(`ℹ️ ${res.Message}`);
          } else {
            alert('Error while processing response.');
          }
        }

      },
      error: (err) => {
        this.isLoading = false;

        console.error('❌ Upload failed', err);
        alert('Upload failed due to a network or server error.');
      }
    });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }

  DownloadTemplate() {
    this.isLoading = true;
    // STATIC TEMPLATE HEADERS
    const templateData = [
      {
        Company_Code: "",
        Employee_Code: "",
        PayPeriod: "",
        Incentive_Paid_PayPeriod: "",
        Pay_Code: "",
        Remarks: "",
        Input_No: "",
        Amount: "",
        Map_Name: "",
        Other_Deduction: "",
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'otherincome': worksheet },
      SheetNames: ['otherincome']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    alert('downloaded successfully')
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `otherincome_Template_${Date.now()}.xlsx`);
    this.isLoading = false;
  }
  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredRows.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }
  deleteClick(row: any) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const id = row.Other_Income_Id;
    const userid = this.userdetail.user_Id;

    this.isLoading = true;

    this.service.Delete(id, userid).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res.Data.message;
        if (res?.StatusCode === 200 && msg.toLowercase().includes('success')) {
          alert(msg);

          this.onsearch();
        } else {
          alert(msg);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Server error while deleting");
      }
    });
  }



}
