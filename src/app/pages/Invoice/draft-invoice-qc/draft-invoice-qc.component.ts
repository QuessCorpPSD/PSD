import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { SelectionModel } from '@angular/cdk/collections';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-draft-invoice-qc',
  imports: [CommonModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatTabsModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, MatIconModule, MatTableModule],
  templateUrl: './draft-invoice-qc.component.html',
  styleUrl: './draft-invoice-qc.component.css',
  providers: [
    {
      provide: Invoice_TOKEN,
      useClass: InvoiceRepository,
    }
  ]
})
export class DraftInvoiceQCComponent implements OnInit {
  @ViewChild('PeningLotPaginator') PeningLot_paginator!: MatPaginator;
  searchText: string = '';
  userdetail: any;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  displayColumns = ['action',  'invoiceType', 'Req_No','invoice_Number', 'company_Code',  'net_CTC', 'netPay', 'lotNo', 'input_No', 'employee_Head_Count',  'serviceChargeAmount','sourcing_Fee_Amount']

constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,){
  
}
ngOnInit(): void {
  const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  this.InvoiceSearch(this.userdetail.user_Id)
}
  applyFilter(searchText: string = '') {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const searchValues = filter
        .toLowerCase()
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);

      return (
        searchValues.length === 0 ||
        searchValues.some(search =>
          Object.values(data).some(val =>
            String(val).toLowerCase().includes(search)
          )
        )
      );
    };

    this.dataSource.filter = searchText.trim().toLowerCase();
  }
Export(){
   if (this.selection.selected.length === 0) {
    alert('No rows selected');
    return;
  }
    const selectedList = this.dataSource.filteredData
    .filter(row => this.selection.isSelected(row))
    .map(item => ({
      "Request No": item.req_No,
      "Invoice Number": item.invoice_Number,
      "Input NO": item.input_No,
      "Lot No": item.lotNo,
      "Company Code": item.company_Code,
      "employee_Head_Count": item.employee_Head_Count,
      "Net_CTC": item.net_CTC,
      "Netpay": item.netPay,
      "Service Charge Amount": item.serviceChargeAmount
    }));
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedList);

  // Create workbook
  const workbook: XLSX.WorkBook = {
    Sheets: { 'SelectedInvoices': worksheet },
    SheetNames: ['SelectedInvoices']
  };

  // Export Excel file
  XLSX.writeFile(workbook, 'Selected_Invoices.xlsx');
}
InvoiceQC(){
  const selectedList = this.dataSource.filteredData
  .filter(row => this.selection.isSelected(row))
  .map(item => ({
    Req_No: item.req_No,
    Invoice_Number: item.invoice_Number
  }));
const request={
  "invoiceQCModels":selectedList,
  "CreatedBy":this.userdetail.user_Id
}
this.isLoading=true;
 this._invoiceService.PostInvoiceQCdetail(request).subscribe({
  next:res=>{
    alert(res.Data.error_Message);    
    this.InvoiceSearch(this.userdetail.user_Id);
    this.isLoading=false;
    this.selection.clear();
    return;

  },
  error:err=>{
this.isLoading=false;
  }
 })
}
  toggleRow(event: any) {

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected() {
    console.log(this.selection.selected);
    return this.selection.selected.length > 0;
  }

  masterToggle() {

    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }


 InvoiceSearch(userId) {    
    this.isLoading = true;   
    this._invoiceService.InitialSearchQC(userId).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);       
        this.dataSource.paginator = this.PeningLot_paginator;
        console.log(res.Data);
        this.isLoading = false;
      },
      error: err => { }
    });
  }

}
