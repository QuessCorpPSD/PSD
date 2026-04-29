import { CommonModule } from '@angular/common';
import { Component, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { UnpaidInvoiceReportService } from '../../../Service/BankInvoice/unpaid-invoice-report.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Common_TOKEN = new InjectionToken<IUnpaidInvoiceReport>('Common_TOKEN');
import * as XLSX from 'xlsx';
import { IUnpaidInvoiceReport } from '../../../Repository/BankInvoice/IunpaidInvoiceReport';

@Component({
  selector: 'app-unpaid-invoice-report',
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
  templateUrl: './unpaid-invoice-report.component.html',
  styleUrl: './unpaid-invoice-report.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: UnpaidInvoiceReportService }
  ],

})
export class UnpaidInvoiceReportComponent {
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
  EntityList: any[] = [];
  EntityId: any;
  selectedFinancialYear: any;
  asOnDate: any;
  selectedEntityIds: any[] = []; 



  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: UnpaidInvoiceReportService
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
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;
    this.getEntity();
  }




  getEntity() {
    const action = 'GetEntity'; 

    this.service.GetEntity(action).subscribe({
      next: (res: any) => {
        this.EntityList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Entity');
      }
    });
  }
  onEntitySelect(event: any) {
    const value = event.target.value.toString();

    if (event.target.checked) {
      if (!this.selectedEntityIds.includes(value)) {
        this.selectedEntityIds.push(value);
      }
    } else {
      this.selectedEntityIds = this.selectedEntityIds.filter(x => x !== value);
    }
  }

  selectAll() {
    this.selectedEntityIds = this.EntityList.map(e => e.EntityId.toString());
  }

  unselectAll() {
    this.selectedEntityIds = [];
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

    if (!this.startDate || !this.endDate) {
      alert("Please select Date range");
      return;
    }

    this.isLoading = true;

    const payload = {
      companyId: this.selectedCompanyId,
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate),
      allEntityId: (this.selectedEntityIds || []).join(',')
    };


    this.service.UnpaidInvoiceExport(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0 ?? [];

        if (!jsonData.length) {
          alert("No data available");
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "UnpaidInvoice");

        XLSX.writeFile(
          wb,
          'UnpaidInvoice_' + new Date().toISOString().split('T')[0] + '.xlsx'
        );
      },
      error: () => {
        this.isLoading = false;
        alert("Export failed");
      }
    });
  }
}
