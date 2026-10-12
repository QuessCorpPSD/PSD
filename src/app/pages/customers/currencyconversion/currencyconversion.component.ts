import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-currencyconversion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './currencyconversion.component.html',
  styleUrl: './currencyconversion.component.css',
})
export class CurrencyconversionComponent {

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'CompanyName',
    'ConversionFrom',
    'ConversionTo',
    'ConversionRate',
    'EffectiveDate',
    'DocumentUploadedDate',
    'DocumentProofs',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  companyList: any[] = [];
  currencyList: any[] = [];

  showCurrencyPopup = false;
  isEditMode = false;
  showErrors = false;
  currencyForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.currencyForm = this.fb.group({
      companyId: [null, Validators.required],
      conversionFrom: [null, Validators.required],
      conversionTo: [null, Validators.required],
      conversionRate: ['', Validators.required],
      effectiveDate: ['', Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.currencyForm.reset();
    this.showCurrencyPopup = true;
  }

  editCurrency(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showCurrencyPopup = true;
    this.currencyForm.patchValue({
      companyId: row.companyId,
      conversionFrom: row.conversionFrom,
      conversionTo: row.conversionTo,
      conversionRate: row.ConversionRate,
      effectiveDate: row.EffectiveDate,
    });
  }

  deleteCurrency(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  onDownload(row: any): void {
  }

  closePopup(): void {
    this.showCurrencyPopup = false;
    this.showErrors = false;
  }

  saveCurrency(): void {
    this.showErrors = true;
    if (this.currencyForm.invalid) {
      this.currencyForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      'Company Code': r.CompanyCode,
      'Company Name': r.CompanyName,
      'Conversion From': r.ConversionFrom,
      'Conversion To': r.ConversionTo,
      'Conversion Rate': r.ConversionRate,
      'Effective Date': r.EffectiveDate,
      'Document Uploaded Date': r.DocumentUploadedDate,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { CurrencyConversion: ws },
      SheetNames: ['CurrencyConversion'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `CurrencyConversion_${Date.now()}.xlsx`);
  }
}