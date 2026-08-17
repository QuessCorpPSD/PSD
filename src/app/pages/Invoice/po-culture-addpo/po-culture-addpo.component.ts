import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { Mapnameclass } from '../../../Models/Common';
import { MapnameComponent } from '../../../common/Mapname/mapname/mapname.component';
import { MatCardModule } from '@angular/material/card';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { POCultureService } from '../../../Service/po-culture.service';
import { MatFormField } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Console } from 'node:console';

interface ChildDetail {
  POCulture_id: number;
  Company_Id: number;
  Paycode_Id: number;
  Paycode_Code: string;
  HasAccess: boolean;
  
}


@Component({
  selector: 'app-po-culture-addpo',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatIconModule,
    MatCheckboxModule, MatTableModule, MatPaginatorModule, MatSortModule,
    CompanyallComponent, MapnameComponent, MatCardModule, MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
],
  templateUrl: './po-culture-addpo.component.html',
  styleUrls: ['./po-culture-addpo.component.css']
})
export class POCultureAddpoComponent implements AfterViewInit {
  POCultureForm!: FormGroup;
  showTypeOfInvoice = false;
  companyUI: any;
  selectedCC: number = 0;
  selectedMN: string = '';
  States: any[] = [];
  ServiceChargeOptions: any[] = [];
  InvoiceTypeList: any[] = [];
  PoNumberList: any[] = [];
  isLoading = false;
  isLoadingPoNumbers = false;
  showInvoiceTypeError = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  isPaycodesLoaded = false;
  datatable: Array<{ [key: string]: any }> = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userdetail: any;
  selectedFile: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  mapnameUI: any;
  stateId?: number;
  typeInvoiceList: any;
;
  searchCtrl = new FormControl('');

purchaseOrderList: any[] = [];

filteredPOs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<POCultureAddpoComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private poService: POCultureService, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService, private router: Router
  ) { }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.initializeForm();
    this.POCultureForm?.get('InvoiceCategory')?.valueChanges.subscribe((categoryId: number) => {
      if (categoryId == 1060) {
        // State Wise
        this.POCultureForm.get('State')?.disable();
        this.POCultureForm.get('State')?.setValue('');
      } else if (categoryId == 1059) {
        // Single
        this.POCultureForm.get('State')?.enable();
      }

      
/*this.searchCtrl.valueChanges.subscribe(value => {

  const search = (value || '').toLowerCase();

  this.filteredPOs = this.PoNumberList.filter(x =>
    x.purchase_Request_No.toString().toLowerCase().includes(search)
  );

});*/
    });

    


    this.POCultureForm?.get('InvoiceType')?.valueChanges.subscribe((invoiceType: any) => {
      // run only after user selects
      if (!invoiceType) return;

      if (invoiceType.invoiceType_Id == 2) {
        // SPLIT → enable checkboxes
        this.enablePaycodeCheckboxes();
      } else if (invoiceType.invoiceType_Id == 1) {
        // REGULAR → disable checkboxes
        this.disablePaycodeCheckboxes();
      }
    });
  }

  toggleSelectAll(): void {

  if (this.isAllSelected()) {

    this.POCultureForm.get('PurchaseOrderIds')?.setValue([]);

  } else {

    const ids = this.filteredPOs.map(x => x.Purchase_Order_Id);

    this.POCultureForm.get('PurchaseOrderIds')?.setValue(ids);

  }
}
isAllSelected(): boolean {

  const selected = this.POCultureForm.get('PurchaseOrderIds')?.value || [];

  return selected.length === this.filteredPOs.length;
}

