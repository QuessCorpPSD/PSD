import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';
import { FinancialYearComponent } from '../../../../common/financial-year/financial-year.component';

import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { IClientTDSMasterService } from '../../../../Repository/BankInvoice/BankInvoiceRepository/ClientTDSMaster.service';
import { ClientTDSMasterService } from '../../../../Service/BankInvoice/BankInvoiceService/client-tdsmaster.service';


export const Pay_Token = new InjectionToken<IClientTDSMasterService>('Pay_Token');

@Component({
  selector: 'app-client-tdsslab-master',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule, FinancialYearComponent],
  templateUrl: './client-tdsslab-master.component.html',
  styleUrl: './client-tdsslab-master.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ClientTDSMasterService,
    }
  ]
})
export class ClientTDSSlabMasterComponent {
  CompanyId: any;
  CompanyCode: any;
  selectedFinancialYear: any;
  uploadDisplayedColumns: string[] = [
    'delete', 'edit', 'slNo', 'companyCode', 'companyName', 'typeOfSection', 'TdsExemptionvalue', 'tds', 'financialYear', 'fromDate', 'toDate', 'natureOfBusiness', 'tanNumber', 'panNumber', 'ldsCertificate'

  ];

  uploadedData: any[] = []; // No mock data
  showTable = false;
  companyName: any;
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isAddclicked = false;
  isEditMode: boolean = false;
  addTDSSlab!: FormGroup;
  selectedFYear: any;
  selectedCompanyCode: any;
  selectedCompanyId: any;
  search: any;
  dataSource = new MatTableDataSource<any>([]);
  userdetail: any;
  editingRowId: number | null = null;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: IClientTDSMasterService) { }

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.addTDSSlab = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl({ value: '', disabled: true }),
      TypeOfSection: new FormControl('', Validators.required),
      NatureOfBusiness: new FormControl('', Validators.required),
      TDSExemptionValue: new FormControl('', Validators.required),
      TDSPercentage: new FormControl('', Validators.required),
      FYear: new FormControl('', Validators.required),
      FromDate: new FormControl(''),
      ToDate: new FormControl(''),
      TANNumber: new FormControl('', Validators.required),
      PANNumber: new FormControl('', Validators.required)
    })
  }

  handleCompany(company) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    this.companyName = company.companyName;
    console.log("company", company)
  }

  handleCompanyEvent(event: any) {
    if (!event) return;

    this.selectedCompanyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.companyName = event.companyName;

    this.addTDSSlab.patchValue({
      CompanyCode: event.companyCode,
      CompanyName: event.companyName
    });

    this.addTDSSlab.get('CompanyCode')?.markAsDirty();
    this.addTDSSlab.get('CompanyCode')?.updateValueAndValidity();
  }
  handleFinancialYear(year) {
    this.selectedFinancialYear = year.financial_Year_Id;
  }

  handleFYear(event: any) {
    this.selectedFYear = event.financial_Year_Id;

    this.addTDSSlab.patchValue({
      FYear: event.financial_Year_Id
    });
  }
  onSearch() {
    if (!this.CompanyId || !this.selectedFinancialYear) {
      alert('Please select both Company and Financial Year');
      return;
    }
    this.showTable = true;
    const companyId = this.CompanyId;
    const financialYearId = this.selectedFinancialYear;

    this.service.search(companyId, financialYearId).subscribe({

      next: (res) => {
        this.search = res.Data.data.Table0;
        console.log("search", this.search);
        if (this.search && this.search.length > 0) {
          this.dataSource = new MatTableDataSource(this.search);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'delete', 'edit', 'slNo', 'companyCode', 'companyName', 'typeOfSection', 'TdsExemptionvalue', 'tds', 'financialYear', 'fromDate', 'toDate', 'natureOfBusiness', 'tanNumber', 'panNumber', 'ldsCertificate'

          ];
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
    if (!this.CompanyId || !this.selectedFinancialYear) {
      alert('Please select both Company and Financial Year to export data.');
      return;
    }
    const payload = {
      companyId: this.CompanyId,        // from UI
      financialYearId: this.selectedFinancialYear      // from UI
    };


    this.service.exportToExcel(payload).subscribe({
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

    this.service.importClientTds(file, this.userdetail.user_Id?.toString()).subscribe({
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

  addTdsSlabOpen() {
    this.isAddclicked = true;
  }

  closeclick() {
    this.isAddclicked = false;
  }

  formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date); // ✅ convert safely

    if (isNaN(d.getTime())) return ''; // invalid date check

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

  editTds(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.editingRowId = row.TdsSlabMaster_Id;

    const formattedFromDate = row.From_Date?.split('T')[0] || '';
    const formattedToDate = row.To_Date?.split('T')[0] || '';

    // ✅ Trigger company binding
    // this.handleCompanyEvent({
    //   Company_Id: row.Company_Id,
    //   Company_Code: row.Company_Code,
    //   Company_Name: row.Company_Name
    // });

    // // ✅ Trigger financial year binding
    // this.handleFYear({
    //   financial_Year_Id: row.Financial_Year_Id,
    //   financial_Year_Name: row.Financial_Year_Name
    // });

    this.addTDSSlab.patchValue({
      TypeOfSection: Number(row.Type_Of_Selection) || '',

      NatureOfBusiness: row.Nature_Of_Business || '',

      TDSExemptionValue: Number(row.TDS_Exemption_Value) || 0,
      TDSPercentage: Number(row.TDS_Percentage) || 0,

      FromDate: formattedFromDate,
      ToDate: formattedToDate,

      TANNumber: String(row.TAN || ''),
      PANNumber: row.PAN === 'Na' ? '' : String(row.PAN || '')
    });
  }

  saveTDSSlab() {
    if (this.addTDSSlab.invalid) {
      this.addTDSSlab.markAllAsTouched();
      return;
    }

    const form = this.addTDSSlab.value;

    const payload = {
      request: {
        TdsDetails: [
          {
            TdsSlabMaster_Id: this.isEditMode ? this.editingRowId : 0,

            Company_Id: this.selectedCompanyId,
            Company_Name: this.companyName,
            Company_Code: this.selectedCompanyCode,

            TypeOfSelection: Number(form.TypeOfSection),
            Value: Number(form.TDSExemptionValue),
            Percentage: Number(form.TDSPercentage),

            FromDate: this.formatDate(form.FromDate),
            ToDate: this.formatDate(form.ToDate),

            NatureOfBusiness: form.NatureOfBusiness || "",

            TAN: String(form.TANNumber || ""),
            PAN: String(form.PANNumber || ""),

            Client_Id: this.userdetail.client_Id,

            Serial_No: this.isEditMode ? form.slNo || 0 : 0,

            Financial_Year_Id: this.selectedFYear,
            Financial_Year_Name:
              this.addTDSSlab.get('FYear')?.value?.financial_Year_Name || ""
          }
        ],

        action: this.isEditMode ? "edit" : "add",
        userId: this.userdetail.user_Id
      }
    };

    console.log("payload", JSON.stringify(payload) );

    this.service.addClientTDS(payload).subscribe({
      next: res => {
        alert(res.Data.response);

        this.isAddclicked = false;
        this.isEditMode = false;
        this.editingRowId = null;

        this.addTDSSlab.reset();
        this.onSearch();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  deleteTds(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    // this.isLoading = true;

    const payload = {
      request: {
        TdsDetails: [
          {
            TdsSlabMaster_Id: row.TdsSlabMaster_Id // ✅ required for delete
          }
        ],
        action: "delete", // ✅ important
        userId: this.userdetail.user_Id
      }
    };

    this.service.addClientTDS(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          alert(res?.Data?.response || 'Deleted successfully');
          this.onSearch(); // ✅ reload table
        } else {
          alert(res?.Message || 'Delete failed');
        }
        // this.isLoading = false;
      },
      error: err => {
        console.error(err);
        alert('API error during deletion');
        // this.isLoading = false;
      }
    });
  }

}
