import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild, OnInit } from '@angular/core';
import { AbstractControl,FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators ,ValidationErrors,
  ValidatorFn,} from '@angular/forms';
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
export const poDateValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const poDate = control.get('PODate')?.value;
  const fromDate = control.get('POValidFrom')?.value;
  const toDate = control.get('POValidTo')?.value;

  // Don't validate until all dates are entered
  if (!poDate || !fromDate || !toDate) {
    return null;
  }

  const po = new Date(poDate);
  const from = new Date(fromDate);
  const to = new Date(toDate);

  // From date must be less than To date
  if (from >= to) {
    return {
      fromDateGreaterThanToDate: true
    };
  }

  // PO Date must be between From and To
  if (po < from || po > to) {
    return {
      poDateOutOfRange: true
    };
  }

  return null;
};
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
  formatDateTime(dateValue: string | null): string | null {
  if (!dateValue) {
    return null;
  }

  return `${dateValue} 00:00:00`;
}
  userdetail: any;
  showTable = true;
  isAddclicked = false;
  isEditMode = false;
  PurchaseOrderID: number = 0;
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

}, {
  validators: poDateValidator
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
      Company_Id: this.selectedCompanyId ?? 0,
      Purchase_Request_No: this.purchaseOrderNo?.trim() || null,
      Purchase_Order_Id: 0,
      PODateFrom: null,
      PODateTo: null,
      PageNo: 1,
      PageSize: 10,
      SortField: "",
      SortDirection: "",
      TotalCount: 0
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
           console.log('POSearch Error:', err);
    console.log(
      'Validation:',
      JSON.stringify(err.error?.Data?.errors, null, 2)
    );
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


 deleteClick(Purchase_Order_Id: number) {

  if (!confirm('Are you sure you want to delete this Purchase Order?')) {
    return;
  }

  const request = {
    Action: 'Delete',
    Purchase_Order_Id: Purchase_Order_Id,

    Company_Id: 0,
    PO_Date: null,
    PO_Based_On: 0,
    Purchase_Request_No: '',
    PO_Amount: 0,
    PO_Valid_From: null,
    PO_Valid_To: null,
    Remarks: '',
    IsActive: false,
    CreatedBy: null,
    ModifiedBy: this.userdetail.user_Id
  };

  console.log('Delete Purchase Order Request:', request);

  this.service.SavePurchaseOrder(request).subscribe({
    next: (res: any) => {

      console.log('Delete Response:', res);

      const errorMessage = res?.Data?.error_Message;

      console.log('Error Message:', errorMessage);

          alert(errorMessage || 'Delete completed successfully');

      this.onSearch();
    },

    error: (err) => {
      console.error('Error deleting Purchase Order:', err);
      alert('Error while deleting Purchase Order');
    }
  });
}
EditPurchaseOrder(element: any) {

  console.log('Edited');
  console.log(element);

  const formatDate = (date: any): string => {

    if (!date) return '';

    // Already yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date.substring(0, 10);
    }

    // dd-MM-yyyy hh:mm:ss AM/PM
    const datePart = String(date).split(' ')[0];
    const parts = datePart.split('-');

    if (parts.length === 3) {

      const [day, month, year] = parts;

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return '';
  };

  // Open popup in Edit mode
  this.isAddclicked = true;
  this.isEditMode = true;

  // Store database ID
  this.PurchaseOrderID = element.Purchase_Order_Id;

  console.log('PurchaseOrderID:', this.PurchaseOrderID);

  // Display company name
  this.edit_company_name = element.Company_Name;

  // Populate form
  this.addpurchase_order.patchValue({

    CompanyCode: element.Company_Id,

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

    this.addpurchase_order.markAllAsTouched();

    return;
  }

  const formValue = this.addpurchase_order.value;
console.log("form value",  JSON.stringify(formValue, null, 2));
  const payload = {

    Action: this.isEditMode ? 'Edit' : 'Create',

    Purchase_Order_Id: this.isEditMode
      ? this.PurchaseOrderID
      : 0,

    Company_Id:  formValue.CompanyCode?.companyId ?? this.selectedCompanyId ?? 0,

    PO_Date: this.formatDateTime(formValue.PODate),

    PO_Based_On: formValue.POBasedOn ? 1 : 0,

    Purchase_Request_No: formValue.PurchaseRequestNo,

    PO_Amount: formValue.POAmount,

    PO_Valid_From: this.formatDateTime(formValue.POValidFrom),

   PO_Valid_To: this.formatDateTime(formValue.POValidTo),

    Remarks: formValue.Remarks,

    IsActive: true,

    CreatedBy: this.isEditMode
      ? null
      : this.userdetail.user_Id,

    ModifiedBy: this.isEditMode
      ? this.userdetail.user_Id
      : null
  };

  console.log('Payload:', payload);

  this.isLoading = true;

  this.service.SavePurchaseOrder(payload).subscribe({

    next: (res: any) => {

      //console.log('Response:', res);

      this.isLoading = false;
const errorMessage =
  res?.Data?.data?.Table0?.[0]?.Error_Message ??
  res?.Data?.Table0?.[0]?.Error_Message ??
  res?.Data?.error_Message ??
  res?.Error_Message ??
  res?.Message ??
  'Operation completed successfully';

//console.log('Message:', errorMessage);

    alert(errorMessage);
      this.isEditMode = false;
      this.isAddclicked = false;
      this.PurchaseOrderID = 0;
      this.dataSource.data = [];
      this.addpurchase_order.reset();

      this.onSearch();
    },

    error: (err) => {

      this.isLoading = false;

      console.error('Error:', err);

      alert('Error while saving Purchase Order');
    }
  });
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
