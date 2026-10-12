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
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-qrsjobsubcategory',
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
  templateUrl: './qrsjobsubcategory.component.html',
  styleUrl: './qrsjobsubcategory.component.css',
})
export class QrsjobsubcategoryComponent {

  uploadDisplayedColumns: string[] = ['Action', 'CompanyCode', 'JobCategory', 'JobSubCategory'];
  dataSource = new MatTableDataSource<any>([]);
  totalCount = 0;
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  companyList: any[] = [];
  jobCategoryList: any[] = [];
  selectedCompanyId: number | null = null;

  selectedFile: File | null = null;

  showJobSubPopup = false;
  isEditMode = false;
  showErrors = false;
  jobSubForm: FormGroup;
  rowData: any;
  selectedCompanyCode: any;

  constructor(private fb: FormBuilder) {
    this.jobSubForm = this.fb.group({
      companyId: [null, Validators.required],
      jobCategoryId: [null, Validators.required],
      jobSubCategory: ['', Validators.required],
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
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.jobSubForm.reset();
    this.jobSubForm.patchValue({ companyId: this.selectedCompanyId });
    this.showJobSubPopup = true;
  }

  editJobSubCategory(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showJobSubPopup = true;
    this.jobSubForm.patchValue({
      companyId: row.companyId,
      jobCategoryId: row.jobCategoryId,
      jobSubCategory: row.JobSubCategory,
    });
  }

  deleteJobSubCategory(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  closePopup(): void {
    this.showJobSubPopup = false;
    this.showErrors = false;
  }

  saveJobSubCategory(): void {
    this.showErrors = true;
    if (this.jobSubForm.invalid) {
      this.jobSubForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      this.selectedFile = null;
      return;
    }
    const name = file.name.toLowerCase();
    if (!(name.endsWith('.xlsx') || name.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      input.value = '';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  onImport(): void {
    if (!this.selectedFile) {
      alert('Please choose a file to import.');
      return;
    }
  }

  downloadTemplate(): void {
    const templateData = [
      {
        'Company Code': '',
        'JOB Category': '',
        'JOB SUB Category': '',
      },
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(templateData);
    const wb: XLSX.WorkBook = {
      Sheets: { QRSJobSubCategory: ws },
      SheetNames: ['QRSJobSubCategory'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `QRSJobSubCategory_Template.xlsx`);
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any) => ({
      'Company Code': r.CompanyCode,
      'JOB Category': r.JobCategory,
      'JOB SUB Category': r.JobSubCategory,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { QRSJobSubCategory: ws },
      SheetNames: ['QRSJobSubCategory'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `QRSJobSubCategory_${Date.now()}.xlsx`);
  }
}