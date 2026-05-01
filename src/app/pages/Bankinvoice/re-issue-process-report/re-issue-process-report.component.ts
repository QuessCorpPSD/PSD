import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { IReissueProcessReport } from '../../../Repository/BankInvoice/IReissueProcessReport';
import { ReissueProcessReportService } from '../../../Service/BankInvoice/reissue-process-report.service';
export const Common_TOKEN = new InjectionToken<IReissueProcessReport>('Common_TOKEN');
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-re-issue-process-report',
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
    MatTooltipModule, MatCardModule],
  templateUrl: './re-issue-process-report.component.html',
  styleUrl: './re-issue-process-report.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: ReissueProcessReportService }
  ]
})
export class ReIssueProcessReportComponent {

  Status: any;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: any[] = [];
  searchText: string = '';
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData)
  displayedColumns: string[] = [
    "sno",
    "companyCode",
    "CompanyName",
    "EmployeeCode",
    "EmployeeName",
    // "ChequeUTRNumber",
    "Payperiod",
    "invoicenumber",
    "BatchId",
    "BatchCreatedBy",
    "BatchCreatedOn",
    "IkayLoacation",
    "WorkLoaction",
    "Bank",
    "AccountNumber",
    "IFSCcode",
    "PTstate",
    "NetPay",
    "Remarks",
    "Status",
    "BankRefNo",
    "UTRChequeNumber",
  ];
  dataSource = new MatTableDataSource<any>([]);
  companyname: any;
  showTable = false;
  startDate: any;
  endDate: any;
  userdetail: any;
  isLoading = false;
  @ViewChild('paginator') paginator!: MatPaginator;

  statuslist = [
    { id: 1, text: 'select' },
    { id: 2, text: 'Bank Rejection' },
    { id: 3, text: 'Bank Rejection Salary Released' },
    { id: 4, text: 'Pending Bank Rejection' }
  ]
  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: ReissueProcessReportService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    if (company == null) {
      this.companyname = '';
    } else {
      this.companyname = company.companyName;
      this.selectedCompanyId = company.companyId;
      this.selectedCompanyCode = company.companyCode;
    }

  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;

    // ADD THIS INSIDE ngOnInit() OR AFTER dataSource DECLARATION

