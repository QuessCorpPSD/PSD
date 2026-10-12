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
  selector: 'app-jobcategory',
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
  templateUrl: './jobcategory.component.html',
  styleUrl: './jobcategory.component.css',
})
export class JobcategoryComponent {

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'JobCategory',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  jobCategorySearch = '';
  selectedRow: any = null;

  showJobPopup = false;
  isEditMode = false;
  showErrors = false;
  jobForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      jobCategory: ['', Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.jobForm.reset();
    this.showJobPopup = true;
  }

  editJobCategory(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showJobPopup = true;
    this.jobForm.patchValue({
      jobCategory: row.JobCategory,
    });
  }

  deleteJobCategory(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  onRowSelect(row: any): void {
    this.selectedRow = row;
  }

  onDelete(): void {
    if (!this.selectedRow) {
      alert('Please select a row to delete.');
      return;
    }
    if (!confirm('Are you sure you want to delete this record?')) return;
    this.selectedRow = null;
  }

  onEdit(): void {
    if (!this.selectedRow) {
      alert('Please select a row to edit.');
      return;
    }
    this.isEditMode = true;
    this.rowData = this.selectedRow;
    this.showErrors = false;
    this.showJobPopup = true;
    this.jobForm.patchValue({
      jobCategory: this.selectedRow.JobCategory,
    });
  }

  closePopup(): void {
    this.showJobPopup = false;
    this.showErrors = false;
  }

  saveJobCategory(): void {
    this.showErrors = true;
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      JOB_Category: r.JobCategory,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { JobCategory: ws },
      SheetNames: ['JobCategory'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `JobCategory_${Date.now()}.xlsx`);
  }
}