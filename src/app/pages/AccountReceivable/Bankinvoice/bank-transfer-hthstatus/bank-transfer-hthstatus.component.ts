import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { IBankTransferhthStatus } from '../../../../Repository/BankInvoice/BankInvoiceRepository/IBankTransferhthStatus';
import { BanktransferhthstatusService } from '../../../../Service/BankInvoice/BankInvoiceService/banktransferhthstatus.service';

export const Common_TOKEN = new InjectionToken<IBankTransferhthStatus>('Common_TOKEN');



@Component({
  selector: 'app-bank-transfer-hthstatus',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule
  ],
  templateUrl: './bank-transfer-hthstatus.component.html',
  styleUrl: './bank-transfer-hthstatus.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: BanktransferhthstatusService }
  ],

})
export class BankTransferHTHStatusComponent {

  displayedColumns: string[] = [
    'sno',
    'batchId',
    'neftBankId',
    'isNonInvoice',
    'hth',
    'hthDate',
    'batchType',
    'amount',
    'headCount',
    'fileSno',
    'fileName',
    'transferStatus',
    'transferDate',
    'responseStatus',
    'responseDate',
    'responseFile',
    'utrIntegrationStatus',
    'utrIntegrationDate',
    'createdBy',
    'createdOn',
    'modifiedBy',
    'modifiedOn'
  ];

  dataSource = new MatTableDataSource<any>([]);

  showTable = false;
  searchText: string = '';
  startDate: any;
  endDate: any;

  userdetail: any;

  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: BanktransferhthstatusService
  ) { }

  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in session storage');
    }

    const today = new Date().toISOString().split('T')[0];

    this.startDate = today;
    this.endDate = today;

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilters() {

    const filterValue =
      this.searchText?.trim().toLowerCase();

    this.dataSource.filter = filterValue;

  }
  // SEARCH

  onSearch() {

    this.isLoading = true;

    this.showTable = true;

    const fromDate =
      this.formatDate(this.startDate);

    const toDate =
      this.formatDate(this.endDate);

    this.service.Search(fromDate, toDate)
      .subscribe({

        next: (res: any) => {

          if (res?.Data?.statusCode === '400') {

            alert(res.Data.message);

            this.dataSource.data = [];

            this.isLoading = false;

            return;
          }

          const reportData =
            res?.Data?.data?.Table0 ?? [];

          if (reportData.length === 0) {

            alert('No data found');

            this.dataSource.data = [];

            this.isLoading = false;

            return;
          }

          this.dataSource =
            new MatTableDataSource(reportData);

          this.dataSource.filterPredicate =
            (data: any, filter: string) => {

              const searchText =
                filter.toLowerCase();

              return (

                data.BatchId?.toString().toLowerCase().includes(searchText) ||

                data.NEFT_Bank_id?.toString().toLowerCase().includes(searchText) ||

                data.IsNonInvoice?.toString().toLowerCase().includes(searchText) ||

                data.HTH?.toString().toLowerCase().includes(searchText) ||

                data.HTH_Date?.toString().toLowerCase().includes(searchText) ||

                data.BatchType?.toString().toLowerCase().includes(searchText) ||

                data.Amount?.toString().toLowerCase().includes(searchText) ||

                data.Head_Count?.toString().toLowerCase().includes(searchText) ||

                data.File_Sno?.toString().toLowerCase().includes(searchText) ||

                data.File_Name?.toString().toLowerCase().includes(searchText) ||

                data.Transfer_Status?.toString().toLowerCase().includes(searchText) ||

                data.Transfer_Date?.toString().toLowerCase().includes(searchText) ||

                data.Response_Status?.toString().toLowerCase().includes(searchText) ||

                data.Response_Date?.toString().toLowerCase().includes(searchText) ||

                data.Responce_File?.toString().toLowerCase().includes(searchText) ||

                data.UTR_Integration_Status?.toString().toLowerCase().includes(searchText) ||

                data.UTR_Integration_Date?.toString().toLowerCase().includes(searchText) ||

                data.Created_By?.toString().toLowerCase().includes(searchText) ||

                data.Created_on?.toString().toLowerCase().includes(searchText) ||

                data.Modified_By?.toString().toLowerCase().includes(searchText) ||

                data.Modified_on?.toString().toLowerCase().includes(searchText)

              );

            };

          this.dataSource.paginator =
            this.paginator;

          this.isLoading = false;

        },

        error: (err) => {

          console.error(
            'Error loading data',
            err
          );

          alert('Error loading data');

          this.isLoading = false;

        }

      });

  }

  // EXPORT EXCEL

  exportToExcel(): void {

    this.isLoading = true;

    const fromDate = this.formatDate(this.startDate);

    const toDate = this.formatDate(this.endDate);

    this.service.ExportToExcel(fromDate, toDate)
      .subscribe({

        next: (res: any) => {

          this.isLoading = false;

          const jsonData = res?.Data?.data?.Table0;

          if (!jsonData || jsonData.length === 0) {

            alert('No data available');

            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            'BankTransferHTHStatus'
          );

          const date = new Date().toISOString().split('T')[0];

          const fileName =
            `BankTransferHTHStatus_${date}.xlsx`;

          XLSX.writeFile(wb, fileName);

        },

        error: (err) => {

          this.isLoading = false;

          alert('Export failed');

          console.error(err);
        }

      });
  }

  // DATE FORMAT

  formatDate(date: any): string {

    if (!date) return '';

    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

}