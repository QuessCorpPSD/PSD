import { CommonModule } from '@angular/common';
import { Component, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
export const Common_TOKEN = new InjectionToken<IInvoiceCollection>('Common_TOKEN');
import * as XLSX from 'xlsx';
import { IInvoiceCollection } from '../../../Repository/BankInvoice/IInvoiceCollection';
import { InvoiceCollectionServiceService } from '../../../Service/BankInvoice/invoice-collection-service.service';

@Component({
  selector: 'app-invoice-collectionreport',
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
    MatTooltipModule, MatCardModule, CompanyallComponent, PayPeriodComponent],
  templateUrl: './invoice-collectionreport.component.html',
  styleUrl: './invoice-collectionreport.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: InvoiceCollectionServiceService }
  ],
})
export class InvoiceCollectionreportComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  companyname: any;
  showTable = false;
  startDate: any;
  endDate: any;
  userdetail: any;
  isLoading = false;
  Entity: any;
  Financialyear: any;
  selectedDateType: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payPeriodId: number = 0;
  payperiods: String = '';
  DateTypeList: any[] = [];




  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: InvoiceCollectionServiceService
  ) { }


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.companyname = company.companyName;
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
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
    this.payPeriodType = "All";
    this.getDateType();
  }

  getDateType() {
    this.service.GetDateType('GetDateType', 'GetDateType').subscribe({
      next: (res: any) => {
        this.DateTypeList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Date Type');
      }
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }
  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert("Please select Company");
      return;
    }

    if (!this.selectedDateType) {
      alert("Please select Date Type");
      return;
    }

    if (!this.startDate || !this.endDate) {
      alert("Please select Date range");
      return;
    }

    this.isLoading = true;

    const payload = {
      dateTypeId: Number(this.selectedDateType), 
      companyId: Number(this.selectedCompanyId),
      payPeriodId: this.payPeriodId || 0,
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate)
    };

    this.service.InvoiceCollectionExport(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0 ?? [];

        if (!jsonData.length) {
          alert("No data available");
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "InvoiceCollection");

        XLSX.writeFile(
          wb,
          'InvoiceCollection_' + new Date().toISOString().split('T')[0] + '.xlsx'
        );
      },
      error: () => {
        this.isLoading = false;
        alert("Export failed");
      }
    });
  }


}
