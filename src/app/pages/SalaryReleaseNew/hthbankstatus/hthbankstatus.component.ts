import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { IHthbankstatus } from '../../../Repository/SalaryRequestNew/Ihthbankstatus';
import { HthbankstatusService } from '../../../Service/Service/SalaryRequestNew/hthbankstatus.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { constants } from 'buffer';
import { FromtodateComponent } from '../../../common/fromtodate/fromtodate.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const Pay_TOKEN = new InjectionToken<IHthbankstatus>('Pay_TOKEN');


@Component({
  selector: 'app-hthbankstatus',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatCardModule, MatTooltipModule, MatTableModule, MatPaginator],
  templateUrl: './hthbankstatus.component.html',
  styleUrl: './hthbankstatus.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: HthbankstatusService,
    }
  ]
})
export class HthbankstatusComponent {
  fromdate: any;
  todate: any;
  isLoading = false;
  istablevisible = false;
  searchText: any;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'SINo', 'Id', 'BatchId', 'NEFT_Bank_id', 'IsNonInvoice',
    'HTH', 'HTH_Date', 'BatchType', 'Amount', 'Head_Count',
    'File_Sno', 'File_Name', 'Transfer_Status', 'Transfer_Date', 'Response_Status', 'Response_Date', 'Responce_File',
    'UTR_Integration_Status', 'UTR_Integration_Date', 'Created_By', 'Created_On', 'Modified_By', 'Modified_on'

  ];
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, @Inject(Pay_TOKEN) private service: IHthbankstatus,) { }
 applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }
  onsearch() {
    this.istablevisible = true;



    if (!this.fromdate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.todate) {
      alert("Please Select To Date");
      return;
    }

    this.istablevisible = true;
    this.isLoading = true;

    const payload =
    {

      FromDate: this.fromdate,
      ToDate: this.todate

    }

    // Call service
    this.service.search(payload)
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
          this.dataSource.paginator = this.paginator;
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


    if (!this.fromdate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.todate) {
      alert("Please Select To Date");
      return;
    }

    this.isLoading = true;

    // Prepare parameters
    const payload = {

      FromDate: this.fromdate,
      ToDate: this.todate
    }

    // Call Export API
    this.service.exporttoexcel(payload).subscribe({
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
          XLSX.utils.book_append_sheet(wb, ws, 'HTHBankStatus');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `HTHBanKstatus_${timestamp}.xlsx`;
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
}
