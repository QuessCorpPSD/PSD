import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-gratuity-batch-generation',
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
  templateUrl: './gratuity-batch-generation.component.html',
  styleUrl: './gratuity-batch-generation.component.css'
})
export class GratuityBatchGenerationComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: [] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData)
  companyname: any;
  showTable = false;
  startDate: any;
  endDate: any;
  dataSource = new MatTableDataSource<any>([]);
  userdetail!: any;
  user_Id: any;
  selectedRows: any[] = [];

  displayedColumns: string[] = [
    'select',
    'Entity',
    'CompanyCode',
    'CompanyName',
    'PayPeriod',
    'GroupName',
    'EmployeeCode',
    'EmployeeName',
    'NetPay'
  ];


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }




  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;


  }

  toggleRow(row: any) {
    if (row.isSelected) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(
        x => x.Employee_Code !== row.Employee_Code // Or unique ID field
      );
    }
  }

  masterToggle(event: any) {
    if (event.checked) {
      this.dataSource.data.forEach(x => x.isSelected = true);
      this.selectedRows = [...this.dataSource.data];
    } else {
      this.dataSource.data.forEach(x => x.isSelected = false);
      this.selectedRows = [];
    }
  }

  isAllSelected() {
    return (
      this.dataSource.data.length > 0 &&
      this.selectedRows.length === this.dataSource.data.length
    );
  }





}



