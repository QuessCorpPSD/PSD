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
  selector: 'app-leaveopeningbalance',
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
  templateUrl: './leaveopeningbalance.component.html',
  styleUrl: './leaveopeningbalance.component.css'
})
export class LeaveopeningbalanceComponent implements OnInit {

  companyCodeSearch: any = null;
  employeeCodeSearch: string = '';
  showTable: boolean = true;
  selectedRow: any = null;

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'GroupName',
    'EmployeeCode',
    'EmployeeName',
    'Year',
    'LeaveCredit',
    'PrivilegeLeave',
    'CasualLeave',
    'SickLeave',
    'CompanyLocation'
  ];

  dataSource = {
    data: []
  };

  showPopup: boolean = false;
  isEditMode: boolean = false;
  showErrors: boolean = false;
  leaveForm!: FormGroup;

  innerDisplayedColumns: string[] = [
    'SNo',
    'EmployeeCode',
    'EmployeeName',
    'LeaveCredit',
    'PrivilegeLeave',
    'CasualLeave',
    'SickLeave'
  ];

  innerGridData: any[] = [];

  yearList = [
    { id: '2023', name: '2023' },
    { id: '2024', name: '2024' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.leaveForm = this.fb.group({
      CompanyCode: [null, Validators.required],
      companyName: [{ value: '', disabled: true }],
      companyLocation: ['', Validators.required],
      groupName: ['', Validators.required],
      year: [null, Validators.required]
    });
  }

  handleCompanyEvent(company: any) {
    this.companyCodeSearch = company.companyId;
  }

  onSearch() {
    this.showTable = true;
  }

  openAdd() {
    this.isEditMode = false;
    this.leaveForm.reset();
    this.innerGridData = [];
    this.showErrors = false;
    this.showPopup = true;
  }

  editLeave(row: any) {
    this.isEditMode = true;
    this.selectedRow = row;
    this.leaveForm.patchValue({
      CompanyCode: row.CompanyCode,
      companyName: row.CompanyName,
      companyLocation: row.CompanyLocation,
      groupName: row.GroupName,
      year: row.Year
    });
    this.showErrors = false;
    this.showPopup = true;
  }

  copyLeave(row: any) {
    this.isEditMode = false;
    this.leaveForm.patchValue({
      CompanyCode: row.CompanyCode,
      companyName: row.CompanyName,
      companyLocation: row.CompanyLocation,
      groupName: row.GroupName,
      year: row.Year
    });
    this.innerGridData = [...this.innerGridData];
    this.showErrors = false;
    this.showPopup = true;
  }

  deleteLeave(row: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }

  closePopup() {
    this.showPopup = false;
    this.showErrors = false;
  }

  saveLeave() {
    if (this.leaveForm.invalid) {
      this.showErrors = true;
      return;
    }
    this.closePopup();
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }

  addInnerRow() {
  }

  deleteInnerRow() {
  }

  onFileSelected(event: any) {
  }

  importData() {
  }
}