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
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';


import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ProInvoiceSummaryReportService } from '../../../Service/Reports/proinvoice-report.service';

@Component({
  selector: 'app-provisional-invoice-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    CompanyallComponent,
    
  ],
  templateUrl: './provisional-invoice-report.component.html',
  styleUrl: './provisional-invoice-report.component.css'
})
export class ProvisionalInvoiceReportComponent {
proinvoiceForm!: FormGroup;
  entityList: any[] = [];
  selectedEntity: any = '';

  selectedCompanyCode: any;
  userdetail: any;
  reportTypes: any[] = [];
  payPeriodList: any[] = [];

  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;

  selectedCompany: any = "";

  isEntitySelected = false;
  isCompanySelected = false;
  disabled = false;
  entity: any;
  company: any;
  payperiod: any;
  startDate: any;
  endDate: any;
  reportType: any;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private reportTypeService:ProInvoiceSummaryReportService
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


    this.proinvoiceForm = this.fb.group({
    });
  }
 handleCompanyEvent(value: any) {
    this.company = value;

    if (this.company) {
      this.isCompanySelected = true;
      this.isEntitySelected = false;
      this.entity = ""; // reset entity
    } else {
      this.isCompanySelected = false;
      this.isEntitySelected = false;
    }
  }

  exportToExcel(): void {
    const userId = this.userdetail?.user_Id;

    this.isLoading = true;
  
    if (!this.startDate || !this.endDate) {
      alert("Please select Start Date and End Date");
      this.isLoading = false;
      return;
    }

    const companyId = this.company?.companyId ? this.company.companyId : 0;

    const startDate = this.startDate?.split('-').reverse().join('-');
    const endDate = this.endDate?.split('-').reverse().join('-');

    let apiCall;
      apiCall = this.reportTypeService.ExporttoExcel(
        companyId,
        startDate,
        endDate
      );
 
    apiCall.subscribe({
      next: (res) => {

        const data = res?.Data?.data?.Table0;

        if (!data || data.length === 0) {
          alert(res.Data?.message);
          this.isLoading = false;
          return;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = {
          Sheets: { 'ProvisionalInvoiceSummary': ws },
          SheetNames: ['ProvisionalInvoiceSummary']
        };

        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blob, `ProvisionalInvoiceSummary_${Date.now()}.xlsx`);

        this.alert("Success", "Excel exported successfully!");
        this.isLoading = false;
      },

      error: (err) => {
        console.error("Export failed:", err);
        this.alert("Error", "Failed to export data");
        this.isLoading = false;
      }
    });

  }
  alert(msg: string, sub?: string) {
    this.popupMessage = msg;
    this.popupSubMessage = sub || '';
    this.showPopup = true;
    this.isLoading = false;
  }

  closePopup() {
    this.showPopup = false;
  }
}
