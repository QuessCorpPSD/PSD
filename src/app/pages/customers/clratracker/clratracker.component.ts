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

@Component({
  selector: 'app-clratracker',
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
  ],
  templateUrl: './clratracker.component.html',
  styleUrl: './clratracker.component.css',
})
export class ClratrackerComponent {

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'InternalReferenceNo',
    'CustomerName',
    'EntityName',
    'Region',
    'CustomerLocationAddress',
    'ValidFrom',
    'ValidTo',
    'LocationSPOCName',
    'LocationSPOCEmail',
    'Status',
    'AdditionalRemarks',
  ];
  dataSource = new MatTableDataSource<any>([]);
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  entityList: any[] = [];
  companyList: any[] = [];
  regionList: any[] = [];
  workNatureList: any[] = [];
  yesNoList: any[] = [];
  spocList: any[] = [];
  statusList: any[] = [];

  selectedEntityId: number | null = null;
  customerNameSearch = '';
  internalRefSearch = '';

  selectedFile: File | null = null;

  showClraPopup = false;
  isEditMode = false;
  showErrors = false;
  clraForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.clraForm = this.fb.group({
      internalReferenceNo: [''],
      customerLocationAddress: [null],
      entityId: [null, Validators.required],
      natureOfWork: [null],
      companyId: [null, Validators.required],
      amendmentWithQues: [null],
      customerName: ['', Validators.required],
      noOfEmployees: [''],
      validFrom: [''],
      region: [null],
      validTo: [''],
      licenseNo: [''],
      locationSpocName: [null, Validators.required],
      clientRcNo: [''],
      status: [null, Validators.required],
      issuingAuthority: [''],
      additionalRemarks: [null, Validators.required],
      licenseIssuingLocation: [null],
      remarks: [''],
      uploadLicense: [null, Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  bulkLicenseDownload(): void {
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.clraForm.reset();
    this.showClraPopup = true;
  }

  editClra(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showClraPopup = true;
    this.clraForm.patchValue(row);
  }

  deleteClra(row: any): void {
    if (!confirm('Are you sure you want to delete this record?')) return;
  }

  closePopup(): void {
    this.showClraPopup = false;
    this.showErrors = false;
  }

  saveClra(): void {
    this.showErrors = true;
    if (this.clraForm.invalid) {
      this.clraForm.markAllAsTouched();
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
        'Internal_Reference_No': '',
        'Customer Name': '',
        'Entity Name': '',
        'Region': '',
        'Customer Location Address': '',
        'Valid_From': '',
        'Valid_To': '',
        'Location_SPOC_Name': '',
        'Location_SPOC_Email': '',
        'Status': '',
        'Additional_Remarks': '',
      },
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(templateData);
    const wb: XLSX.WorkBook = {
      Sheets: { CLRATracker: ws },
      SheetNames: ['CLRATracker'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `CLRATracker_Template.xlsx`);
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any, i: number) => ({
      SNo: i + 1,
      'Company Code': r.CompanyCode,
      'Internal_Reference_No': r.InternalReferenceNo,
      'Customer Name': r.CustomerName,
      'Entity Name': r.EntityName,
      Region: r.Region,
      'Customer Location Address': r.CustomerLocationAddress,
      'Valid_From': r.ValidFrom,
      'Valid_To': r.ValidTo,
      'Location_SPOC_Name': r.LocationSPOCName,
      'Location_SPOC_Email': r.LocationSPOCEmail,
      Status: r.Status,
      'Additional_Remarks': r.AdditionalRemarks,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { CLRATracker: ws },
      SheetNames: ['CLRATracker'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `CLRATracker_${Date.now()}.xlsx`);
  }
}