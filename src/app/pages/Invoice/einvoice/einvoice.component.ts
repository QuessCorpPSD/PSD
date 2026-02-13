import { Component, Inject, InjectionToken, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { CommonModule } from '@angular/common';


import { EncryptionService } from "../../../Shared/encryption.service";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from "@angular/material/checkbox";
import { Company, Groupnameclass } from '../../../Models/Common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';


import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Payperiodclass } from '../../../Models/Common';


import { finalize } from 'rxjs';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { EInvoiceGrid } from '../../../Models/EInvoiceGrid';
import { InvoiceRepository } from '../../../Service/invoice/InvoiceRepository';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { AttributeComponent } from "../attribute/attribute.component";


export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');

interface IrnColor {
  label: string,
  color: string
}

@Component({
  selector: 'einvoice',
  standalone: true,
  imports: [CommonModule, MatPaginator, MatTableModule, FormsModule,
    MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckbox, MatCardModule,
    MatIconModule, MatTooltipModule, FormsModule, ReactiveFormsModule, CompanyallComponent, PayPeriodComponent, AlertpopupComponent, PayPeriodComponent, AttributeComponent],
  templateUrl: './einvoice.component.html',
  styleUrl: './einvoice.component.css',
  providers: [

    {
      provide: Invoice_TOKEN,
      useClass: InvoiceRepository
    }]
})
export class EInvoiceComponent {

  companyUI: any;
  payperiodUI: any;
  selectedCC?: number;
  selectedCN?: string;
  selectedPP?: string;
  isLoading?: boolean = false;
  showPopup?: boolean = false;
  popupMessage: string = "";
  popupSubMessage: string = "";
  datatable: Array<{ [key: string]: any }> = [];
  isChecked: boolean = false;
  userdetail: any;
  payPeriodTypefromParent: string = '';
  payPeriodTypetoChild?: string;
  searchText: string = '';
  selectedTemplate: string = '';
  template: string = "";
  IrnTypeItems: IrnColor[] = [];
  availableItems: any[] = [];
  isattributes = false;
  showpsd = false;
  excelFile: File | null = null;
  UploadedResponse: any;
  AttributeType = 'G';
  selectedItems: any[] = [];
  Company_Code?: string;
  pay_period?: string;
  currentSelectItems: any[] = [];
  gridData: any[] = [];
  cacheData: any;
  showPanel = false;
  selectedCompanyId!: number;
  payPeriodType: string = "All";
  constructor(private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, private fb: FormBuilder, @Inject(Invoice_TOKEN) private invoiceService: IInvoiceRepository
  ) { }
  TemplateOptions = [
    { value: 'irnpending', Text: 'IRN Pending' },
    { value: 'irnrequested', Text: 'IRN Requested' },
    { value: 'irngenerated', Text: 'IRN Generated' }
  ];

  attributes = [
    { name: 'Narration', selected: false },
    { name: 'PO_Number', selected: false }
  ];

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.Company_Code = company.company_Code;
    this.selectedCompanyId = this.companyUI.companyId;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    const request = {
      "id": 0,
      "AttributeName": "A",
      "ActionType": "G",
      "IsActive": false,
      "CreatedBy": 3,
      "DateTime": new Date()
    }
    this.invoiceService.GetAllAttribute(request).subscribe({
      next: res => {
        this.availableItems = res.Data;
      }, error: err => { console.log(err) }
    })
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    this.pay_period = payperiod.payPeriod
    if (!this.companyUI) {
      alert("Select Company Code pay");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
  }

