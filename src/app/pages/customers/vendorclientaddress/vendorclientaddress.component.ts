import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IClientaddress } from '../../../Repository/customer/IClientaddress';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { ClientaddressService } from '../../../Service/customersserv/clientaddress.service';
const Pay_TOKEN = new InjectionToken<IClientaddress>('Pay_TOKEN');


@Component({
  selector: 'app-vendorclientaddress',
  imports: [MatPaginator, MatTableModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCardModule, CompanyallComponent],
  templateUrl: './vendorclientaddress.component.html',
  styleUrl: './vendorclientaddress.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ClientaddressService,
    }
  ]
})
export class VendorclientaddressComponent {
  Clientaddress: any;
  userdetail: any;
  clientaddress!: FormGroup;
  selectedCC: any;
  companyUI: any;
  isEditMode: boolean = false;
  rowData: any;

  constructor(private dialog: MatDialog, @Inject(Pay_TOKEN) private service: IClientaddress, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, private fb: FormBuilder,) { }
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  showAlert = false;
  showValidate = false;
  isLoading: boolean = false;
  uploadDisplayedColumns: string[] = [
    'Action',
    'Client_Address_Id',
    'Companycode',
    'State',
    'MapName',
    'SACCode',
    'Billing_Client_Name',
    'billingaddress',
    'billingstate',
    'Shippingaddresssameasbilling',
    'Shippingclientname',
    'Shippingaddress',
    'Shippingstate',
    'Effectivedate',
    'SezApplicable',
    'SezExpiryDate',
    'LutNumber',
    'LutDate',
    'LutExpiryDate',
    'VendorCode',
    'gstnumber',
    'BillingLocation',
    'ShippingLocation',
    'BillingPincode',
    'ShippingPincode',
    'SapBillTo',
    'SapShipTo',
    'AddressCode'
  ];
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showClientPopup = false;
  sameAsBilling = false;


  AddPOOpen() {
    this.isEditMode = false;
    this.clientaddress.reset();
    this.showClientPopup = true;
  }

  editOpen(row: any) {
    this.isEditMode = true;
    this.rowData = row;
    this.showClientPopup = true;

    this.clientaddress.patchValue({

      company: row.company_Code,
      Costcentermapping: row.map_Name,
      state: row.state,
      subCustomerCode: row.saC_Code,
      billingClientName: row.billingClientName,
      billingAddress: row.billingAddress,
      billingState: row.billingStateName,
      billingLocation: row.city_Name,
      billingPinCode: row.billingPinCode,
      shippingsameasbilling: row.isShippingAddressSameAsBilling,
      shippingClientName: row.shippingClientName,
      shippingAddress: row.shippingAddress,
      shippingState: row.shippingStateName,
      shippingLocation: row.shippingCity_Name,
      shippingPinCode: row.shippingPinCode,
      sapBillTo: row.sapBillTo,
      sapShipTo: row.sapShipTo,
      effectiveDate: row.effectiveDate,
      vendorcode: row.vendorCode,
      sezApplicable: row.seZ_Applicable,
      sezExpiryDate: row.seZ_ExpiryDate,
      lutNumber: row.luT_Number,
      lutDate: row.luT_Date,
      lutExpiryDate: row.luT_ExpiryDate,
    });
  }

  closeClientPopup() {
    this.showClientPopup = false;
  }

  handleCompanyEvent(company: any) {
    this.selectedCC = company.companyId;
    this.companyUI = company;
    this.clientaddress.patchValue({
      company: company
    });
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }



    this.clientaddress = this.fb.group({

      company: ['', Validators.required],
      Costcentermapping: ['', Validators.required],
      subCustomerCode: ['', Validators.required],
      state: ['', Validators.required],

      billingClientName: ['', Validators.required],
      billingAddress: ['', Validators.required],
      billingState: ['', Validators.required],
      billingLocation: ['', Validators.required],
      billingPinCode: ['', Validators.required],
      sapBillTo: [''],

      shippingClientName: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingLocation: ['', Validators.required],
      shippingPinCode: ['', Validators.required],
      sapShipTo: [''],

      shippingsameasbilling: [false],

      effectiveDate: [''],

      sezApplicable: [false],
      sezExpiryDate: [''],
      lutNumber: [''],
      lutDate: [''],
      lutExpiryDate: [''],
      vendorcode: ['']

    });




