import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';

import { Payperiodclass } from '../../../../Models/Common';
import { PayPeriodComponent } from '../../../../common/payperiod/payperiod.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { InvoicecollectionService } from '../../../../Service/BankInvoice/BankInvoiceService/invoicecollection.service';
import { IInvoiceCollectionService } from '../../../../Repository/BankInvoice/BankInvoiceRepository/InvoiceCollection.service';


export const Pay_Token = new InjectionToken<IInvoiceCollection>('Pay_Token');
export interface IInvoiceCollection {
  select: boolean;
  slNo: number;
  invoiceNo: number | null;
  netInvoiceAmount: number | null;
  invoiceAmount: number | null;
  TDS: number | null;
  TDSAmount: number | null;
  ReceivableAmount: number | null;
  CollectionAmount: number | null;
  roundOff: number | null;
  creditNoteNumber: number | null;
  creditNoteAmount: number | null;
  creditNoteDate: Date | null;
  depositBankName: string | null;
  collectionReceivedDate: Date | null;
  chequeNumber: number | null;
  chequeDate: Date | null;
  remarks: string | null;
}

@Component({
  selector: 'app-invoice-collection',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule,
    // FinancialYearComponent,
    PayPeriodComponent,
    MatCheckboxModule],
  templateUrl: './invoice-collection.component.html',
  styleUrl: './invoice-collection.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: InvoicecollectionService,
    }
  ]
})
export class InvoiceCollectionComponent {
  CompanyId: any;
  CompanyCode: any;
  selectedFinancialYear: any;
  PayPeriodUI: any;
  uploadType: any;
  payPeriodType: string = "All";
  uploadDisplayedColumns: string[] = [
    // 'delete',
    'slNo', 'companyCode', 'companyName', 'payperiod', 'modeOfCollection', 'mapName', 'RefId', 'totalCollectionAmount', 'totalTdsAmount', 'totalDifferenceAmount', 'userName', 'postedDate'

  ];

