import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
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
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';
import { CreditNoteService } from '../../../../Service/invoice/creditnote.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatCardModule } from '@angular/material/card';
import { IAPARAdjustmentUpdateService } from '../../../../Repository/BankInvoice/BankInvoiceRepository/APARAdjustment.service';
import { APARAdjustmentUpdateService } from '../../../../Service/BankInvoice/BankInvoiceService/aparadjustment-update.service';


export const Pay_Token = new InjectionToken<IAPARAdjustmentUpdateService>('Pay_Token');

@Component({
  selector: 'app-aparadjustmentupdate',
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
    MatCheckboxModule,
    MatCardModule],
  templateUrl: './aparadjustmentupdate.component.html',
  styleUrl: './aparadjustmentupdate.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: APARAdjustmentUpdateService,
    }
  ]
})
export class APARAdjustmentupdateComponent {
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
  StartDate: string = "";
  EndDate: string = "";

  displayedColumns: string[] = [
    "edit",
    "select",
    "Company_Code",
    "Company_name",
    "aparadjustment_no",
    "aparadjustment_amount",
    "Adjusted_amount",
    "balance_amount",
    "base_amount",
    "GstAmount",
    "status",
    "aparadjustment_type",
    "Sap_Reference_Number",
    "Ref_No",
    "Invoice_Number",
    "SAC_Code",
    "IRN_Status",
    "IRN_Number",
    "DBN_IRN_Status",
    "DBN_IRN_Number",
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private creditService: CreditNoteService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_Token) private service: APARAdjustmentUpdateService
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
    this.BindPurpose(this.comapnyId);
  }

  handlePayperiodEvent(payperiod: any) {
    this.PayPeriodUI = payperiod;
    console.log(this.PayPeriodUI);
  }

  BindPurpose(companyId: number) {
    this.creditService.GetCreditNotePurpose(companyId).subscribe({
      next: res => {
        console.log(res.Data);
        this.CreditNotePurpose = res.Data
      }
    });
  }

  onPurposeChange(event: any) {
    this.Credit_Note_Type = event.target.value;
    console.log('type', this.Credit_Note_Type);
    if (this.Credit_Note_Type == "Excess Collections") {
      this.isPayPeriod = false;
      this.isRefId = true;
    }
    else {
      this.isPayPeriod = true;
      this.isRefId = false;
    }

  }

  onStartChange(event: any) {
    const inputDate = event.target.value;
    const [year, month, day] = inputDate.split("-");
    this.StartDate = `${day}/${month}/${year}`;
  }
  onEndChange(event: any) {
    const inputDateend = event.target.value;
    const [year, month, day] = inputDateend.split("-");
    this.EndDate = `${day}/${month}/${year}`;
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  SearchClick() {
    if (!this.comapnyId) {
      alert('Please select a Company');
      return;
    }
    this.isLoading = true;

    const companyId: number = this.comapnyId;
    const fromdate: string = this.formatDate(new Date(this.StartDate));
    const todate: string = this.formatDate(new Date(this.EndDate));

    this.service.search(companyId, fromdate, todate).subscribe({
      next: (res: any) => {
        console.log(res.Data);
        this.isLoading = false;

        if (res.StatusCode === 200 && Array.isArray(res.Data) && res.Data.length > 0) {
          this.dataSource.data = res.Data.data.Table0;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          this.isLoading = false;

        } else {
          this.dataSource.data = [];
          this.isLoading = false;
          alert("No Records Found");

        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("API Error:", err);
        this.dataSource.data = [];
      }
    });
  }

  exportToExcel(): void {
    // this.isLoading = true;
    if (!this.comapnyId || !this.StartDate || !this.EndDate) {
      alert('Please select both Company and start and End Date to export data.');
      return;
    }
    const payload = {
      companyId: this.comapnyId?.toString(),        // from UI
      fromDate: this.formatDate(new Date(this.StartDate?.toString())),
      toDate: this.formatDate(new Date(this.EndDate?.toString()))    // from UI
    };


    this.service.exportToExcel(payload).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and startdate and enddate.');
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

    this.service.importAPARAdjustment(file, this.userdetail.user_Id?.toString()).subscribe({
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

  CancelClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onCancelFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert("Please select a file");
      return;
    }

    this.service.importAPARAdjustmentCancel(
      file,
      this.userdetail.user_Id?.toString()
    ).subscribe({
      next: (res) => {
        console.log(res);
        alert("Cancel upload processed");
      },
      error: () => {
        alert("Cancel upload failed");
      }
    });
  }

  DownloadTemplate() {

    const templateData = [
      {
        CreditNote_Nos: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    const wb = {
      Sheets: { 'Sheet1': ws },
      SheetNames: ['Sheet1']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, `ClientTDSSlabMaster.xlsx`);
  }

  FileUpload(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  // onFileChange(event: any): void {
  //   this.isLoading = true;
  //   const target: DataTransfer = <DataTransfer>(event.target);

  //   if (!target.files || target.files.length !== 1) {
  //     console.error('Please upload only one Excel file.');
  //     this.isLoading = false;
  //     return;
  //   }

  //   const file = target.files[0];
  //   this.excelFile = target.files[0];

  //   if (!this.excelFile) {
  //     console.error("⚠️ No file selected.");
  //     this.isLoading = false;
  //     return;
  //   }

  //   const formData = new FormData();
  //   if (this.excelFile) {
  //     formData.append('file', this.excelFile);
  //     formData.append('userId', this.userdetail.user_Id);

  //     this.creditService.UploadCreditNoteCancel(formData).subscribe({
  //       next: (res) => {
  //         console.log(res);
  //         this.datatable = res.Data;
  //         console.table(this.datatable);
  //         if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
  //           this.downloadExcel(this.datatable, "CreditNoteApprove_Validations");
  //           this.isLoading = false;
  //         } else {
  //           alert("No validations returned");
  //           this.isLoading = false;
  //         }
  //       },
  //       error: err => {
  //         console.error('❌ Upload failed', err);
  //         this.isLoading = false;
  //       }
  //     });
  //   }
  // }

  downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  deleteClick() {
    // if (confirm("Are you sure you want to delete this?")) {

    //   const parentDetail = {
    //     InvoiceCulture_id: invoiceCulture_id,
    //     Company_Id: 0,
    //     Company_Code: '',
    //     Company_Name: '',
    //     InvoiceCul_Ref_No: "",
    //     InvoiceType: invoiceType,
    //     InvoiceType_Id: 0,
    //     Cost_Center_Mapping_Id: 0,
    //     Service_Charge_Master_Id: 0,
    //     Service_Charge_Type_Id: 0,
    //     Service_Charge_Slab_Item_Id: 0,
    //     Service_Charge_Slab_Inner_Item_Id: 0,
    //     Map_Name_Id: 0,
    //     Map_Name: '',
    //     Invoice_Category_Id: 0,
    //     Error_Message: ""
    //   }

    //   // const childDetail: ChildDetail[] = [];

    //   // childDetail.push({
    //   //   InvoiceCulture_id: 0,
    //   //   Company_Id: 0,
    //   //   Paycode_Id: 0,
    //   //   Paycode_Code: "",
    //   //   HasAccess: false
    //   // });

    //   const InvoiceCultureAdd = {
    //     createdBy: this.userdetail.user_Id,
    //     mode: 'Delete',
    //     parentDetail: parentDetail,
    //   //childDetail: childDetail
    //   }
    //   console.log(InvoiceCultureAdd);
    //   this.creditService.postInvoiceCulture(InvoiceCultureAdd).subscribe({
    //     next: (res) => {
    //       console.log(res);
    //       const errormsg = res.Data.data.Table0[0].Error_Message;
    //       alert(errormsg);
    //       this.isLoading = true;
    //       this.SearchClick()
    //       error: err => {
    //         console.error('Error fetching data:', err.message);
    //         this.isLoading = false;
    //       }
    //     }
    //   });
    // }
  }

  Export() {
    // if (!this.comapnyId) {
    //   alert('Please select a Company');
    //   return;
    // }

    // this.isLoading = true;
    // this.creditService.ExportToExcel(this.userdetail.user_Id)
    //   .pipe(
    //     finalize(() => this.isLoading = false)
    //   ).subscribe({
    //     next: res => {
    //       //console.log(res);
    //       if (res.StatusCode == 200) {
    //         const data = res.Data;
    //         var base64 = data.file;
    //         this.downloadExcelFromBase64(base64, data.fileName)
    //       }
    //     },
    //     error: error => console.error('Error:', error)
    //   })
  }

  DownloadInvoice(CreditNoteid: number, CompanyId: number, InvoiceNumber: number, InvoiceID: number) {
    this.isLoading = true;
    this.creditService.DownloadInvoice(CreditNoteid, CompanyId, InvoiceNumber, InvoiceID).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = InvoiceNumber + '.pdf';

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

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }


}
