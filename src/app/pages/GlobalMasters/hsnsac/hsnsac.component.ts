
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HsnSacService }  from '../../../Service/GlobalMasters/HsnSac.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IHsnSacRepository } from '../../../Repository/GlobalMasters/IHsnSacRepository';
import * as XLSX from 'xlsx';
import { MatCardModule } from '@angular/material/card';
interface HsnSac {
  hsnSacId: number;
  hsnSacCode: string;
  description: string;
  codeType: string;
  cgstPercentage: number;
  sgstPercentage: number;
  igstPercentage: number;
  cessPercentage: number;
 effectiveFrom: Date | null;
  isActive: boolean;
}

@Component({
  selector: 'app-hsnsac',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule
  ],
  providers: [HsnSacService],
  templateUrl: './hsnsac.component.html',
  styleUrl: './hsnsac.component.css'
})
export class HSNSACComponent implements OnInit {

  hsnSacForm: FormGroup;

  isFormVisible = false;
  isEditMode = false;
  selectedId: number | null = null;
 userdetail: any;
userId: String = '0';

  displayedColumns: string[] = [
    'action',
    'hsnSacCode',
    'description',
    'codeType',
    'cgstPercentage',
    'sgstPercentage',
    'igstPercentage',
    'cessPercentage',
    'effectiveFrom',
    'isActive'

  ];

  hsnSacList: HsnSac[] = [];
constructor(private fb: FormBuilder,
    private hsnSacService: HsnSacService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  )
  
   {
    this.hsnSacForm = this.fb.group({
      hsnSacCode: ['', Validators.required],
      description: ['', Validators.required],
      codeType: ['HSN', Validators.required],
    
      cgstPercentage: [
    0,
    [Validators.required, Validators.min(0), Validators.max(100)]
  ],

  sgstPercentage: [
    0,
    [Validators.required, Validators.min(0), Validators.max(100)]
  ],

  igstPercentage: [
    0,
    [Validators.required, Validators.min(0), Validators.max(100)]
  ],

  cessPercentage: [
    0,
    [Validators.min(0), Validators.max(100)]
  ],

      effectiveFrom: [new Date(), Validators.required],
      isActive: [true]
    });

  }
ngOnInit(): void {

  const json = this._sessionStoreage.getItem('UserProfile');

  if (json) {
    this.userdetail = JSON.parse(this.decry.decrypt(json));

    // Get User ID after decrypting UserProfile
    this.userId = String(this.userdetail?.user_Id || '0');
  }
  else {
    console.warn('UserProfile not found in the session Storage');
  }

  this.getHsnSacDetails();
}

  // GET API
  
getHsnSacDetails(): void {
  this.hsnSacService.Search(this.userId.toString())
    .subscribe({
      next: (response: any) => {

        const apiData = response?.Data?.data;

console.log('API Data:', apiData);

const records = apiData?.Table0;

console.log('Extracted Records:', records);

        this.hsnSacList = Array.isArray(records)
          ? records.map((x: any) => ({
              hsnSacId: Number(x.hsnSacId ?? x.HsnSacId),
              hsnSacCode: x.hsnSacCode ?? x.HsnSacCode,
              description: x.description ?? x.Description,
              codeType: x.codeType ?? x.CodeType,
              cgstPercentage: Number(x.cgstPercentage ?? x.CGSTPercentage ?? 0),
              sgstPercentage: Number(x.sgstPercentage ?? x.SGSTPercentage ?? 0),
              igstPercentage: Number(x.igstPercentage ?? x.IGSTPercentage ?? 0),
              cessPercentage: Number(x.cessPercentage ?? x.CessPercentage ?? 0),
              effectiveFrom: this.parseDate(
  x.EffectiveFrom ?? x.effectiveFrom
),
              isActive: x.isActive ?? x.IsActive
            }))
          : [];

        console.log('Final Grid Data:', this.hsnSacList);
      },
      error: (error) => {
        console.error('Error loading HSN/SAC details:', error);
        alert('Unable to load HSN/SAC details.');
      }
    });
}

 
  // Add New
  addNew(): void {

    this.isEditMode = false;
    this.selectedId = null;

    this.hsnSacForm.reset({
      hsnSacCode: '',
      description: '',
      codeType: 'HSN',
      cgstPercentage: 0,
      sgstPercentage: 0,
      igstPercentage: 0,
      cessPercentage: 0,
      effectiveFrom: new Date(),
      isActive: true
    });
    this.isFormVisible = true;
  }

  // Edit
  editRecord(record: HsnSac): void {

    this.isEditMode = true;
    this.selectedId = record.hsnSacId;
    this.hsnSacForm.patchValue({
      hsnSacCode: record.hsnSacCode,
      description: record.description,
      codeType: record.codeType,
      cgstPercentage: record.cgstPercentage,
      sgstPercentage: record.sgstPercentage,
      igstPercentage: record.igstPercentage,
      cessPercentage: record.cessPercentage,
      effectiveFrom: record.effectiveFrom,
      isActive: record.isActive
    });
    this.isFormVisible = true;
  }

