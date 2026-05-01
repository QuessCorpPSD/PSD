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
import { CollectionPendingReportService } from '../../../Service/BankInvoice/collection-pending-report.service';
import { ICollectionPendingReport } from '../../../Repository/BankInvoice/ICollectionPendingReport';
export const Common_TOKEN = new InjectionToken<ICollectionPendingReport>('Common_TOKEN');
import * as XLSX from 'xlsx';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-collectionpendingreport',
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
  templateUrl: './collectionpendingreport.component.html',
  styleUrl: './collectionpendingreport.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: CollectionPendingReportService }
  ],
})
export class CollectionpendingreportComponent {
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
  selectedEntityIds: any[] = [];   // for multi select



  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: CollectionPendingReportService
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
    this.getFinancialYear();
    this.getEntity();
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

    if (!this.selectedFinancialYear) {
      alert("Please select Financial Year");
      return;
    }

    if (!this.startDate) {
      alert("Please select As On Date");
      return;
    }

    this.isLoading = true;

    const payload = {
      companyId: Number(this.selectedCompanyId),
      financialId: Number(this.selectedFinancialYear),
      asOnDate: this.formatDate(this.startDate),
      allEntityId: (this.selectedEntityIds || [])
        .filter(x => x !== null && x !== undefined && x !== '' && x !== 0)
        .join(',')
    };

    this.service.CollectionPendingExport(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0 ?? [];

        if (!jsonData.length) {
          alert("No data available");
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "CollectionPending");

        XLSX.writeFile(
          wb,
          'CollectionPending_' + new Date().toISOString().split('T')[0] + '.xlsx'
        );
      },
      error: () => {
        this.isLoading = false;
        alert("Export failed");
      }
    });
  }
}
