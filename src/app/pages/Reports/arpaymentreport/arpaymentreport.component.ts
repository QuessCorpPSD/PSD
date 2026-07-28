import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ARReportService } from '../../../Service/Reports/ARRreportservice';

@Component({
  selector: 'arpaymentreport',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule],
  templateUrl: './arpaymentreport.component.html',
  styleUrl: './arpaymentreport.component.css',

})
export class ArpaymentreportComponent {

  startDate: any;
  endDate: any;
  reportType: any;
  userdetail: any;
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private reportService: ARReportService
  ) { }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;
  }

  exportToExcel(): void {
    const userId = this.userdetail?.user_Id;

    this.isLoading = true;

    if (!this.startDate || !this.endDate) {
      alert("Please select Start Date and End Date");
      this.isLoading = false;
      return;
    }
    const startDate = this.startDate;

    this.reportService.ARReport(startDate).subscribe({
      next: res => {
        if (res.Data.file != "No") {
          this.downloadExcelFromBase64(res.Data.file, res.Data.fileName)
        }
        else {
          alert("Data not exists");
          this.isLoading = false;
        }

      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    // this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
    this.isLoading = false;
  }
}

