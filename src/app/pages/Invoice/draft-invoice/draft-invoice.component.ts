import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoicetypeComponent } from '../../../common/invoicetype/invoicetype.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { MatIconModule } from '@angular/material/icon';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { Payperiodclass } from '../../../Models/Common';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { InvoiceType } from '../../../Models/invoicetype';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { GstInvoiceComponent } from '../gst-invoice/gst-invoice.component';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { GstinvoiceComponent } from "../gstinvoice/gstinvoice.component";
import { InvoiceCancelComponent } from "../invoicecancel/invoicecancel.component";

export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
@Component({
  selector: 'app-draft-invoice',
  imports: [CommonModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatTabsModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, CompanyallComponent, PayPeriodComponent, MatIconModule, MatTableModule, GstinvoiceComponent,InvoiceCancelComponent],
  templateUrl: './draft-invoice.component.html',
  styleUrl: './draft-invoice.component.css',
   providers: [
          {
              provide: Invoice_TOKEN,
              useClass: InvoiceRepository,
          }
      ]
})
export class DraftInvoiceComponent implements OnInit {
  @ViewChild('PeningLotPaginator') PeningLot_paginator!: MatPaginator;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  remarks = '';
  dataSource=new MatTableDataSource<any>([]);
  invoiceType:number=0;
  selection = new SelectionModel<any>(true, []);
  userdetail:any;
  currentElement:any;
  isdisabled:boolean=false;
  issearch:boolean=false;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  isLoading:boolean= false;
  Modelpopup:boolean=false;
  //@ViewChild(PayPeriod) PayPeriodComponent!: Payperiodclass;
  displayColumns=['action','serial_No','map_name','net_CTC','netPay','lotNo','input_No','pO_Number','employee_Head_Count','service_Charge','serviceChargeAmount','service_Charge_Master','service_Charge_Type','bgvbl','astfee','discT1','discT2','idcard','email','regfee','trnfee','ggdbt','ppekit','vmsfee','edufee','ntpry','renmac','draded','othdd','mbapp','calcrg','calrt','narration']
  constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository,private _decrypt:EncryptionService,
  private _sessionStoreage:SessionStorageService,private dialog: MatDialog){
  }
 

  openDialog(): void {
      this.isLoading = false;
      //this.Modelpopup=true;
    this.dialogRef = this.dialog.open(this.editDialog, {
      width: '400px',
     // data: "text"
    });
  }
  applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
  Invoiceintiate():void{
      if(this.selectedCompanyId==undefined)
      {
        alert("Select Company ");
        return;
      }
  
      if(this.payPeriod==undefined)
      {
        alert("Select PayPeriod ");
        return;
      }
      //this.invoiceType=1
      if(this.invoiceType==undefined)
      {
        alert("Select Invoice Type ");
        return;
      }
     if(this.selection.selected.length==0)
     {
      alert("Please Select atleast one row");
      return;
     }
     this.isdisabled=true;
     this.isLoading=true;
      const request={
        "invoiceInitiations":this.selection.selected,
        "TaxTypeId":this.invoiceType,
        "CreatedBy":this.userdetail.user_Id,
      }
      this._invoiceService.InvoiceInitiate(request).subscribe({
        next:res=>{ 
          alert(res.Data.error_Message);
         this.isdisabled=false;
         this.InvoiceSearch();
         this.selection.clear();
         this.selection = new SelectionModel<any>(true, []);
         this.isLoading=false;
         this.dialogRef.close();
         this.remarks='';
        },
        error:err=>{console.log(err);
          this.isdisabled=false;
          this.isLoading=false;
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
      this.isLoading=false;
    }
    InitiationSearchExport():void{
      
      if(this.selectedCompanyId==undefined)
      {
        alert("Select Company ");
        return;
      }
  
      if(this.payPeriod==undefined)
      {
        alert("Select PayPeriod ");
        return;
      }
      if(this.invoiceType==undefined)
      {
        alert("Select Invoice Type ");
        return;
      }
      this.isLoading=true;
       const request = {
        "Company_Id": this.selectedCompanyId,
        "PayPeriod_Id": this.payPeriod.payfrequencyid,
        "InvoiceType": 0,
        "ActionType": "S"
      }
      this.isLoading=true;
      this._invoiceService.InitiationSearchExport(request).subscribe({
        next:res=>{
          if(res.Data.file!="No")
          {
            this.downloadExcelFromBase64(res.Data.file,res.Data.fileName)
          }
          
        },
        error:err=>{
          console.log(err);
        }
      })
    }
    toggleRow(event)
    {
  
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
    handleCompanyEvent(company)
    {
      this.selectedCompanyId = company.companyId;
      //this.payPeriod.;
    }
    handlePayperiodEvent(payperiod: Payperiodclass){
      this.payPeriod = payperiod;
    }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    console.log(this.userdetail);
    this.payPeriodType = "All";
    const request = {
      "Company_Id": 0,
      "PayPeriod_Id": 0,
      "InvoiceType": 0,
      "ActionType": "A"
    }
    this.dataSource=new MatTableDataSource<any>([]);
    // this._invoiceService.InitialSearch(request).subscribe({
    //   next: res => {
        
    //     this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
    //     this.dataSource.paginator=this.PeningLot_paginator
    //   },
    //   error: err => { console.log(err) }
    // })

  }
  
    InvoiceSearch(){
  
      if(this.selectedCompanyId==undefined)
      {
        alert("Select Company ");
        return;
      }
  
      if(this.payPeriod==undefined)
      {
        alert("Select PayPeriod ");
        return;
      }
      if(this.invoiceType==undefined)
      {
        alert("Select Invoice Type ");
        return;
      }
      // const request={
      //   "companyId":this.selectedCompanyId,
      //   "Pay_Period":this.payPeriod.payPeriod,
      //   "Pay_Period_Id":this.payPeriod.payfrequencyid,
      //   "taxtypeId":this.invoiceType.geN_iID
      // }
      this.issearch=true;
      this.isLoading=true;
      const request = {
        "Company_Id": this.selectedCompanyId,
        "PayPeriod_Id": this.payPeriod.payfrequencyid,
        "InvoiceType": 0,
        "ActionType": "S"
      }
      this._invoiceService.InitialSearch(request).subscribe({
        next:res=>{
           this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
           this.dataSource.paginator=this.PeningLot_paginator;
           this.issearch=false;
           this.isLoading=false;
         
        },
        error:err=>{this.issearch=false;}
      });
    }
    ngOnChanges() {
  if (!this.payPeriodType) {
    
  }
}
    onOptionSelected(event:InvoiceType){
     //this.invoiceType =event;
    }
}
