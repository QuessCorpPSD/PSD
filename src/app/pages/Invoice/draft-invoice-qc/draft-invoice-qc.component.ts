import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
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
export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');

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
export class DraftInvoiceQCComponent {
  @ViewChild('PeningLotPaginator') PeningLot_paginator!: MatPaginator;
  searchText: string = '';
  userdetail: any;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  displayColumns = ['action', 'serial_No', 'invoiceType', 'Req_No', 'invoice_remarks', 'company_Code', 'map_name', 'net_CTC', 'netPay', 'lotNo', 'input_No', 'pO_Number', 'employee_Head_Count', 'service_Charge', 'serviceChargeAmount', 'service_Charge_Master', 'service_Charge_Type', 'bgvbl', 'astfee', 'discT1', 'discT2', 'idcard', 'email', 'regfee', 'trnfee', 'ggdbt', 'ppekit', 'vmsfee', 'edufee', 'ntpry', 'renmac', 'draded', 'othdd', 'mbapp', 'calcrg', 'calrt', 'narration', 'eapct', 'hosac']


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




}
