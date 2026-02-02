import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-passwordunlock',
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, MatTooltipModule, MatCheckboxModule],
  templateUrl: './passwordunlock.component.html',
  styleUrl: './passwordunlock.component.css'
})
export class PasswordunlockComponent {
  showTable = false;
  userdetail: any;
  Username: any;
  Role: any;
  inActive: boolean = false;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog) { }

  uploadDisplayedColumns: string[] = [
    'slNo', 'name', 'employeeid', 'emailid', 'reportingto', 'roles', 'activestatus', 'lockingstatus'];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }

  onsearch() {
    this.showTable = true;
    this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
    this.uploadedDataSource.paginator = this.paginator;
  }

}
