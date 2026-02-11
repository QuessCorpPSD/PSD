import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IReimbursementService } from '../../../Repository/reimbursement/IReimbursement.service';
import { ReimbursementService } from '../../../Service/reimbursements/reimbursement.service';
import { FinancialYearComponent } from '../../../common/financial-year/financial-year.component';
import * as XLSX from 'xlsx';
export const Pay_Token = new InjectionToken<IReimbursementService>('Pay_Token');
export interface IReimbursement {
  slNo: number;
  reimbursementCode: number | null;
  description: string | null;
  claimAmount: number | null;
}

@Component({
  selector: 'app-reimbrusement',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule, FinancialYearComponent],
  templateUrl: './reimbrusement.component.html',
  styleUrl: './reimbrusement.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ReimbursementService,
    }
  ]
})
export class ReimbrusementComponent {
  ceaform!: FormGroup;
  isAddclicked = false;
  FinancialYear: any;
  EmpCode: any;
  showTable = false;
  addReimbursement!: FormGroup;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  CompanyId: any;
  CompanyCode: any;
  isEditMode: boolean = false;
  uploadData: IReimbursement[] = [];
  uploadedDataSource = new MatTableDataSource<IReimbursement>(this.uploadData)
  uploadedData1: any[] = [];
  uploadedDataSources = new MatTableDataSource<any>(this.uploadedData1);

  displayedColumns: string[] = [
    'delete', 'edit', 'slNo', 'companyCode', 'employeeCode', 'date', 'financialYear', 'payperiod', 'reimbursementCode', 'claimAmount'];

