import { Component, Inject, InjectionToken } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IGstRepository } from '../../../Repository/GlobalMasters/IGstRepository';
import { GSTService } from '../../../Service/GlobalMasters/gst.service';
export const Pay_TOKEN = new InjectionToken<IGstRepository>('Pay_TOKEN');

@Component({
  selector: 'app-gst-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, AlertpopupComponent],
  templateUrl: './gst-edit.component.html',
  styleUrl: './gst-edit.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GSTService,
    }
  ]
})
export class GSTEditComponent {
  Gsteditform!: FormGroup;
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';
  userdetail: any;
  entity: any;
  gsttypes: any;
  state: any;
  location: any;


  constructor(
    private dialogRef: MatDialogRef<GSTEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(Pay_TOKEN) private gstService: IGstRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
  formatDateTime(dateStr: string): string {
    if (!dateStr) return '';

    const datePart = dateStr.split(' ')[0];
    const [day, month, year] = datePart.split('-');

    return `${year}-${month}-${day}`;
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.Gsteditform = this.fb.group({

      Gstmasterid: [this.editData.GstMasterId],

      EffectiveDate: [this.formatDateTime(this.editData.EffectiveDate), Validators.required],

      GSTNumber: [this.editData.GstNumber, Validators.required],

      GSTType: [this.editData.GstTypeId, Validators.required],

      Entity: [this.editData.EntityId, Validators.required],

      StateName: [this.editData.StateId, Validators.required],

      CompanyName: [this.editData.CompanyName, Validators.required],

      CompanyAddress: [this.editData.CompanyAddress, Validators.required],

      PinCode: [this.editData.PinCode, Validators.required],

      // ===== TAX IDs =====
      PANNumber: [this.editData.PanNumber, Validators.required],

      TANNumber: [this.editData.TanNumber, Validators.required],

      Location: [this.editData.LocationId, Validators.required],

      cgstApplicable: [this.editData.CGST_Applicable, { value: true, disabled: true }],

      sgstApplicable: [this.editData.SGST_Applicable],

      utgstApplicable: [this.editData.UTGST_Applicable],

      cgstPercentage: [this.editData.CGST_Percentage, Validators.required],

      sgstPercentage: [this.editData.SGST_Percentage, { disabled: true }],

      utgstPercentage: [this.editData.UTGST_Percentage, { disabled: true }],

      // ===== CESS =====
      cessPercentage: [this.editData.Cess_Percentage],
      cessFromDate: [this.formatDateTime(this.editData.CessEffectiveFromDate)],
      cessToDate: [this.formatDateTime(this.editData.CessEffectiveToDate)]
    });


    this.LoadEntity();


    this.Loadstate();
    this.handleGSTToggle();


  }

  handleGSTToggle() {

    const sgstApplicableCtrl = this.Gsteditform.get('sgstApplicable');
    const utgstApplicableCtrl = this.Gsteditform.get('utgstApplicable');

    const sgstPercentageCtrl = this.Gsteditform.get('sgstPercentage');
    const utgstPercentageCtrl = this.Gsteditform.get('utgstPercentage');

    sgstApplicableCtrl?.valueChanges.subscribe(checked => {
      if (checked) {
        utgstApplicableCtrl?.setValue(false, { emitEvent: false });

        sgstPercentageCtrl?.enable({ emitEvent: false });
        utgstPercentageCtrl?.disable({ emitEvent: false });
        utgstPercentageCtrl?.setValue(0, { emitEvent: false });
      } else {
        sgstPercentageCtrl?.disable({ emitEvent: false });
        sgstPercentageCtrl?.setValue(0, { emitEvent: false });
      }
    });

    utgstApplicableCtrl?.valueChanges.subscribe(checked => {
      if (checked) {
        sgstApplicableCtrl?.setValue(false, { emitEvent: false });

        utgstPercentageCtrl?.enable({ emitEvent: false });
        sgstPercentageCtrl?.disable({ emitEvent: false });
        sgstPercentageCtrl?.setValue(0, { emitEvent: false });
      } else {
        utgstPercentageCtrl?.disable({ emitEvent: false });
        utgstPercentageCtrl?.setValue(0, { emitEvent: false });
      }
    });
  }



  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  LoadEntity() {
    this.gstService.GetEntity().subscribe({
      next: (res: any) => {


        if (res?.Data?.data?.Table0) {
          this.entity = res.Data.data.Table0;
        }
      },
      error: err => console.error(" Pay Category API Error:", err)
    });
  }

  Loadgsttype(stateId) {
    this.gstService.GetGSTTypes(stateId).subscribe({
      next: (res: any) => {
        this.gsttypes = res.Data;
      },
    });
  }
  Loadlocation(stateId) {
    this.gstService.GetAllcityBystate(stateId).subscribe({
      next: (res: any) => {
        this.location = res.Data;
      }
    });
  }
  Loadstate() {
    this.gstService.GetAllState().subscribe({
      next: (res: any) => {
        this.state = res.Data;
      },
    });
    const stateId = this.Gsteditform.get('StateName')?.value;
    this.Loadgsttype(stateId);
    this.Loadlocation(stateId)
  }
  onClose(): void {
    this.dialogRef.close();
  }

  SaveClick() {
    if (this.Gsteditform.invalid) {
      this.Gsteditform.markAllAsTouched();
      alert("Please fill all mandatory fields with valid data.");
      return;
    }

    this.isLoading = true;

    const form = this.Gsteditform.value;

    const payload = {
      Action: "Edit",
      UserId: Number(this.userdetail.user_Id),
      GstMasterId: Number(form.Gstmasterid),
      EffectiveDate: form.EffectiveDate,

      EntityId: Number(form.Entity),
      StateId: Number(form.StateName),

      GstNumber: form.GSTNumber,
      PanNumber: form.PANNumber,
      TanNumber: form.TANNumber,

      CompanyName: form.CompanyName,
      CompanyAddress: form.CompanyAddress,

      CreatedBy: Number(this.userdetail.user_Id),
      CreatedOn: new Date().toISOString(),

      CGST_Applicable: form.cgstApplicable,
      CGST_Percentage: Number(form.cgstPercentage),

      SGST_Applicable: form.sgstApplicable,
      SGST_Percentage: Number(form.sgstPercentage),

      UTGST_Applicable: form.utgstApplicable,
      UTGST_Percentage: Number(form.utgstPercentage),

      // If your form doesn't have IGST fields, send defaults
      IGST_Applicable: false,
      IGST_Percentage: 0,

      GstTypeId: Number(form.GSTType),

      Cess_Percentage: Number(form.cessPercentage),
      CessEffectiveFromDate: form.cessFromDate,
      CessEffectiveToDate: form.cessToDate,

      Pincode: form.PinCode,
      LocationId: Number(form.Location) || 0
    };

    this.gstService.Edit(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res?.Data?.response;
        if (msg.toLowerCase().includes('success')) {
          alert(res.Data.response);
          this.dialogRef.close('refresh');
        } else {
          alert(res?.Data?.response || "Unexpected response");
          this.dialogRef.close('refresh');
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error while processing");
      }
    });
  }



}
