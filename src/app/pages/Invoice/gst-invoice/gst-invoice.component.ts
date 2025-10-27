import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from "@angular/material/tooltip";
import { AddComponent } from './add/add.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'gst-invoice',
    imports: [MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule,
        MatInputModule, MatIconModule, MatTooltip],
    templateUrl: './gst-invoice.component.html',
    styleUrl: './gst-invoice.component.css'
})
export class GstInvoiceComponent {
  dataSource:any;
  selection = new SelectionModel<any>(true, []);
displayColumnNames=['check','action','invoice_Number','iRN_Status','sap_Invoice_Number','sap_Account_Number',
  'invoice_Date','company_Code','pay_Period','map_Name','state_Name','group_Name','invoiceType','net_Amount',
  'status','sap_Cancel_Document','sap_Credit_Note_Document','iRN_Number','crn_Number','crn_IRN_Status','crn_IRN_Number'
]
invoice_NumberFilter = new FormControl('');
iRN_StatusFilter = new FormControl('');
invoice_DateFilter = new FormControl('');
CompanyCodeFilter = new FormControl('');
Pay_PeriodFilter = new FormControl('');
MapNameFilter = new FormControl('');
StateFilter = new FormControl('');
group_NameFilter = new FormControl('');
invoiceTypeFilter = new FormControl('');
CreditNoteFilter = new FormControl('');
CreditNoteIRNStatusFilter = new FormControl('');
constructor(private dialog: MatDialog){}
  AddPOOpen():void {
    this.dialog.open(AddComponent, {
      width: '90%',
      height: '90vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
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
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }
}
export type FloatLabelType = 'always' | 'auto';