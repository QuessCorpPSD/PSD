import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-fand-fattendence',
  imports: [CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    CompanyallComponent,
    MatRadioModule],
  templateUrl: './fand-fattendence.component.html',
  styleUrl: './fand-fattendence.component.css'
})
export class FandFattendenceComponent {
  selectedCompanyId!: number;
  payPeriodType!: string;
  selectedCompanyCode: any;
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;
  isAddclicked = false;
  fandfForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;




  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete',
    'edit',
    'SNo',
    'EmployeeCode',
    'EmployeeName',
    'PaySequenceNo',
    'PayPeriod',
    'MonthDays',
    'WorkDays',
    'ProcessingSeqNo',
    'ProcessingPayPeriod',
    'EffectiveDate'
  ];

  constructor(private dialog: MatDialog, private decry: EncryptionService, private _sessionStoreage: SessionStorageService, private fb: FormBuilder) { }


  dataSource = new MatTableDataSource<any>([]);
  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    const userInfo = {
      userId: this.userdetail.user_Id,
      userName: this.userdetail.userName,
    };

  }

  onSearchClick() {
    this.showTable = true;
    this.dataSource.data = this.uploadedData;

  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr.replace(/-/g, '/').replace('T', ' '));
    return date.toISOString().split('T')[0];
  }

}
