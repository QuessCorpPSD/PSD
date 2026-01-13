import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanypermissionaddComponent } from '../companypermissionadd/companypermissionadd.component';

@Component({
  selector: 'app-companypermission',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, MatTooltipModule,],
  templateUrl: './companypermission.component.html',
  styleUrl: './companypermission.component.css'
})
export class CompanypermissionComponent {

  showTable = false;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  EmployeeId: any;
  BusinessUnitNames: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog) { }

  uploadDisplayedColumns: string[] = [
    'slNo', 'username', 'employeeid', 'companycode', 'companyname', 'businessunitname', 'permissionaccess'];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";
  }

  onsearch() {
    this.showTable = true;
    this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
    this.uploadedDataSource.paginator = this.paginator;
  }

  companyPermissionAdd() {
    this.dialog.open(CompanypermissionaddComponent, {
      width: '50%',
      height: '54vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

}