  uploadedData: any[] = []; // No mock data
  showTable = false;
  companyName: any;
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isAddclicked = false;
  addInvoiceCollection!: FormGroup;
  selectedFYear: any;
  selectedCompanyCode: any;
  selectedCompanyId: any;
  isEditMode = false;
  PayPeriod: any;
  payfrequencyid: any;
  selectedRowSlNo: number | null = null;
  uploadData: IInvoiceCollection[] = [];
  uploadedDataSources = new MatTableDataSource<IInvoiceCollection>(this.uploadData)
  search: any;
  userdetail: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: IInvoiceCollectionService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.addInvoiceCollection = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      PayPeriod: new FormControl('', Validators.required),
      MapName: new FormControl('', Validators.required),
      ReferenceNumber: new FormControl('', Validators.required),
      ModeOfCollection: new FormControl('', Validators.required),
      totalCollectionAmount: new FormControl(''),
      totalTdsAmount: new FormControl(''),
      totalDifferenceAmount: new FormControl(''),
      notes: new FormControl('')
    })
  }

  handleCompany(company) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    this.companyName = company.companyName;
    console.log("company", company)
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.PayPeriodUI = payperiod;
    this.payfrequencyid = payperiod.payfrequencyid
  }

  handlePayperiod(payperiod: Payperiodclass) {
    this.PayPeriod = payperiod;
  }


  onSearch() {
    if (!this.CompanyId || !this.PayPeriodUI) {
      alert('Please select both Company and Pay Period');
      return;
    }
    this.showTable = true;
    const companyId = this.CompanyId;
    const payPeriodId = this.payfrequencyid;
    const invoiceCollectionId = 1;
    const mode = 'search';

    this.service.search(companyId, payPeriodId, invoiceCollectionId, mode).subscribe({

      next: (res) => {
        this.search = res.Data.data.Table0;
        console.log("search", this.search);
        if (this.search && this.search.length > 0) {
          this.dataSource = new MatTableDataSource(this.search);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'slNo', 'companyCode', 'companyName', 'payperiod', 'modeOfCollection', 'mapName', 'RefId', 'totalCollectionAmount', 'totalTdsAmount', 'totalDifferenceAmount', 'userName', 'postedDate']
        } else {
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
        // this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        // this.isLoading = false;
      },
    });
  }


  exportToExcel(): void {
    // this.isLoading = true;
    if (!this.CompanyId || !this.PayPeriodUI) {
      alert('Please select both Company and Pay Period');
      return;
    }
    const companyId = this.CompanyId;
    const payPeriodId = this.payfrequencyid;

    this.service.exportToExcel(companyId, payPeriodId).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and payperiod.');
            // this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Reimbursements');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Reimbursements${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          // this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
        // this.isLoading = false;
      },
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    // this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      // this.isLoading = false;
      alert("Please upload only one Excel file.")
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'excel'); // 🔥 REQUIRED
    formData.append('user', this.userdetail.user_Id?.toString()); // 🔥 FIXED

    this.service.importInvoiceCollection(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          alert("Upload request Processed.Server did not return any data")
          // this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          // this.isLoading = false;
          // this.showAlertPopup("Row(s) Uploaded Successfully.")
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
          // this.isLoading = false;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');
          // this.isLoading = false;
          alert("Failed to Import");
          // errors[0] may be a JSON string, an array, or a plain string/object
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
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_MAINPO.xlsx');
          // this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        // CASE: Data is array with Error_Message (e.g. "No rows to Upload")
        if (Array.isArray(res.Data) && res.Data[0]?.Error_Message) {
          // this.isLoading = false;
          alert(res.Data[0].Error_Message)
          return;
        }

        // CASE 3: Anything else → fallback
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback)
        } else {
          alert('Error while processing response.')
        }

        // this.isLoading = false;

      },
      error: (err) => {
        // this.isLoading = false;
        alert("Upload Failed")
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


  downloadTemplate() {
    const templateData = [
      {
        COMPCODE: "",
        DESIGNATIONNAME: "",
        Standard_Desigantion: '',
        Amount: "",
        Skill_Category: "",
        NpDays: ""
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'table': workSheet },
      SheetNames: ['table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `InvoiceCollection${Date.now()}.xlsx`)
  }

  DownloadClientAdvancePaymentTemplate() {
    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      return;
    }

    // Validate selection
    if (!this.uploadType || this.uploadType === '-1') {
      alert('Please select Upload Type');
      return;
    }

    const flag = this.uploadType;

    this.service.GetClientAdvancePaymentTemplate(flag, userId).subscribe({
      next: (res: any) => {

        const data = res?.Data?.data?.Table0 ?? [];
        console.log("template",data)

        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'ClientAdvancePayment': worksheet },
          SheetNames: ['ClientAdvancePayment']
        };

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        // ✅ Correct MIME type
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // ✅ Works with your current import style
        FileSaver.saveAs(blob, `Client_Advance_Payment_Template_${Date.now()}.xlsx`);
      },

      error: (err) => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }

  isAllSelected(): boolean {
    if (!this.uploadedDataSources || !this.uploadedDataSources.data) return false;

    return this.uploadedDataSources.data.length > 0 &&
      this.uploadedDataSources.data.every((row: any) => row.isSelected);
  }

  toggleAllRows(event: MatCheckboxChange): void {
    const isChecked = event.checked;

    this.uploadedDataSources.data.forEach((row: any) => {
      row.isSelected = isChecked;
    });
  }


  deleteSelectedRow() {
    if (!this.selectedRowSlNo) {
      alert('Please select a row before deleting');
      return;
    }

    this.uploadData = this.uploadData.filter(row => row.slNo !== this.selectedRowSlNo);

    // Re-index slNo after deletion
    this.uploadData.forEach((row, index) => row.slNo = index + 1);

    this.uploadedDataSources.data = [...this.uploadData];

    // Reset selection
    this.selectedRowSlNo = null;
  }

  addInvoiceCollectionOpen() {
    this.isAddclicked = true;
  }

  closeclick() {
    this.isAddclicked = false;
  }

  saveTDSSlab() {
    if (this.addInvoiceCollection.invalid) {
      this.addInvoiceCollection.markAllAsTouched();
      return;
    }
  }


}
