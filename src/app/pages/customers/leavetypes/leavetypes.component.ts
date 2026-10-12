import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-leavetypes',
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
    MatRadioModule,
    MatTooltipModule,
  ],
  templateUrl: './leavetypes.component.html',
  styleUrl: './leavetypes.component.css',
})
export class LeavetypesComponent {

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Company_code',
    'Leave_Type',
    'Leave_Type_Description',
    'Carry_Forward',
    'Min_Carry_Forward_Days',
    'Encashable',
    'Min_Encashable_Days',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  companyList: any[] = [];
  selectedCompanyId: number | null = null;

  showLeavePopup = false;
  isEditMode = false;
  showErrors = false;
  leaveTypeForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.leaveTypeForm = this.fb.group({
      companyId: [null, Validators.required],
      leaveType: ['', Validators.required],
      leaveTypeDescription: [''],
      carryForward: [false, Validators.required],
      minCarryForwardDays: [''],
      encashable: [false, Validators.required],
      minEncashableDays: [''],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.leaveTypeForm.reset({ carryForward: false, encashable: false });
    this.showLeavePopup = true;
  }

  editLeaveType(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showLeavePopup = true;
    this.leaveTypeForm.patchValue(row);
  }

  deleteLeaveType(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  closePopup(): void {
    this.showLeavePopup = false;
    this.showErrors = false;
  }

  saveLeaveType(): void {
    this.showErrors = true;
    if (this.leaveTypeForm.invalid) {
      this.leaveTypeForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      'Company Code': r.Company_code,
      'Leave Type': r.Leave_Type,
      'Leave Type Description': r.Leave_Type_Description,
      'Carry Forward': r.Carry_Forward ? 'Yes' : 'No',
      'Min Carry Forward Days': r.Min_Carry_Forward_Days,
      Encashable: r.Encashable ? 'Yes' : 'No',
      'Min Encashable Days': r.Min_Encashable_Days,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { LeaveType: ws },
      SheetNames: ['LeaveType'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `LeaveType_${Date.now()}.xlsx`);
  }
}