import { Component, InjectionToken, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';

import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';
import { MatCardModule } from '@angular/material/card';
import { ICreditNoteUpdate } from '../../../../Repository/BankInvoice/BankInvoiceRepository/IcreditNoteUpdate';
import { CreditNoteUpdateService } from '../../../../Service/BankInvoice/BankInvoiceService/credit-note-update.service';


export const Common_TOKEN = new InjectionToken<ICreditNoteUpdate>('Common_TOKEN');

@Component({
  selector: 'app-credit-note-update',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    CompanyallComponent,
    MatTooltipModule,
    MatCardModule,
    MatCheckboxModule],
  templateUrl: './credit-note-update.component.html',
  styleUrl: './credit-note-update.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: CreditNoteUpdateService }
  ],
})
export class CreditNoteUpdateComponent {
  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  isLoading: boolean = false;
  excelFile: File | null = null;
  userdetail: any;
  datatable: any;
  companyUI: any;
  CreditNotePurpose: any;
  Credit_Note_Type: string = "";
  Ref_id: string = "";
  isPayPeriod = false;
  isRefId = false;
  payPeriodType: string = "All";
  PayPeriodUI: any;
  startDate: any;
  endDate: any;
  showTable = false;
  isEditPopupOpen = false;
  selectedRow: any;
  popupTableData: any[] = [];

  popupDisplayedColumns: string[] = [
    'Employee_Code',
    'Reference_Number',
    'Credit_Note_Amount',
    'Credit_Note_Date'
  ];

  creditNoteStatus: any;
  sapReferenceNo: string = '';




  displayedColumns: string[] = [
    "edit",
    "select",
    "CompanyCode",
    "CompanyName",
    "CreditNoteNumber",
    "CreditNoteAmount",
    "AdjustedAmount",
    "BalanceAmount",
    "BaseAmount",
    "GstAmount",
    "Status",
    "CreditNoteType",
    "SapReferenceNumber",
    "ReferenceNumber",
    "InvoiceNumber",
    "SACCode",
    "IRNStatus",
    "IRNNumber",
    "DBNRNStatus",
    "DBNIRNNumber",
    "CRNPDF",
    "DBN_PDF"
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(

    private creditService: CreditNoteUpdateService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.PayPeriodUI = {
      payPeriod: "",
      paySequenceNo: "",
      payfrequencyid: 0
    }
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;
  }

  selection = new SelectionModel<any>(true, []);

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.creditNote_Id === sel.creditNote_Id
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

  toggleRow(row: any) {
    this.selection.toggle(row);
  }


  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.companyUI = event.company;
    // this.BindPurpose(this.comapnyId);
  }

  handlePayperiodEvent(payperiod: any) {
    this.PayPeriodUI = payperiod;
  }


  formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