  uploadedData: any[] = []; // No mock data
  selectedRowSlNo: number | null = null;
  selectedRow: IReimbursement | null = null;
  userdetail: any;
  employeeCode: any;
  selectedFinancialYear: any;
  dataSource = new MatTableDataSource<any>([]);
  search: any;
  payPeriod: any;
  selectedFYear: any;
  empCode: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: IReimbursementService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.addReimbursement = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      Date: new FormControl('', Validators.required),
      EmployeeCode: new FormControl('', Validators.required),
      EmployeeName: new FormControl({ value: '', disabled: true }),
      FYear: new FormControl('', Validators.required),
      PayPeriod: new FormControl('', Validators.required),
    })
    this.initializeForm();
    this.addReimbursement.get('EmployeeName')?.disable();


    this.addReimbursement.get('EmployeeCode')?.valueChanges.subscribe(empId => {

      const selectedEmp = this.empCode.find(
        (e: any) => e.Employee_Id == empId
      );

      if (selectedEmp) {
        this.addReimbursement.patchValue({
          EmployeeName: selectedEmp.Employee_Name
        });
      } else {
        this.addReimbursement.patchValue({
          EmployeeName: ''
        });
      }
    });

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.bindEmpCode();
  }

  handleCompany(company) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    this.bindEmployeeCode();
  }

  handleFinancialYear(year) {
    this.selectedFinancialYear = year.financial_Year_Id;
  }

  handleFYear(year) {
    this.selectedFYear = year.financial_Year_Id;
    this.bindPayPeriod();
    this.addReimbursement.get('FYear')?.setValue(this.selectedFYear);
    this.addReimbursement.get('FYear')?.markAsTouched();
    this.addReimbursement.get('FYear')?.updateValueAndValidity();
  }

  selectRow(row: IReimbursement) {
    this.selectedRow = row;
  }

  initializeForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];  // 'yyyy-MM-dd'
    this.addReimbursement.patchValue({
      Date: formattedDate
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  addNewRow() {

    if (this.addReimbursement.invalid) {
      this.addReimbursement.markAllAsTouched();
      alert('Please fill all required fields');

      return;
    }
    this.uploadData.push({
      slNo: this.uploadData.length + 1,
      reimbursementCode: null,
      description: null,
      claimAmount: null
    });

    this.uploadedDataSource.data = [...this.uploadData];
    this.patchReimbursementCode();
  }

  deleteSelectedRow() {
    if (!this.selectedRowSlNo) {
      alert('Please select a row before deleting');
      return;
    }

    this.uploadData = this.uploadData.filter(row => row.slNo !== this.selectedRowSlNo);

    // Re-index slNo after deletion
    this.uploadData.forEach((row, index) => row.slNo = index + 1);

    this.uploadedDataSource.data = [...this.uploadData];

    // Reset selection
    this.selectedRowSlNo = null;
  }

  bindEmployeeCode() {
    const companyId = this.CompanyId || 0;
    this.service.getEmployeeCode(companyId).subscribe({
      next: res => {
        this.employeeCode = res.Data.data.Table0
      }
    })
  }


  bindEmpCode() {
    const companyId = this.selectedCompanyId || 0;
    this.service.getEmployeeCode(companyId).subscribe({
      next: res => {
        this.empCode = res.Data.data.Table0
      }
    })
  }

  bindPayPeriod() {
    const companyId = this.selectedCompanyId || 0;
    const financialYearId = this.selectedFYear || 0;

    this.service.bindPayPeriod(companyId, financialYearId).subscribe({
      next: res => {
        this.payPeriod = res.Data.data.Table0;
      }
    });
  }

  patchReimbursementCode() {
    const companyId = this.selectedCompanyId || 0;
    this.service.bindReimbursementCode(companyId).subscribe({
      next: res => {
        // Assuming you want to do something with the reimbursement codes here      
        const reimbursementCodes = res.Data.data.Table0;
        console.log('Reimbursement Codes:', reimbursementCodes);
      }
    });
  }

  onSearch() {
    this.showTable = true;
    // this.isLoading = true;
    const companyId = this.CompanyId || 0
    const financialYearId = this.selectedFinancialYear || 0
    const EmployeeId = this.EmpCode || 0

    this.service.search(companyId, financialYearId, EmployeeId).subscribe({

      next: (res) => {
        this.search = res.Data.data.Table0;
        console.log(this.search);
        if (this.search && this.search.length > 0) {
          this.dataSource = new MatTableDataSource(this.search);
          this.dataSource.paginator = this.paginator;
          this.displayedColumns = [
            'delete', 'edit', 'slNo', 'companyCode', 'employeeCode', 'date', 'financialYear', 'payperiod', 'reimbursementCode', 'claimAmount'];
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
    // this.isLoading = false;
  }

  exportToExcel(): void {
    // this.isLoading = true;
    const companyId = this.CompanyId || 0
    const financialYearId = this.selectedFinancialYear || 0
    const EmployeeId = this.EmpCode || 0

    this.service.search(companyId, financialYearId, EmployeeId).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and employee and financialyear.');
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
    formData.append('CreatedBy', this.userdetail.user_Id?.toString());
    console.log("formdata", formData)

    this.service.importReimbursement(formData).subscribe({
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

  saveReimbursement() {

    if (this.addReimbursement.invalid) {
      this.addReimbursement.markAllAsTouched();
      return;
    }

    if (this.uploadData.length === 0) {
      alert('Please add at least one slab row');
      return;
    }

    // this.isLoading = true;

    const form = this.addReimbursement.value;

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: 'Add',
      parentDetail: {
        Reimbursement_Id: 0,
        Company_Id: form.CompanyCode?.companyId,
        Employee_Id: form.EmployeeCode,
        Financial_Year_Id: form.FYear,
        Pay_Period_Id: form.PayPeriod,
        Pay_Frequency_Detail_Id: form.PayPeriod,
        Reimbursement_Date: form.Date,
        //  Reimbursement_Date: this.formatDate(form.Date)
        // Effective_Date: this.formatDate(form.EffectiveDate)?.toString(),
        Error_Message: ''
      },
      childDetail: this.uploadData.map(row => ({
        Reimbursement_Detail_Id: 0,
        Reimbursement_Id: 0,
        Tax_Id: "0",
        Paycode_Id: 0,
        Computation_Rule_Id: 0,
        Claim_Amount: row.claimAmount || 0,
        Error_Message: ''
      }))
    };

    console.log('Payload to be sent:', JSON.stringify(payload));
    this.service.addReimbursement(payload).subscribe({
      next: res => {
        alert(res.Data.response);
        this.isAddclicked = false;
        this.addReimbursement.reset();
        this.uploadData = [];
        this.uploadedDataSource.data = [];
      },
      error: err => {
        console.error(err);
        // this.isLoading = false;
      }
    });
    // this.isLoading = false;
  }

  closeclick() {
    this.isAddclicked = false;
    this.addReimbursement.reset();
    this.uploadData = [];
    this.uploadedDataSource.data = [];
  }

  AddLtaOpen() {
    this.isAddclicked = true;
  }
}
