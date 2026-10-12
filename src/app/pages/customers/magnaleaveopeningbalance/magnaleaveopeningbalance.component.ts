import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-magnaleaveopeningbalance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    CompanyallComponent
],
  templateUrl: './magnaleaveopeningbalance.component.html',
  styleUrl: './magnaleaveopeningbalance.component.css'
})
export class MagnaleaveopeningbalanceComponent implements OnInit {

  selectedCompanyId: any = null;
  employeeCodeSearch: string = '';
  showTable: boolean = true;
  selectedRow: any = null;

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'EmployeeCode',
    'EmployeeName',
    'LeaveOpeningBalance',
    'LeaveCredit',
    'LeaveClosingBalance',
    'ActualLeaveClosingBalance'
  ];

  dataSource = {
    data: []
  };

  showEditPopup: boolean = false;
  showErrors: boolean = false;
  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      companyCode: [{ value: '', disabled: true }],
      companyName: [{ value: '', disabled: true }],
      employeeCode: [{ value: '', disabled: true }],
      employeeName: [{ value: '', disabled: true }],
      leaveOpeningBalance: ['', Validators.required],
      leaveCredit: ['', Validators.required],
      leaveClosingBalance: ['', Validators.required],
      actualLeaveClosingBalance: [{ value: '', disabled: true }]
    });
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
  }

  onSearch() {
    this.showTable = true;
  }

  exportToExcel() {
  }

  importData() {
  }

  openEdit(row: any) {
    this.selectedRow = row;
    this.showEditPopup = true;
    this.showErrors = false;
    this.editForm.patchValue({
      companyCode: row.CompanyCode,
      companyName: row.CompanyName,
      employeeCode: row.EmployeeCode,
      employeeName: row.EmployeeName,
      leaveOpeningBalance: row.LeaveOpeningBalance,
      leaveCredit: row.LeaveCredit,
      leaveClosingBalance: row.LeaveClosingBalance,
      actualLeaveClosingBalance: row.ActualLeaveClosingBalance
    });
  }

  closePopup() {
    this.showEditPopup = false;
    this.showErrors = false;
  }

  saveEdit() {
    if (this.editForm.invalid) {
      this.showErrors = true;
      return;
    }
    this.closePopup();
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }
}