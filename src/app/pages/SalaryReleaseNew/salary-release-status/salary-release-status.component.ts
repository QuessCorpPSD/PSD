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
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { MatDialog } from '@angular/material/dialog';
import { IReleaseRequest } from '../../../Repository/SalaryRequestNew/IReleaseRequest';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ISalaryReleaseStatus } from '../../../Repository/SalaryRequestNew/ISalaryReleaseStatus';
import { SalaryReleaseStatusService } from '../../../Service/SalaryRequestNew/salary-release-status.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatTooltipModule } from '@angular/material/tooltip';
export const Pay_TOKEN = new InjectionToken<ISalaryReleaseStatus>('Pay_TOKEN');

@Component({
  selector: 'app-salary-release-status',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, MatCardModule, MatIconModule,MatTooltipModule],
  templateUrl: './salary-release-status.component.html',
  styleUrl: './salary-release-status.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: SalaryReleaseStatusService,
    }
  ]
})
export class SalaryReleaseStatusComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  holdSelections: { [key: number]: string } = {};
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  selectedBatchType: string = '';
  startDate: string = '';
  endDate: string = '';
  employeeCode: string = '';
  batchtype: any[] = [];
  batchList: any[] = [];
  startDateInput: string = '';
  endDateInput: string = '';



  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'CompanyName', 'EmployeeCode', 'PayPeriod',
    'InvoiceNumber', 'BatchId', 'BatchCreatedBy', 'BatchCreatedOn', 'IkyaLocation', 'WorkLocation'

  ];

  displayedColumnsImport: string[] = [
    'select', 'InvoiceNumber'];

  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;
  @ViewChild('importPaginator') importpaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('importSort') importsort!: MatSort;
  TEMPLATE_HEADERS: Record<string, string[]> = {
    Release: [
      'InvoiceNumber'
    ]
  };
  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Pay_TOKEN) private service: ISalaryReleaseStatus,
    private dialog: MatDialog
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }


  ngOnInit(): void {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    this.startDate = `${year}-${month}-${day}`;
    this.endDate = `${year}-${month}-${day}`;
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.Bindbatchtype();
    this.payPeriodTypefromParent = "All";


  }

  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }


  Bindbatchtype() {
    this.service.Batchtype(this.userdetail.user_Id).subscribe({
      next: res => {
        this.batchtype = res.Data;
      }
    });

  }
  formatDateForAPI(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`; // converts yyyy-mm-dd -> dd-mm-yyyy
  }
  searchClick() {


    if (!this.selectedBatchType) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.startDate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.endDate) {
      alert("Please Select To Date");
      return;
    }

    this.istablevisible = true;
    this.isLoading = true;

    const batchType = this.selectedBatchType || 0;
    const fromDate = this.formatDateForAPI(this.startDate);
    const toDate = this.formatDateForAPI(this.endDate);
    const employeeCode = this.employeeCode || 0;
    const userId = this.userdetail.user_Id;

    // Call service
    this.service.Search(batchType, fromDate, toDate, employeeCode, userId)
      .subscribe({
        next: res => {

          const tableData = res?.Data?.data?.Table0;

          if (!tableData || tableData.length === 0) {
            alert("No data available to display.");
            this.isLoading = false;
            return;
          }

          // Bind table data
          this.dataSource = new MatTableDataSource<any>(tableData);
          this.dataSource.paginator = this.holdpaginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },

        error: err => {
          console.error('Error fetching data:', err);
          alert('Error while fetching data.');
          this.isLoading = false;
        },

        complete: () => {
          this.isLoading = false;
        }
      });
  }

  exportToExcel(): void {
    // Validation
    if (!this.selectedBatchType) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.startDate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.endDate) {
      alert("Please Select To Date");
      return;
    }

    this.istablevisible = true;
    this.isLoading = true;

    // Prepare parameters
    const batchType = this.selectedBatchType || 0;
    const fromDate = this.formatDateForAPI(this.startDate);
    const toDate = this.formatDateForAPI(this.endDate);
    const employeeCode = this.employeeCode || 0;
    const userId = this.userdetail.user_Id;

    // Call Export API
    this.service.ExporttoExcel(batchType, fromDate, toDate, employeeCode, userId).subscribe({
      next: (res) => {
        this.isLoading = false;

        try {
          const jsonData = res?.Data?.data?.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No Data Found');
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'SalaryRelease');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `SalaryRelease_Details_${timestamp}.xlsx`;
          XLSX.writeFile(wb, fileName);

        } catch (err) {
          console.error('Error exporting to Excel:', err);
        }
      },
      error: (err) => {
        console.error('Error exporting data', err);
        this.isLoading = false;
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
      console.error('Please upload one Excel file.');
      this.isLoading = false;
      return;
    }

    if (!this.selectedBatchType) {
      alert('Please select a Batch Type.');
      this.isLoading = false;
      return;
    }

    if (!this.userdetail || !this.userdetail.user_Id) {
      alert('User details not found.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('BatchType', this.selectedBatchType);
    formData.append('UserId', this.userdetail.user_Id);

    this.service.Upload(formData).subscribe({
      next: (res) => {
        this.isLoading = false;

        // Check for success message
        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.showPopup = true;
          this.popupMessage = res.Data.response;
          return;
        }

        
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        
        const successMsg = 'EmployeePO data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.showPopup = true;
          this.popupMessage = successMsg;
          return;
        }

        // Case: failure message
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
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
            Error_Message: item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_salaryreleaseststus.xlsx');

          this.showPopup = true;
          this.popupMessage = 'Import Failed.';
          return;
        }

       
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          alert('Error while processing response.');
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.isLoading = false;
        this.showPopup = true;
        this.popupMessage = 'Upload failed.';
      }
    });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

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
    this.service.DownloadTemplate(12).subscribe({
      next: (res) => {
        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'SalaryReleasetemplate': worksheet },
          SheetNames: ['SalaryReleasetemplate']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `SalaryReleasetemplate_${Date.now()}.xlsx`);
      },
      error: (err) => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }

}
