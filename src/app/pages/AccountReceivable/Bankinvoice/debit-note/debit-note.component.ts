import { CommonModule } from '@angular/common';
import { Component, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../../Models/Common';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';

export const Common_TOKEN = new InjectionToken<IdebitNoteRepository>('Common_TOKEN');
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { IdebitNoteRepository } from '../../../../Repository/BankInvoice/BankInvoiceRepository/IDebitNoteRepository';
import { DebitNoteServiceService } from '../../../../Service/BankInvoice/BankInvoiceService/debit-note-service.service';


@Component({
  selector: 'app-debit-note',
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatCardModule, MatIconModule, MatTooltipModule, CompanyallComponent],
  templateUrl: './debit-note.component.html',
  styleUrl: './debit-note.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: DebitNoteServiceService }
  ],
})
export class DebitNoteComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  holdSelections: { [key: number]: string } = {};
  istablevisible = false;
  selectedBatchType: string = '';
  startDate: string = '';
  endDate: string = '';
  employeeCode: string = '';
  batchtype: any[] = [];
  batchList: any[] = [];
  startDateInput: string = '';
  endDateInput: string = '';
  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  CreditNotePurpose: any;
  Credit_Note_Type: string = "";
  Ref_id: string = "";
  isPayPeriod = false;
  isRefId = false;
  payPeriodType: string = "All";
  PayPeriodUI: any;
  StartDate: string = "";
  EndDate: string = "";
  payPeriodmain!: Payperiodclass;
  payperiodIdmain: any;
  payperiodsmain: any;
  selectedCompanyId: any;
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPPid?: string;
  selectedPP?: string;
  paginatedData: any[] = [];
  companyId: any;
  SelectedBatch: any = "";
  showAttachmentPopup = false;

  selectedRowData: any = null;

  attachments: any = {
    debitNoteCopies: null,
    paymentAdvice: null,
    clientEmail: null,
    bhApproval: null
  };
  constructor(private creditService: DebitNoteServiceService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }



  displayedColumns: string[] = [
    'select',
    'DebitNote_Id',
    'DebitNote_No',
    'Company_Code',
    'Client_Name',
    'Employee_id',
    'SubClientCode',
    'Invoice_Number',
    'Pay_Period_Id',
    'ShortAmount',
    'PayCode',
    'Debit_Note_Amount',
    'Actual_Amount',
    'DebitNoteType_Id',
    'Debit_NoteType',
    'Is_GST_Applicable',
    'Remarks',
    'Amount_In_Words',
    'DebitNote_Date',
    'IsActive',
    'CreatedBy',
    'CreatedOn',
    'ModifiedBy',
    'ModifiedOn',
    'Sap_Reference_Number',
    'SAC_Code',
    'CGST_Percentage',
    'SGST_Percentage',
    'UTGST_Percentage',
    'IGST_Percentage',
    'CGST_Amount',
    'SGST_Amount',
    'UTGST_Amount',
    'IGST_Amount',
    'Balance_Amount',
    'Naration',
    'IsMovedToSap',
    'Status',
    'Particulars',
    'Ref_Id',
    'ClientGstNumber',
    'ClientPanNumber',
    'ClientTanNumber'
    // 'FileStatus'
  ];



  ngOnInit(): void {
    this.payPeriodTypefromParentall = "All";
    const today = new Date().toISOString().split('T')[0];

    this.startDate = today;
    this.endDate = today;
  }
  // handleCompanyEvent(event: any) {
  //   this.comapnyId = event.companyId;
  //   this.selectedCompanyCode = event.companyCode;
  //   this.companyUI = event.company;
  //   this.BindPurpose(this.comapnyId);
  // }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.paginatedData = [];
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPPid = String(payperiod.payfrequencyid);
    this.selectedPP = String(payperiod.payPeriod);
    this.paginatedData = [];
  }


  handlePayperiodEventmain(payperiod: Payperiodclass) {
    this.payPeriodmain = payperiod;
    this.payperiodIdmain = payperiod.payfrequencyid;
    this.payperiodsmain = payperiod.payPeriod;

  }

  BindPurpose(companyId: number) {

  }

  searchClick() {

    if (
      !this.selectedCompanyCode ||
      this.selectedCompanyCode === ''
    ) {

      alert('Please select the company code');

      return;
    }

    if (
      !this.employeeCode ||
      this.employeeCode.trim() === ''
    ) {

      alert('Please enter the employee code');

      return;
    }

    this.isLoading = true;

    const fromDate =
      this.formatDate(this.startDate);

    const toDate =
      this.formatDate(this.endDate);

    this.creditService.Search(
      this.selectedCompanyCode,
      this.employeeCode,
      fromDate,
      toDate
    ).subscribe({

      next: (res: any) => {

        if (res?.Data?.statusCode === '400') {

          alert(res.Data.message);

          this.dataSource.data = [];

          this.isLoading = false;

          return;
        }

        const reportData =
          res?.Data?.data?.Table0 ?? [];

        if (reportData.length === 0) {

          alert('No data found');

          this.dataSource.data = [];

          this.isLoading = false;

          return;
        }

        this.dataSource =
          new MatTableDataSource(reportData);

        this.paginatedData = reportData;

        this.istablevisible = true;

        this.isLoading = false;

      },

      error: (err) => {

        console.error('Error loading data', err);

        alert('Error loading data');

        this.isLoading = false;

      }

    });

  }
  exportToExcel(): void {

    this.isLoading = true;

    const fromDate =
      this.formatDate(this.startDate);

    const toDate =
      this.formatDate(this.endDate);

    const payload = {

      companyId:
        this.companyId || 0,

      fromDate:
        fromDate,

      toDate:
        toDate

    };

    this.creditService
      .DebitNoteExport(payload)
      .subscribe({

        next: (res: any) => {

          this.isLoading = false;

          const jsonData =
            res?.Data?.data?.Table0 ?? [];

          if (jsonData.length === 0) {

            alert('No data available');

            return;
          }

          const worksheet: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(jsonData);

          const workbook: XLSX.WorkBook =
            XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'DebitNote'
          );

          XLSX.writeFile(
            workbook,
            'DebitNote.xlsx'
          );

        },

        error: (err) => {

          this.isLoading = false;

          console.error(err);

          alert('Export failed');

        }

      });

  }



  formatDate(date: any): string {

    if (!date) return '';

    const d = new Date(date);

    const day =
      ('0' + d.getDate()).slice(-2);

    const month =
      ('0' + (d.getMonth() + 1)).slice(-2);

    const year =
      d.getFullYear();

    return `${day}-${month}-${year}`;

  }
  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!this.selectedBatchType) {
      alert('Please select a Batch Type.');
      this.isLoading = false;
      return;
    }
  }
  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }


}



