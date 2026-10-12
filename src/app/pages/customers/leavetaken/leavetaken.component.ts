import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select'; // For dropdowns

@Component({
  selector: 'app-leavetaken',
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
    MatSelectModule
  ],
  templateUrl: './leavetaken.component.html',
  styleUrl: './leavetaken.component.css'
})
export class LeavetakenComponent implements OnInit {

  // --- Search & Table Properties ---
  customerNameSearch: string = ''; // Reusing naming convention from reference
  showTable: boolean = true;
  selectedRow: any = null;

  // Table Columns matching your screenshot
  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'GroupName',
    'EmployeeCode',
    'EmployeeName',
    'PayPeriod',
    'PrivilegeLeave',
    'CasualLeave',
    'SickLeave',
    'PresentDays'
  ];

  dataSource = {
    data: [
      // Mock Data for display
      {
        CompanyCode: 'C001',
        GroupName: 'Group A',
        EmployeeCode: 'EMP001',
        EmployeeName: 'John Doe',
        PayPeriod: 'Oct-2023',
        PrivilegeLeave: 2,
        CasualLeave: 1,
        SickLeave: 0,
        PresentDays: 22
      }
    ]
  };

  // --- Popup Properties ---
  showAddressPopup: boolean = false; // Keeping variable name generic or rename to showLeavePopup
  isEditMode: boolean = false;
  showErrors: boolean = false;
  leaveForm!: FormGroup;

  // Mock Dropdown Data
  companyList = [{ id: 1, name: 'Company A' }, { id: 2, name: 'Company B' }];
  payPeriodList = [{ id: 1, name: 'Oct-2023' }, { id: 2, name: 'Nov-2023' }];
  
  // Inner Grid Data (inside popup)
  innerGridData: any[] = []; 
  innerDisplayedColumns: string[] = ['SNo', 'EmployeeCode', 'EmployeeName', 'PrivilegeLeave', 'CasualLeave', 'SickLeave', 'PresentDays'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.leaveForm = this.fb.group({
      companyId: [null, Validators.required],
      companyName: [{ value: '', disabled: true }],
      companyLocation: ['', Validators.required],
      groupName: ['', Validators.required],
      payPeriod: [null, Validators.required]
    });
  }

  // --- Actions ---

  onSearch() {
    console.log('Searching...', this.customerNameSearch);
    this.showTable = true;
  }

  exportToExcel() {
    console.log('Exporting to Excel...');
  }

  openadd() {
    this.isEditMode = false;
    this.leaveForm.reset();
    this.innerGridData = []; // Clear inner grid
    this.showAddressPopup = true;
  }

  editLeave(row: any) {
    this.isEditMode = true;
    this.showAddressPopup = true;
    // Patch form values logic here
    this.leaveForm.patchValue({
      companyId: 1,
      companyName: 'Company A',
      companyLocation: 'New York',
      groupName: row.GroupName,
      payPeriod: 1
    });
  }

  deleteLeave(row: any) {
    console.log('Delete', row);
  }

  closePopup() {
    this.showAddressPopup = false;
    this.showErrors = false;
  }

  saveLeave() {
    if (this.leaveForm.invalid) {
      this.showErrors = true;
      return;
    }
    console.log('Saving...', this.leaveForm.value);
    this.closePopup();
  }

  addInnerRow() {
    console.log('Add inner row');
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }
}