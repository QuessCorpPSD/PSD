import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-reimbursement-loan-pre-closure',
  imports: [CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    CompanyallComponent,
    FormsModule,
    MatRadioModule],
  templateUrl: './reimbursement-loan-pre-closure.component.html',
  styleUrl: './reimbursement-loan-pre-closure.component.css'
})
export class ReimbursementLoanPreClosureComponent {
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




  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete',
    'edit',
    'SNo',
    'CompanyCode',
    'EmployeeCode',
    'LoanPreCloseDate',
    'Loan Number',
    'Loan Amount',
    'EMI',
    'Balance Amount',
    'PreClose Amount',
    'Adjustment'
  ];

  constructor(private dialog: MatDialog, private decry: EncryptionService, private _sessionStoreage: SessionStorageService, private fb: FormBuilder) { }


  dataSource = new MatTableDataSource<any>([]);
  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

  }
  handleCompanyEvent2(company: any) {
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

    const today = new Date().toISOString().substring(0, 10);

    this.LoanPreForm = this.fb.group({
      Company_Code: ['', Validators.required],
      PreClosure_Date: [today, Validators.required],

      Employee_Code: ['', Validators.required],
      Employee_Name: [''],

      Loan_Number: ['', Validators.required],
      Loan_Amount: [''],
      EMI: [''],

      Adjustable: ['', Validators.required],

      Paid_Amount: [''],
      Balance_Amount: [''],

      PreClosed_Amount: ['']
    });

    // Disable auto-calculated / readonly fields
    this.LoanPreForm.get('Employee_Name')?.disable();
    this.LoanPreForm.get('Loan_Amount')?.disable();
    this.LoanPreForm.get('EMI')?.disable();
    this.LoanPreForm.get('Paid_Amount')?.disable();
    this.LoanPreForm.get('Balance_Amount')?.disable();
  }


  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.LoanPreForm.reset();
  }

  closeclick() {
    this.isAddclicked = false;
  }

  onSearchClick() {
    this.showTable = true;
    this.dataSource.data = this.uploadedData;

  }




}
