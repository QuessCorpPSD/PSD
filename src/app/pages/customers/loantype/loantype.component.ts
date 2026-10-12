import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-loantype',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    CompanyallComponent
],
  templateUrl: './loantype.component.html',
  styleUrl: './loantype.component.css',
})
export class LoantypeComponent implements OnInit {

  // ---------- GRID ----------
  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Company_code',
    'Pay_Code',
    'Eligibility',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ---------- FILTERS ----------
  selectedCompanyId: number | null = null;
  selectedCompanyCode = '';
  companyList: any[] = [
    { companyId: 1, companyCode: 'C001' },
    { companyId: 2, companyCode: 'C002' },
    { companyId: 3, companyCode: 'C003' },
  ];

  showLoanPopup = false;
  isEditMode = false;
  showErrors = false;
  loanTypeForm!: FormGroup;
  rowData: any;

  payCodeList: any[] = [
    { payCodeId: 10, payCode: 'PAY01' },
    { payCodeId: 11, payCode: 'PAY02' },
    { payCodeId: 12, payCode: 'PAY03' },
  ];

  private tableData: any[] = [
    { loanTypeId: 1, companyId: 1, Company_code: 'C001', Pay_Code: 'PAY01', Eligibility: 'Permanent Employees' },
    { loanTypeId: 2, companyId: 2, Company_code: 'C002', Pay_Code: 'PAY02', Eligibility: 'Contract Employees' },
    { loanTypeId: 3, companyId: 3, Company_code: 'C003', Pay_Code: 'PAY03', Eligibility: 'All Employees' },
  ];

  constructor(private fb: FormBuilder) {}


  ngOnInit(): void {
    this.buildForm();
    this.onsearch(); 
  }

  private buildForm(): void {
    this.loanTypeForm = this.fb.group({
      companyId: [null, Validators.required],
      payCodeId: [null, Validators.required],
      eligibility: ['', Validators.required],
    });
  }


  handleCompanyEvent(company: any): void {
    if (!company) {
      this.selectedCompanyId = null;
      this.selectedCompanyCode = '';
      return;
    }
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  onsearch(): void {
    let filtered = [...this.tableData];

    if (this.selectedCompanyId) {
      filtered = filtered.filter(r => r.companyId === this.selectedCompanyId);
    }

    this.dataSource = new MatTableDataSource(filtered);
    this.dataSource.paginator = this.paginator;
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.loanTypeForm.reset();
    this.showLoanPopup = true;
  }

  editLoanType(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showLoanPopup = true;

    this.loanTypeForm.patchValue({
      companyId: row.companyId,
      payCodeId: this.payCodeList.find(p => p.payCode === row.Pay_Code)?.payCodeId ?? null,
      eligibility: row.Eligibility,
    });
  }

  deleteLoanType(row: any): void {
    if (!confirm('Are you sure you want to delete this Loan Type?')) return;

    this.tableData = this.tableData.filter(r => r.loanTypeId !== row.loanTypeId);
    this.onsearch();
  }

  closePopup(): void {
    this.showLoanPopup = false;
    this.showErrors = false;
  }

  saveLoanType(): void {
    this.showErrors = true;

    if (this.loanTypeForm.invalid) {
      this.loanTypeForm.markAllAsTouched();
      return;
    }

    const form = this.loanTypeForm.value;
    const company = this.companyList.find(c => c.companyId === form.companyId);
    const pay = this.payCodeList.find(p => p.payCodeId === form.payCodeId);

    if (this.isEditMode && this.rowData) {
      // UPDATE
      const idx = this.tableData.findIndex(r => r.loanTypeId === this.rowData.loanTypeId);
      if (idx > -1) {
        this.tableData[idx] = {
          ...this.tableData[idx],
          companyId: form.companyId,
          Company_code: company?.companyCode ?? '',
          Pay_Code: pay?.payCode ?? '',
          Eligibility: form.eligibility,
        };
      }
    } else {
      // ADD
      const newId = this.tableData.length
        ? Math.max(...this.tableData.map(r => r.loanTypeId)) + 1
        : 1;

      this.tableData.push({
        loanTypeId: newId,
        companyId: form.companyId,
        Company_code: company?.companyCode ?? '',
        Pay_Code: pay?.payCode ?? '',
        Eligibility: form.eligibility,
      });
    }

    this.closePopup();
    this.onsearch();
  }
}