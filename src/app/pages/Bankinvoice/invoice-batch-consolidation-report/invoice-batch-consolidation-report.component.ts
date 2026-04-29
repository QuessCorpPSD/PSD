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
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Common_TOKEN = new InjectionToken<IBatchConsolidationReport>('Common_TOKEN');
import * as XLSX from 'xlsx';
import { IBatchConsolidationReport } from '../../../Repository/BankInvoice/IInvoiceBatchConsolidation';
import { InvoiceBatchConsolidationService } from '../../../Service/BankInvoice/invoice-batch-consolidation.service';

@Component({
  selector: 'app-invoice-batch-consolidation-report',
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
    MatTooltipModule, MatCardModule],
  templateUrl: './invoice-batch-consolidation-report.component.html',
  styleUrl: './invoice-batch-consolidation-report.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: InvoiceBatchConsolidationService }
  ],
})
export class InvoiceBatchConsolidationReportComponent {
  startDate: any;
  endDate: any;
  userdetail: any;
  isLoading = false;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  companyname: any;
  EntityList: any[] = [];
  selectedEntityIds: number[] = [];
  selectedReportType: string = '';
  searchText: string = '';

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: InvoiceBatchConsolidationService
  ) { }


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
    this.getBusinessUnit();
  }


  getBusinessUnit() {
    this.service.GetBusinessUnit().subscribe({
      next: (res: any) => {
        this.EntityList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Business Units');
      }
    });
  }

  onEntitySelect(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedEntityIds.includes(id)) {
        this.selectedEntityIds.push(id);
      }
    } else {
      this.selectedEntityIds = this.selectedEntityIds.filter(x => x !== id);
    }
  }

  // ✅ Select all
  selectAll() {
    this.selectedEntityIds = this.EntityList.map(e => e.Entity_Id);
  }

  // ✅ Unselect all
  unselectAll() {
    this.selectedEntityIds = [];
  }

  // exportToExcel(): void {

  //   if (!this.selectedReportType) {
  //     alert("Please select Report Type");
  //     return;
  //   }

  //   if (!this.selectedEntityIds.length) {
  //     alert("Please select at least one Entity");
  //     return;
  //   }

  //   this.isLoading = true;

  //   const payload = {
  //     allEntityId: this.selectedEntityIds.join(','),
  //     fromDate: this.formatDate(this.startDate),
  //     toDate: this.formatDate(this.endDate),
  //     txtSearch: this.searchText || '',
  //     reportType: this.selectedReportType
  //   };

  //   console.log("Payload:", payload);

  //   this.service.InvoiceBatchConsolidationExport(payload).subscribe({

  //     next: (res: any) => {

  //       this.isLoading = false;

  //       const jsonData = res?.Data?.data?.Table0;

  //       if (!jsonData || jsonData.length === 0) {
  //         alert("No Data to Export"); // ✔ same as MVC
  //         return;
  //       }

  //       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
  //       const wb: XLSX.WorkBook = XLSX.utils.book_new();

  //       XLSX.utils.book_append_sheet(wb, ws, "InvoiceBatch");

  //       const date = new Date().toISOString().split('T')[0];
  //       XLSX.writeFile(wb, `InvoiceBatch_${date}.xlsx`);
  //     },

  //     error: (err) => {
  //       this.isLoading = false;
  //       alert("Export failed");
  //       console.error(err);
  //     }
  //   });
  // }


  exportToExcel(): void {

    if (!this.selectedReportType) {
      alert("Select Report Type");
      return;
    }

    if (!this.selectedEntityIds.length) {
      alert("Select Entity");
      return;
    }

    this.isLoading = true;

    const payload = {
      allEntityId: this.selectedEntityIds.join(','),
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate),
      txtSearch: this.searchText || '',
      reportType: this.selectedReportType
    };

    this.service.InvoiceBatchConsolidationExport(payload).subscribe({

      next: (res: any) => {

        this.isLoading = false;

        const data = res?.Data?.data;

        if (!data || !data.Table0 || data.Table0.length === 0) {
          alert("No Data to Export");
          return;
        }

        const wb: XLSX.WorkBook = XLSX.utils.book_new();


        if (this.selectedReportType === 'InvoiceBatchConsolidate') {

          const ws = XLSX.utils.json_to_sheet(data.Table0);
          XLSX.utils.book_append_sheet(wb, ws, "BatchConsolidate");

        }

        else if (this.selectedReportType === 'InvoiceBatchSummary') {


          if (data.Table0?.length) {
            const ws1 = XLSX.utils.json_to_sheet(data.Table0);
            XLSX.utils.book_append_sheet(wb, ws1, "OutflowSummary");
          }


          if (data.Table1?.length) {
            const ws2 = XLSX.utils.json_to_sheet(data.Table1);
            XLSX.utils.book_append_sheet(wb, ws2, "FundingSummary");
          }
        }

        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `InvoiceBatch_${date}.xlsx`);
      },

      error: (err) => {
        this.isLoading = false;
        alert("Export failed");
        console.error(err);
      }
    });
  }
  
  formatDate(date: any): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

}