  // Save / Update API
  save(): void {

    if (this.hsnSacForm.invalid) {
      this.hsnSacForm.markAllAsTouched();
      return;
    }

    const formValue = this.hsnSacForm.getRawValue();

    const request = {
      hsnSacId: this.isEditMode ? this.selectedId : 0,
      hsnSacCode: formValue.hsnSacCode,
      description: formValue.description,
      codeType: formValue.codeType,
      gstType: formValue.gstType,
      cgstPercentage: formValue.cgstPercentage,
      sgstPercentage: formValue.sgstPercentage,
      igstPercentage: formValue.igstPercentage,
      cessPercentage: formValue.cessPercentage,
      effectiveFrom: this.formatDate(formValue.effectiveFrom),
      isActive: formValue.isActive,
      createdBy: this.userId,
      modifiedBy: this.userId,
      userId: this.userId
    };

    if (this.isEditMode) {
      this.updateRecord(request);
    } else {
      this.createRecord(request);
    }
  }

  // CREATE API

createRecord(request: any): void {

  console.log('Save Request:', request);

  this.hsnSacService.Create(request).subscribe({
    next: (response: any) => {

      const message =
        response?.Data?.response ??
        response?.Data?.message ??
        response?.Message ??
        'Unable to save HSN/SAC record.';

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes('successfully') ||
        lowerMessage.includes('already exists')
      ) {
        alert(message);

        this.cancel();

        // Refresh grid for both success and duplicate records
        this.getHsnSacDetails();

      } else {
        alert(message);
      }
    },

    error: (error) => {
      console.error('Create API error:', error);
      alert('Error while saving HSN/SAC record.');
    }
  });
}

  // EDIT API
 updateRecord(request: any): void {

  console.log('Update Request:', request);

  this.hsnSacService.Edit(request).subscribe({
    next: (response: any) => {

      const message =
        response?.Data?.response ??
        response?.Data?.message ??
        response?.Message ??
        'Unable to update HSN/SAC record.';

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes('successfully') ||
        lowerMessage.includes('already exists')
      ) {
        alert(message);
        this.cancel();
        this.getHsnSacDetails();
      } else {
        alert(message);
      }
    },
    error: (error) => {
      console.error('Update API error:', error);
      alert('Error while updating HSN/SAC record.');
    }
  });
}

deleteRecord(id: number): void {

  if (!confirm('Are you sure you want to delete this HSN/SAC record?')) {
    return;
  }

  this.hsnSacService.Delete(id, this.userId).subscribe({
    next: (response: any) => {

      const message =
        response?.Data?.response ??
        response?.Data?.message ??
        response?.Message ??
        'Unable to delete HSN/SAC record.';

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('successfully')) {
        alert(message);
        this.getHsnSacDetails();
      } else {
        alert(message);
      }
    },
    error: (error) => {
      console.error('Delete API error:', error);
      alert('Error while deleting HSN/SAC record.');
    }
  });
}

  // Date formatting for SQL DATE
  private formatDate(date: Date | string): string {

    const selectedDate = new Date(date);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Cancel
  cancel(): void {

    this.isFormVisible = false;
    this.isEditMode = false;
    this.selectedId = null;

    this.hsnSacForm.reset({
      hsnSacCode: '',
      description: '',
      codeType: 'HSN',
      gstType: 'INTRA',
      cgstPercentage: 0,
      sgstPercentage: 0,
      igstPercentage: 0,
      cessPercentage: 0,
      effectiveFrom: new Date(),
      isActive: true
    });
  }
 private parseDate(value: any): Date | null {
  if (!value) return null;

  // API format: 26-11-2026 12:00:00 AM
  if (typeof value === 'string') {
    const parts = value.split(' ');
    const dateParts = parts[0].split('-');

    if (dateParts.length === 3) {
      const day = Number(dateParts[0]);
      const month = Number(dateParts[1]) - 1;
      const year = Number(dateParts[2]);

      const date = new Date(year, month, day);

      return isNaN(date.getTime()) ? null : date;
    }
  }

  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

exportToExcel(): void {

  if (!this.hsnSacList || this.hsnSacList.length === 0) {
    alert('No HSN/SAC records available to export.');
    return;
  }

  const exportData = this.hsnSacList.map((row: any) => ({
    'HSN/SAC Code': row.hsnSacCode,
    'Description': row.description,
    'Code Type': row.codeType,
    'CGST (%)': row.cgstPercentage,
    'SGST (%)': row.sgstPercentage,
    'IGST (%)': row.igstPercentage,
    'Cess (%)': row.cessPercentage,
    'Effective From': row.effectiveFrom
      ? new Date(row.effectiveFrom).toLocaleDateString('en-GB')
      : '',
    'Status': row.isActive ? 'Active' : 'Inactive'
  }));

  const worksheet: XLSX.WorkSheet =
    XLSX.utils.json_to_sheet(exportData);

  const workbook: XLSX.WorkBook = {
    Sheets: { 'HSN SAC Master': worksheet },
    SheetNames: ['HSN SAC Master']
  };

  XLSX.writeFile(
    workbook,
    'HSN_SAC_Master.xlsx'
  );
}
}