this.dataSource.filterPredicate = (
  data: any,
  filter: string
) => {

  const searchText = filter.trim().toLowerCase();

  return (

    data.Serial_No?.toString().toLowerCase().includes(searchText) ||

    data.Company_Code?.toLowerCase().includes(searchText) ||

    data.Company_Name?.toLowerCase().includes(searchText) ||

    data.Employee_Code?.toLowerCase().includes(searchText) ||

    data.Employee_Name?.toLowerCase().includes(searchText) ||

    data.Pay_Period?.toLowerCase().includes(searchText) ||

    data.Invoice_Number?.toLowerCase().includes(searchText) ||

    data.BatchId?.toLowerCase().includes(searchText) ||

    data.Batch_Created_By?.toLowerCase().includes(searchText) ||

    data.Bank?.toLowerCase().includes(searchText) ||

    data.Account_Number?.toLowerCase().includes(searchText) ||

    data.IFSC_Code?.toLowerCase().includes(searchText) ||

    data.PT_State?.toLowerCase().includes(searchText) ||

    data.Net_Pay?.toString().toLowerCase().includes(searchText) ||

    data.Remarks?.toLowerCase().includes(searchText) ||

    data.Status?.toLowerCase().includes(searchText) ||

    data.Bank_Ref_No?.toLowerCase().includes(searchText) ||

    data.Utr_Cheque_No?.toLowerCase().includes(searchText)

  );
};

  }
  onSearch() {
    this.isLoading = true;
    if (!this.startDate) {
      alert('Please select From Date');
      this.isLoading = false;
      return;
    }

    // To Date validation
    if (!this.endDate) {
      alert('Please select To Date');
      this.isLoading = false;
      return;
    }


    if (!this.Status || this.Status.text.toLowerCase() === 'select') {
      alert('Please select Status');
      this.isLoading = false;
      return;
    }

    this.showTable = true;

    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    const status = this.Status.text;

    this.service.ReissueProcessSearch(fromDate, toDate, status).subscribe({
      next: (res) => {

        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.uploadData = res?.Data?.data?.Table0 ?? [];

        if (this.uploadData.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.uploadData);
        this.dataSource.paginator = this.paginator;

        this.displayedColumns = [
          "sno",
          "companyCode",
          "CompanyName",
          "EmployeeCode",
          "EmployeeName",
          "Payperiod",
          "invoicenumber",
          "BatchId",
          "BatchCreatedBy",
          "BatchCreatedOn",
          "IkayLoacation",
          "WorkLoaction",
          "Bank",
          "AccountNumber",
          "IFSCcode",
          "PTstate",
          "NetPay",
          "Remarks",
          "Status",
          "BankRefNo",
          "UTRChequeNumber"
        ];

        this.isLoading = false;
      },

      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.isLoading = false;
      }
    });
  }

  formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }



  exportToExcel(): void {

    this.isLoading = true;

    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    const status = this.Status.text;

    this.service
      .ReissueProcessReportExport(fromDate, toDate, status)
      .subscribe({
        next: (res) => {

          this.isLoading = false;

          const jsonData = res?.Data?.data?.Table0 ?? [];

          if (jsonData.length === 0) {
            alert('No data available');
            return;
          }

          const ws: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(jsonData);

          const wb: XLSX.WorkBook =
            XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            'ReissueProcessReport'
          );

          const fileName =
            'ReissueProcessReport_' +
            this.formatDate(new Date()) +
            '.xlsx';

          XLSX.writeFile(wb, fileName);
        },

        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert('Export failed');
        }
      });
  }

  // ANGULAR

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  VonFileChange(event: Event): void {

    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload one Excel file.');
      this.isLoading = false;
      return;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt !== 'xls' && fileExt !== 'xlsx') {
      alert('Please upload only .xls or .xlsx file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('createdBy', this.userdetail.user_Id);

    this.service.ImportReissueProcess(formData).subscribe({

      next: (res: any) => {

        let response = res?.Data?.response;
        const statusCode = res?.StatusCode;

        if (!res || !res.Data) {
          alert('Server did not return any data.');
          this.isLoading = false;
          return;
        }

        // Parse JSON string response message
        try {
          if (
            typeof response === 'string' &&
            response.startsWith('[')
          ) {
            const parsed = JSON.parse(response);
            response =
              parsed?.[0]?.Error_Message ||
              parsed?.[0]?.Message ||
              parsed?.[0]?.message ||
              response;
          }
        } catch {
        }

        // SUCCESS
        if (
          statusCode === 200 &&
          response?.toLowerCase().includes('success')
        ) {
          alert(response);
          this.onSearch();
          this.isLoading = false;
          return;
        }

        // FAILED WITH ERRORS
        if (statusCode === 200) {

          let errorArray: any[] = [];

          try {

            const rawErr = res?.Data?.errors?.[0];

            if (typeof rawErr === 'string') {
              errorArray = JSON.parse(rawErr);
            }
            else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            }
            else if (rawErr) {
              errorArray = [rawErr];
            }

          } catch {

            errorArray = [
              {
                Error_Message:
                  res?.Data?.errors ||
                  response
              }
            ];
          }

          const exportData = errorArray.map(
            (item: any) => ({
              Error_Message:
                item?.Error_Message ||
                item?.Message ||
                item?.message ||
                item || ''
            })
          );

          const worksheet: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(exportData);

          const workbook: XLSX.WorkBook = {
            Sheets: {
              ErrorMessages: worksheet
            },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(
            workbook,
            'ReissueProcessReport_Errors.xlsx'
          );

          alert(response);
          this.isLoading = false;
          return;
        }

        alert(response || 'Upload Failed');
        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        alert('Upload Failed');
        this.isLoading = false;
      }

    });
  }
  DownloadReissueDeleteTemplate() {

    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      return;
    }

    const flag = 'ReissueDelete';

    this.isLoading = true;

    this.service.GetReissueDeleteTemplate(flag, userId).subscribe({

      next: (res: any) => {

        this.isLoading = false;

        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { ReissueDelete: worksheet },
          SheetNames: ['ReissueDelete']
        };

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        FileSaver.saveAs(
          blob,
          `Reissue_Delete_Template_${Date.now()}.xlsx`
        );
      },

      error: (err) => {
        this.isLoading = false;
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }

    });
  }

  // ADD THIS METHOD INSIDE COMPONENT

  applyFilters(): void {
    const filterValue =
      this.searchText?.trim().toLowerCase() || '';

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
