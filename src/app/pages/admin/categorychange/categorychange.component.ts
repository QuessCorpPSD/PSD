import { Component, InjectionToken, ViewChild } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { CategoryChangeService } from '../../../Service/Admin/category-change.service';
import { ICategoryChange } from '../../../Repository/Admin/ICategoryChange';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import FileSaver from 'file-saver';
export const Pay_TOKEN = new InjectionToken<ICategoryChange>('Pay_TOKEN');
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-categorychange',
  imports: [MatCardModule, CompanyallComponent, MatIconModule, FormsModule, CommonModule, PayPeriodComponent, ReactiveFormsModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule],
  templateUrl: './categorychange.component.html',
  styleUrl: './categorychange.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CategoryChangeService,
    }
  ]
})
export class CategorychangeComponent {

  selectedCompanyId: any;
  selectedCompanyCode: any;
  companyname: any;
  isLoading: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payPeriodId: number = 0;
  payperiods: String = '';
  payPeriodTypefromParentall: string = '';
  lot_number!: number;
  categorySearch: any;
  showTable = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  ProcessCategory: any;
  selectedFile: File | null = null;
  userdetail: any;
  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private service: CategoryChangeService) { }

  uploadDisplayedColumns: string[] = [
    'companycode', 'lotNumber', 'payrollinputtype', 'update'];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.companyname = company.companyName;
    console.log(this.selectedCompanyId, 'company')
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    console.log("payperiod", this.payPeriod)
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
  }

  ngOnInit() {
    this.payPeriodTypefromParentall = "All";
    this.BindProcessCategory();
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  BindProcessCategory() {
    this.service.GetProcessCategory().subscribe({
      next: res => { this.ProcessCategory = res.Data },
      error: err => { console.log(err) }
    })
  }
  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  // onFileChange(event: Event): void {
  //   this.isLoading = true;
  //   const input = event.target as HTMLInputElement;
  //   const file = input?.files?.[0];

  //   if (!file) {
  //     this.isLoading = false;
  //     alert("Please upload only one Excel file.")
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('userId', this.userdetail.user_Id);

  //   this.service.ImportCategory(formData).subscribe({
  //     next: (res) => {

  //       if (!res || !res.Data) {
  //         alert("Upload request Processed.Server did not return any data")
  //         this.isLoading = false;
  //         return;
  //       }

  //       if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
  //         this.isLoading = false;
  //         this.showAlertPopup("Row(s) Uploaded Successfully.")
  //         return;
  //       }

  //       // --- parse response defensively ---
  //       const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

  //       // CASE 1: Success message inside parsed JSON array/object
  //       const successMsg = 'Row(s) Uploaded Successfully.';
  //       const successMatch =
  //         (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
  //         (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

  //       if (res?.StatusCode === 200 && successMatch) {
  //         this.isLoading = false;
  //         return;
  //       }

  //       // CASE 2: Plain failure string
  //       if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
  //         // Optional debug
  //         // alert('1');
  //         this.isLoading = false;
  //         alert("Failed to Import");
  //         // errors[0] may be a JSON string, an array, or a plain string/object
  //         const rawErr = res?.Data?.errors?.[0];
  //         let errorArray: any[] = [];
  //         try {
  //           if (typeof rawErr === 'string') {
  //             const tryJson = JSON.parse(rawErr);
  //             errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
  //           } else if (Array.isArray(rawErr)) {
  //             errorArray = rawErr;
  //           } else if (rawErr) {
  //             errorArray = [rawErr];
  //           }
  //         } catch {
  //           errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
  //         }

  //         const exportData = errorArray.map((item: any) => ({
  //           Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
  //         }));

  //         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  //         const workbook: XLSX.WorkBook = {
  //           Sheets: { ErrorMessages: worksheet },
  //           SheetNames: ['ErrorMessages']
  //         };
  //         XLSX.writeFile(workbook, 'ErrorMessages_MAINPO.xlsx');
  //         this.isLoading = false;
  //         return;
  //       }

  //       // CASE 3: Anything else → show whatever we have
  //       // CASE: Data is array with Error_Message (e.g. "No rows to Upload")
  //       if (Array.isArray(res.Data) && res.Data[0]?.Error_Message) {
  //         this.isLoading = false;
  //         alert(res.Data[0].Error_Message)
  //         return;
  //       }

  //       // CASE 3: Anything else → fallback
  //       const fallback =
  //         msg ||
  //         (Array.isArray(parsed) ? JSON.stringify(parsed) :
  //           (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
  //             (parsed ? JSON.stringify(parsed) : ''));

  //       if (fallback) {
  //         alert(fallback)
  //       } else {
  //         alert('Error while processing response.')
  //       }

  //       this.isLoading = false;

  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       alert("Upload Failed")
  //     }
  //   });
  // }
  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      alert("Please select an Excel file.");
      return;
    }

    const file = input.files[0];

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {

      const binaryString = e.target.result;

      const workbook = XLSX.read(binaryString, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json<any>(worksheet);

      console.log(excelData);

      const xmlData = this.convertToXML(excelData);

      const payload = {

        CompanyID: this.selectedCompanyId,

        PayPeriod: this.payPeriodId,

        LotNumber: this.lot_number,

        Revised: 0,

        Flag: "I",

        XML_File: xmlData,

        CreatedBy: this.userdetail.user_Id

      };

      console.log(payload);

      this.service.ImportCategory(payload).subscribe({

        next: (res: any) => {

          console.log(res);

          if (res.StatusCode == 200) {

            alert(res?.Data?.[0]?.Error_Message);

            this.onSearch();

          }
          else {

            alert(res?.Message);

          }

        },

        error: (err) => {

          console.log(err);

          alert("Upload Failed");

        }

      });

    };

    reader.readAsBinaryString(file);

  }

  convertToXML(data: any[]): string {

    let xml = "<NewDataSet>";

    data.forEach(item => {

      xml += `
      <Table>
        <Company_code>${item.Company_code}</Company_code>
        <Pay_Period>${item.Pay_Period}</Pay_Period>
        <Lot_number>${item.Lot_number}</Lot_number>
        <Revised>${item.Revised}</Revised>
      </Table>`;

    });

    xml += "</NewDataSet>";

    return xml;

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
  onSearch() {
    if (!this.selectedCompanyId) {
      alert('Please select Company Code');
      return;
    }
    if (!this.payPeriod || !this.payPeriod.payPeriod) {
      alert('Please select Pay Period');
      return;
    }
    this.showTable = true;
    const payload = {
      CompanyID: this.selectedCompanyId,
      PayPeriod: this.payPeriodId,
      LotNumber: this.lot_number,
      Revised: 0,
      Flag: "s"

    }
    this.service.SearchCategory(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.categorySearch = res.Data;
        this.categorySearch.forEach((item: any) => {
          if (!item.process_Category) {
            item.process_Category = 'P1';
          }
        });
        if (this.categorySearch && this.categorySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.categorySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'companycode', 'lotNumber', 'payrollinputtype', 'update'];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading category change data', err);
      },
    });

  }

  downloadTemplate() {
    const templateData = [
      {
        CompanyID: this.selectedCompanyId,
        PayPeriod: this.payPeriodId,
        LotNumber: this.lot_number,
        Revised: 0,
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'table': workSheet },
      SheetNames: ['table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Category Change${Date.now()}.xlsx`)
  }
  onUpdate() {
    const payload = {
      CompanyID: this.selectedCompanyId,
      PayPeriod: this.payPeriodId,
      LotNumber: this.lot_number,
      Revised: 0,
      Flag: "U"
    }

    this.service.SearchCategory(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert(res?.Data?.[0]?.Message);
        this.onSearch();

      },
      error: (err) => {
        this.isLoading = false;
        console.error('Update Failed', err);
      },
    });
  }
}