loadPurchaseOrders(): void {

  this.isLoadingPoNumbers = true;

  this.poService.GetPoNumbers(
    this.companyUI.companyId,
    this.userdetail.user_Id
  ).subscribe({
    next: (res: any) => {

      this.PoNumberList = Array.isArray(res.Data) ? res.Data : [];
console.log('PO Numbers API Response:', this.PoNumberList); // Log the response for debugging
      // Used for search
      this.filteredPOs = [...this.PoNumberList];

      this.isLoadingPoNumbers = false;
    },
    error: (err) => {

      console.error('PO Numbers API ERROR:', err);

      this.PoNumberList = [];
      this.filteredPOs = [];

      this.isLoadingPoNumbers = false;
    }
  });

}
invoiceCreationModes = [
  {
    value: true,
    text: "Map-Name wise Invoice - Generate single invoice for the selected PO's."
  },
  {
    value: false,
    text: "PO wise Invoice - Generate separate invoice for each PO."
  }
];
  enablePaycodeCheckboxes() {
    this.typeInvoiceList.forEach(t => {
      this.POCultureForm.get(t.Paycode_Id.toString())?.enable();
    });
  }

  disablePaycodeCheckboxes() {
    this.typeInvoiceList.forEach(t => {
      const control = this.POCultureForm.get(t.Paycode_Id.toString());
      control?.disable();
      control?.setValue(false); // clear selection
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  handleMapNameEvent(mapname: any) {
    this.mapnameUI = mapname;
    this.selectedMN = mapname.mapName;

    this.POCultureForm.patchValue({
      MapName: mapname.mapName || '',
      CostCenterMapping: mapname['costCenterMappingId'] || 1
    });

    this.POCultureForm.get('MapName')?.markAsTouched();
    this.POCultureForm.get('CostCenterMapping')?.markAsTouched();
     // this.loadPurchaseOrders();
  }

  initializeForm(): void {
    this.POCultureForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      MapName: ['', Validators.required],
      isMapnameWiseInvoice: ['false', Validators.required]
    });


    this.typeInvoiceList?.forEach(item => {
      this.POCultureForm.addControl(item.Paycode_Id.toString(), this.fb.control(false));
    });

    
  }

  getSelectedInvoiceTypes() {
    return this.typeInvoiceList.filter(t =>
      this.POCultureForm.get(t.Paycode_Id.toString())?.value === true
    );
  }

  SaveData() {
  
    if (this.POCultureForm.invalid) {
      this.POCultureForm.markAllAsTouched();
      return;
    }
  this.isLoading = true;
    const parentDetail = {
      poCulture_id: 0,
      Company_Id: this.companyUI.companyId,
      Company_Code: this.companyUI.companyCode,
      Company_Name: this.companyUI.companyName,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: this.mapnameUI.mapName,
    IsMapnameWiseInvoice:
    this.POCultureForm.get('isMapnameWiseInvoice')?.value ?? false,
      Error_Message: ""
    }
   

    const POCultureAdd = {
      createdBy: this.userdetail.user_Id,
      mode: 'Add',
      parentDetail: parentDetail,
    }
    //console.log('POCultureAdd Payload:', POCultureAdd); // Log the payload for debugging
    this.poService.postPOCulture(POCultureAdd).subscribe({
      next: (res) => {
        //console.log('API Response:', res);
        if (res.Data.message == "Po Culture Already Exists") {
          this.isLoading = false;
          alert(res.Data.message);
          return;
        }
        else if (res.Data.data.Table0) {
          this.datatable = res.Data.data.Table0;
          this.downloadExcel(this.datatable, "POCulture_Validations");
          this.router.navigate(['Master/invoicenavigation/app-po-culture']);
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
 
    
  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.selectedCC = Number(company.companyId) || 0;

    this.POCultureForm.patchValue({
      CompanyCode: this.selectedCC
    })
    this.POCultureForm.get('CompanyCode')?.markAsTouched();
  }


  resetForm() {
  this.POCultureForm.reset({
    CompanyCode: null,
    MapName: null,
    isMapnameWiseInvoice: null
  });

  this.companyUI = null;
  this.mapnameUI = null;
  this.selectedCC = 0;
  this.selectedMN = '';

}


  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.POCultureForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getFieldError(fieldName: string): string {
    const control = this.POCultureForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      CompanyCode: 'Company Code',
      ServiceCharge: 'Service Charge',
      MapName: 'Map Name',
      InvoiceType: 'Invoice Type',
      InvoiceCategory: 'Invoice Category',
      CityName: 'City Name',
      Description: 'Description',
      CostCenterMapping: 'Cost Center Mapping',
      StateName: 'State Name',
      InvoiceTypeName: 'Invoice Type Name',
      InvoiceCategoryName: 'Invoice Category Name'
    };
    return fieldNames[fieldName] || fieldName;
  }

  ValidatedSubmit(): Promise<void> {
    this.isLoading = true;

    return new Promise((resolve, reject) => {
      // Mark all fields as touched to trigger validation displays
      this.POCultureForm.markAllAsTouched();

      if (this.POCultureForm.invalid || this.showInvoiceTypeError) {
        this.isLoading = false;
        this.showPopup = true;
        this.popupMessage = 'Please fill all required fields before saving.';
        // validation failure - stop without rejecting to avoid unhandled rejection logs
        return;
      }

      const selectedTypeOfInvoice = this.typeInvoiceList
        .filter(t => this.POCultureForm.get(t.Paycode_Code)?.value);

      if (selectedTypeOfInvoice.length === 0) {
        this.isLoading = false;
        this.showPopup = true;
        this.popupMessage = 'Please select at least one invoice type.';
        // stop without rejecting
        return;
      }

      // Prepare payload
      const currentDate = new Date().toISOString().split('T')[0];

      const paycodeMap: { [key: string]: number } = {
        SALARY: 1000,
        SERCG: 1002,
        ARREAR: 1003,
        BONUS: 1004,
        OTHER: 1005
      };

      const typeOfInvoicePayload = selectedTypeOfInvoice.map(t => ({
        invoiceCulture_id: 0,
        company_Id: this.selectedCC || this.companyUI?.companyId || 1,
        paycode_Id: paycodeMap[t.code] || 1005,
        paycode_Code: t.code,
        hasAccess: true
      }));

      const paycodeCodes = typeOfInvoicePayload.map(t => t.paycode_Code).join(',') || '';

      const payload = {
        InvoiceStructure: {
          invoiceCulture_id: 0,
          client_Id: 0,
          client_Code: this.companyUI?.clientCode || "101",
          company_Name: this.companyUI?.companyName || "QUESS SINGAPORE",
          company_Id: this.selectedCC || this.companyUI?.companyId || 1,
          invoiceType_Id: Number(this.POCultureForm.get('InvoiceType')?.value) || 2,
          cost_Center_Mapping_Id: Number(this.POCultureForm.get('CostCenterMapping')?.value) || 1,
          service_Charge_Master_Id: Number(this.POCultureForm.get('ServiceCharge')?.value) || 1,
          service_Charge_Type_Id: 0,
          service_Charge_Slab_Item_Id: 0,
          service_Charge_Slab_Inner_Item_Id: 0,
          type_Of_Invoice: 0,
          type_Of_Invoice_Name: "Regular",
          service_Charge_Type_Name: "Standard",
          company_Code: this.companyUI?.companyCode || "SG000001",
          map_Name: this.POCultureForm.get('MapName')?.value || "Singapore",
          map_Name_Id: 1,
          paycode_Id: 0,
          invoiceCul_Ref_No: "",
          serial_No: 0,
          gen_iID: 0,
          invoice_Category_Id: Number(this.POCultureForm.get('InvoiceCategory')?.value) || 0,
          state_Id: 4,
          Date: currentDate,
          City_Name: this.POCultureForm.get('CityName')?.value || "Singapore",
          State_Name: this.POCultureForm.get('StateName')?.value || "Singapore",
          InvoiceType: this.POCultureForm.get('InvoiceTypeName')?.value || "Standard",
          Paycode_Code: paycodeCodes,
          Error_Message: '',
          GEN_vDescription: this.POCultureForm.get('Description')?.value || `Invoice for ${this.companyUI?.companyName || 'QUESS SINGAPORE'}`,
          InvoiceType_Id_Name: this.POCultureForm.get('InvoiceTypeName')?.value || "Standard",
          Invoice_Category_Name: this.POCultureForm.get('InvoiceCategoryName')?.value || "Standard"
        },
        TypeOfInvoiceForInvoiceStructure: typeOfInvoicePayload,
        Mode: "Add",
        InvoiceType: "Standard",
        UserId: this.userdetail?.userId?.toString() || 'U12345'
      };

      // Send API Request
      this.poService.postPOCulture(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;

          if (res.StatusCode === 200 || res.success) {
            this.showPopup = true;
            this.popupMessage = 'Invoice saved successfully!';
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 2000);
            resolve();
          } else {
            this.showPopup = true;
            this.popupMessage = res.Message || 'Failed to save invoice.';
            reject(res.Message);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('API Error:', err);

          const errorData = err.error?.Data;
          if (errorData && errorData.errors) {
            const errorMessages = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                const combinedMessages = Array.isArray(messages) ? messages.join(', ') : messages;
                return `${field}: ${combinedMessages}`;
              })
              .join('\n');

            this.showPopup = true;
            this.popupMessage = `Validation Errors:\n${errorMessages}`;
            reject(errorMessages);
          } else {
            this.showPopup = true;
            this.popupMessage = err.error?.Message || 'Failed to save invoice. Please try again.';
            reject(err);
          }
        }
      });
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
