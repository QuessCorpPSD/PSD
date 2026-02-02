import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-loanandadvance',
  imports: [MatPaginator, MatTableModule, MatIcon, CompanyallComponent, MatCardModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './loanandadvance.component.html',
  styleUrl: './loanandadvance.component.css'
})
export class LoanandadvanceComponent {
  employeeCode: string = '';

  displayedColumns: string[] = [
    'delete',
    'edit',
    'sno',
    'companyCode',
    'employeeCode',
    'employeeName',
    'department',
    'designation',
    'loanType',
    'loanNumber',
    'totalLoanAmount',
    'interestRate',
    'emi',
    'startDate',
    'date',
    'payPeriod'
  ];
  emiDisplayedColumns: string[] = [
    'sno',
    'principalOS',
    'paySeqNo',
    'principal',
    'emi',
    'interest',
    'pay_period',
    'interest_'
  ];

  emiDataSource = new MatTableDataSource<any>([]);
  LoanandadvanceForm!: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  isEditMode = false;
  isAddclicked = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  companyId: any;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  selectedCompanyIdadd: any;
  selectedCompanyCodeadd: any;
  handleCompanyEvent(company: any) {
    this.companyId = company.companyId;
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }
  handleCompanyEvent2(company: any) {
    this.selectedCompanyIdadd = company.companyId;
    this.selectedCompanyCodeadd = company.companyId;
  }
  closeclick() {
    this.isAddclicked = false;
  }
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {

    this.LoanandadvanceForm = this.fb.group({

      CompanyCode: ['', Validators.required],
      PayCategory: ['', Validators.required],

      EmployeeCode: ['', Validators.required],
      EmployeeName: [''],
      Department: [''],
      Designation: [''],

      LoanType: ['', Validators.required],
      LoanNumber: [''],
      StartDate: ['', Validators.required],

      OpeningBalance: ['', Validators.required],
      LoanAdvanceAmount: ['', Validators.required],
      TotalLoanAmount: [''],

      TypeOfInterest: ['Zero Interest'],
      BankInterest: [0, Validators.required],
      InterestRateGiven: [0],
      PerkPercent: [0],

      TotalAdditionalAmount: [''],
      TotalPrepayment: [''],

      EMI: ['', Validators.required],
      NumberOfInstallments: ['', Validators.required],
      Date: ['', Validators.required],

      // 👇 EMI Schedule Table
      emiDetails: this.fb.array([])

    });
    this.LoanandadvanceForm.get('EmployeeName')?.disable();
    this.LoanandadvanceForm.get('Department')?.disable();
    this.LoanandadvanceForm.get('Designation')?.disable();
    this.LoanandadvanceForm.get('LoanNumber')?.disable();
    this.LoanandadvanceForm.get('TotalLoanAmount')?.disable();
    this.LoanandadvanceForm.get('TotalAdditionalAmount')?.disable();
    this.LoanandadvanceForm.get('TotalPrepayment')?.disable();
    this.LoanandadvanceForm.get('InterestRateGiven')?.disable();
    this.LoanandadvanceForm.get('PerkPercent')?.disable();
    this.LoanandadvanceForm.get('EMI')?.disable();
    this.LoanandadvanceForm.get('BankInterest')?.disable();

  }

  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;

  }




}
