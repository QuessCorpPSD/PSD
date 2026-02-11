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
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { finalize } from 'rxjs';
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
    CompanyallComponent,
    PayPeriodComponent,
    MatSort,
    AlertpopupComponent

  ],
  templateUrl: './invoicecancel.component.html',
  styleUrls: ['./invoicecancel.component.css']
})
export class InvoiceCancelComponent implements OnInit, AfterViewInit {

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

  displayedColumns: string[] = ['select'
    , 'pdfdownload', 'docDownload', 'invoice_Number', 'invoice_Date', 'map_Name', 'state_Name', 'invoiceType', 'cgsT_Amount', 'sgsT_Amount', 'igsT_Amount', 'net_Amount', 'creditNote_Status', 'creditNoteNumber', 'cancelledOn'];
  filterDisplayedColumns: string[] = [...this.displayedColumns];
  columnFilters: { [key: string]: string } = {};
  selection = new SelectionModel<Invoicecancelgrid>(true, []);

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

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filters = JSON.parse(filter);

      return Object.keys(filters).every(column => {
        if (!filters[column]) return true;

        const value = data[column];
        if (!value) return false;

        return value
          .toString()
          .toLowerCase()
          .includes(filters[column]);
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

  applyFilter(event: Event, column: string) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.columnFilters[column] = value;
    this.dataSource.filter = JSON.stringify(this.columnFilters);
  }
  applyDateFilter(event: Event, column: string) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.columnFilters[column] = value;
    this.dataSource.filter = JSON.stringify(this.columnFilters);
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


  invoiceApprove() {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);

    // ❌ No selection
    if (!selectedInvoiceIds.length) {
      alert('Please select at least one invoice ❌');
      this.isLoading = false;
      return;
    }

    // ⚠️ Confirmation
    if (!confirm(`You have selected ${selectedInvoiceIds.length} invoice(s). Do you want to approve them?`)) {
      this.isLoading = false;
      return;
    }

    const payload = { invoice_Id: selectedInvoiceIds };

    this._invoiceService.BulkApproveInvoice(payload).subscribe({
      next: (res: any) => {

        this.popupMessage =
          res?.message || 'Invoices approved successfully';
        this.showPopup = true;
        console.log(res);
        const isSuccess =
          res?.status === 'SUCCESS' ||
          res?.statusCode === 200;

        if (isSuccess) {


          // Clear selection
          this.selection.clear();

          // Reset paginator
          if (this.paginator) {
            this.paginator.firstPage();
          }

          // Refresh grid
          this.InvoiceSearch();
        }

        this.isLoading = false;
      },
      error: (err) => {
        alert(err?.error?.message || 'Something went wrong ❌');
        this.isLoading = false;
      }
    });
  }

  invoiceReject() {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);

    // ❌ No selection
    if (!selectedInvoiceIds.length) {
      alert('Please select at least one invoice ❌');
      this.isLoading = false;
      return;
    }

    // ⚠️ Confirmation
    if (!confirm(`You have selected ${selectedInvoiceIds.length} invoice(s). Do you want to Reject them?`)) {
      this.isLoading = false;
      return;
    }

    const payload = { invoice_Id: selectedInvoiceIds };

    this._invoiceService.BulkApproveInvoice(payload).subscribe({
      next: (res: any) => {

        this.popupMessage =
          res?.message || 'Invoices approved successfully';
        this.showPopup = true;
        console.log(res);
        const isSuccess =
          res?.status === 'SUCCESS' ||
          res?.statusCode === 200;

        if (isSuccess) {


          // Clear selection
          this.selection.clear();

          // Reset paginator
          if (this.paginator) {
            this.paginator.firstPage();
          }

          // Refresh grid
          this.InvoiceSearch();
        }

        this.isLoading = false;
      },
      error: (err) => {
        alert(err?.error?.message || 'Something went wrong ❌');
        this.isLoading = false;
      }
    });
  }

  InvoiceSearch() {
    if (!this.selectedCompanyId || !this.payPeriod) {
      alert('Select Company and Pay Period');
      return;
    }

    this.isLoading = true;

    const request = {
      Company_Id: this.selectedCompanyId,
      PayPeriod_Id: this.payPeriod.payfrequencyid
    };

    this._invoiceService.GetAllInvoiceCancelDetails(request).subscribe({
      next: (res: any) => {
        const apiData = Array.isArray(res?.Data?.data) ? res.Data.data : [];

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

  DownloadInvoice(invoiceId: number, invoice_Number: string) {
    this.isLoading = true;
    this._invoiceService.DownloadInvoice(invoiceId).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = invoice_Number + '.pdf';
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

}
