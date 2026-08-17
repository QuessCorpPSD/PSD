import { CommonModule } from '@angular/common';
import { Component, SimpleChanges, Inject, InjectionToken, ViewChild, ElementRef, QueryList, ViewChildren, } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCardModule } from '@angular/material/card';
import { ISEZRepositoryService } from '../../../Repository/invoice/iSEZRepository.service';
import { SEZRepositoryService } from '../../../Service/invoice/SEZRepository.service';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs';
import { FinancialYearComponent } from '../../../common/financial-year/financial-year.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { PayperiodsequenceComponent } from "../../../common/payperiodsequence/payperiodsequence.component";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const sezservice = InjectionToken<ISEZRepositoryService>;

interface ViewRow {
  invoiceNo: string;
  documentName: string;
  uploadedData: string;
  remarks: string;
  approvalStatus: string;
  uploadStatus: string;
  selected?: boolean;
}


@Component({
  selector: 'sezrepository-approval',
  imports: [CommonModule, MatTableModule, MatCardModule, MatCheckboxModule, MatPaginatorModule,
    MatSortModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, MatRadioModule, MatIconModule, FinancialYearComponent, CompanyallComponent, PayPeriodComponent],
  templateUrl: './sezrepository-approval.component.html',
  styleUrl: './sezrepository-approval.component.css',
  providers: [
    { provide: sezservice, useClass: SEZRepositoryService }]

})
export class SEZRepositoryApprovalComponent {
  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any = '';
  payPeriodTypefromParentall: string = '';
  userdetail!: any;
  filteredRows: any[] = [];
  Company_Code?: string;
  pay_period?: string;
  searchText: string = '';
  rows: ViewRow[] = [];
  iseditclicked = false;
  selectedFileName: string = "";
  remarksText: string = "";
  showTable = false;
  editData?: any;
  invoiceSearch: string = '';
  financialUI: any;
  isLoading = false;
  searchInvoiceNumber: string = '';
  remarkText?: string;
  selectedFile: File | null = null;
  uploadedFileUrl: string | null = null;
  selectedCompanyId!: number;
  payPeriodType: string = "All";
  filterValues: { [key: string]: string } = {};
  filterdisplayedColumns: string[] = [
    'filterselect',
    'filterinvoice_Number',
    'filterdocumentName',
    'filterackNo',
    'filteruploadedData',
    'filterdocument_Remarks',
    'filterrequestedBy',
    'filterapprovalStatus',
    'filteruploadStatus'
  ];
  displayedColumns: string[] = [
    'select',
    //'edit',
    //'delete',
    'invoiceNo',
    'documentName',
    'ackNo',
    'uploadedData',
    'document_Remarks',
    'requestedBy',
    'approvalStatus',
    'uploadStatus'

  ];

  constructor(private _sessionStoreage: SessionStorageService, private decry: EncryptionService, private router: Router, public fb: FormBuilder
    , @Inject(sezservice) private sezService: ISEZRepositoryService
  ) {

  }

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('filterInput') filterInputs!: QueryList<ElementRef>;


