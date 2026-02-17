import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Invoicecancelgrid } from '../../../Models/Invoicecancelgrid';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { finalize } from 'rxjs';

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
  selector: 'invoicecancel',
  standalone: true,
  imports: [
    AgGridAngular,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatDialogModule,
    CompanyallComponent,
    PayPeriodComponent,
    AlertpopupComponent

  ],
  templateUrl: './invoicecancel.component.html',
  styleUrls: ['./invoicecancel.component.css']
})
export class InvoiceCancelComponent implements OnInit, AfterViewInit {


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
    tooltipValueGetter: (params: any) =>
      params.value != null ? params.value.toString() : '',

    tooltipComponentParams: {
      tooltipClass: 'ag-tooltip'
    }
  };

  InvoiceCancelData: any[] = [];
  //columnDefs: any;

  pageSize = 5; // default
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentPage = 1;
  totalPages = 1;

  columnDefs: ColDef[] = [

    // ✅ SELECT
    {
      colId: 'select',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: () => true,
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      pinned: 'left',
      sortable: false,
      filter: false
    },

    // ✅ PDF DOWNLOAD
    {
      colId: 'pdfdownload',
      headerName: 'Invoice Pdf',
      width: 45,
      pinned: 'left',
      sortable: false,
      filter: false,
      suppressSizeToFit: true,
      tooltipValueGetter: () => 'Pdf Download',

      cellRenderer: () =>
        `<img src="assets/download_enabled.svg"
             style="cursor:pointer;width:18px;height:18px;" />`,

      onCellClicked: (params: any) => {
        this.DownloadInvoice(
          params.data.invoice_Id,
          params.data.invoice_Number
        );
      }
    },

    // ✅ CANCEL DOC
    {
      colId: 'docDownload',
      headerName: 'Cancel Doc',
      width: 45,
      pinned: 'left',
      sortable: false,
      filter: false,

      cellRenderer: (params: any) => {
        const hasFile = !!params.data?.filePath;

        const icon = hasFile
          ? 'assets/icons/download_enabled_green.svg'
          : 'assets/icons/download_disabled.svg';

        const cursor = hasFile ? 'pointer' : 'not-allowed';

        return `<img src="${icon}"
                   style="cursor:${cursor};width:18px;height:18px;" />`;
      }
    },

    // ================= DATA =================

    {
      field: 'invoice_Number',
      headerName: 'Invoice Number',
      width: 150,
      filter: 'agTextColumnFilter',
      pinned: 'left',
    },

    {
      field: 'invoice_Date',
      headerName: 'Invoice Date',
      width: 150,
      filter: 'agDateColumnFilter',
      pinned: 'left',
      valueFormatter: (p: any) =>
        p.value ? new Date(p.value).toLocaleDateString('en-GB') : ''
    },

    {
      field: 'map_Name',
      headerName: 'Map Name',
      width: 130,
      filter: 'agTextColumnFilter'
    },

    {
      field: 'state_Name',
      headerName: 'State Name',
      width: 130,
      filter: 'agTextColumnFilter'
    },

    {
      field: 'invoiceType',
      headerName: 'Invoice Type',
      width: 130
    },

    { field: 'cgsT_Amount', headerName: 'CGST (₹)', width: 110 },
    { field: 'sgsT_Amount', headerName: 'SGST (₹)', width: 110 },
    { field: 'igsT_Amount', headerName: 'IGST (₹)', width: 110 },

    {
      field: 'net_Amount',
      headerName: 'Net Amount',
      width: 130,
      filter: 'agNumberColumnFilter'
    },

    {
      field: 'creditNote_Status',
      headerName: 'Credit Note Status',
      width: 170,
      filter: 'agTextColumnFilter'
    },

    {
      field: 'creditNoteNumber',
      headerName: 'Credit Note',
      width: 150,
      filter: 'agTextColumnFilter'
    },

    {
      field: 'cancelledOn',
      headerName: 'Cancelled Date',
      width: 150,
      valueFormatter: (p: any) =>
        p.value ? new Date(p.value).toLocaleDateString('en-GB') : ''
    }
  ];


  private gridApi!: GridApi;

  //AG grid

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  dataSource = new MatTableDataSource<Invoicecancelgrid>([]);
  dialogRef!: MatDialogRef<any>;

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType: string = "All";
  isdisabled: boolean = false;
  issearch: boolean = false;
  isLoading: boolean = false;
  remarks: string = '';
  userdetail: any;
  showPopup: boolean = false;
  popupMessage: string = "";
  popupSubMessage: string = "";
  showRemarksPopup = false;
  remarkText?: string;

  displayedColumns: string[] = ['select'
    , 'pdfdownload', 'docDownload', 'invoice_Number', 'invoice_Date', 'map_Name', 'state_Name', 'invoiceType', 'cgsT_Amount', 'sgsT_Amount', 'igsT_Amount', 'net_Amount', 'creditNote_Status', 'creditNoteNumber', 'cancelledOn'];
  filterDisplayedColumns: string[] = [...this.displayedColumns];
  columnFilters: { [key: string]: string } = {};
  selection = new SelectionModel<Invoicecancelgrid>(true, []);

  constructor(
    private _invoiceService: InvoiceRepository,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private dialog: MatDialog
  ) { }
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id
      )
    );
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filters = JSON.parse(filter);

      return Object.keys(filters).every(column => {
        if (!filters[column]) return true;

        const value = data[column];
        if (!value) return false;

        return value
          .toString()
          .toLowerCase()
          .includes(filters[column]);
      });
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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


  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }

  applyFilter(event: Event, column: string) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.columnFilters[column] = value;
    this.dataSource.filter = JSON.stringify(this.columnFilters);
  }
  applyDateFilter(event: Event, column: string) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.columnFilters[column] = value;
    this.dataSource.filter = JSON.stringify(this.columnFilters);
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
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  toggleRow(row: Invoicecancelgrid) {
    this.selection.toggle(row);
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.editDialog, { width: '400px' });
  }

  CloseCancelPopup(): void {
    this.showRemarksPopup = false;
    this.remarkText = '';
  }


  invoiceApprove() {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);

    if (!selectedInvoiceIds.length) {
      alert('Please select at least one invoice ❌');
      this.isLoading = false;
      return;
    }

    if (!confirm(`You have selected ${selectedInvoiceIds.length} invoice(s). Do you want to approve them?`)) {
      this.isLoading = false;
      return;
    }

    const payload = {
      invoice_Id: selectedInvoiceIds,
      remarks: this.remarkText
    };

    this._invoiceService.BulkApproveInvoice(payload).subscribe({
      next: (res: any) => {
        if (res.Data[0].Status === "SUCCESS") {
          this.popupMessage = 'Cancel Request Approved successfully';
          this.showPopup = true;
          const isSuccess =
            res?.status === 'SUCCESS' ||
            res?.statusCode === 200;

          if (isSuccess) {
            this.selection.clear();
            if (this.paginator) {
              this.paginator.firstPage();
            }
            this.InvoiceSearch();
          }

          this.isLoading = false;
        }
        else {
          this.popupMessage = 'Cancel Request Failed';
          this.popupSubMessage = 'Note:' + res.Data[0].Error_Message;
          this.showPopup = true;
          this.isLoading = false;
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Something went wrong ❌');
        this.isLoading = false;
      }
    });
  }

  invoiceReject() {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);

    if (!selectedInvoiceIds.length) {
      alert('Please select at least one invoice');
      this.isLoading = false;
      return;
    }
    console.log(this.remarkText);
    if (!this.remarkText || this.remarkText == "") {
      alert("Remarks Mandatory for Reject");
      this.isLoading = false;
      return;
    }

    if (!confirm(`You have selected ${selectedInvoiceIds.length} invoice(s). Do you want to Reject them?`)) {
      this.isLoading = false;
      return;
    }

    const payload = {
      invoice_Id: selectedInvoiceIds,
      remarks: this.remarkText
    };
    console.log('Reject Payload', payload);
    this._invoiceService.BulkRejectCancelRequest(payload).subscribe({
      next: (res: any) => {
        if (res.Data[0].Status === "SUCCESS") {
          this.popupMessage = 'Cancel Request Rejected successfully';
          this.showPopup = true;
          const isSuccess =
            res?.status === 'SUCCESS' ||
            res?.statusCode === 200;

          if (isSuccess) {
            this.selection.clear();
            if (this.paginator) {
              this.paginator.firstPage();
            }
            this.InvoiceSearch();
          }

          this.isLoading = false;
        }
        else {
          this.popupMessage = 'Cancel Request Rejection Failed';
          this.popupSubMessage = 'Note:' + res.Data[0].Error_Message;
          this.showPopup = true;
          this.isLoading = false;
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Something went wrong ❌');
        this.isLoading = false;
      }
    });
  }

  InvoiceSearch() {
    if (!this.selectedCompanyId || !this.payPeriod) {
      alert('Select Company and Pay Period');
      return;
    }

    this.isLoading = true;

    const request = {
      Company_Id: this.selectedCompanyId,
      PayPeriod_Id: this.payPeriod.payfrequencyid
    };

    this._invoiceService.GetAllInvoiceCancelDetails(request).subscribe({
      next: (res: any) => {
        const apiData = Array.isArray(res?.Data?.data) ? res.Data.data : [];
        console.log(apiData);
        this.dataSource.data = apiData.map((item: any) => ({
          ...item,
          invoice_Number:
            item.invoice_Number ||
            item.invoiceNumber ||
            item.InvoiceNumber
        }));

        this.InvoiceCancelData = apiData.map((item: any) => ({
          ...item,
          invoice_Number:
            item.invoice_Number ||
            item.invoiceNumber ||
            item.InvoiceNumber
        }));

        // ✅ Always reassign paginator after data load
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  Invoiceintiate() {
    if (!this.selection.selected.length) {
      alert("Please select at least one row");
      return;
    }

    this.isdisabled = true;
    this.isLoading = true;

    const request = {
      invoiceInitiations: this.selection.selected,
      TaxTypeId: 0,
      CreatedBy: this.userdetail.user_Id
    };

    this._invoiceService.InvoiceInitiate(request).subscribe({
      next: (res) => {
        alert(res.Data.error_Message);
        this.selection.clear();
        this.isdisabled = false;
        this.isLoading = false;
        this.dialogRef.close();
      },
      error: (err) => {
        console.error(err);
        this.isdisabled = false;
        this.isLoading = false;
      }
    });
  }

  DownloadInvoice(invoiceId: number, invoice_Number: string) {
    this.isLoading = true;
    this._invoiceService.DownloadInvoice(invoiceId).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = invoice_Number + '.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) fileName = match[1];
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });
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
    const filteredSelected = this.selection.selected.filter(item =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);
    if (!selectedInvoiceIds.length) {
      alert("No invoices selected");
      this.isLoading = false;
      return;
    }

    const BulkInvoices = { invoiceIds: selectedInvoiceIds };

    this._invoiceService.BulkDownloadInvoice(BulkInvoices).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'invoices.zip';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) fileName = match[1];
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }

  Downloadfile(invoice_Id: number) {
    if (!invoice_Id) return;

    this.isLoading = true;

    this._invoiceService.GetUploadedFile(invoice_Id)
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
            alert("File Path not found!");
          }
        },
        error: error => {
          console.error('Error:', error);
        }
      });
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    // this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
    this.isLoading = false;
  }

}
