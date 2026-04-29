import { Component, InjectionToken, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
export const Common_TOKEN = new InjectionToken<IClientAdvanceReport>('Common_TOKEN');
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IClientAdvanceReport } from '../../../Repository/BankInvoice/IClientAdvanceReport';
import { ClientadvanceReportsService } from '../../../Service/BankInvoice/clientadvance-reports.service';
import { Pay_Token } from '../../GlobalMasters/computationruleadd/computationruleadd.component';

@Component({
  selector: 'app-client-advance-report',
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
    MatTooltipModule, MatCardModule, CompanyallComponent],
  templateUrl: './client-advance-report.component.html',
  styleUrl: './client-advance-report.component.css',
  providers: [
    { provide: Pay_Token, useClass: ClientadvanceReportsService }
  ],

})
export class ClientAdvanceReportComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: [] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData)
  displayedColumns: string[] = [
    'sno',
    'companyCode',
    'CompanyName',
    'referenceNumber',
    'RTGSNo',
    'PaymentDate',
    'TransactionAmount',
    'AdjustedAmount',
    'BalanceAmount',
    'Description',
    'UserName',
    'PostedDate',
    'GroupName',
    'SubCustomerCode'
  ];
  dataSource = new MatTableDataSource<any>([]);
  companyname: any;
  showTable = false;
  startDate: any;
  endDate: any;
  userdetail: any;
  isLoading = false;
  isAddclicked = false;
  DateTypeList: any[] = [];
  selectedDateType: any;


  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: ClientadvanceReportsService
  ) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.companyname = company.companyName;
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
    this.BindDateType();
  }

  onSearch() {
    this.isLoading = true;
    this.showTable = true;

    const companyId = this.selectedCompanyId || 0;
    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    this.service.Search(companyId, fromDate, toDate).subscribe({
      next: (res: any) => {

        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        const reportData = res?.Data?.data?.Table0 ?? [];

        if (reportData.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(reportData);
        this.dataSource.paginator = this.paginator;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading report data', err);
        alert('Error loading report data');
        this.isLoading = false;
      }
    });
  }


  exportToExcel(): void {

    this.isLoading = true;

    const payload = {
      companyId: (this.selectedCompanyId || 0).toString(),
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate)
    };


    this.service.ClientAdvancePaymentReportExport(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || jsonData.length === 0) {
          alert("No data available");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ClientAdvancePaymentReport");

        const date = new Date().toISOString().split('T')[0];
        const fileName = `ClientAdvancePaymentReport_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },
      error: (err) => {
        this.isLoading = false;
        alert("Export failed");
        console.error(err);
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

  closeclick() {
    this.isAddclicked = false;
  }

  AddLtaOpen() {
    this.isAddclicked = true;
  }

  BindDateType() {
    this.service.GetDateType('GetDateTypeClientAdvPay', 'GetDateTypeClientAdvPay')
      .subscribe(res => {
        this.DateTypeList = res?.Data?.data?.Table0
          || res?.Data?.data?.Table
          || [];
      });
  }


}
