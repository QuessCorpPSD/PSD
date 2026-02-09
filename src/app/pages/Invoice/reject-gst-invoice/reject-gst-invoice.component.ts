import { Component, OnInit,ImportProvidersSource, Inject, InjectionToken, TrackByFunction  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Optional } from '@angular/core';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';


@Component({
  selector: 'app-reject-gst-invoice',
standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertpopupComponent
  ],
 
  templateUrl: './reject-gst-invoice.component.html'
})
export class RejectGstInvoiceComponent implements OnInit {

  rejectForm!: FormGroup;
  selectedFile: File | null = null;
  fileError: string | null = null;
   showPopup: boolean = false;
  popupMessage: string = "";
  isLoading: boolean = false;
    userdetail: any;

  constructor(private dialogRef: MatDialogRef<RejectGstInvoiceComponent>, private gst: InvoiceRepository, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,private fb: FormBuilder,) { }

expectedColumns: string[] = [
  'Invoice Number',
  'Discrepancy By',
  'Discrepancy Reason'
];
  ngOnInit(): void {
    this.rejectForm = this.fb.group({
      status: ['Rejected', Validators.required]
    });
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }

 onFileSelected(event: any): void {
  const file = event.target.files[0];

  if (!file) {
    this.selectedFile = null;
    return;
  }

  const allowedExtensions = ['xls', 'xlsx'];
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !allowedExtensions.includes(extension)) {
    this.fileError = 'Invalid file format. Please upload Excel file.';
    this.selectedFile = null;
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 🔹 Get header row
    const headerRow = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      range: 0
    })[0] as string[];

    // 🔹 Normalize headers
    const normalizedHeaders = headerRow.map(h => h?.trim());

    const isValidFormat =
      this.expectedColumns.length === normalizedHeaders.length &&
      this.expectedColumns.every(col => normalizedHeaders.includes(col));

    if (!isValidFormat) {
      this.popupMessage =
        'Format incorrect. Excel must contain columns: Invoice Number, Discrepancy By, Discrepancy Reason';
      this.showPopup = true;
      this.selectedFile = null;
      return;
    }

    this.fileError = null;
    this.selectedFile = file;
  };

  reader.readAsBinaryString(file);
}

  // Submit
 onSubmit(): void {
  if (this.rejectForm.invalid || !this.selectedFile) {
    return;
  }

  const formData = new FormData();
  formData.append('file', this.selectedFile);
   formData.append('userId', this.userdetail.user_Id);
  formData.append('status', this.rejectForm.value.status);

  this.isLoading = true;
  console.log(formData);

  this.gst.RejectInvoice(formData).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      this.popupMessage = res?.Message || 'Rejected successfully';
      this.showPopup = true;
    },
    error: () => {
      this.isLoading = false;
      this.popupMessage = 'Something went wrong';
      this.showPopup = true;
    }
  });
}

   
 downloadTemplate(): void {

      const dataToExport = [
      { 'Invoice Number': '', 'Discrepancy By': '', 'Discrepancy Reason': '' },
    ]
    this.downloadExcel(dataToExport, "GstInvoice");

  }
 downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'GstInvoice': worksheet },
      SheetNames: ['GstInvoice']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  // Back navigation
  goBack(): void {
  this.dialogRef.close();
  }
}
