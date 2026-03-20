import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { ClientaddressService } from '../../../Service/customersserv/clientaddress.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { MatCardModule } from "@angular/material/card";
import { IClientaddress } from '../../../Repository/customer/IClientaddress';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MapnameComponent } from "../../../common/Mapname/mapname/mapname.component";
import { StatenameComponent } from '../../../common/statename/statename.component';
import { StateComponent } from '../../../common/state/state.component';
import { CitynameComponent } from '../../../common/cityname/cityname.component';
import { CitybystateComponent } from '../../../common/citybystate/citybystate.component';
export const Pay_TOKEN = new InjectionToken<IClientaddress>('Pay_TOKEN');

@Component({
  selector: 'vendorclientaddress',
  imports: [MatPaginatorModule, MatTableModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCardModule, CompanyallComponent, MapnameComponent, StateComponent, CitybystateComponent],
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
  clientaddressEdit!: FormGroup;
  selectedCC: any;
  companyUI: any;
  mapnameUI: any;
  stateNameUI: any;
  stateNameUI1: any;
  stateNameUI2: any;
  cityNameUI1: any;
  cityNameUI2: any;
  selectedMN: string = '';
  selectedState?: number;
  selectedState1?: number;
  selectedState2?: number;
  showErrors = false;
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
    'VendorClientAddressId',
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
    console.log('RowData', this.rowData);


    this.clientaddress.patchValue({
      companyId: row.companyId,
      company: row.company_Code,
      Costcentermapping: row.map_Name,
      CostcentermappingID: row.costCenterMappingId,
      state: row.state_Name,
      stateId: row.stateId,
      subCustomerCode: row.saC_Code,
      billingClientName: row.billingClientName,
      billingAddress: row.billingAddress,
      billingState: {
        state_Id: row.billingStateId,
        state_Name: row.billingStateName
      },
      billingStateId: row.billingStateId,
      billingLocation: {
        city_Id: row.billingLocationId,
        city_Name: row.city_Name
      },
      billingLocationId: row.billingLocationId,
      billingPinCode: row.billingPinCode,
      shippingsameasbilling: row.isShippingAddressSameAsBilling,
      shippingClientName: row.shippingClientName,
      shippingAddress: row.shippingAddress,
      shippingState: {
        state_Id: row.shippingStateId,
        state_Name: row.shippingStateName
      },
      shippingStateId: row.shippingStateId,
      shippingLocation: {
        city_Id: row.shippingLocationId,
        city_Name: row.shippingCity_Name
      },
      shippingLocationId: row.shippingLocationId,
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

    console.log('Clientaddress', this.clientaddress)
  }

  closeClientPopup() {
    this.showClientPopup = false;
  }

  handleCompanyEvent(company: any) {
    //console.log('company', company);
    this.selectedCC = company.companyId;
    this.companyUI = company;
    this.clientaddress.patchValue({
      company: company
    });
  }

  handleMapNameEvent(mapname: any) {
    console.log('Map', mapname);
    this.mapnameUI = mapname;
    this.selectedMN = mapname.mapName;
    this.clientaddress.patchValue({
      Costcentermapping: mapname
    });
  }

  handleStateNameEvent(statename: any) {
    console.log(statename);
    this.stateNameUI = statename;
    this.selectedState = statename.state_Id;
    this.clientaddress.patchValue({
      state: statename
    });

  }

  handleStateNameEvent1(statename1: any) {
    this.stateNameUI1 = statename1;
    this.selectedState1 = statename1.state_Id;
    this.clientaddress.patchValue({
      billingState: statename1
    });
  }

  get billingStateControl() {
    return this.clientaddress.get('billingState');
  }
  handleStateNameEvent2(statename2: any) {
    this.stateNameUI2 = statename2;
    this.selectedState2 = statename2.state_Id;
    this.clientaddress.patchValue({
      shippingState: statename2
    });
  }
  cityNameUI3: any;
  citybystateEvent1(cityname: any) {
    console.log('City', cityname);
    this.cityNameUI1 = cityname;
    this.cityNameUI3 = cityname.city_Id;
    this.clientaddress.patchValue({
      billingLocation: cityname
    });
    console.log('BillingLocation', this.clientaddress.value.billingLocation);
    console.log('CityNameUI3', this.cityNameUI3);
  }

  citybystateEvent2(cityname: any) {
    this.cityNameUI2 = cityname;
    this.clientaddress.patchValue({
      shippingLocation: cityname
    });
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      this.onsearch();
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

    // this.clientaddressEdit = this.fb.group({

    //   companyId: [''],
    //   companyCode: [''],
    //   Costcentermapping: [''],
    //   CostcentermappingID: [''],
    //   subCustomerCode: [''],
    //   state: [''],
    //   billingClientName: [''],
    //   billingAddress: [''],
    //   billingState: [''],
    //   billingStateId: [''],
    //   billingLocation: [''],
    //   billingLocationId: [''],
    //   billingPinCode: [''],
    //   sapBillTo: [''],
    //   shippingClientName: [''],
    //   shippingAddress: [''],
    //   shippingState: [''],
    //   shippingStateId: [''],
    //   shippingLocation: [''],
    //   shippingLocationId: [''],
    //   shippingPinCode: [''],
    //   sapShipTo: [''],
    //   shippingsameasbilling: [false],
    //   effectiveDate: [''],
    //   sezApplicable: [false],
    //   sezExpiryDate: [''],
    //   lutNumber: [''],
    //   lutDate: [''],
    //   lutExpiryDate: [''],
    //   vendorcode: ['']

    // });
  }

  sameAsBillingChange(event: any) {

    this.sameAsBilling = event.target.checked;

    console.log('BillingLocation', this.clientaddress.value.billingLocation);

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

    this.service.PostVendorClientAddressDelete(row.vendorClientAddressId, userId)
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

    this.service.VendorSearch(userId).subscribe({
      next: (res) => {
        this.Clientaddress = res?.Data;
        console.log('search', this.Clientaddress);

        if (!this.Clientaddress) {
          alert(res.Data.message)
          this.isLoading = false;
        }
        if (this.Clientaddress && this.Clientaddress.length > 0) {
          this.dataSource = new MatTableDataSource(this.Clientaddress);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Action',
            'VendorClientAddressId',
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

          this.isLoading = false;

        } else {
          this.isLoading = false;
          alert('No Records Found');
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading Companypaycode release data', err);
      },
    });
  }


  exportToExcel(): void {
    this.isLoading = true;

    const Companyid = this.userdetail.user_Id;

    this.service.VendorExporttoExcel(Companyid).subscribe({
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
        Company_Code: "",
        StateName: "",
        Map_Name: "",
        Billing_Client_Name: "",
        Billing_Address: "",
        Billing_State: "",
        Is_Shipping_Address_Same_As_Billing: "",
        Shipping_Client_Name: "",
        Shipping_Address: "",
        Shipping_State: "",
        Effective_Date: "",
        SEZ_Applicable: "",
        SEZ_ExpiryDate: "",
        SAC_Code: "",
        GST_Number: "",
        LUT_Number: "",
        LUT_Date: "",
        LUT_ExpiryDate: "",
        Vendor_Code: "",
        Billing_City_Name: "",
        Billing_Pin_Code: "",
        Shipping_City_Name: "",
        Shipping_Pin_Code: "",
        GST_Excemption: "",
        SapBillTo: "",
        SapShipTo: "",
        AddressCode: "",
        ClientGstNumber: "",
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

    this.service.PostVendorClientAddressUpload(formData).subscribe({
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
        VendorClientAddressId: this.rowData.vendorClientAddressId,

        CompanyId: this.rowData.companyId,
        CostCenterMappingId: this.rowData.costCenterMappingId,
        StateId: this.rowData.stateId,
        Company_Code: this.rowData.company_Code,
        State_Name: this.rowData.state_Name,
        Map_Name: this.rowData.map_Name,
        BillingClientName: raw.billingClientName || "",
        BillingAddress: raw.billingAddress || "",
        BillingStateId: raw.billingState?.state_Id || 0,
        BillingStateName: raw.billingState?.state_Name || "",
        BillingLocationId: raw.billingLocation?.city_Id || this.rowData.billingLocationId || 0,
        City_Name: raw.billingLocation?.city_Name || "",
        BillingPinCode: raw.billingPinCode || "",
        IsShippingAddressSameAsBilling: raw.shippingsameasbilling,
        ShippingClientName: raw.shippingClientName || "",
        ShippingAddress: raw.shippingAddress || "",
        ShippingStateId: raw.shippingState?.state_Id || 0,
        ShippingStateName: raw.shippingState?.state_Name || "",
        ShippingLocationId: raw.shippingLocation?.city_Id || this.rowData.shippingLocationId || 0,
        ShippingCity_Name: raw.shippingLocation?.city_Name || "",
        ShippingPinCode: raw.shippingPinCode || "",
        EffectiveDate: raw.effectiveDate || "",
        SEZ_Applicable: raw.sezApplicable || false,
        SEZ_ExpiryDate: raw.sezExpiryDate || "",
        LUT_Number: raw.lutNumber || "",
        LUT_Date: raw.lutDate || "",
        LUT_ExpiryDate: raw.lutExpiryDate || "",
        VendorCode: raw.vendorcode || "",
        SAC_Code: raw.subCustomerCode || "",
        GstNumber: raw.gstNumber || "",
        SapBillTo: raw.sapBillTo || "",
        SapShipTo: raw.sapShipTo || "",
        AddressCode: "",
        ClientGstNumber: "",
        CreatedBy: this.userdetail.user_Id
      };
      console.log('Edit Payload', payload);
      console.log('Client Address Form Value', JSON.stringify(payload));

      this.service.Vendorclientaddressaddsave(payload).subscribe({
        next: (res: string) => {
          const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');

          if (cleanMessage.includes('Success')) {
            alert('Client Address updated Successfully');
            this.closeClientPopup();
            this.onsearch();
            resolve();
          } else {
            alert(cleanMessage);
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
  ValidatedSubmit() {
    console.log('Client Address', this.clientaddress);
    this.showErrors = true;

    if (this.clientaddress.invalid) {
      return;
    }
    //this.isLoading = true;

    const raw = this.clientaddress.getRawValue();
    console.log(raw);
    const payload = {
      Action: "Add",
      UserId: this.userdetail.user_Id,
      VendorClientAddressId: 0,
      CompanyId: raw.company?.companyId || 0,
      StateId: raw.state?.state_Id || 0,
      CostCenterMappingId: raw.Costcentermapping?.mapNameId || 0,
      BillingClientName: raw.billingClientName || "",
      BillingAddress: raw.billingAddress || "",
      BillingStateId: raw.billingState.state_Id || 0,
      IsShippingAddressSameAsBilling: raw.shippingsameasbilling,
      ShippingClientName: this.sameAsBilling
        ? this.clientaddress.get('billingClientName')?.value
        : raw.shippingClientName || "",
      ShippingAddress: this.sameAsBilling
        ? this.clientaddress.get('billingAddress')?.value
        : raw.shippingAddress || "",
      ShippingStateId: raw.shippingState.state_Id || 0,
      EffectiveDate: raw.effectiveDate || "",
      SEZ_Applicable: raw.sezApplicable || false,
      // SEZ_Document: raw.
      SEZ_ExpiryDate: raw.sezExpiryDate || "",
      LUT_Number: raw.lutNumber || "",
      LUT_Date: raw.lutDate || "",
      LUT_ExpiryDate: raw.lutExpiryDate || "",
      VendorCode: raw.vendorcode || "",
      SAC_Code: raw.subCustomerCode || "",
      GstNumber: raw.gstNumber || "",
      Company_Code: raw.company?.companyCode || "",
      State_Name: raw.state?.state_Name || "",
      Map_Name: raw.Costcentermapping?.mapName || "",
      BillingStateName: raw.billingState?.state_Name || "",
      ShippingStateName: raw.shippingState?.state_Name || "",
      BillingLocationId: raw.billingLocation?.city_Id || 0,
      BillingPinCode: raw.billingPinCode || "",
      ShippingLocationId: raw.shippingLocation?.city_Id || 0,
      ShippingPinCode: raw.shippingPinCode || "",
      City_Name: raw.billingLocation?.city_Name || "",
      ShippingCity_Name: raw.shippingLocation?.city_Name || "",
      SapBillTo: raw.sapBillTo || "",
      SapShipTo: raw.sapShipTo || "",
      AddressCode: "",
      ClientGstNumber: "",
      CreatedBy: this.userdetail.user_Id
    };

    this.service.Vendorclientaddressaddsave(payload).subscribe({
      next: (res: string) => {
        const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');
        if (cleanMessage.includes('Success')) {
          alert('Client Address Created Successfully');
          this.closeClientPopup();
          this.onsearch();
        } else {
          alert(cleanMessage);
          this.closeClientPopup();
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }
}

