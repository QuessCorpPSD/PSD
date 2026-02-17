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
import { ChatMessage } from '../../../Models/Common';
import { ChatWindow } from '../../../Models/Common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { finalize, lastValueFrom } from 'rxjs';


import { AgGridAngular } from "ag-grid-angular";

import type { ColDef, GridApi, GridOptions, GridReadyEvent, PaginationChangedEvent, RowClickedEvent } from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  provideGlobalGridOptions,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";


export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
@Component({
  selector: 'app-draft-invoice',
  imports: [CommonModule, MatFormFieldModule, AgGridAngular,
    MatInputModule, MatRadioModule, MatTabsModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, MatIconModule, MatTableModule],
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
  dataSource = new MatTableDataSource<any>([]);
  invoiceType: number = 0;
  selection = new SelectionModel<any>(true, []);
  userdetail: any;
  currentElement: any;
  isdisabled: boolean = false;
  issearch: boolean = false;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  isLoading: boolean = false;
  Modelpopup: boolean = false;
  openChats: ChatWindow[] = [];
  hoverTimers: { [key: number]: any } = {};
  currentUser = '';
  selectedTemplate: string = '';
  template: string = "";
  TemplateOptions = [
    { value: 'Proforma', Text: 'Draft' },
    { value: 'Provisional', Text: 'Provisional' }
  ];
  //@ViewChild(PayPeriod) PayPeriodComponent!: Payperiodclass;
  displayColumns = ['action', 'download', 'serial_No', 'invoiceType', 'Req_No', 'invoice_remarks', 'company_Code', 'map_name', 'net_CTC', 'netPay', 'lotNo', 'input_No', 'pO_Number', 'employee_Head_Count', 'service_Charge', 'serviceChargeAmount', 'service_Charge_Master', 'service_Charge_Type', 'bgvbl', 'astfee', 'discT1', 'discT2', 'idcard', 'email', 'regfee', 'trnfee', 'ggdbt', 'ppekit', 'vmsfee', 'edufee', 'ntpry', 'renmac', 'draded', 'othdd', 'mbapp', 'calcrg', 'calrt', 'narration']

  // AG grid

  public gridOptions: GridOptions = {
    theme: 'legacy',
    suppressHorizontalScroll: false,
    domLayout: 'normal',
    rowHeight: 46,
    headerHeight: 48,

    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    animateRows: true,
    pagination: true,
    rowMultiSelectWithClick: true,
    enableBrowserTooltips: false
  };

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    minWidth: 150,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    tooltipValueGetter: (params: any) =>
      params.value != null ? params.value.toString() : '',

    tooltipComponentParams: {
      tooltipClass: 'ag-tooltip'
    }
  };

  DraftInvoiceData: any;
  //columnDefs: any;

  pageSize = 5; // default
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentPage = 1;
  totalPages = 1;

  columnDefs: ColDef[] = [

    // ✅ CHECKBOX
    {
      colId: 'action',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: () => true,
      width: 45,
      minWidth: 45,
      maxWidth: 45,
      pinned: 'left',
      sortable: false,
      filter: false
    },

    // ✅ DOWNLOAD
    {
      colId: 'download',
      headerName: '',
      width: 55,
      minWidth: 55,
      maxWidth: 55,
      pinned: 'left',
      sortable: false,
      filter: false,
      suppressSizeToFit: true,

      tooltipValueGetter: () => 'Pdf Download',

      cellRenderer: () => {
        return `<img src="assets/download_enabled.svg"
                     style="cursor:pointer;width:20px;height:20px;" />`;
      },

      onCellClicked: (params: any) => {
        this.RequestEmployeeDownload(params.data);
      }
    },

    // ======================
    // DATA COLUMNS
    // ======================

    { field: 'serial_No', headerName: 'Sl No', width: 90,pinned: 'left', },

    {
      field: 'invoiceType',
      headerName: 'Invoice Type',
      width: 130,
      pinned: 'left',
      valueFormatter: (p: any) =>
        p.value === 'Proforma' ? 'Draft' : p.value
    },

    { field: 'req_No', headerName: 'Request No', width: 120,pinned: 'left', },
    { field: 'invoice_remarks', headerName: 'Invoice Remarks', width: 150 },
    { field: 'company_Code', headerName: 'Company Code', width: 150 },
    { field: 'company_Id', headerName: 'Company Id', width: 130 },
    { field: 'pay_Period_Id', headerName: 'Pay Period Id', width: 140 },
    { field: 'pay_Period', headerName: 'Pay Period', width: 140 },
    { field: 'map_name', headerName: 'Map Name', width: 140 },
    { field: 'map_Name_Id', headerName: 'Map Name Id', width: 140 },
    { field: 'lotNo', headerName: 'Lot No.', width: 120 },
    { field: 'net_CTC', headerName: 'Net CTC', width: 120 },
    { field: 'netPay', headerName: 'Net Pay', width: 120 },
    { field: 'input_No', headerName: 'Input No.', width: 120 },
    { field: 'pO_Number', headerName: 'PO Number', width: 130 },
    { field: 'employee_Head_Count', headerName: 'Head Count', width: 130 },
    { field: 'service_Charge', headerName: 'Service Charge', width: 140 },
    { field: 'serviceChargeAmount', headerName: 'Service Charge Amount', width: 170 },
    { field: 'service_Charge_Master', headerName: 'Service Charge Master', width: 170 },
    { field: 'service_Charge_Type', headerName: 'Service Charge Type', width: 170 },
    { field: 'bgvbl', headerName: 'BGV Billing', width: 130 },
    { field: 'astfee', headerName: 'Assignment Fee', width: 150 },
    { field: 'discT1', headerName: 'Discount1', width: 120 },
    { field: 'discT2', headerName: 'Discount2', width: 120 },
    { field: 'idcard', headerName: 'ID Card Billing', width: 150 },
    { field: 'email', headerName: 'Email Id', width: 180 },
    { field: 'regfee', headerName: 'Registration Fee', width: 150 },
    { field: 'trnfee', headerName: 'Trainer Fee', width: 140 },
    { field: 'ggdbt', headerName: 'Govt Grants DBT', width: 160 },
    { field: 'ppekit', headerName: 'PPE Kit', width: 120 },
    { field: 'vmsfee', headerName: 'VMS Fee', width: 120 },
    { field: 'edufee', headerName: 'Education Fee', width: 150 },
    { field: 'ntpry', headerName: 'Notice Period Recovery', width: 200 },
    { field: 'renmac', headerName: 'Laptop Rental', width: 150 },
    { field: 'draded', headerName: 'DRA Deduction', width: 150 },
    { field: 'othdd', headerName: 'Other Deduction', width: 150 },
    { field: 'mbapp', headerName: 'Mobile Application Charge', width: 210 },
    { field: 'calcrg', headerName: 'Call Charge', width: 130 },
    { field: 'calrt', headerName: 'Call Rate', width: 120 },
    { field: 'narration', headerName: 'Narration', width: 180 },
    { field: 'data_From', headerName: 'Data From', width: 140 }
  ];

  private gridApi!: GridApi;

  //AG grid

  constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService, private dialog: MatDialog) {
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
        case 'Proforma':
          templateMatch = data.invoiceType == 'Proforma';
          break;

        case 'Provisional':
          templateMatch = data.invoiceType == 'Provisional';
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

  
   //AG grid
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.updatePaginationInfo();
  }

  onPaginationChanged(event: PaginationChangedEvent) {
    this.updatePaginationInfo();
  }

  updatePaginationInfo() {
    if (!this.gridApi) return;
    this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    this.totalPages = this.gridApi.paginationGetTotalPages();
  }

  //AG Grid

  Invoiceintiate(): void {

    if (this.selection.selected.length == 0) {
      alert("Please Select atleast one row");
      return;
    }

    const uniqueInvoiceTypes = new Set(
      this.selection.selected.map(row => row.invoiceType)
    );
    console.log('uniqueInvoiceTypes', uniqueInvoiceTypes);
    if (uniqueInvoiceTypes.size > 1) {
      alert('Both Draft and Provisional Invoices are selected. Please select only Draft or Provisional Invoices.');
      this.selection.clear();
      return;
    }
    this.isdisabled = true;
    this.isLoading = true;
    if (this.selection.selected[0].invoiceType === 'Proforma') {
      const request = {
        "invoiceInitiations": this.selection.selected,
        "TaxTypeId": this.invoiceType,
        "CreatedBy": this.userdetail.user_Id,
      }
      this._invoiceService.InvoiceInitiate(request).subscribe({
        next: res => {
          alert(res.Data.error_Message);
          this.isdisabled = false;
          this.InvoiceSearch();
          this.selection.clear();
          this.selection = new SelectionModel<any>(true, []);
          this.isLoading = false;
          this.dialogRef.close();
          this.remarks = '';
        },
        error: err => {
          console.log(err);
          this.isdisabled = false;
          this.isLoading = false;
        }
      })
    }
    else if (this.selection.selected[0].invoiceType === 'Provisional') {
      this.InvoiceInitiateClick();
    }

  }

  async InvoiceInitiateClick() {
    //this.isLoading = true;
    console.log('Provisional');
    const selectedRows = this.selection.selected;

    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      this.isLoading = false;
      return;
    }

    const allResponses: any[] = [];

    try {
      for (const row of selectedRows) {

        const requestPayload = {
          CompanyId: String(row.company_Id),
          CompanyCode: String(row.company_Code),
          PayPeriodId: String(row.pay_Period_Id),
          PayPeriod: String(row.pay_Period),
          LotNo: String(row.lotNo),
          Input_No: String(row.input_No),
          Map_Name_Id: String(row.map_Name_Id),
          Map_Name: String(row.map_name),
          CreatedBy: String(this.userdetail.user_Id)
        };

        console.log("Sending API for row:", requestPayload);

        const res: any = await lastValueFrom(
          this._invoiceService.ProvisionalInvoiceInitiate(requestPayload)
        );

        console.log("Received response for row:", res);

        allResponses.push({
          Map_Name: requestPayload.Map_Name,
          LotNo: requestPayload.LotNo,
          Response: res.Data.response
        });
      }

      console.log(allResponses);
      this.downloadExcelValidate(allResponses, "ProvisionalInvoiceInitiateLog");
      this.isLoading = false;
      // this.showPopup = true;
      // this.popupMessage = "All selected invoices processed!";
      //this.searchClick();

    } catch (err) {
      console.error("❌ Error processing rows:", err);
      alert("Error while processing.");
      this.isLoading = false;
    }

  }

  downloadExcelValidate(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
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
  RequestEmployeeDownload(element) {

    if (element.req_No == "0" || element.req_No == "") {
      alert('Request No should not be Empty');
      return;
    }
    this.isLoading = true;
    this._invoiceService.DraftInvoiceEmployeeByRequestId(element.req_No, element.invoiceType).subscribe({
      next: res => {
        const files = res.Data;
        if (files.file != "No") {
          this.downloadExcelFromBase64(files.file, element.req_No);
        }
        else {
          this.isLoading = false;
        }
      },
      error: err => {
        this.isLoading = false;
        console.log(err)
      }
    })
  }

  InitiationSearchExport(): void {

    if (this.selection.selected.length == 0) {
      alert("Please Select atleast one row");
      return;
    }

    if (this.selection.selected.length > 1) {
      alert("Multiple selection not allowed.");
      return;
    }
    console.log('Selection', this.selection.selected);
    this.isLoading = true;
    const request = {
      "Company_Id": this.selection.selected[0].company_Id,
      "PayPeriod_Id": this.selection.selected[0].pay_Period_Id,
      "LotNo": this.selection.selected[0].lotNo,
      "ReqNo": this.selection.selected[0].req_No,
      "Data_From": this.selection.selected[0].data_From,
      "Invoice_Type": this.selection.selected[0].invoiceType

    }
    this._invoiceService.InitiationSearchExport(request).subscribe({
      next: res => {
        if (res.Data.file != "No") {
          this.downloadExcelFromBase64(res.Data.file, res.Data.fileName)
        }

      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }
  toggleRow(event) {

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
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    //this.payPeriod.;
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    console.log(this.userdetail);
    this.payPeriodType = "All";
    const request = {
      // "Company_Id": 0,
      // "PayPeriod_Id": 0,
      "InvoiceType": 0,
      "ActionType": "A",
      "userId": this.userdetail.user_Id
    }
    this.dataSource = new MatTableDataSource<any>([]);
    this.InvoiceSearch();
    // this._invoiceService.InitialSearch(request).subscribe({
    //   next: res => {

    //     this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
    //     this.dataSource.paginator=this.PeningLot_paginator
    //   },
    //   error: err => { console.log(err) }
    // })

  }

  InvoiceSearch() {

    // if(this.selectedCompanyId==undefined)
    // {
    //   alert("Select Company ");
    //   return;
    // }

    // if(this.payPeriod==undefined)
    // {
    //   alert("Select PayPeriod ");
    //   return;
    // }
    // if(this.invoiceType==undefined)
    // {
    //   alert("Select Invoice Type ");
    //   return;
    // }
    // const request={
    //   "companyId":this.selectedCompanyId,
    //   "Pay_Period":this.payPeriod.payPeriod,
    //   "Pay_Period_Id":this.payPeriod.payfrequencyid,
    //   "taxtypeId":this.invoiceType.geN_iID
    // }
    this.issearch = true;
    this.isLoading = true;
    const request = {
      // "Company_Id": this.selectedCompanyId,
      // "PayPeriod_Id": this.payPeriod.payfrequencyid,
      "InvoiceType": 0,
      "ActionType": "S",
      "userId": this.userdetail.user_Id
    }
    this._invoiceService.InitialSearchAllot(request).subscribe({
      next: res => {
        this.DraftInvoiceData = Array.isArray(res.Data) ? res.Data : [];
        this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        console.log('Grid Data', this.dataSource);
        this.dataSource.paginator = this.PeningLot_paginator;
        this.issearch = false;
        this.isLoading = false;

      },
      error: err => { this.issearch = false; }
    });
  }

  ExportGridData() {
    if (!this.dataSource.filteredData) {
      this.InvoiceSearch();
    }
    else if (this.dataSource.filteredData) {
      const selectedData = this.dataSource.filteredData.map(item => ({
        Serial_No: item.serial_No,
        Request_No: item.req_No,
        InvoiceType: item.invoiceType === 'Proforma' ? 'Draft' : item.invoiceType,
        Company_Code: item.company_Code,
        Pay_Period: item.pay_Period,
        Map_Name: item.map_name,
        LotNo: item.lotNo,
        Input_No: item.input_No,
        Employee_Head_Count: item.employee_Head_Count,
        PO_Number: item.pO_Number,
        Net_CTC: item.net_CTC,
        NetPay: item.netPay,
        Service_Charge: item.service_Charge,
        Service_Charge_Master: item.service_Charge_Master,
        Service_Charge_Type: item.service_Charge_Type,
        ServiceChargeAmount: item.serviceChargeAmount,
        BGV_Billing: item.bgvbl,
        Assignment_Fee: item.astfee,
        Registration_Fee: item.regfee,
        Training_Fee: item.trnfee,
        Govt_Grants_Debit: item.ggdbt,
        PPE_Kit: item.ppekit,
        VMS_Fee: item.vmsfee,
        Education_Fee: item.edufee,
        Notice_Pay_Recovery: item.ntpry,
        Discount1: item.discT1,
        Discount2: item.discT2,
        ID_Card_Billing: item.idcard,
        Call_Charge: item.calcrg,
        Call_Rate: item.calrt,
        DRA_Deduction: item.draded,
        Other_Deduction: item.othdd,
        Mobile_Application_Charge: item.mbapp,
        Invoice_Category: item.invoice_Category,
        State_Name: item.state_name,
        Initiation_Remarks: item.initiation_Remarks,
        GL_Code: item.gL_Code,
        Work_Order_Number: item.work_Order_Number,
        Data_From: item.data_From
      }));
      this.downloadExcel(selectedData, 'DraftInvoice_Export');
    }
  }

  downloadExcel(data: any[], FileName: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${FileName}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  ngOnChanges() {
    if (!this.payPeriodType) {

    }
  }
  onOptionSelected(event: InvoiceType) {
    //this.invoiceType =event;
  }


  openChat(row: any): void {
    const reqNo: string = row.req_No;

    // 🔒 Prevent duplicate chat window
    const existingChat = this.openChats.find(c => c.req_No === reqNo);
    if (existingChat) {
      this.keepChatOpen(reqNo);
      return;
    }

    // 🪟 Create chat shell first
    const chat = {
      req_No: reqNo,
      messages: [] as ChatMessage[]
    };

    this.openChats.push(chat);

    const request = { Req_No: reqNo };

    this._invoiceService.getRemarksByReqNo(request)
      .subscribe((res: any) => {
        console.log('API Response:', res);

        const rows = res?.Data || res?.data || [];
        console.log('Rows:', rows);

        chat.messages = rows
          .map((r: any) => ({
            message: r.invoice_remarks,
            givenBy: r.remarks_GivenBy,
            type: r.invoiceType,
            time: r.time // already formatted
          }))
          // 🕒 oldest → latest
          .sort(
            (a, b) =>
              new Date(a.time).getTime() - new Date(b.time).getTime()
          );
      });
  }

  closeChat(reqNo: string): void {
    this.openChats = this.openChats.filter(c => c.req_No !== reqNo);
    clearTimeout(this.hoverTimers[reqNo]);
  }

  closeChatDelayed(reqNo: string): void {
    this.hoverTimers[reqNo] = setTimeout(() => {
      this.closeChat(reqNo);
    }, 300);
  }

  keepChatOpen(reqNo: string): void {
    clearTimeout(this.hoverTimers[reqNo]);
  }
}
