import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { BankneftcultureService } from '../../../Service/banknonvoice/bankneftculture.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { BatchconsolidationService } from '../../../Service/banknonvoice/batchconsolidation.service';
import { IBatchConsolidationReport } from '../../../Repository/banknonvoice/IBatchConsolidationReport.service';
import * as XLSX from 'xlsx';

const Pay_TOKEN = new InjectionToken<IBatchConsolidationReport>('Pay_TOKEN');

@Component({
  selector: 'app-bankconsolidatedreport',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './bankconsolidatedreport.component.html',
  styleUrl: './bankconsolidatedreport.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BatchconsolidationService,
    }
  ]

})
export class BankconsolidatedreportComponent {
  EntityList: any[] = [];
  selectedEntityIds: number[] = [];
  selectedReportType: string = '';
  searchText: string = '';
  isLoading: boolean = false;
  reporttypes: any;
  fromdate: any;
  todate: any;
  searchby: any;

  constructor(
    @Inject(Pay_TOKEN) private service: IBatchConsolidationReport,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }
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

  selectAll() {
    this.selectedEntityIds = this.EntityList.map(e => e.Company_Id);
  }

  unselectAll() {
    this.selectedEntityIds = [];
  }
  ngOnInit() {
    this.getBusinessUnit();
    this.getentity();
  }
  getBusinessUnit() {

  }
  getentity() {
    this.service.GetEntity().subscribe({
      next: res => {

        this.EntityList = res?.Data?.data?.Table0 || [];
      },

    });
  }

  exportToExcel(): void {
    this.isLoading = true;
    const reporttype = this.reporttypes;
    const fromdate = this.fromdate;
    const todate = this.todate;
    const entityid = this.selectedEntityIds;
    const searchby = this.searchby ?? '""';
    console.log(this.searchby);
    console.log(searchby);
    this.service.ExportToExcel(entityid, fromdate, todate, searchby, reporttype).subscribe({
      next: (res) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available');
            this.isLoading = false;
            return;
          }


          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `batchconsolidatedreport${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
      },
    });
  }

}
