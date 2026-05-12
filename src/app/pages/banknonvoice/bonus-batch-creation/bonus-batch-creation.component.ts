import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
export const Common_TOKEN = new InjectionToken<IPartialBatchCreation>('Common_TOKEN');

import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IPartialBatchCreation } from '../../../Repository/banknonvoice/IPartialBatchCreation';
import { PartialBatchCreationService } from '../../../Service/banknonvoice/partial-batch-creation.service';


@Component({
  selector: 'app-bonus-batch-creation',
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './bonus-batch-creation.component.html',
  styleUrl: './bonus-batch-creation.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: PartialBatchCreationService }
  ],
})
export class BonusBatchCreationComponent {

  searchText: string = '';
  isLoading = false;
  userdetail!: any;
  user_Id: any;

  companyList: any[] = [];
  selectedCompanyId: any = 0;
  selectedCompanyCode: any = '';
  companyname: any = '';
  Remarks: string = '';
  uploadData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData);
  dataSource = new MatTableDataSource<any>([]);
  showTable = false;

  selectedRows: any[] = [];

  displayedColumns: string[] = [
    'select',
    'CompanyCode',
    'PayPeriod',
    'BatchId',

  ];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private decry: EncryptionService,
    private service: PartialBatchCreationService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.GetNonInvoiceEntity();
  }

  GetNonInvoiceEntity() {
    this.service.GetNonInvoiceEntity().subscribe({
      next: (res: any) => {
        this.companyList = res?.Data?.data?.Table0 ?? [];
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load Business Units');
      }
    });
  }

  isAllSelected() {
    return this.selectedRows.length === this.dataSource.data.length;
  }

  masterToggle(event: any) {
    if (event.checked) {
      this.selectedRows = [...this.dataSource.data];
    } else {
      this.selectedRows = [];
    }
  }

  toggleRow(row: any) {
    if (row.isSelected) {

      const exists = this.selectedRows.find(
        x => x.Salary_Process_Initiate_detail_Id === row.Salary_Process_Initiate_detail_Id
      );

      if (!exists) {
        this.selectedRows.push(row);
      }

    } else {

      this.selectedRows = this.selectedRows.filter(
        x => x.Salary_Process_Initiate_detail_Id !== row.Salary_Process_Initiate_detail_Id
      );
    }
  }


}



