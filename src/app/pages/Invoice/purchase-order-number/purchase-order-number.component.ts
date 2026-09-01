import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { PurchaseOrderNumber } from '../../../Service/invoice/purchaseorderNumber.service';
@Component({
  selector: 'app-purchase-order-number',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule, MatCheckboxModule],
  templateUrl: './purchase-order-number.component.html',
  styleUrl: './purchase-order-number.component.css'
})
export class PurchaseOrderNumberComponent implements OnInit {
  edit_company_name = '';
  selectedCompanyId: any;
  isLoading: boolean = false;
  excelFile: File | null = null;
  datatable: any;
  search: any;
  purchaseOrderNo: string = '';
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'delete',
    'purchaseOrderNo',
    'companyCode',
    'companyName',
    'clientPORefNo',
    'poDate',
    'purchaseRequestNo',
    'poAmount',
    'poValidFrom',
    'poValidTo',
    'poBasedOn',
    'cityName',
    'remarks',
    'isActive'
  ];
  userdetail: any;
  showTable = true;
  isAddclicked = false;
  isEditMode = false;
  addpurchase_order!: FormGroup;
  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private router: Router, public service: PurchaseOrderNumber) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.addpurchase_order = new FormGroup({

      CompanyCode: new FormControl('', Validators.required),

      PODate: new FormControl('', Validators.required),

      PurchaseRequestNo: new FormControl(''),

      POAmount: new FormControl('', Validators.required),

      POValidFrom: new FormControl('', Validators.required),

      POValidTo: new FormControl('', Validators.required),

      POBasedOn: new FormControl('', Validators.required),

      Remarks: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    if (!company || !company.companyId) {
      this.selectedCompanyId = null;
      return;
    }
    this.selectedCompanyId = company.companyId;
  }

  onSearch() {
    // if (!this.selectedCompanyId) {
    //   alert('Please select a Company');
    //   return;
    // }
    this.isLoading = true;
    const spiltTypeId = 2

    const payload = {
      Action: "Get",
      Company_Id: this.selectedCompanyId ?? null,
      Purchase_Request_No: this.purchaseOrderNo != '' ? this.purchaseOrderNo : null,
      Purchase_Order_Id: null,
      PODateFrom: null,
      PODateTo: null,
      PageNo: 1,
      PageSize: 10,
      SortField: "",
      SortDirection: null,
      TotalCount: null
    };

    this.service.Search(payload).subscribe({
      next: (res) => {
        this.search = res.Data.data.Table0;
        console.log("Data", this.search)
        if (this.search && this.search.length > 0) {
          this.dataSource = new MatTableDataSource(this.search);
          this.dataSource.paginator = this.paginator;

        } else {
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.isLoading = false;
      },
    });
    this.isLoading = false;
  }

  exportToExcel() {
    // if (!this.selectedCompanyId) {
    //   alert('Please select a Company');
    //   return;
    // }

    this.isLoading = true;

    const payload = {
      Action: "Import",
      Company_Id: this.selectedCompanyId ?? null,
      Purchase_Request_No: this.purchaseOrderNo != '' ? this.purchaseOrderNo : null,
      Purchase_Order_Id: null,
      PODateFrom: null,
      PODateTo: null,
      PageNo: 1,
      PageSize: 10,
      SortField: "",
      SortDirection: null,
      TotalCount: null
    };
    this.service.Exporttoexcel(payload)
      .pipe(
        finalize(() =>
          this.isLoading = false
        )
      ).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data.data.Table0;

            if (data.length === 0) {
              alert('No data found');
              return;
            }
            this.downloadExcel(data, "PurchaseOrderNumber_Export");
            // var base64 = data.file;
            // this.downloadExcelFromBase64(base64, data.fileName)
          }
        },
        error: error => console.error('Error:', error)
      })
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

  DownloadTemplate() {
    const templateData = [
      {
        Company_code: "", Service_Charge: "", Map_Name: "", Invoice_Type: ""
        , Invoice_category: "", State: "", Type_of_invoice: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    const wb = {
      Sheets: { 'OtherIncomeCulture': ws },
      SheetNames: ['OtherIncomeCulture']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, `OtherIncomeCulture_Template.xlsx`);
  }

  FileUpload(fileInput: HTMLInputElement): void {
    this.isLoading = true;
    fileInput.click();
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];

    if (!this.excelFile) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('userId', this.userdetail.user_Id);

      // this.service.UploadInvoiceCulture(formData).subscribe({
      //   next: (res) => {
      //     this.datatable = res.Data;
      //     console.table(this.datatable);
      //     if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
      //       this.downloadExcel(this.datatable, "InvoiceCulture_Validations");
      //       this.isLoading = false;
      //     } else {
      //       alert("No validations returned");
      //       this.isLoading = false;
      //     }
      //   },
      //   error: err => {
      //     console.error('Upload failed', err);
      //     this.isLoading = false;
      //   }
      // });
    }
  }

  downloadExcel(data: any[], templateId: string): void {
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

  AddPurchaseOrder() {
    this.isAddclicked = true;
    this.isEditMode = false;
  }


  deleteClick(invoiceCulture_id: number, invoiceType: string) {
    if (confirm("Are you sure you want to delete this?")) {

      const parentDetail = {
        InvoiceCulture_id: invoiceCulture_id,
        Company_Id: 0,
        Company_Code: '',
        Company_Name: '',
        InvoiceCul_Ref_No: "",
        InvoiceType: invoiceType,
        InvoiceType_Id: 0,
        Cost_Center_Mapping_Id: 0,
        Service_Charge_Master_Id: 0,
        Service_Charge_Type_Id: 0,
        Service_Charge_Slab_Item_Id: 0,
        Service_Charge_Slab_Inner_Item_Id: 0,
        Map_Name_Id: 0,
        Map_Name: '',
        Invoice_Category_Id: 0,
        Error_Message: ""
      }

      // const childDetail: ChildDetail[] = [];

      // childDetail.push({
      //   InvoiceCulture_id: 0,
      //   Company_Id: 0,
      //   Paycode_Id: 0,
      //   Paycode_Code: "",
      //   HasAccess: false
      // });

      const InvoiceCultureAdd = {
        createdBy: this.userdetail.user_Id,
        mode: 'Delete',
        parentDetail: parentDetail,
        //childDetail: childDetail
      }
      // this.service.postInvoiceCulture(InvoiceCultureAdd).subscribe({
      //   next: (res) => {
      //     const errormsg = res.Data.data.Table0[0].Error_Message;
      //     alert(errormsg);
      //     this.isLoading = true;
      //     this.onSearch()
      //     error: err => {
      //       console.error('Error fetching data:', err.message);
      //       this.isLoading = false;
      //     }
      //   }
      // });
    }
  }

  EditOtherIncome(element) {
    console.log("Edited")
    console.log(element);

    const formatDate = (date: any): string => {
      if (!date) return '';
      // Already in yyyy-MM-dd format
      if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
        return date.substring(0, 10);
      }
      // Format: dd-MM-yyyy hh:mm:ss AM/PM
      const datePart = String(date).split(' ')[0];
      const parts = datePart.split('-');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return '';
    };

    this.isAddclicked = true;
    this.isEditMode = true;
    //this.addpurchase_order.get('CompanyCode')?.disable();
    this.edit_company_name = element.Company_Name;
    this.addpurchase_order.patchValue({
      CompanyCode: element.company_Code,
      PODate: formatDate(element.PO_Date),
      PurchaseRequestNo: element.Purchase_Request_No,
      POAmount: element.PO_Amount,
      POValidFrom: formatDate(element.PO_Valid_From),
      POValidTo: formatDate(element.PO_Valid_To),
      POBasedOn: element.PO_Based_On,
      Remarks: element.Remarks
    });
  }

  SaveData() {
    if (this.addpurchase_order.invalid) {
      alert("Please fill all required fields");
      return;
    }
  }

  Editedcloseclick() {
    this.isAddclicked = false;
    this.isEditMode = false;
    this.dataSource.data = [];
    this.addpurchase_order.reset();
    this.onSearch();
  }

  handleCompanyAdd(company) {
    console.log("Selected Company:", company);
    if (!company || !company.companyId) {
      this.selectedCompanyId = null;
      return;
    }
    this.selectedCompanyId = company.companyId;

    // this.CompanySelectedCC = company.companyId;
    // this.selectedCC = Number(this.CompanySelectedCC) || 0;
    // this.addOtherIncome.patchValue({
    //   // CompanyCode: company.companyCode,
    //   CompanyName: company.companyName
    // });
    // const req = {
    //   "company_Id": this.CompanySelectedCC,
    //   "Culture_Id": 0,
    //   "Type": 'N'
    // }
    // this.loadPaycodes(req);
  }
}
