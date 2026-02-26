import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Invoicecancelgrid } from '../../../Models/Invoicecancelgrid';
import { Payperiodclass } from '../../../Models/Common';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { finalize } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

interface IrnColor {
  label: string,
  color: string
}
@Component({
  selector: 'invoicecancel',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatDialogModule,
    MatSort,
    AlertpopupComponent,
    MatTooltipModule

  ],
  templateUrl: './invoicecancel.component.html',
  styleUrls: ['./invoicecancel.component.css']
})



export class InvoiceCancelComponent implements OnInit, AfterViewInit {
  IrnTypeItems: IrnColor[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  dataSource = new MatTableDataSource<Invoicecancelgrid>([]);
  dialogRef!: MatDialogRef<any>;

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType: string = "All";
  isdisabled: boolean = false;
  issearch: boolean = false;
  isLoading: boolean = false;
  remarks: string = '';
  userdetail: any;
  showPopup: boolean = false;
  popupMessage: string = "";
  popupSubMessage: string = "";
  showRemarksPopup = false;
    searchText: string = '';
  remarkText?: string;
    showPanel = false;
     currentSelectItems: any[] = [];
       gridData: any[] = [];
         selectedTemplate: string = ''; 
           template: string = "";

  displayedColumns: string[] = ['select'
    , 'pdfdownload', 'docDownload', 'invoice_Number', 'invoice_Date', 'company_Code','pay_Period','map_Name','amount', 'cgsT_Amount', 'sgsT_Amount', 'igsT_Amount', 'net_Amount', 'creditNote_Status', 'creditNoteNumber', 'cancelledOn','crn_IRN_Status','crn_IRN_Number','remarks'];
    filterDisplayedColumns: string[] = [...this.displayedColumns];
  columnFilters: { [key: string]: string } = {};
  selection = new SelectionModel<Invoicecancelgrid>(true, []);
 TemplateOptions = [
    { value: 'requested', Text: 'Requested' },
    { value: 'approved', Text: 'Approved' },
    { value: 'rejected', Text: 'Rejected' }
  ];

  constructor(
    private _invoiceService: InvoiceRepository,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private dialog: MatDialog
  ) { }
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id
      )
    );
  }
  ngOnInit(): void {

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.InvoiceSearch();
     this.BindIRNColors();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
    const searchTerms = JSON.parse(filter);

    return Object.keys(searchTerms).every(column => {
      const filterValue = searchTerms[column];
      const dataValue = data[column];

      if (!filterValue) return true;

      return dataValue
        ?.toString()
        .toLowerCase()
        .includes(filterValue);
    });
  };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  toggleRow(row: Invoicecancelgrid) {
    this.selection.toggle(row);
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.editDialog, { width: '400px' });
  }

  CloseCancelPopup(): void {
    this.showRemarksPopup = false;
    this.remarkText = '';
  }


  invoiceApprove() {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);

    if (!selectedInvoiceIds.length) {
      alert('Please select at least one invoice ❌');
      this.isLoading = false;
      return;
    }

    if (!confirm(`You have selected ${selectedInvoiceIds.length} invoice(s). Do you want to approve them?`)) {
      this.isLoading = false;
      return;
    }

    const payload = {
      invoice_Id: selectedInvoiceIds,
      remarks: this.remarkText,
      userId: String(this.userdetail.user_Id)
    };
    this._invoiceService.BulkApproveInvoice(payload).subscribe({
      next: (res: any) => {
        console.log(res);
         this.isLoading = false;
        if (res?.statusCode === 200 && res?.data?.status === 'SUCCESS') {
      this.popupMessage = res?.Data[0]?.data?.message; // ✅ correct
      this.showPopup = true;

      this.selection.clear();

      if (this.paginator) {
        this.paginator.firstPage();
      }

      this.InvoiceSearch();
    } else {
      this.popupMessage =  res?.Data[0]?.data?.message||'Invoice Approved Successfully';
      this.showPopup = true;
       this.selection.clear();

      if (this.paginator) {
        this.paginator.firstPage();
      }

      this.InvoiceSearch();
    }
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

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);

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
      invoice_Id: selectedInvoiceIds,
      remarks: this.remarkText,
      userId: String(this.userdetail.user_Id)
    };
    
    this._invoiceService.BulkRejectCancelRequest(payload).subscribe({
      next: (res: any) => {
        if (res.Data[0].Status === "SUCCESS") {
          this.popupMessage = 'Cancel Request Rejected successfully';
          this.showPopup = true;
          const isSuccess =
            res?.status === 'SUCCESS' ||
            res?.statusCode === 200;

          if (isSuccess) {
            this.selection.clear();
            if (this.paginator) {
              this.paginator.firstPage();
            }
            this.InvoiceSearch();
          }

          this.isLoading = false;
        }
        else {
          this.popupMessage = 'Cancel Request Rejection Failed';
          this.popupSubMessage ='Note:' + res.Data[0].Error_Message;
          this.showPopup = true;
          this.isLoading = false;
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Something went wrong ❌');
        this.isLoading = false;
      }
    });
  }

  InvoiceSearch() {
    /*if (!this.selectedCompanyId || !this.payPeriod) {
      alert('Select Company and Pay Period');
      return;
    }*/

    this.isLoading = true;

    /*const request = {
      Company_Id: this.selectedCompanyId,
      PayPeriod_Id: this.payPeriod.payfrequencyid
    };*/

    this._invoiceService.GetAllInvoiceCancelDetails().subscribe({
      next: (res: any) => {
        const apiData = Array.isArray(res?.Data?.data) ? res.Data.data : [];
        console.log(apiData);
        this.dataSource.data = apiData.map((item: any) => ({
          ...item,
          invoice_Number:
            item.invoice_Number ||
            item.invoiceNumber ||
            item.InvoiceNumber
        }));

        // ✅ Always reassign paginator after data load
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  Invoiceintiate() {
    if (!this.selection.selected.length) {
      alert("Please select at least one row");
      return;
    }

    this.isdisabled = true;
    this.isLoading = true;

    const request = {
      invoiceInitiations: this.selection.selected,
      TaxTypeId: 0,
      CreatedBy: this.userdetail.user_Id
    };

    this._invoiceService.InvoiceInitiate(request).subscribe({
      next: (res) => {
        alert(res.Data.error_Message);
        this.selection.clear();
        this.isdisabled = false;
        this.isLoading = false;
        this.dialogRef.close();
      },
      error: (err) => {
        console.error(err);
        this.isdisabled = false;
        this.isLoading = false;
      }
    });
  }

  DownloadInvoice(invoiceId: number, invoice_Number: string,creditNoteNumber:string) {
    this.isLoading = true;
    this._invoiceService.DownloadInvoice(invoiceId).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileNameBase = creditNoteNumber && creditNoteNumber.trim() !== ''
        ? creditNoteNumber
        : invoice_Number;
      let fileName =  `${fileNameBase}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) fileName = match[1];
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }

  BulkDownload() {
    this.isLoading = true;
    const filteredSelected = this.selection.selected.filter(item =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);
    if (!selectedInvoiceIds.length) {
      alert("No invoices selected");
      this.isLoading = false;
      return;
    }

    const BulkInvoices = { invoiceIds: selectedInvoiceIds };

    this._invoiceService.BulkDownloadInvoice(BulkInvoices).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'invoices.zip';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) fileName = match[1];
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }

  Downloadfile(invoice_Id: number) {
    if (!invoice_Id) return;

    this.isLoading = true;

    this._invoiceService.GetUploadedFile(invoice_Id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: res => {
          //console.log(res);
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
  BindIRNColors() {
    this._invoiceService.GetIRNColors().subscribe({
      next: (res: any) => {
        console.log(res);
        this.IrnTypeItems = res.Data.data; // ✅ correct level
      },
      error: err => {
        console.error(err);
      }
    });
  }

  onMouseEnter(error: any): void {
    console.log('Triggered');
    if (!error?.Invoice_Id) return;

    if (Array.isArray(this.gridData) && this.gridData.length > 0) {
      this.showPanel = true;
      return;
    }

    this._invoiceService.GetEInvoiceErrorHover(error.Invoice_Id).subscribe({
      next: res => {
        console.log(res.Data);
        const data = res.Data.data.Table0.map((item: any) => ({
          Error_Code: item.Error_Code,
          Error_Message: item.Error_Message,
        }));
        this.gridData = data;
        this.showPanel = true;
      }
    });
  }


  onItemsMoved(event): void {
    this.currentSelectItems = event.selected;
  }


    legendItems = [
    { label: 'Pending', color: '#9E9E9E' },
    { label: 'Requested', color: '#2196F3' },
    //{ label: 'Processing', color: '#FF9800' },
    { label: 'Generated', color: '#4CAF50' },
    { label: 'Rejected', color: '#F44336' }

  ];
 
  getIRNStatusColor(row: any): string {

    if (row.crn_IRN_Status == null) {
      return '#f6c23e'; // Invoice Pending
    }
    if (row.crn_IRN_Status == "Requested") {
      return '#36b9cc'; // Invoice Requested
    }
    if (row.crn_IRN_Status = "Generated") {
      return '#1cc88a'; // Invoice Generated
    }
    if (row.crn_IRN_Status = "Processing") {
      return '#4e73df'; // Invoice Generated
    }
    if (row.IRN_Status === 'Rejected') {
      return '#e74a3b'; // Invoice Generated
    }
    return '#f6c23e';
  }
 downloadError(error) {
    this._invoiceService.GetEInvoiceError(error.Invoice_Id).subscribe({
      next: res => {
        let files = res.Data;
        if (files.file != "No") {
          this.downloadExcelFromBase64(files.file, error.Invoice_Number);
        }
      },
      error: err => { }
    })
  }
 onTemplateChange(searchText: string = ''): void {

    this.template = this.selectedTemplate;

    const filterValue = `${this.template}|${searchText}`;

    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {

      const [template, searchText = ''] = filter.split('|');
      const searchValues = searchText
        .toLowerCase()
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);


      let templateMatch = true;

      switch (template) {
        case 'requested':
          templateMatch = data.creditNote_Status == 'Requested';
          break;

        case 'approved':
          templateMatch = data.creditNote_Status=='Approved';
          break;

        case 'rejected':
          templateMatch = data.creditNote_Status=='Rejected';
          break;
      }

      const textMatch =
        searchValues.length === 0 ||
        searchValues.some(search =>
          Object.values(data).some(val =>
            String(val).toLowerCase().includes(search)
          )
        );

      return templateMatch && textMatch;
    };

    this.dataSource.filter = filterValue;
  }
 /* applyFilter(event: Event, column: string) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.columnFilters[column] = value;
    this.dataSource.filter = JSON.stringify(this.columnFilters);
  }*/
 applyFilter(event: Event, column: string) {
  const inputValue = (event.target as HTMLInputElement).value || '';

  // Split comma-separated invoice numbers
  const searchValues = inputValue
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(v => v);

  this.dataSource.filterPredicate = (data: any, filter: string) => {
    if (!searchValues.length) return true;

    const cellValue = data[column]?.toString().toLowerCase() || '';

    // Match ANY invoice number
    return searchValues.some(val => cellValue.includes(val));
  };

  // Trigger filtering
  this.dataSource.filter = searchValues.join(',');
}
 applyDateFilter(event: any, column: string) {
  const inputValue = event.target.value || '';

  // Split comma-separated date values
  const searchDates = inputValue
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(v => v);

  this.dataSource.filterPredicate = (data: any, filter: string) => {
    if (!searchDates.length) return true;

    const rowDate = new Date(data[column]);
    if (isNaN(rowDate.getTime())) return false;

    // Convert row date → dd MMM yyyy
    const formattedRowDate = rowDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      .replace(',', '')
      .toLowerCase();

    // Match ANY date from comma-separated input
    return searchDates.some(date => formattedRowDate.includes(date));
  };

  // Trigger filter refresh
  this.dataSource.filter = searchDates.join(',');
}

}