  search() {

    this.selectedTemplate = '';
    this.searchText = '';
    this.selection.clear();
    this.invoiceService.GetAllInvoiceDetailsByCompanyId(this.companyUI.companyId, this.payperiodUI.payfrequencyid).subscribe({
      next: res => {
        // Check data here
        console.log(res);
        const tableData = res.data.data.Table0;

        if (!tableData || tableData.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource<EInvoiceGrid>(tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.onTemplateChange();
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }
  ngOnInit(): void {
    //this.payPeriodTypetoChild = "All"
    this.payPeriodTypefromParent = "All";
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      const request = {
        "id": 0,
        "AttributeName": "A",
        "ActionType": "G",
        "IsActive": false,
        "CreatedBy": 3,
        "DateTime": new Date()
      }
      this.invoiceService.GetAllAttribute(request).subscribe({
        next: res => {
          //console.log('Result',res.Data);
          this.availableItems = res.Data;
          //console.log('availableItems',this.availableItems);

        }, error: err => { console.log(err) }
      })
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    // if (this.TemplateOptions?.length > 0) {
    //   this.selectedTemplate = this.TemplateOptions[0].value;
    // }

    this.BindIRNColors();
  }
  BindIRNColors() {
    this.invoiceService.GetIRNColors().subscribe({
      next: (res: any) => {
        console.log(res);
        this.IrnTypeItems = res.Data.data; // ✅ correct level
      },
      error: err => {
        console.error(err);
      }
    });
  }

  applyFilter(searchText: string = '') {

    this.onTemplateChange(searchText);
  }


  dataSource = new MatTableDataSource<EInvoiceGrid>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'select', 'pdfdownload', 'irnStatus', 'invoice_Number', 'map_Name'
    , 'Invoice_Date', 'state_Name', 'SubTotal', 'CGST_Amount', 'SGST_Amount', 'UTGST_Amount', 'IGST_Amount', 'net_Amount'
  ];




  selection = new SelectionModel<EInvoiceGrid>(true, []);

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.Invoice_Id === sel.Invoice_Id
      )
    );
  }

  canInitiateIRN(): boolean {
    return this.selection.selected.some(
      row => row.IRN_Status === 'Pending' || row.IRN_Status === 'Rejected'
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


  toggleRow(row: EInvoiceGrid) {
    this.selection.toggle(row);
  }

  searchClick() {
    if (!this.companyUI) {
      alert("Please select Company Code");
    }
    if (!this.payperiodUI) {
      alert("Please select Pay Period");
    }

    if (this.companyUI && this.payperiodUI) {
      this.isLoading = true;
      this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
    }
  }

  ExportExcel() {
    if (!this.companyUI) {
      alert("Please select Company Code");
    }
    if (!this.payperiodUI) {
      alert("Please select Pay Period");
    }

    if (this.companyUI && this.payperiodUI) {
      this.isLoading = true;
      this.GetExportData(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
    }
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
        case 'irnrequested':
          templateMatch = data.IRN_Number == null && data.BatchFile != null;
          break;

        case 'irnpending':
          templateMatch = data.IRN_Number == null && data.BatchFile == null;
          break;

        case 'irngenerated':
          templateMatch = data.IRN_Number != null && data.BatchFile != null;
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




  isSelectedIRNGenerated(): boolean {
    const selected = this.selection.selected;

    if (!selected || selected.length === 0) return false;

    const irnumbers = [...new Set(selected.map(item => item.IRN_Number))];

    // Block if multiple lot numbers selected
    if (irnumbers.length !== 1) return true;

    // Check if any record for the selected lotNumber is already submitted
    return selected.some(item => item.IRN_Number === irnumbers[0]); // && item.isSubmitted === true);
  }

  BindDashBoard(companyId: number, payPeriodId: number) {
    this.selectedTemplate = '';
    this.searchText = '';
    this.selection.clear();
    this.invoiceService.GetAllInvoiceDetailsByCompanyId(companyId, payPeriodId).subscribe({
      next: res => {
        // Check data here
        console.log(res);
        const tableData = res.Data.data.Table0;

        if (!tableData || tableData.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource<EInvoiceGrid>(tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.onTemplateChange();
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }
  GetExportData(companyId: number, payPeriodId: number) {
    this.invoiceService.GetExportData(companyId, payPeriodId).subscribe({
      next: res => {
        this.datatable = res.data.data.Table0;
        console.log(this.datatable);
        if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
          this.downloadExcel(this.datatable, "EInvoice_" + this.companyUI.companyCode + "_" + this.payperiodUI.payPeriod);
          this.isLoading = false;
        }
        else {
          alert("No validations returned");
          this.isLoading = false;
        }
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }

    });
  }


  confirmIRN(): void {
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const hasB2COrB2BEXMT = filteredSelected.some(item =>
      item.Invoice_Category === 'B2C' || item.Invoice_Category === 'B2BEXMT'
    );

    if (hasB2COrB2BEXMT) {
      alert('Cannot Initiate IRN for B2C or B2BEXMPT Catgory');
      return;
    }
    else {
      const confirmed = confirm("Are you sure you want to Generate IRN for the Selected Invoice(s)");
      if (confirmed) {
        this.IRNInitiate();
      }
    }
  }

  // DownloadInvoice(invoiceId: number, invoice_Number: string) {
  //   this.isLoading = true;
  //   this.invoicerepo.DownloadInvoice(invoiceId).subscribe(response => {
  //     const contentDisposition = response.headers.get('Content-Disposition');
  //     let fileName = invoice_Number + '_' + this.companyUI.displayName + '.pdf';

  //     // Extract file name from header
  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="?(.*?)"?$/);
  //       if (match && match.length > 1) {
  //         fileName = match[1];
  //       }
  //     }

  //     const blob = new Blob([response.body!], { type: 'application/pdf' });

  //     // Create link and trigger download
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = fileName;
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     this.isLoading = false;
  //   });
  // }

  DownloadInvoice(invoiceId: number, invoice_Number: string) {
    this.isLoading = true;
    const BulkInvoices = {
      invoiceIds: [invoiceId]
    }
    console.log(BulkInvoices);
    this.invoiceService.BulkDownloadInvoice(BulkInvoices).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = this.companyUI.displayName + '.zip';

      // Extract file name from header
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) {
          fileName = match[1];
        }
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });

      // Create link and trigger download
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
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    const selectedInvoiceIds = filteredSelected.map(item => item.Invoice_Id);
    if (!selectedInvoiceIds.length) {
      alert("No invoices selected");
      return;
    }
    const BulkInvoices = {
      invoiceIds: selectedInvoiceIds
    }
    console.log(BulkInvoices);
    this.invoiceService.BulkDownloadInvoice(BulkInvoices).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = this.companyUI.displayName + '.zip';

      // Extract file name from header
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) {
          fileName = match[1];
        }
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });

      // Create link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }

  IRNInitiate() {
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    console.log(filteredSelected);
    // if (filteredSelected.Invoice_Category === 'B2B'  ||  filteredSelected.Invoice_Category === 'B2B') {
    //   alert("Cannot In");
    // }
    this.isLoading = true;
    const selectedInvoiceIds = filteredSelected.map(item => item.Invoice_Id);
    //console.log(selectedInvoiceIds);
    const InitiateIRN = {
      invoiceIds: selectedInvoiceIds,
      CompanyId: this.companyUI.companyId,
      PayPeriodId: this.payperiodUI.payfrequencyid,
      userId: this.userdetail.user_Id
    };
    //console.log(InitiateIRN);
    if (InitiateIRN) {
      this.invoiceService.InitiateIRN(InitiateIRN).subscribe({
        next: res => {
          console.log(res);
          const parsedData = JSON.parse(res.data.data);
          const errorMessage = parsedData[0]?.Error_Message;
          if (errorMessage) {
            //console.log(errorMessage);
            alert(errorMessage);
            this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid);
            this.isLoading = false;
          }
          else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('Error fetching data:', err.message);
          this.isLoading = false;
        }
      });
    }
    else {
      alert("Please select atleast one Invoice");
      this.isLoading = false;
      return;
    }

  }

  downloadExcel(data: any[], templateId: string): void {
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
  legendItems = [
    { label: 'Pending', color: '#9E9E9E' },
    { label: 'Requested', color: '#2196F3' },
    //{ label: 'Processing', color: '#FF9800' },
    { label: 'Generated', color: '#4CAF50' },
    { label: 'Rejected', color: '#F44336' }

  ];
  // IrnTypeItems = [
  //   { label: 'B2B', color: '#2C2C54' },
  //   { label: 'B2C', color: '#C0392B' },
  //   { label: 'B2C Exp', color: '#7F8C8D' },
  //   { label: 'EXPWP', color: '#8E44AD' },
  //   { label: 'EXPWOP', color: '#6E2C00' },
  //   { label: 'SEZWP', color: '#F39C12' },
  //   { label: 'SEZWOP', color: '#D35400' }

  // ];
  getIRNStatusColor(row: any): string {

    if (row.IRN_Status == null) {
      return '#f6c23e'; // Invoice Pending
    }
    if (row.IRN_Status == "Requested") {
      return '#36b9cc'; // Invoice Requested
    }
    if (row.IRN_Status = "Generated") {
      return '#1cc88a'; // Invoice Generated
    }
    if (row.IRN_Status = "Processing") {
      return '#4e73df'; // Invoice Generated
    }
    if (row.IRN_Status === 'Rejected') {
      return '#e74a3b'; // Invoice Generated
    }
    return '#f6c23e';
  }
  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
  downloadError(error) {
    this.invoiceService.GetEInvoiceError(error.Invoice_Id).subscribe({
      next: res => {
        let files = res.Data;
        if (files.file != "No") {
          this.downloadExcelFromBase64(files.file, error.Invoice_Number);
        }
      },
      error: err => { }
    })
  }

  // onMouseEnter(error: any): void {
  //   console.log('Triggered');
  //   if (!error?.Invoice_Id) return;

  //   if (this.errorCache[error.Invoice_Id]) {
  //     this.gridData = this.errorCache[error.Invoice_Id];
  //     this.showPanel=true;
  //     return;
  //   }

  //   this.invoicerepo.GetEInvoiceErrorHover(error.Invoice_Id).subscribe({
  //     next: res => {
  //       const data = (res.data.data.Table0 || []).map((item: any) => ({
  //         Error_Code: item.Error_Code,
  //         Error_Message: item.Error_Message
  //       }));

  //       this.errorCache[error.Invoice_Id] = data;
  //       this.gridData = data;
  //       this.showPanel=true;
  //     }
  //   });
  // }


  onMouseEnter(error: any): void {
    console.log('Triggered');
    if (!error?.Invoice_Id) return;

    if (Array.isArray(this.gridData) && this.gridData.length > 0) {
      this.showPanel = true;
      return;
    }

    this.invoiceService.GetEInvoiceErrorHover(error.Invoice_Id).subscribe({
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


  Attributeclick() {
    if (this.companyUI == undefined || this.companyUI == null) {
      alert('Please select Company');
      return;
    }

    if (this.payperiodUI == undefined || this.payperiodUI == null) {
      alert('Please select Pay Period');
      return;
    }

    const request = {
      "id": 0,
      "AttributeName": "A",
      "ActionType": "S",
      "IsActive": false,
      "CreatedBy": 3,
      "DateTime": new Date()
    }
    this.invoiceService.GetAllAttribute(request).subscribe({
      next: res => {
        this.availableItems = res.Data;
      }, error: err => { console.log(err) }
    })
    //this.isattributes = true;
    this.showpsd = true;

  }

  AttributesTemplateclick() {
    const selectedAttributes = this.attributes
      .filter(attr => attr.selected)
      .map(attr => attr.name);

    if (selectedAttributes.length == 0) {
      alert('Please select atleast one Attributes');
      return;
    }

    const baseHeaders = ["LotNo", "Employee_Code"];
    const finalHeaders = [...baseHeaders, ...selectedAttributes];
    const data: any[][] = [finalHeaders];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Split");

    XLSX.writeFile(wb, "Attributes_Template.xlsx");

  }


  onImportClick(fileInput: HTMLInputElement): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please select PayPeriod");
      return;
    }
    fileInput.value = '';
    fileInput.click();

  }

  onFileChange(event: any): void {
    this.isLoading = true;
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }
    const file = target.files[0];
    this.excelFile = target.files[0];
    console.log(target.files.length);

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('CompanyId', this.companyUI.companyId);
      formData.append('payperiodId', this.payperiodUI.payfrequencyid);
      formData.append('CreatedBy', this.userdetail.user_Id);

      this.invoiceService.UploadAttributesGST(formData).subscribe({
        next: res => {
          this.UploadedResponse = res;
          console.log(this.UploadedResponse);
          if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response.includes('Row(s) Uploaded Successfully.')) {
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = this.UploadedResponse.Data.response;
            this.searchClick();
          }
          else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {

            const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
            const exportData = errorArray.map((item: any) => ({
              Error_Message: item.Error_Message || item.Error_Message || ''
                || item.Message || item.MESSAGE || item.message
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { 'ErrorMessages': worksheet },
              SheetNames: ['ErrorMessages']
            };

            // Export the file
            XLSX.writeFile(workbook, 'Attribute_Validations.xlsx');
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Import Failed.';

          }
          else {
            if (this.UploadedResponse.Data.response != '') {
              alert(this.UploadedResponse.Data.response);
              this.isLoading = false;
            }
            else {
              alert('Error while processing response.');
              this.isLoading = false;
            }

          }
        },
        error: err => {
          console.error('❌ Upload failed', err);
          this.isLoading = false;
        }
      });
    }
  }

  onConsolidatedClick(): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please select PayPeriod");
      return;
    }

    this.isLoading = true;

    const payload = {
      Company_Id: this.companyUI.companyId,
      Pay_Period_Id: this.payperiodUI.payfrequencyid,
      Pay_Period: this.payperiodUI.payPeriod
    }

    this.invoiceService.GetConsolidatedPayRegister(payload)
      .pipe(
        finalize(() => this.isLoading = false) // ✅ only one place to stop loading
      )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            const data = res.data;
            this.downloadExcelFromBase64(data.file, data.fileName);
          } else {
            alert("Something went wrong while generating the report.");
          }
        },
        error: error => {
          console.error('Error:', error);
          alert("Server error occurred.");
        }
      });
  }


  onConsolidatedSummaryClick(): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please select PayPeriod");
      return;
    }

    this.isLoading = true;

    const payload = {
      Company_Id: this.companyUI.companyId,
      Company_Code: this.companyUI.companyCode,
      Company_Name: this.companyUI.companyName,
      Pay_Period_Id: this.payperiodUI.payfrequencyid,
      Pay_Period: this.payperiodUI.payPeriod
    }

    this.invoiceService.GetConsolidateInvoiceSummary(payload)
      .pipe(
        finalize(() => this.isLoading = false) // ✅ only one place to stop loading
      )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            console.log(res.Data);
            const data = res.Data;
            this.downloadExcelFromBase64(data.File, data.FileName);
          } else {
            alert("Something went wrong while generating the report.");
          }
        },
        error: error => {
          console.error('Error:', error);
          alert("Server error occurred.");
        }
      });
  }


}
