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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-companygroupmaster',
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
    MatTooltipModule,
  ],
  templateUrl: './companygroupmaster.component.html',
  styleUrl: './companygroupmaster.component.css',
})
export class CompanygroupmasterComponent {

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyGroupCode',
    'CompanyGroupName',
    'SAPCustomerCode',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  companyGroupNameSearch = '';
  selectedRow: any = null;

  showGroupPopup = false;
  isEditMode = false;
  showErrors = false;
  groupForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      companyGroupCode: ['', Validators.required],
      companyGroupName: ['', Validators.required],
      sapCustomerCode: ['', Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.groupForm.reset();
    this.showGroupPopup = true;
  }

  editGroup(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showGroupPopup = true;
    this.groupForm.patchValue(row);
  }

  deleteGroup(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  onCopy(): void {
    if (!this.selectedRow) {
      alert('Please select a row to copy.');
      return;
    }
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.groupForm.patchValue(this.selectedRow);
    this.showGroupPopup = true;
  }

  onEdit(): void {
    if (!this.selectedRow) {
      alert('Please select a row to edit.');
      return;
    }
    this.isEditMode = true;
    this.rowData = this.selectedRow;
    this.showErrors = false;
    this.showGroupPopup = true;
    this.groupForm.patchValue(this.selectedRow);
  }

  onDelete(): void {
    if (!this.selectedRow) {
      alert('Please select a row to delete.');
      return;
    }
    if (!confirm('Are you sure you want to delete this record?')) return;
    this.selectedRow = null;
  }

  onRowSelect(row: any): void {
    this.selectedRow = row;
  }

  closePopup(): void {
    this.showGroupPopup = false;
    this.showErrors = false;
  }

  saveGroup(): void {
    this.showErrors = true;
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      CompanyGroupCode: r.CompanyGroupCode,
      CompanyGroupName: r.CompanyGroupName,
      SAPCustomerCode: r.SAPCustomerCode,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { CompanyGroupMaster: ws },
      SheetNames: ['CompanyGroupMaster'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `CompanyGroupMaster_${Date.now()}.xlsx`);
  }
}