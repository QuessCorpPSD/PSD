import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IGstRepository } from '../../../Repository/GlobalMasters/IGstRepository';
import { GSTService } from '../../../Service/GlobalMasters/gst.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

export const Pay_TOKEN = new InjectionToken<IGstRepository>('Pay_TOKEN');


@Component({
  selector: 'app-gst-create',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, AlertpopupComponent],
  templateUrl: './gst-create.component.html',
  styleUrl: './gst-create.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GSTService,
    }
  ]
})
export class GSTCreateComponent {
  entity: any;
  state: any;
  gsttypes: any;
  location: any;
  constructor(private dialogRef: MatDialogRef<GSTCreateComponent>,
    @Inject(Pay_TOKEN) private gstService: IGstRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }

  userdetail: any;

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.LoadEntity();
    this.Loadstate();
  }
  // Basic details
  GSTMasterId = 0;
  EffectiveDate: string = '';
  GSTNumber: string = '';
  GSTType: string = '';
  Entity: number | null = null;
  StateName: any;
  CompanyName: string = '';
  CompanyAddress: string = '';
  PinCode: string = '';

  // Additional details
  PANNumber: string = '';
  TANNumber: string = '';
  Location: string = '';

  // GST percentages
  cgstApplicable = true;
  cgstPercentage: number = 0;

  sgstApplicable = false;
  sgstPercentage: number = 0;

  utgstApplicable = false;
  utgstPercentage: number = 0;

  // Cess
  cessPercentage: number = 0;
  cessFromDate: string = '';
  cessToDate: string = '';

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';

  toggleField(type: string) {
    switch (type) {
      case 'cgst':
        if (!this.cgstApplicable) this.cgstPercentage = 0;
        break;
      case 'sgst':
        if (!this.sgstApplicable) this.sgstPercentage = 0;
        break;
      case 'utgst':
        if (!this.utgstApplicable) this.utgstPercentage = 0;
        break;
    }
  }
  toggleGST(type: 'sgst' | 'utgst') {
    if (type === 'sgst' && this.sgstApplicable) {
      this.utgstApplicable = false;
      this.utgstPercentage = 0;
    }

    if (type === 'utgst' && this.utgstApplicable) {
      this.sgstApplicable = false;
      this.sgstPercentage = 0;
    }
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

  Loadgsttype(StateName) {
    this.gstService.GetGSTTypes(StateName).subscribe({
      next: (res: any) => {
        this.gsttypes = res.Data;
      },
    });
  }

  Loadlocation(StateName) {
    this.gstService.GetAllcityBystate(StateName).subscribe({
      next: (res: any) => {
        this.location = res.Data;
      }
    });
  }
  Loadstate() {
    this.gstService.GetAllState().subscribe({
      next: (res: any) => {
        this.state = res.Data;

        if (this.StateName) {
          this.Loadgsttype(this.StateName);
          this.Loadlocation(this.StateName);
        }
      }
    });
  }


  SaveClick() {
    this.isLoading = true;

    if (!this.EffectiveDate || this.EffectiveDate === '1900-01-01') {
      alert('Please select Effective Date');
      this.isLoading = false;
      return;
    }

    if (this.GSTNumber == '') {
      alert('Please Enter GST Number');
      this.isLoading = false;
      return;
    }

    if (this.CompanyName == '') {
      alert('Please Enter Company Name');
      this.isLoading = false;
      return;
    }

    if (this.CompanyAddress == '') {
      alert('Please Enter Company Address');
      this.isLoading = false;
      return;
    }

    if (this.PinCode == '') {
      alert('Please Enter PinCode');
      this.isLoading = false;
      return;
    }

    if (this.cgstPercentage == 0) {
      alert('Please Enter GST Percentage');
      this.isLoading = false;
      return;
    }
    const today = new Date();
    const payload = {
      Action: "Add",
      UserId: Number(this.userdetail.user_Id),
      GstMasterId: 0,
      EffectiveDate: this.EffectiveDate,

      EntityId: Number(this.Entity),
      StateId: Number(this.StateName),

      GstNumber: this.GSTNumber,
      PanNumber: this.PANNumber,
      TanNumber: this.TANNumber,

      CompanyName: this.CompanyName,
      CompanyAddress: this.CompanyAddress,

      CreatedBy: Number(this.userdetail.user_Id),
      CreatedOn: new Date().toISOString(),

      CGST_Applicable: this.cgstApplicable,
      CGST_Percentage: Number(this.cgstPercentage || 0),

      SGST_Applicable: this.sgstApplicable,
      SGST_Percentage: Number(this.sgstPercentage || 0),

      UTGST_Applicable: this.utgstApplicable,
      UTGST_Percentage: Number(this.utgstPercentage || 0),

      IGST_Applicable: false,
      IGST_Percentage: 0,

      GstTypeId: Number(this.GSTType),

      Cess_Percentage: Number(this.cessPercentage || 0),
      CessEffectiveFromDate: this.cessFromDate || null,
      CessEffectiveToDate: this.cessToDate || null,

      Pincode: this.PinCode,
      LocationId: Number(this.Location) // Use selected LocationId
    };

    this.gstService.Create(payload).subscribe({
      next: (res: any) => {

        const msg = res?.Data?.response;

        if (msg.includes('Success')) {
          this.showPopup = true;
          alert(res?.Data?.response);
          this.dialogRef.close('add')
          this.isLoading = false;
        } else {
          this.isLoading = false;
          alert(res?.Data?.response);
          this.dialogRef.close('add')
        }

        // <-- show popup for both cases
        //this.dialogRef?.close();
        this.isLoading = false;
      },

      error: (err) => {
        alert("Error while processing");
        this.isLoading = false;
      }
    });

  }


}
