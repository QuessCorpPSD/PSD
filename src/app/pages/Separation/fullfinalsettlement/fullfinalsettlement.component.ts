import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-fullfinalsettlement',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    CompanyallComponent
  ],
  templateUrl: './fullfinalsettlement.component.html',
  styleUrl: './fullfinalsettlement.component.css'
})
export class FullfinalsettlementComponent {

  selectedCompanyId!: number;
  payPeriodType!: string;
  selectedCompanyCode: any;
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;
  isAddclicked = false;
  LoanPreForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  selectedRowIndex: number | null = null;

  // 🔹 ADDED: tab control
  activeTab: 'FINAL' | 'OTHER' = 'FINAL';

  // 🔹 ADDED: Final settlement table rows
  finalSettlementRows: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete',
    'edit',
    'SNo',
    'CompanyCode',
    'EmployeeCode',
    'EmployeeName',
    'PayPeriod',
  ];

  CompanyId: any;
  CompanyCode: any;

  constructor(
    private dialog: MatDialog,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private fb: FormBuilder
  ) { }

  dataSource = new MatTableDataSource<any>([]);
  dataSource1 = new MatTableDataSource<any>([]);

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handleCompanyEvent2(company: any) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
  }

  ngOnInit(): void {

    // 🔹 ADDED: form initialization (required)
    this.LoanPreForm = this.fb.group({
      Company_Code: [''],
      PreClosure_Date: [''],
      Employee_Code: ['']
    });

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }

    const userInfo = {
      userId: this.userdetail?.user_Id,
      userName: this.userdetail?.userName,
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

  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.activeTab = 'FINAL'; // 🔹 ADDED
    this.LoanPreForm.reset();
    this.finalSettlementRows = []; // 🔹 ADDED
  }

  closeclick() {
    this.isAddclicked = false;
  }

  // 🔹 ADDED: Add row
  addRow() {

    // OPTIONAL validation (keep or remove)
    if (this.LoanPreForm.invalid) {
      this.LoanPreForm.markAllAsTouched();
      alert('Please fill all required fields.');
      return;
    }

    const newRow = {
      PayCode: '',
      PayDescription: '',
      Type: '',
      Amount: ''
    };

    // 🔥 IMPORTANT: update MatTableDataSource
    this.dataSource1.data = [...this.dataSource1.data, newRow];
  }
  selectRow(index: number) {
    this.selectedRowIndex = index;
  }


  // 🔹 ADDED: Delete row
  deleteRow() {

    if (this.selectedRowIndex === null) {
      alert('Please select at least one row to delete.');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this row?');
    if (!confirmDelete) {
      return;
    }

    const data = this.dataSource1.data;
    data.splice(this.selectedRowIndex, 1);

    // 🔥 IMPORTANT: reassign dataSource
    this.dataSource1.data = [...data];
    this.selectedRowIndex = null;
  }

  displayedColumns1: string[] = [
    'SNo',
    'PayCode',
    'PayDescription',
    'Type',
    'Amount',
  ];
}
