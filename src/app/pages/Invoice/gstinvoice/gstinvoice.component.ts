import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { GstInvoiceGrid } from '../../../Models/GSTInvoiceGrid';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GstinvoiceaddComponent } from '../gstinvoiceadd/gstinvoiceadd.component';
import { RejectGstInvoiceComponent } from '../reject-gst-invoice/reject-gst-invoice.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { DialogRef } from '@angular/cdk/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


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

export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');

@Component({
  selector: 'gstinvoice',
  standalone: true,
  imports: [CommonModule,MatButtonModule,AgGridAngular, MatTableModule, MatTooltipModule, MatIconModule, MatCheckboxModule, MatPaginatorModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './gstinvoice.component.html',
  styleUrl: './gstinvoice.component.css',
  providers: [{
    provide: Invoice_TOKEN,
    useClass: InvoiceRepository
  }]
})

export class GstinvoiceComponent {


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

  GSTinvoiceData: any;
  //columnDefs: any;

  pageSize = 5; // default
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentPage = 1;
  totalPages = 1;

  columnDefs: ColDef[] = [

    // ✅ checkbox (very small)
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 45,
      maxWidth: 45,
      minWidth: 45,
      pinned: 'left',
      sortable: false,
      filter: false,
      suppressSizeToFit: true
    },

    // ✅ edit (small)
    {
      headerName: 'Edit',
      width: 60,
      maxWidth: 60,
      minWidth: 60,
      pinned: 'left',
      sortable: false,
      filter: false,
      suppressSizeToFit: true,
      cellRenderer: (params: any) => {
        const disabled = this.isEditDisabled(params.data);
        return `<span style="
                cursor:${disabled ? 'not-allowed' : 'pointer'};
                opacity:${disabled ? 0.5 : 1};
                color:#1976d2;
                font-size:15px;
              ">✏️</span>`;
      },
      onCellClicked: (params: any) => {
        if (!this.isEditDisabled(params.data)) {
          this.editInvoice(params.data.invoice_Id);
        }
      }
    },

    // ✅ pdf (small)
    {
      headerName: '',
      width: 60,
      maxWidth: 60,
      minWidth: 60,
      pinned: 'left',
      sortable: false,
      filter: false,
      suppressSizeToFit: true,
      cellRenderer: () => {
        return `<img src="assets/download_enabled.svg"
                   style="cursor:pointer;width:24px;height:24px;" />`;
      },
      onCellClicked: (params: any) => {
        this.DownloadInvoice(
          params.data.invoice_Id,
          params.data.invoice_Number
        );
      }
    },
    {
      field: 'invoice_Number',
      headerName: 'Invoice Number',
      pinned: 'left',
      minWidth: 160,
      suppressSizeToFit: false
    },

    // ✅ remaining scrollable columns
    { field: 'irN_Status', headerName: 'IRN Status', minWidth: 150 },

    {
      field: 'invoice_Date',
      headerName: 'Invoice Date',
      filter: 'agDateColumnFilter',
      minWidth: 150,
      valueFormatter: (p: any) =>
        p.value ? new Date(p.value).toLocaleDateString('en-GB') : ''
    },

    { field: 'company_Code', headerName: 'Company Code', minWidth: 150 },
    { field: 'pay_Period', headerName: 'Pay Period', minWidth: 150 },
    { field: 'map_Name', headerName: 'Map Name', minWidth: 160 },
    { field: 'group_Name', headerName: 'Group Name', minWidth: 160 },
    { field: 'invoiceType', headerName: 'Invoice Type', minWidth: 150 },

    {
      field: 'net_Amount',
      headerName: 'Net Amount',
      filter: 'agNumberColumnFilter',
      minWidth: 150
    },

    { field: 'status', headerName: 'Status', minWidth: 130 },
    { field: 'Irn_Number', headerName: 'IRN Number', minWidth: 180 },
    { field: 'sap_Invoice_Number', headerName: 'SAP Invoice No', minWidth: 180 },
    { field: 'sap_Account_Number', headerName: 'SAP Account No', minWidth: 180 },
    { field: 'crn_Number', headerName: 'CRN Number', minWidth: 160 },
    { field: 'crn_IRN_Status', headerName: 'CRN IRN Status', minWidth: 170 },
    { field: 'crn_IRN_Number', headerName: 'CRN IRN Number', minWidth: 170 },
    { field: 'sap_Cancel_Document', headerName: 'SAP Cancel DOC No', minWidth: 200 },
    { field: 'sap_Credit_Note_Document', headerName: 'SAP Credit Note No', minWidth: 210 }
  ];

  private gridApi!: GridApi;

  //AG grid

  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<GstInvoiceGrid>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedTemplate: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;

  displayedColumns: string[] = [
    'select'
    , 'edit'
    , 'pdfdownload'
    , 'invoice_Number'
    , 'irN_Status'
    , 'invoice_Date'
    , 'company_Code'
    , 'pay_Period'
    , 'map_Name'
    , 'group_Name'
    , 'invoiceType'
    , 'net_Amount'
    , 'status'
    , 'Irn_Number'
    , 'sap_Invoice_Number'
    , 'sap_Account_Number'
    , 'crn_Number'
    , 'crn_IRN_Status'
    , 'crn_IRN_Number'
    , 'sap_Cancel_Document'
    , 'sap_Credit_Note_Document'
  ];

  filterDisplayedColumns: string[] = [
    'filterselect'
    , 'filteredit'
    , 'filterpdfdownload'
    , 'filterinvoice_Number'
    , 'filterirn_Status'

    , 'filterinvoice_Date'
    , 'filtercompany_Code'
    , 'filterpay_Period'
    , 'filtermap_Name'
    , 'filtergroup_Name'
    , 'filterinvoiceType'
    , 'filternet_Amount'
    , 'filterstatus'
    , 'filterIrn_Number'
    , 'filtersap_Invoice_Number'
    , 'filtersap_Account_Number'
    , 'filtercrn_Number'
    , 'filtercrn_IRN_Status'
    , 'filtercrn_IRN_Number'
    , 'filtersap_Cancel_Document'
    , 'filtersap_Credit_Note_Document'
  ]

  TemplateOptions = [
    { value: 'reject', Text: 'Reject' },
    { value: 'cancel', Text: 'Cancel' },
    { value: 'clear', Text: 'Clear' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService, private dialog: MatDialog,) {
  }

  selection = new SelectionModel<GstInvoiceGrid>(true, []);

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id
      )
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
    }
  }

  toggleRow(row: GstInvoiceGrid) {
    this.selection.toggle(row);
  }

  templateDataMap: { [key: string]: any[] } = {
    reject: [
      { 'Invoice Number': '', 'Discrepancy By': '', 'Discrepancy': '' },
    ],
    cancel: [
      { 'Invoice Number': '', 'Remarks': '', 'New Invoice Number': '' },
    ]
  };

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindDashBoard(this.userdetail.user_Id);
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

  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data[column]?.toString().toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
  }

  BindDashBoard(userId: number) {
    this._invoiceService.GetGSTInvoice(userId).subscribe({
      next: res => {
        console.log(res);
        // this.dataSource = new MatTableDataSource<any>(res.Data);
        this.GSTinvoiceData = res.Data;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        // this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'GstInvoice': worksheet },
      SheetNames: ['GstInvoice']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  TemplateClick(): void {
    const dataToExport = [
      { 'Invoice_Number': '', 'Remarks': '', 'NewInvoiceNumber': '' },
    ]
    this.downloadExcel(dataToExport, "Template_" + this.selectedTemplate);
  }

  onCancelClick(fileInput2: HTMLInputElement): void {
    this.isLoading = true;
    fileInput2.click();
  }

  onFileChange2(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const top100 = jsonData.slice(0, 100);
        this.excelPreviewData = top100;  // 🔹 Store for popup preview
        this.showPreviewModal = true;     // 🔹 Trigger modal
        this.showSearchGrid = false;     // 🔹 Trigger modal
        this.isLoading = false;
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsBinaryString(file);
  }

  submitExcelData(): void {
    this.showPreviewModal = false;
    this.isLoading = true;
    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('userId', this.userdetail.user_Id);

      this._invoiceService.UploadCancel(formData).subscribe({
        next: (res: string) => {
          const error_msg = res;
          console.table(error_msg);
          if (error_msg) {
            alert(error_msg);
            this.BindDashBoard(this.userdetail.user_Id);
            this.isLoading = false;
          } else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('❌ Upload failed', err);
          this.isLoading = false;
        }
      });
    }
    else {
      console.error('No Data');
      this.isLoading = false;
    }
  }

  onFileDownload() {
  }
  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
  }
  DownloadInvoice(invoiceId: number, invoice_Number: string) {
    this.isLoading = true;
    this._invoiceService.DownloadInvoice(invoiceId).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'Invoices.zip';

      // Extract file name from header
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) {
          fileName = match[1];
        }
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });

      // Create link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }
  BulkDownload() {
    this.isLoading = true;
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);
    if (!selectedInvoiceIds.length) {
      alert("No invoices selected");
      return;
    }
    const BulkInvoices = {
      invoiceIds: selectedInvoiceIds
    }
    this._invoiceService.BulkDownloadInvoice(BulkInvoices).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'invoices.zip';

      // Extract file name from header
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) {
          fileName = match[1];
        }
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });

      // Create link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }

  applyDateFilter(event: any, column: string) {
    const filterValue = event.target.value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;

      const rowDate = new Date(data[column]);
      if (isNaN(rowDate.getTime())) return false;

      // Convert row date → dd MMM yyyy
      const formattedRowDate = rowDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(',', '').toLowerCase();

      return formattedRowDate.includes(filter);
    };

    this.dataSource.filter = filterValue;
  };

  AddGstInvoice() {
    this.dialog.open(GstinvoiceaddComponent, {
      width: '95%',
      height: '90vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
  openRejectPage(): void {
    this.dialog.open(RejectGstInvoiceComponent, {
      width: '95%',
      height: '90vh',
      disableClose: true,
      hasBackdrop: true,
      data: { example: 'Hello from parent!' }
    });
  }
  editInvoice(invoiceId: number) {
    this.dialog.open(GstinvoiceaddComponent, {
      width: '95%',
      height: '90vh',
      disableClose: true,
      data: {
        mode: 'edit',
        invoiceId: invoiceId
      }
    });
  }
  isEditDisabled(element: any): boolean {
    return element.irN_Status?.toLowerCase() !== 'pending';
  }
}