    this.onsearch();



  }

  sameAsBillingChange(event: any) {

    this.sameAsBilling = event.target.checked;

    if (this.sameAsBilling) {

      this.clientaddress.patchValue({

        shippingClientName: this.clientaddress.value.billingClientName,
        shippingAddress: this.clientaddress.value.billingAddress,
        shippingState: this.clientaddress.value.billingState,
        shippingLocation: this.clientaddress.value.billingLocation,
        shippingPinCode: this.clientaddress.value.billingPinCode,
        sapShipTo: this.clientaddress.value.sapBillTo

      });

    }

  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showAlert = true;
    this.showValidate = false;
  }

  showvalidatePopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showValidate = true;
    this.showAlert = false;
  }

  closePopup() {
    this.showAlert = false;
    this.showValidate = false;
  }

  // AddPOOpen() {
  //   const dialogRef = this.dialog.open(ClientaddressNewComponent, {
  //     width: '60%',
  //     height: '85vh',
  //     disableClose: true,
  //     data: { example: 'Hello from parent!' }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'refresh') {
  //       this.onsearch();
  //     }
  //   });
  // }

  // ImportOpen() {
  //   const dialogRef = this.dialog.open(ClientaddressImportComponent, {
  //     width: '60%',
  //     height: '78vh',
  //     disableClose: true,
  //     data: { example: 'Hello from parent!' }
  //   });

  // }


  deleteClientAddress(row: any): void {
    const userId = this.userdetail.user_Id;

    this.service.PostClientAddressDelete(row.clientAddressId, userId)
      .subscribe({
        next: (res: string) => {
          if (res.includes('Success')) {
            alert(res);
            this.onsearch();
          }
          else {
            alert(res);
            this.onsearch();
          }
        },
        error: (err) => {
          alert('Error deleting Client Address.');
          console.error(err);
        },
        complete: () => {
          console.error('Delete client address completed');
        }
      });
  }

  onsearch() {
    this.isLoading = true;

    const userId = this.userdetail.user_Id;

    this.service.Search(userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.Clientaddress = res?.Data;

        if (!this.Clientaddress) {
          this.isLoading = false;
          alert(res.Data.message)
        }
        if (this.Clientaddress && this.Clientaddress.length > 0) {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.Clientaddress);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Action',
            'Client_Address_Id',
            'Companycode',
            'State',
            'MapName',
            'SACCode',
            'Billing_Client_Name',
            'billingaddress',
            'billingstate',
            'Shippingaddresssameasbilling',
            'Shippingclientname',
            'Shippingaddress',
            'Shippingstate',
            'Effectivedate',
            'SezApplicable',
            'SezExpiryDate',
            'LutNumber',
            'LutDate',
            'LutExpiryDate',
            'VendorCode',
            'gstnumber',
            'BillingLocation',
            'ShippingLocation',
            'BillingPincode',
            'ShippingPincode',
            'SapBillTo',
            'SapShipTo',
            'AddressCode'];
        } else {
          this.isLoading = false;
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading Companypaycode release data', err);
      },
    });
    this.isLoading = false;
  }


  exportToExcel(): void {
    this.isLoading = true;

    const Companyid = this.userdetail.user_Id;

    this.service.ExporttoExcel(Companyid).subscribe({
      next: (res) => {
        this.isLoading = false;

        try {
          const base64File = res?.Data?.file;
          let apiFileName = res?.Data?.fileName;

          if (!base64File) {
            alert("No file received from the API");
            return;
          }

          // 🔧 Fix invalid characters in the filename
          apiFileName = apiFileName
            .replace(/\//g, "-")
            .replace(/:/g, "-")
            .replace(/ /g, "_");

          // remove .xlsx because your download function adds extension
          apiFileName = apiFileName.replace(".xlsx", "");

          this.downloadExcelFromBase64(base64File, apiFileName, "Excel");
        } catch (err) {
          console.error("Error exporting to Excel:", err);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading data for export", err);
      },
    });
  }

  downloadExcelFromBase64(base64String: string, fileName: string, FileType): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}_${FileType}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  downloadTemplate() {
    const templateData = [
      {
        CompanyCode: "",
        MapName: "",
        BillingClientName: "",
        BillingAddress: "",
        IsShippingAddressSameAsBilling: "",
        ShippingClientName: "",
        ShippingAddress: "",
        EffectiveDate: "",
        VATApplicable: "",
        SAC_Code: "",
        GstNumber: ""
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Table': workSheet },
      SheetNames: ['Table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `ClientAddress_Template.xlsx`)
  }


  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert("Please upload only one Excel file")
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);

    this.service.PostClientAddressUpload(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          alert("Upload request Processed.Server did not return any data")
          this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          this.showAlertPopup("Row(s) Uploaded Successfully.")
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && res?.Data?.response?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');
          this.isLoading = false;
          alert("Failed to Import")
          // errors[0] may be a JSON string, an array, or a plain string/object
          const rawErr = res?.Data?.errors?.[0];
          let errorArray: any[] = [];
          try {
            if (typeof rawErr === 'string') {
              const tryJson = JSON.parse(rawErr);
              errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }
          } catch {
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_ClientAddress.xlsx');
          this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        // CASE: Data is array with Error_Message (e.g. "No rows to Upload")
        if (Array.isArray(res.Data) && res.Data[0]?.Error_Message) {
          alert(res.Data[0].Error_Message)
          this.isLoading = false;
          return;
        }
        else {
          alert('Error while processing response.')
        }

        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
        alert("Upload Failed")
      }
    });
  }

  saveClientAddress() {
    if (this.isEditMode) {
      this.onSubmitedit();
    } else {
      this.ValidatedSubmit();
    }
  }

  onSubmitedit(): Promise<void> {
    // this.submitted = true;

    return new Promise((resolve, reject) => {

      if (this.clientaddress.invalid) {
        this.clientaddress.markAllAsTouched();
        reject("Form validation failed");
        return;
      }

      const raw = this.clientaddress.getRawValue();

      const payload = {

        Action: "Edit",
        UserId: this.userdetail.user_Id,
        ClientAddressId: this.rowData.clientAddressId,

        CompanyId: this.rowData.companyId,
        CostCenterMappingId: this.rowData.costCenterMappingId,

        BillingClientName: raw.billingClientName,
        BillingAddress: raw.billingAddress,

        IsShippingAddressSameAsBilling: raw.shippingsameasbilling,

        ShippingClientName: raw.shippingClientName,
        ShippingAddress: raw.shippingAddress,

        EffectiveDate: raw.effectiveDate || "",
        GstApplicable: raw.gstApplicable || false,

        SAC_Code: raw.subCustomerCode,
        GstNumber: raw.gstNumber,

        CreatedBy: this.userdetail.user_Id
      };
      this.service.clientaddressaddsave(payload).subscribe({
        next: (res: string) => {
          const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');
          if (cleanMessage.includes('Success')) {
            alert('Client Address updated Successfully');
            resolve();
            this.onsearch();
          } else {
            alert(cleanMessage)
            reject('API returned failure');
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          reject(err);
        }
      });
    });
  }
  ValidatedSubmit(): Promise<void> {

    return new Promise((resolve, reject) => {

      if (this.clientaddress.invalid) {
        this.clientaddress.markAllAsTouched();
        reject("Form validation failed");
        return;
      }

      const raw = this.clientaddress.getRawValue();

      const payload = {
        Action: "Add",
        UserId: this.userdetail.user_Id,
        ClientAddressId: null,

        CompanyId: raw.company?.companyId || 0,
        // CostCenterMappingId: this.mapnameUI.mapNameId || 0,

        BillingClientName: raw.billingClientName,
        BillingAddress: raw.billingAddress,

        IsShippingAddressSameAsBilling: raw.IsShippingAddressSameAsBilling,

        ShippingClientName: this.sameAsBilling
          ? this.clientaddress.get('billingClientName')?.value
          : raw.shippingClientName,

        ShippingAddress: this.sameAsBilling
          ? this.clientaddress.get('billingAddress')?.value
          : raw.shippingAddress,

        EffectiveDate: raw.effectiveDate || "",
        GstApplicable: raw.gstApplicable || false,

        SAC_Code: raw.subCustomerCode,
        GstNumber: raw.gstNumber,

        CreatedBy: this.userdetail.user_Id
      };

      this.service.clientaddressaddsave(payload).subscribe({
        next: (res: string) => {
          const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');
          if (cleanMessage.includes('Success')) {
            alert('Client Address Created Successfully');
            resolve();
            this.closeClientPopup();
          } else {
            alert(cleanMessage);
            reject('API returned failure');
            this.closeClientPopup();
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          reject(err);
        }
      });
    });
  }
}