  SearchClick() {

    this.isLoading = true;
    this.showTable = false;

    if (!this.comapnyId) {
      alert('Please Select Company');
      this.isLoading = false;
      return;
    }
    this.showTable = true;

    const companyId = this.comapnyId || 0;
    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    this.creditService.CreditnoteSearch(companyId, fromDate, toDate).subscribe({
      next: (res) => {

        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        const result = res?.Data?.data?.Table0 ?? [];

        if (result.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }


        this.dataSource = new MatTableDataSource(result);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


        this.displayedColumns = [
          "edit",
          "select",
          "CompanyCode",
          "CompanyName",
          "CreditNoteNumber",
          "CreditNoteAmount",
          "AdjustedAmount",
          "BalanceAmount",
          "BaseAmount",
          "GstAmount",
          "Status",
          "CreditNoteType",
          "SapReferenceNumber",
          "ReferenceNumber",
          "InvoiceNumber",
          "SACCode",
          "IRNStatus",
          "IRNNumber",
          "DBNRNStatus",
          "DBNIRNNumber",
          "CRNPDF",
          "DBN_PDF"
        ];

        this.showTable = true;

        this.isLoading = false;
      },

      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.showTable = false;
        this.isLoading = false;
      }
    });
  }



  exportToExcel(): void {
    if (!this.comapnyId) {
      alert('Please Select Company');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    const payload = {
      companyId: (this.comapnyId).toString(),
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate)
    };
    this.creditService.CreditNoteExport(payload).subscribe({
      next: (res) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || jsonData.length === 0) {
          alert("No data available");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "CreditNoteUpdate");

        const date = new Date().toISOString().split('T')[0];
        const fileName = `CreditNoteUpdate_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },
      error: (err) => {
        this.isLoading = false;
        alert("Export failed");
        console.error(err);
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload one Excel file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', String(this.userdetail.user_Id));

    this.creditService.ImportCreditNoteCancel(formData).subscribe({
      next: (res) => {

        const response = res?.Data?.response;
        const statusCode = res?.StatusCode;
        const errors = res?.Data?.errors;

        if (!res || !res.Data) {
          alert('Server did not return any data.');
          this.isLoading = false;
          return;
        }

        // ✅ SUCCESS (no errors present)
        if (
          statusCode === 200 &&
          response?.toLowerCase().includes('success') &&
          (!errors || errors.length === 0)
        ) {
          alert(response); // 🔥 backend message
          this.isLoading = false;
          return;
        }

        // ❌ ERROR CASE (WITH ERROR FILE)
        if (errors && errors.length > 0) {

          let errorArray: any[] = [];

          try {
            const rawErr = errors[0];

            if (typeof rawErr === 'string') {
              errorArray = JSON.parse(rawErr);
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }

          } catch {
            errorArray = [{ Error_Message: 'Error parsing server response' }];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item?.Error_Message ||
              item?.Message ||
              item?.message ||
              item || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'CreditNoteCancel_Errors.xlsx');

          alert(response || 'Upload completed with errors');
          this.isLoading = false;
          return;
        }

        // ⚠️ FALLBACK
        if (response) {
          alert(response);
        } else {
          alert('Error while processing response.');
        }

        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        alert('Upload Failed');
        this.isLoading = false;
      }
    });
  }



  BulkDownloadCreditNotes(type: string) {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    if (!filteredSelected.length) {
      alert("No records selected");
      this.isLoading = false;
      return;
    }

    const payload = {
      pdfType: type,
      items: filteredSelected.map((row: any) => ({
        creditNoteId: row.CreditNote_Id,
        companyId: row.Company_Id,
        invoiceNumber: row.Invoice_Number,
        invoiceId: row.Invoice_Id
      }))
    };

    this.creditService.BulkDownloadCreditNote(payload).subscribe({
      next: (response) => {

        const blob = new Blob([response.body!], { type: 'application/zip' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = type + "_BulkDownload.zip";
        a.click();

        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert("Bulk Download Failed");
      }
    });
  }

  DownloadCreditNote(creditNoteId: number) {
    this.isLoading = true;

    const BulkInvoices = {
      invoiceIds: [creditNoteId]
    };

    this.creditService.BulkDownloadCreditNote(BulkInvoices)
      .subscribe(response => {

        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'CreditNotes.zip';

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.*?)"?$/);
          if (match && match.length > 1) {
            fileName = match[1];
          }
        }

        const blob = new Blob([response.body!], { type: 'application/zip' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      });
  }


  openEditPopup(row: any) {

    this.selectedRow = row;
    this.isEditPopupOpen = true;

    this.creditNoteStatus = row.Credit_Note_Status;
    this.sapReferenceNo = row.SAPRef_Number;

    this.creditService.GetCreditNoteDetails(row.CreditNote_No)
      .subscribe(res => {

        const data = res?.Data?.data?.Table0 || [];

        this.popupTableData = data.map((x: any) => ({
          CreditNote_Id: x.CreditNote_Id,
          Employee_Code: x.Employee_Code,
          Reference_Number: x.Ref_Id || '',
          Credit_Note_Amount: x.Credit_Note_Amount,

          Credit_Note_Date: this.formatDateForInput(x.Credit_Note_Date)
        }));

      });
  }
  formatDateForInput(dateStr: string): string {

    if (!dateStr) return '';
    if (dateStr.includes('-')) {

      const datePart = dateStr.split(' ')[0];
      const parts = datePart.split('-');

      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        return `${year}-${month}-${day}`;
      }
    }

    if (dateStr.includes('.')) {

      const parts = dateStr.split('.');

      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    return '';
  }
  closeEditPopup() {
    this.isEditPopupOpen = false;
  }

  saveEdit() {
    const payload = {
      Created_By: this.userdetail.user_Id,
      Mode: 'CreditNoteReqEdit',

      CreditNote: {
        CreditNote_No: this.selectedRow.CreditNote_No,
        Credit_Note_Type_Text: this.selectedRow.Credit_Note_Type_Text,
        Invoice_Number: this.selectedRow.Invoice_Number,
        Sap_Reference_Number: this.sapReferenceNo,
        Credit_Note_Status: this.creditNoteStatus
      },

      CreditNoteDetails: this.popupTableData.map((x: any) => ({
        CreditNote_Id: x.CreditNote_Id,
        Employee_Code: x.Employee_Code,
        Ref_Id: x.Reference_Number,
        Credit_Note_Amount: x.Credit_Note_Amount,
        Credit_Note_Dates: this.formatDateForSave(x.Credit_Note_Date)
      }))
    };

    this.creditService.UpdateCreditNote(payload).subscribe(res => {
      alert(res);
      this.closeEditPopup();
      this.SearchClick();
    });
  }

  formatDateForSave(dateStr: string): string {

    if (!dateStr) return '';

    const parts = dateStr.split('-');

    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      return `${year}-${month}-${day}`; // yyyy-MM-dd
    }

    return dateStr;
  }

  DownloadCreditNoteTemplate() {
    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      return;
    }

    const flag = 'CreditNoteCancel';

    this.creditService.GetCreditNoteUpdate(flag, userId).subscribe({
      next: (res: any) => {

        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          return;
        }


        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'CreditNoteCancel': worksheet },
          SheetNames: ['CreditNoteCancel']
        };

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });


        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        FileSaver.saveAs(blob, `Credit_Note_Cancel_Template_${Date.now()}.xlsx`);
      },

      error: (err) => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }
}
