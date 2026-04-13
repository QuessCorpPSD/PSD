
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Payperiodclass } from '../../../Models/Common';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IdletimeoutService } from '../../../Service/idletimeout.service';
import { DesignationService } from '../../../Service/company/designation.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { VendorServiceChargeService } from '../../../Service/CUSTOMER/vendor-service.service';
import { MapnameComponent } from '../../../common/Mapname/mapname/mapname.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-vendor-service-charge-add',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    AlertpopupComponent,
    MapnameComponent,
    CompanyallComponent,

  ],
 templateUrl: './vendor-service-charge-add.component.html',
  styleUrl: './vendor-service-charge-add.component.css',
  providers: [DatePipe]
})
export class VendorServiceChargeAddComponent {

VendorServiceChargeAddForm!: FormGroup;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  showErrors = false;
  companyId: any;
  mapNameList: any[] = [];
    CompanyId: any[] = [];
    selectedCC: number = 0;
   mapnameUI: any;
  selectedMN: string = '';
  BillingTypeList: any[] = [];
 TypeList: any[] = [];
 minDate: string = '';
  constructor(private dialogRef: MatDialogRef<VendorServiceChargeAddComponent>, private designation: DesignationService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private idleTimeOutService: IdletimeoutService,   private snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: any,  private vendorservice: VendorServiceChargeService,  private datePipe: DatePipe) { }


  ngOnInit(): void {
    this.loadVendorServiceTypes();
    this.loadBillingTypes();
     const now = new Date();

  // format to yyyy-MM-ddTHH:mm
  this.minDate = now.toISOString().slice(0,16);
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
     this.companyId = this.data.companyId;
  this.VendorServiceChargeAddForm = new FormGroup({
  CompanyId: new FormControl('', Validators.required),
  MapNameId: new FormControl('', Validators.required),
  Type: new FormControl('', Validators.required),
  BillingType: new FormControl(''),

  FromValue: new FormControl(''),
  ToValue: new FormControl(''),
  Amount: new FormControl('', Validators.required),
  EffectiveDate: new FormControl('', Validators.required),
    VendorServiceChargeId: new FormControl({ value: '', disabled: true })
});
    this.VendorServiceChargeAddForm.get('VendorServiceChargeId')?.disable();
    this.VendorServiceChargeAddForm.get('Type')?.valueChanges.subscribe(value => {
  this.handleTypeChange(value);
});
  }
handleTypeChange(value: any) {

  const billing = this.VendorServiceChargeAddForm.get('BillingType');
  const from = this.VendorServiceChargeAddForm.get('FromValue');
  const to = this.VendorServiceChargeAddForm.get('ToValue');

  if (value == 1 || value == 2) { // Percentage / Fixed

    billing?.disable();
    from?.disable();
    to?.disable();

    billing?.clearValidators();
    from?.clearValidators();
    to?.clearValidators();

    billing?.setValue(null);
    from?.setValue(null);
    to?.setValue(null);

  } else {

    billing?.enable();
    from?.enable();
    to?.enable();

    billing?.clearValidators();
    from?.clearValidators();
    to?.clearValidators();
  }

  billing?.updateValueAndValidity();
  from?.updateValueAndValidity();
  to?.updateValueAndValidity();
}
  showValidatePopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }


  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  

  onClose() {
    this.dialogRef.close();
  }

  handleCompany(company) {
    this.CompanyId = company;
    this.selectedCC = Number(company.companyId) || 0;
    this.VendorServiceChargeAddForm.patchValue({
         CompanyId: company.companyId || '',
      CompanyName: company.companyName
    });
    console.log("company", company)

}

  handleMapNameEvent(mapname: any) {
    this.mapnameUI = mapname;
    this.selectedMN = mapname.mapName;

    this.VendorServiceChargeAddForm.patchValue({
      MapName: mapname.mapName || '',
        MapNameId: mapname.mapNameId || ''
      // CostCenterMapping: mapname['costCenterMappingId'] || 1
    });

    this.VendorServiceChargeAddForm.get('MapName')?.markAsTouched();
  }
   loadBillingTypes(): void {
    this.vendorservice.GetAllBillingTypes().subscribe({
      next: (res: any) => {
        this.BillingTypeList = Array.isArray(res.Data) ? res.Data : [];
      },
      error: err => {
        console.error('BILLING TYPES API ERROR:', err);
        this.BillingTypeList = [];
      }
    });

  }
loadVendorServiceTypes(): void {
    this.vendorservice.GetAllVendorServiceType().subscribe({
    
      next: (res: any) => {
          console.log(res);
        this.TypeList = Array.isArray(res.Data) ? res.Data : [];
      },
      error: err => {
        console.error('VENDOR SERVICE TYPES API ERROR:', err);
        this.TypeList = [];
      }
    });

  }
  allowDecimal(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;

  // Allow: backspace, delete
  if (charCode === 8 || charCode === 46) return true;

  const inputChar = String.fromCharCode(charCode);

  // Allow numbers and dot
  if (!/^[0-9.]$/.test(inputChar)) {
    event.preventDefault();
    return false;
  }

  // Prevent multiple dots
  const input = event.target as HTMLInputElement;
  if (input.value.includes('.') && inputChar === '.') {
    event.preventDefault();
    return false;
  }

  return true;
}


  
onSave() {

  if (this.VendorServiceChargeAddForm.invalid) {
    this.VendorServiceChargeAddForm.markAllAsTouched();
    return;
  }

  const form = this.VendorServiceChargeAddForm.value;

  if (form.FromValue && form.ToValue && Number(form.FromValue) > Number(form.ToValue)) {
    alert('From Value should not be greater than To Value');
    return;
  }

  const payload = {
    Created_By: this.userdetail?.user_Id,
    Mode: 'Add',
    CompanyId: Number(this.selectedCC),

     VendorServiceChargemaster: [
      {
        Billing_Type_Id:form.BillingType ? Number(form.BillingType) : null,
        Cost_Center_Mapping_Id: form.MapNameId ? Number(form.MapNameId) : null,
        Service_Charge_Type_Id: form.Type ? Number(form.Type) : null,

        MaxAmount: form.Amount ? Number(form.Amount) : 0,

        FromValue: form.FromValue ? Number(form.FromValue) : null,
        ToValue: form.ToValue ? Number(form.ToValue) : null,
     Effective_Date: new Date(form.EffectiveDate).toISOString().split('T')[0]
      }
    ]
  };

  //console.log('Final Payload:', payload);
  //console.log('Form Valid:', this.VendorServiceChargeAddForm.valid);
  //console.log(this.VendorServiceChargeAddForm.value);
  this.vendorservice.saveVendorServiceCharge(payload).subscribe({
    next: (res: any) => {
     // console.log('Success:', res);
      alert('Saved successfully');
        this.dialogRef.close(true);
    },
    error: (err) => {
      console.error('Error:', err);

      if (err?.error) {
        console.log('Backend Error:', err.error);
      }

      alert('Failed to save. Check console for details.');
    }
  });
}

}
