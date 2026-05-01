import { CommonModule } from '@angular/common';
import { Component, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatCardTitle } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
export const Common_TOKEN = new InjectionToken<ILTDSReport>('Common_TOKEN');
import * as XLSX from 'xlsx';
import { Payperiodclass } from '../../../Models/Common';
import { ICollectionPendingReport } from '../../../Repository/BankInvoice/ICollectionPendingReport';
import { CollectionPendingReportService } from '../../../Service/BankInvoice/collection-pending-report.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ILTDSReport } from '../../../Repository/BankInvoice/ILTDSreport';
import { LTDSReportService } from '../../../Service/BankInvoice/ltdsreport.service';

@Component({
  selector: 'app-ltdsreport',
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatCardModule, FormsModule],
  templateUrl: './ltdsreport.component.html',
  styleUrl: './ltdsreport.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: LTDSReportService }
  ],
})
export class LTDSreportComponent {
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
  FinancialYearList: any[] = [];
  selectedFinancialYear: any;
  selectedDateType: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payPeriodId: number = 0;
  payperiods: String = '';
  DateTypeList: any[] = [];
  ReportTypeList: any[] = [];
  selectedReportType: any;
  BusinessUnitList: any[] = [];
  selectedBusinessUnit: any;
  isVerticalDisabled: boolean = true;
  tanNumber: any;




  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: LTDSReportService
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
    this.getFinancialYear();
    this.getLTDSReportType();
    // this.getBusinessUnits();

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
  getLTDSReportType() {
    this.service.GetLTDSReportType().subscribe({
      next: (res: any) => {

        this.ReportTypeList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Report Type');
      }
    });
  }

  onReportTypeChange() {

    // Always reset
    this.BusinessUnitList = [];
    this.selectedBusinessUnit = ''; 

    if (this.selectedReportType != 1144) {
      this.isVerticalDisabled = true;
      return;
    }

    this.isVerticalDisabled = false;

    this.service.GetBusinessUnits(this.selectedReportType).subscribe({
      next: (res: any) => {
        this.BusinessUnitList = res?.Data?.data?.Table0 ?? [];
      }
    });
  }
  exportToExcel(): void {


    if (!this.selectedReportType) {
      alert("Please select Report Type");
      return;
    }

    if (!this.selectedFinancialYear) {
      alert("Please select Financial Year");
      return;
    }

    if (!this.startDate || !this.endDate) {
      alert("Please select Date range");
      return;
    }


    if (this.selectedReportType == 1144 && !this.selectedBusinessUnit) {
      alert("Please select Business Unit");
      return;
    }

    this.isLoading = true;


    const payload = {
      reportTypeId: Number(this.selectedReportType),
      financialYearId: Number(this.selectedFinancialYear),
      tanNumber: this.tanNumber || '',
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate),
      businessUnitId: this.selectedReportType == 1144
        ? Number(this.selectedBusinessUnit)
        : 0
    };

    this.service.LTDSReportExport(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;
        const jsonData = res?.Data?.data?.Table0 ?? [];

        if (!jsonData.length) {
          alert("No data available");
          return;
        }


        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "LTDSReport");

        XLSX.writeFile(
          wb,
          'LTDSReport_' + new Date().toISOString().split('T')[0] + '.xlsx'
        );
      },

      error: () => {
        this.isLoading = false;
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



}



