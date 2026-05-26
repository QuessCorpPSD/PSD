import { CommonModule } from '@angular/common';
import { Component, InjectionToken } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import * as XLSX from 'xlsx';

import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';
import { IClientLegerReport } from '../../../../Repository/BankInvoice/BankInvoiceRepository/IclientLegerReport';
import { ClientLegerReportService } from '../../../../Service/BankInvoice/BankInvoiceService/client-leger-report.service';

export const Common_TOKEN = new InjectionToken<IClientLegerReport>('Common_TOKEN');
@Component({
  selector: 'app-clientledgerreport',
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
    MatSelectModule,
    MatTooltipModule, MatCardModule, CompanyallComponent],
  templateUrl: './clientledgerreport.component.html',
  styleUrl: './clientledgerreport.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: ClientLegerReportService }
  ],
})
export class ClientledgerreportComponent {

  selectedCompanyId: any;
  selectedCompanyCode: any;
  companyname: any;
  showTable = false;
  startDate: any = '';
  endDate: any = '';
  userdetail: any;
  isLoading = false;
  Entity: any;
  Financialyear: any;
  FinancialYearList: any[] = [];
  EntityList: any[] = [];
  EntityId: any;
  selectedFinancialYear: any;
  selectedEntityIds: any[] = [];
  isDateDisabled: boolean = true; 



  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: ClientLegerReportService
  ) { }


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
    // const today = new Date().toISOString().split('T')[0];
    // this.startDate = today;
    // this.endDate = today;
    this.getFinancialYear();

  }

  getFinancialYear() {
    this.service.GetFinancialYear().subscribe({
      next: (res: any) => {
       

        this.FinancialYearList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Financial Year');
      }
    });
  }


  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert("Please select Company");
      return;
    }

    if (!this.startDate || !this.endDate) {
      alert("Please select Date range");
      return;
    }

    this.isLoading = true;
    const payload = {
      companyId: Number(this.selectedCompanyId),
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate)
    };


    this.service.ClientLegerExport(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;        
        const jsonData = res?.Data?.data?.Table1 ?? [];

        if (!jsonData || jsonData.length === 0) {
          alert("No data available");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "ClientLedger");

        XLSX.writeFile(
          wb,
          'ClientLedger_' + new Date().toISOString().split('T')[0] + '.xlsx'
        );
      },

      error: (err) => {
        this.isLoading = false;
        console.error("Export Error:", err);
        alert("Export failed");
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
  onFinancialYearChange() {

    if (!this.selectedFinancialYear) {
      this.startDate = '';
      this.endDate = '';
      this.isDateDisabled = true;
      return;
    }

    this.isDateDisabled = false;

    const fy = this.FinancialYearList.find(
      x => x.Financial_Year_Id == this.selectedFinancialYear
    );

    if (!fy) return;

    const yearText = fy.Financial_Year_Name; // "2023-24"

    const parts = yearText.split('-');

    if (parts.length < 2) return;

    const startYear = parts[0].trim();
    let endYear = parts[1].trim();

    if (endYear.length === 2) {
      endYear = startYear.substring(0, 2) + endYear;
    }

    this.startDate = `${startYear}-04-01`;
    this.endDate = `${endYear}-03-31`;
  }
}