  selection = new SelectionModel<any>(true, []);

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id
      )
    );
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numFilteredRows = this.dataSource.filteredData.length;

    return numFilteredRows > 0 && numSelected === numFilteredRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.clear(); // avoid mixing previous selections
      this.dataSource.filteredData.forEach(row =>
        this.selection.select(row)
      );
    }
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };
    //this.stateService.clear();
    this.companyUI = [];
    this.payperiodUI = [];

    this.payPeriodTypefromParentall = "All";

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Onchanges");
    console.log(changes);
    if (!this.companyUI) {
      this.payPeriodTypefromParentall = 'Clear';
    }
    this.filteredRows = [...this.rows];
    if (this.companyUI) {
      // this.AttributeAPI();
    }
  }

  handleCompanyEvent(company: any) {
    if (company) {
      this.companyUI = company;
      this.Company_Code = company.company_Code;
      this.selectedCompanyId = company.companyId;
      console.log('company', this.selectedCompanyId);

      if (!this.companyUI) {
        alert("Select Company Code");
        return;
      }
    }
    else {
      this.payPeriodTypefromParentall = 'Clear';
    }
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    this.pay_period = payperiod.payPeriod
    console.log('payperiod', this.payperiodUI);
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  handlefinancialYearEvent(financialyear) {
    this.financialUI = financialyear;
    console.log('Financial', this.financialUI);
  }

  searchClick() {
    this.dataSource = new MatTableDataSource<any>();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = true;
    const companyId = this.companyUI?.companyId || 0;
    const payperiodId = this.payperiodUI?.payfrequencyid || 0;
    const year = this.financialUI?.financial_Year_Id || 0;
    const InvoiceNumber = this.searchInvoiceNumber || '0';

    this.sezService.Search(companyId, payperiodId, InvoiceNumber, year).subscribe({
      next: res => {
        //console.log(res);
        const tableData = res.Data;
        if (!tableData || tableData.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        console.log('tableData', tableData);
        this.dataSource = new MatTableDataSource<any>(tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  onExportClick() {
    this.isLoading = true;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace(/[:T]/g, '-');

    this.saveAsExcelFile(excelBuffer, `SezApproval_${formattedDate}`);
    this.saveAsExcelFile(excelBuffer, 'SezApproval' + Date());
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    this.isLoading = false;
    FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  onImportClick(fileInput) {

  }

  onFileChange($event) {

  }
  onTemplateClick() {

  }

  applyFilter() {
    // const text = (this.searchText || '').toLowerCase().trim();
    // if (!text) {
    //   this.filteredRows = [...this.rows];
    //   return;
    // }
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }


  applyFilterNew(event: Event, column: string) {

    const inputValue = (event.target as HTMLInputElement).value || '';

    // Store current column filter
    this.filterValues[column] = inputValue;

    // Create filter predicate only once
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {

      const filters = JSON.parse(filter);

      return Object.keys(filters).every(col => {

        const searchValues = filters[col]
          .split(',')
          .map((v: string) => v.trim().toLowerCase())
          .filter((v: string) => v);

        if (searchValues.length === 0) {
          return true;
        }

        const cellValue = (data[col] ?? '').toString().toLowerCase();

        // OR within a column (comma separated)
        return searchValues.some(val => cellValue.includes(val));
      });
    };

    // Trigger filtering
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  
  clearFilters() {
    this.filterValues = {};
    this.dataSource.filter = '';

    // Clear all filter input boxes
    this.filterInputs.forEach(input => {
      input.nativeElement.value = '';
    });
  }

  get selectedRowsCount(): number {
    return this.rows.filter(r => r.selected).length;
  }

  editRow(row: ViewRow) {
    console.log('Edit clicked for:', row);

  }

  closeclick() {
    this.iseditclicked = false;
  }
  EditClick(rowData: any) {
    this.iseditclicked = true;
    this.editData = rowData;
    console.log(JSON.stringify(this.editData));
  }

  MultiEditClick() {
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    if (!filteredSelected.length) {
      alert('No invoices selected');
      return;
    }
    this.iseditclicked = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    // Create local download URL
    this.uploadedFileUrl = URL.createObjectURL(file);
  }


  removeUploadedFile() {
    if (this.uploadedFileUrl) {
      URL.revokeObjectURL(this.uploadedFileUrl);
    }

    this.selectedFile = null;
    this.uploadedFileUrl = null;

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // SubmitDoc(): void {

  //   const filteredSelected = this.selection.selected.filter((item: any) =>
  //     this.dataSource.filteredData.includes(item)
  //   );

  //   if (!filteredSelected.length) {
  //     alert('No invoices selected');
  //     return;
  //   }

  //   if (!this.remarkText || !this.remarkText.trim()) {
  //     alert('Please enter SEZ remarks ❌');
  //     return;
  //   }
  //   if (!this.selectedFile) {
  //     alert('Please upload SEZ document ❌');
  //     return;
  //   }

  //   this.isLoading = true;

  //   const formData = new FormData();

  //   formData.append(
  //     'invoiceIds',
  //     filteredSelected.map((x: any) => x.invoice_Id).join(',')
  //   );
  //   // formData.append('CompanyId', this.companyUI.companyId);
  //   // formData.append('PayPeriodId', this.payperiodUI.payfrequencyid);
  //   formData.append('userId', this.userdetail.userId);
  //   formData.append('remarks', this.remarkText.trim());

  //   if (this.selectedFile) {
  //     formData.append('file', this.selectedFile, this.selectedFile.name);
  //   }

  //   formData.forEach((value, key) => {
  //     console.log(key, value);
  //   });

  //   this.sezService.UploadSEZDocument(formData).subscribe({
  //     next: (res: any) => {
  //       const resultString = res.data.message.result;
  //       let errorMessage = '';
  //       try {
  //         const parsed = JSON.parse(resultString);
  //         errorMessage = parsed?.[0]?.Error_Message || '';
  //       } catch (e) {
  //         console.error('Parsing failed', e);
  //       }

  //       alert(errorMessage);
  //       this.searchClick();
  //       this.selection.clear();

  //       this.remarkText = '';
  //       this.selectedFile = null;
  //       this.iseditclicked = false;
  //       this.isLoading = false;
  //     },
  //     error: err => {
  //       this.isLoading = false;
  //       this.iseditclicked = false;
  //       console.error(err);
  //       alert('Upload failed. Please try again.');
  //       this.searchClick();
  //     }
  //   });
  // }


  Cancel() {
    this.remarksText = ''
    this.selectedFileName = ''
    this.iseditclicked = false;
  }

  deleteRow(row: ViewRow) {
    const confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete) {
      this.rows = this.rows.filter(r => r !== row);
      this.filteredRows = [...this.rows];
    }
  }
  exportdata() {

  }

  downloadFile(invoice_Id: number) {
    if (!invoice_Id) return;

    this.isLoading = true;

    this.sezService.GetUploadedFile(invoice_Id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: res => {
          console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName);
          } else {
            alert("File Path not found!");
          }
        },
        error: error => {
          console.error('Error:', error);
        }
      });
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

  invoiceApprove() {
    this.isLoading = true;
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    const selectedInvoiceIds = filteredSelected.map(item => item.id);
    //console.log(selectedInvoiceIds)
    if (!selectedInvoiceIds.length) {
      alert('Please select at least one Record ❌');
      this.isLoading = false;
      return;
    }
    if (!confirm(`You have selected ${selectedInvoiceIds.length} Record(s). Do you want to approve them?`)) {
      this.isLoading = false;
      return;
    }
    const payload = {
      Invoice_Id: String(selectedInvoiceIds),
      Remarks: this.remarkText,
      UserId: String(this.userdetail.user_Id),
      Action: "Approve"
    };
    //console.log(payload)
    this.sezService.BulkApproveSEZ(payload).subscribe({
      next: (res: any) => {
        //console.log(res);
        const errorMessage = res.Data[0].Error_Message;

        alert(errorMessage);
        this.searchClick();
        this.selection.clear();

        this.remarkText = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Something went wrong ❌');
      }
    });
  }
  invoiceReject() {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.id);

    if (!selectedInvoiceIds.length) {
      alert('Please select at least one invoice');
      this.isLoading = false;
      return;
    }

    if (!this.remarkText || this.remarkText == "") {
      alert("Remarks Mandatory for Reject");
      this.isLoading = false;
      return;
    }

    if (!confirm(`You have selected ${selectedInvoiceIds.length} invoice(s). Do you want to Reject them?`)) {
      this.isLoading = false;
      return;
    }

    const payload = {
      Invoice_Id: String(selectedInvoiceIds),
      Remarks: this.remarkText,
      UserId: String(this.userdetail.user_Id),
      Action: "Reject"
    };
    //console.log(payload)
    this.sezService.BulkApproveSEZ(payload).subscribe({
      next: (res: any) => {
        //console.log(res);
        const errorMessage = res.Data[0].Error_Message;
        alert(errorMessage);
        this.searchClick();
        this.selection.clear();

        this.remarkText = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Something went wrong ❌');
      }
    });
  }
}

