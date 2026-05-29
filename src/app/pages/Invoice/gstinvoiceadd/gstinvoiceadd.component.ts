import { Component, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { format } from 'node:path';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { FinancialYearComponent } from "../../../common/financial-year/financial-year.component";
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { MapnameComponent } from "../../../common/Mapname/mapname/mapname.component";
import { CitynameComponent } from "../../../common/cityname/cityname.component";
import { StatenameComponent } from "../../../common/statename/statename.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { combineLatest } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder } from '@angular/forms';
import { AnyCaaRecord } from 'node:dns';
import { Inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-gstinvoiceadd',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    CompanyallComponent,
    FinancialYearComponent,
    PayPeriodComponent,
    MapnameComponent,
    GroupnameComponent,
    CitynameComponent,
    StatenameComponent,
    MatExpansionModule
  ],
  templateUrl: './gstinvoiceadd.component.html',
  styleUrl: './gstinvoiceadd.component.css'
})
export class GstinvoiceaddComponent {
  selectedCompanyId!: number;
  companyList: any[] = [];
   selectedCompany: any;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  accordionLoaded = false;
  addGstInvoice!: FormGroup;
  InvoiceType: any;
  invoiceType: any;
  CTCDeductionType: any;
  BillingType: any;
  NetDeductionType: any;
  selectedFinancialYear: any;
  selectedPayPeriod: any;
  PayCode: any;
  payperiodId: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedMapId: any;
  selectedsiteId: any;
  selectedCityId: any;
  selectedStateId: any;
  selectedPayPeriodId: any;
  siteId: number = 0;
  selectedSiteName: string = '';
  companyId: number = 0;
  mapNameId: any;
  selectedMap: any;
  cityId:any;
  selectedCity:any;
  selectedcityId:any;
   stateId:any;
  selectedState:any;
  ctcSign: string = '-';
  totalTaxableAmount = 0;
totalGstAmount = 0;
totalNonTaxableAmount = 0;
showInvoiceDetails = false;
invoiceDetails: any;
createdInvoiceId: number | null = null;
successMessage: string | null = null;
 isEditMode = false;
invoiceId!: number;

  constructor(private dialogRef: MatDialogRef<GstinvoiceaddComponent>, private gst: InvoiceRepository, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,private fb: FormBuilder,  @Inject(MAT_DIALOG_DATA) public data: any ,private cdRef: ChangeDetectorRef) { }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;

    this.addGstInvoice.patchValue({
      CompanyName: company.companyName
    });
     this.onChange();
  }

  handleFinancialYear(year: any) {
    this.selectedFinancialYear = year.financial_Year_Id;
    this.addGstInvoice.patchValue({
      FinancialYear: year.financial_Year_Id
    });
     this.onChange();
  }

  groupnameEvent(event: any) {
  this.siteId = event.siteCode;
  this.selectedsiteId = event.siteCode;
  this.selectedSiteName = event.siteName;

 this.addGstInvoice.patchValue({
  GroupDetail: event.siteCode
}, { emitEvent: false });
 this.addGstInvoice.get('GroupDetail')?.markAsTouched();
  this.onChange();
}
  mapnameEvent(event) {
    //console.log("Map Event:", event); // Debug log to check the event data
   this.selectedMapId = event.mapNameId;
    this.mapNameId = event.mapNameId;
    this.selectedMap = event.mapName;
    this.addGstInvoice.patchValue({
      CostCenterMapping: event.mapNameId
    });
    this.addGstInvoice.get('CostCenterMapping')?.markAsTouched();
     this.onChange();
  }
citynameEvent(event) {
    this.cityId = event.city_Id;
    this.selectedCity = event.city_Name;
    this.selectedCityId= event.city_Id;
    this.addGstInvoice.patchValue({
      City: event.city_Id
    });
     this.addGstInvoice.get('City')?.markAsTouched();
      this.onChange();
  }
  statenameEvent(event) {
    this.stateId = event.stateId;
    this.selectedState = event.state_Name;
    this.selectedStateId = event.stateId;
    this.addGstInvoice.patchValue({
      StateName: event.stateId
    });
    this.addGstInvoice.get('StateName')?.markAsTouched();
     this.onChange();
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.pay_Frequency_Detail_Id;
    this.selectedPayPeriodId= payperiod.pay_Frequency_Detail_Id;
//console.log("Selected Pay Period:", this.payperiodId  , payperiod);
    this.addGstInvoice.patchValue({
      PayPeriod: payperiod.pay_Frequency_Detail_Id
    });

     if (payperiod?.pay_Frequency_Detail_Id) {
    this.UpdateParticulars();
     this.onChange();
  }
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindGstInvoiceType();
    this.BindCTCDeductionType();
    this.BindGetBillingType();
    this.BindNetDeductionType();
    this.GetInvoiceStatus();
    this.payPeriodType = "All";
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
     
    this.addGstInvoice = new FormGroup({
      InvoiceNumber: new FormControl(  { value: 'NEW', disabled: true }, Validators.required),
      companyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl(''),
      GroupDetail: new FormControl(''),
      CostCenterMapping: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      StateName: new FormControl('', Validators.required),
      FinancialYear: new FormControl('', Validators.required),
      PayPeriod: new FormControl('', Validators.required),
      InvoiceType: new FormControl('', Validators.required),
      NofEmployees: new FormControl(''),
      InvoiceDate: new FormControl(formattedToday),
      Amount: new FormControl("", Validators.required),
      Particulars: new FormControl(""),
      ServiceCharge: new FormControl(""),
      ServiceChargeAmount: new FormControl(""),
      AbsorptionFee: new FormControl(""),
      AbsorptionAmt: new FormControl(""),
      SourcingFee: new FormControl(""),
      SourcingChargeAmount: new FormControl(""),
      InEdgeCharges: new FormControl(""),
      InEdgeChargesNote: new FormControl(""),
      CTCAdjustmentAmount: new FormControl(""),
      CTCDeductionType: new FormControl(""),
      CTCAdjustmentNote: new FormControl(""),
      OnboardingCharge: new FormControl(""),
      ComplianceFee: new FormControl(""),
      ComplianceFeeAmount: new FormControl(""),
      UpfrontCharges: new FormControl(""),
      UpfrontChargesNote: new FormControl(''),
      BGVBilling: new FormControl(""),
      AssessmentFee: new FormControl(""),
      Discount1: new FormControl(""),
      Discount2: new FormControl(""),
      IDCardBilling: new FormControl(""),
      Email: new FormControl(""),
      RegistrationFee: new FormControl(""),
      TrainerFee: new FormControl(""),
      GOVTGRANTS_DBT: new FormControl(""),
      PREKIT: new FormControl(""),
      VMSFEE: new FormControl(""),
      EducationFee: new FormControl(""),
      NoticePeriodRecovery: new FormControl(""),
      LaptopRental: new FormControl(""),
      DRADeduction: new FormControl(""),
      OtherDeduction: new FormControl(""),
      CallCharges: new FormControl(""),
      CallRate: new FormControl(""),
      MobilerecoveryAmount: new FormControl(""),
      PersonalLoanAmount: new FormControl(""),
      OtherDeductionAmount: new FormControl(""),
      TaxableAmount1: new FormControl(""),
      TaxableAmount1_Note: new FormControl(""),
      TaxableAmount2: new FormControl(""),
      TaxableAmount2_Note: new FormControl(""),
      TaxableAmount3: new FormControl(""),
      TaxableAmount3_Note: new FormControl(""),
      NonTaxableAmount1: new FormControl(""),
      NonTaxableAmount1Note: new FormControl(""),
      NonTaxableAmount2: new FormControl(""),
      NonTaxableAmount2Note: new FormControl(""),
      NonTaxableAmount3: new FormControl(""),
      NonTaxableAmount3Note: new FormControl(""),
      NetAdjustmentAmount: new FormControl(""),
      NetDeductionType: new FormControl(""),
      NetAdjNote: new FormControl(""),
      NetAmount: new FormControl(""),
      EmployeeESI: new FormControl(""),
      EmployerESI: new FormControl(""),
      EmployeePF: new FormControl(""),
      EmployerPF: new FormControl(""),
      PIIdNo: new FormControl(""),
      EmployeeName: new FormControl(""),
      Markup: new FormControl(""),
      GriMsp: new FormControl(""),
      DONumber: new FormControl(""),
      WONumber: new FormControl(""),
      WODate: new FormControl(""),
      InvoiceNotes: new FormControl(""),
      Status: new FormControl("", Validators.required),
      Remarks: new FormControl(""),
      DiscrepancyReason: new FormControl(""),
      DiscrepancyBy: new FormControl(""),
      CreatedMode: new FormControl(""),
      BillableType: new FormControl("", Validators.required),
      Location: new FormControl(""),
      CGSTper:new FormControl(""),
      CGSTAmount:new FormControl(""),
      SGSTper:new FormControl(""),
      SGSTAmount:new FormControl(""),
      UTGSTper:new FormControl(""),
      UTGSTAmount:new FormControl(""),
      IGSTper:new FormControl(""),
      IGSTAmount:new FormControl(""),
      CTCAmtNorP:new FormControl(""),
      Compliance_Fee:new FormControl(""),
      Compliance_Fee_Amount:new FormControl(""),
      NetAmtNorP:new FormControl(""),
      EAPCT:new FormControl(""),
      HOSAC:new FormControl(""),
    });
       this.addGstInvoice.get('FinancialYear')?.valueChanges.subscribe(yearId => {

    this.selectedFinancialYear = yearId;

    // reset PayPeriod first
    this.addGstInvoice.get('PayPeriod')?.reset(null, { emitEvent: false });

    this.GetPayPeriod();
   
    });
   
     this.addGstInvoice.valueChanges
    .pipe(debounceTime(300)) // prevents too many calls
    .subscribe(() => {
      this.calculateGstAmounts();
      this.getNetAmount(); // or CalculateNetAmount()
    });
    
  if (this.data?.mode === 'edit' && this.data?.invoiceId) {
    this.isEditMode = true;
    this.invoiceId = this.data.invoiceId;
    this.loadInvoiceForEdit(this.invoiceId);
    
    }
  }

  BindGstInvoiceType() {
    this.gst.getGSTInvoiceType().subscribe({
      next: res => { this.invoiceType = res.Data }
    });
  }

  BindCTCDeductionType() {
    this.gst.getCTCDeductionType().subscribe({
      next: res => { this.CTCDeductionType = res.Data }
    });
  }
  BindGetBillingType() {
        this.gst.getBillingType().subscribe({
      next: res => { 
        this.BillingType = res.Data }
    });
  }

  BindNetDeductionType() {
    this.gst.getNetDeductionType().subscribe({
      next: res => { this.NetDeductionType = res.Data }
    });
  };

  
  GetInvoiceStatus() {
const request = {
    Action:"Add",
     UserId: this.toBlank(this.userdetail?.user_Id),
    Invoice_Id: ''
  };
  this.gst.GetInvoiceStatus(request)
    .subscribe({
      next: (res: any) => {

      if (res?.StatusCode === 200 && res?.Data?.length > 0) {
        this.addGstInvoice.get('Status')?.setValue(
          `${res.Data[0].Status}`
        );
      }
    },
    error: (err) => {
      alert('Error ' + err.message);
    }
    });
}

  CreateGSTInvoice() {
    if (this.addGstInvoice.invalid) {
      this.addGstInvoice.markAllAsTouched();
         this.logInvalidControls(this.addGstInvoice);
      return;
    }

    const formValue = this.addGstInvoice.getRawValue();
    const today = new Date().toISOString().split('T')[0] + "T00:00:00";

    const payload = {
      //Action: "Add",
      //Invoice_Id: null
      Action: this.data?.mode === 'edit' ? 'Edit' : 'Add',
    Invoice_Id: this.isEditMode
  ? String(this.data?.invoiceId ?? '')
  : null,
      Created_Mode: null,

      UserId: this.userdetail?.user_Id?.toString() ?? null,
      Invoice_Number: formValue?.InvoiceNumber?.toString() ?? null,
      Company_Id: this.selectedCompanyId?.toString() ?? null,
      Cost_Center_Mapping_Id: this.mapNameId?.toString() ?? null,

      City_Id: this.cityId?.toString() ?? null,

      Financial_Year_Id: formValue?.FinancialYear?.toString() ?? null,
      Pay_Period_Id: this.payperiodId?.toString() ?? null,
      Invoice_Type_Id: formValue?.InvoiceType?.toString() ?? null,

      Invoice_Date: formValue?.InvoiceDate?.toString() ?? null,
      Invoice_Due_Date: formValue?.InvoiceDate?.toString() ?? null,

      Particulars: formValue?.Particulars?.toString() ?? null,
      Amount: formValue?.Amount?.toString() ?? null,
      StateId: this.stateId?.toString() ?? null,
     //StateId: "1",
      //InvoicingStateId: "1",

      CGST_Percentage: formValue?.CGSTper?.toString() ?? 0,
      SGST_Percentage: formValue?.SGSTper?.toString() ?? 0,
      UTGST_Percentage: formValue?.UTGSTper?.toString() ?? 0,
      IGST_Percentage: formValue?.IGSTper?.toString() ?? 0,

      Client_PO: null,
      Purchase_Order_Id: null,

      Input_Date: today?.toString() ?? null,
      Output_Date: today?.toString() ?? null,

      Service_Charge: formValue?.ServiceCharge?.toString() ?? null,
      Service_Charge_Amount: formValue?.ServiceChargeAmount?.toString() ?? null,

      Sourcing_Fee: formValue?.SourcingFee?.toString() ?? null,
      Sourcing_Fee_Amount: formValue?.SourcingChargeAmount?.toString() ?? null,

      No_Of_Employees: formValue?.NofEmployees?.toString() ?? null,

      Absorption_Fee: formValue?.AbsorptionFee?.toString() ?? null,
      Absorption_Amt: formValue?.AbsorptionAmt?.toString() ?? null,

      CTC_Amt_Adjusted: formValue?.CTCAdjustmentAmount?.toString() ?? null,
      CTC_Amt_NorP: null,
      CTC_Adj_Note: formValue?.CTCAdjustmentNote?.toString() ?? null,

      Net_Amt_Adjusted: formValue?.NetAdjustmentAmount?.toString() ?? null,
      Net_Amt_NorP: null,
      Net_Adj_Note: formValue?.NetAdjNote?.toString() ?? null,

      Invoice_Culture_Id: null,
      Invoice_Culture_RefNo: null,

      Input_No: null,

      Employee_ESI: formValue?.EmployeeESI?.toString() ?? null,
      Employee_PF: formValue?.EmployeePF?.toString() ?? null,

      Mobile_Recovery_Amount: formValue?.MobilerecoveryAmount?.toString() ?? null,
      Personal_Loan_Amount: formValue?.PersonalLoanAmount?.toString() ?? null,
      Other_Deduction_Amount: formValue?.OtherDeductionAmount?.toString() ?? null,

      WO_Number: formValue?.WONumber?.toString() ?? null,
      Pl_Id_No: formValue?.PIIdNo?.toString() ?? null,
      Employee_Name: formValue?.EmployeeName?.toString() ?? null,

      Markup: formValue?.Markup?.toString() ?? null,
      Gri_Msp: formValue?.GriMsp?.toString() ?? null,
      DO_Number: formValue?.DONumber?.toString() ?? null,
      Remarks: formValue?.Remarks?.toString() ?? null,
      Status: formValue?.Status?.toString() ?? null,

      IsActive: "1",
      WO_Date: formValue?.WODate?.toString() ?? null,
      InvoiceNotes: formValue?.InvoiceNotes?.toString() ?? null,
       CreatedBy:  this.isEditMode ?null:this.userdetail?.user_Id?.toString() ??null,
      CreatedOn:  this.isEditMode ?null:today?.toString() ??null,
ModifiedBy:  this.isEditMode ?this.userdetail?.user_Id?.toString() : null,
ModifiedOn: this.isEditMode ? today?.toString() : null,

      Discrepancy_By: formValue?.DiscrepancyBy?.toString() ?? null,
      Discrepancy_Reason: formValue?.DiscrepancyReason?.toString() ?? null,

      Onboarding_Charge: formValue?.OnboardingCharge?.toString() ?? null,

      Group_Detail_Id:this.siteId?.toString() ?? null,

      TaxableAmount1: null,
      TaxableAmount1_Note: null,
      TaxableAmount2: null,
      TaxableAmount2_Note: null,

      TaxableAmount3: formValue?.TaxableAmount3?.toString() ?? null,
      TaxableAmount3_Note: formValue?.TaxableAmount3Note?.toString() ?? null,

      NonTaxableAmount1: formValue?.NonTaxableAmount1?.toString() ?? null,
      NonTaxableAmount1_Note: formValue?.NonTaxableAmount1Note?.toString() ?? null,
      NonTaxableAmount2: formValue?.NonTaxableAmount2?.toString() ?? null,
      NonTaxableAmount2_Note: formValue?.NonTaxableAmount2Note?.toString() ?? null,
      NonTaxableAmount3: formValue?.NonTaxableAmount3?.toString() ?? null,
      NonTaxableAmount3_Note: formValue?.NonTaxableAmount3Note?.toString() ?? null,

      Billable_Type_Id: null,
      ProvisionalInvoiceNumber: null,

      Compliance_Fee: formValue?.Compliance_Fee?.toString() ?? null,
      Compliance_Fee_Amount: formValue?.Compliance_Fee_Amount?.toString() ?? null,

      CtcDeductionTypeId: null,
      NetDeductionTypeid: null,
      GratuityInterest: null,
      InsuranceAmount: null,
      NewInvoiceNumber: null,

      BGVBL: formValue?.BGVBilling?.toString() ?? null,
      ASTFEE: formValue?.AssessmentFee?.toString() ?? null,
      DISCT1: formValue?.Discount1?.toString() ?? null,
      DISCT2: formValue?.Discount2?.toString() ?? null,
      IDCARD: formValue?.IDCardBilling?.toString() ?? null,
      EMAIL: formValue?.Email?.toString() ?? null,
      REGFEE: formValue?.RegistrationFee?.toString() ?? null,
      TRNFEE: formValue?.TrainerFee?.toString() ?? null,

      GGDBT: formValue?.GOVTGRANTS_DBT?.toString() ?? null,
      PPEKIT: formValue?.PREKIT?.toString() ?? null,
      VMSFEE: formValue?.VMSFEEF?.toString() ?? null,
      EAPCT: formValue?.PREKIT?.toString() ?? null,
      HOSAC: formValue?.VMSFEEF?.toString() ?? null,

      CALCRG: formValue?.CallCharges?.toString() ?? null,
      CALRT: formValue?.CallRate?.toString() ?? null
    };

    console.log("payload", JSON.stringify(payload));

    this.gst.addGstInvoice(payload).subscribe({
      next: (res: any) => {

if (res?.StatusCode === 200 && res?.Data?.length > 0) {

  const invoiceId = res.Data[0].Invoice_Id;
  this.createdInvoiceId = invoiceId;
  this.loadInvoiceDetails(invoiceId);
  this.showInvoiceDetails = true;
   this.clearForm();

} else {
      alert(res?.Message || 'Invoice creation failed');
    }
  },
     error: saveErr => {

    console.error('Create GST Invoice error:', saveErr);

    let errorMessage = 'Invoice creation failed';

    if (saveErr?.error?.text) {
      errorMessage = saveErr.error.text;
    }
    else if (typeof saveErr?.error === 'string') {
      errorMessage = saveErr.error;
    }
    else if (saveErr?.message) {
      errorMessage = saveErr.message;
    }

    errorMessage = errorMessage.replace(/<br\s*\/?>/gi, '\n');

    alert(errorMessage);
  }
    });
    
  }

  onClose() {
    this.dialogRef.close();
  }

closeForm() {
  this.showInvoiceDetails = false;
  this.invoiceDetails = null;
   this.successMessage = null;
     this.dialogRef.close();
}

onChange() {
  if (!this.selectedCompanyId || !this.stateId) return;

  const formValue = this.addGstInvoice.getRawValue();
const request = {
  Company_Id: this.toBlank(this.selectedCompanyId),
  Cost_Center_Mapping_Id: this.toBlank(this.mapNameId),
  Group_Detail_id: this.toBlank(this.siteId),
  StateId: this.toBlank(this.stateId),
  Invoice_Date: formValue?.InvoiceDate
    ? new Date(formValue.InvoiceDate).toISOString()
    : '',
  Invoice_Id: '',
  UserId: this.toBlank(this.userdetail?.user_Id)
};
 this.gst.GetGstRates(request).subscribe({
    next: (res: any) => {
 

      const gst = res?.Data?.[0];
      if (!gst) return;

      // 🔹 1. Display GST % in textbox
      this.addGstInvoice.patchValue(
        {
          CGSTper: gst.cgsT_Percentage ?? 0,
          SGSTper: gst.sgsT_Percentage ?? 0,
          UTGSTper: gst.utgsT_Percentage ?? 0,
          IGSTper: gst.igsT_Percentage ?? 0
        },
      
      );
      // 🔹 2. Auto-calculate GST amounts
      this.calculateGstAmounts();
      this.CalculateNetAmount();
    },
    error: err => {
      console.error('PO save error:', err);
    }
  });
}
toBlank(value: any): string {
  return value === null || value === undefined ? '' : value.toString();
}


  calculateGstAmounts(): void {
   const amount = Number(this.totalTaxableAmount) || 0;

  const cgstPer = Number(this.addGstInvoice.get('CGSTper')?.value) || 0;
  const sgstPer = Number(this.addGstInvoice.get('SGSTper')?.value) || 0;
  const utgstPer = Number(this.addGstInvoice.get('UTGSTper')?.value) || 0;
  const igstPer = Number(this.addGstInvoice.get('IGSTper')?.value) || 0;

  this.addGstInvoice.patchValue(
    {
      CGSTAmount: ((amount * cgstPer) / 100).toFixed(2),
      SGSTAmount: ((amount * sgstPer) / 100).toFixed(2),
      UTGSTAmount: ((amount * utgstPer) / 100).toFixed(2),
      IGSTAmount: ((amount * igstPer) / 100).toFixed(2)
    },
    { emitEvent: false }
  );
}

 getNetAmount(): number {
  //formValue?.CTCAdjustmentAmount?.toString() ?? null,
  const isCtcAdjustmentPositve =   this.addGstInvoice.get('CTCAmtNorP')?.value;
  console.log(isCtcAdjustmentPositve);
  const  amtCTC = Number(this.addGstInvoice.get('Amount')?.value) || 0;
  const  amtCtcAdjustment=Number(this.addGstInvoice.get('CTCAdjustmentAmount')?.value) || 0;

    //Gst precentages
      const CGST_Percentage = Number(this.addGstInvoice.get('CGSTper')?.value) || 0;
      const  SGST_Percentage = Number(this.addGstInvoice.get('SGSTper')?.value) || 0;
      const UTGST_Percentage = Number(this.addGstInvoice.get('UTGSTper')?.value) || 0;
      const IGST_Percentage =Number(this.addGstInvoice.get('IGSTper')?.value) || 0;

         //   // Taxable fields
    const   finalCtcAmount = isCtcAdjustmentPositve ? (amtCTC + amtCtcAdjustment) : (amtCTC - amtCtcAdjustment);
     const amtServiceCharge = Number(this.addGstInvoice.get('ServiceChargeAmount')?.value) || 0;
    const   amtSourcingFee = Number(this.addGstInvoice.get('SourcingChargeAmount')?.value) || 0;
     const  amtAbsorption = Number(this.addGstInvoice.get('AbsorptionAmt')?.value) || 0;
    const   amtOnboardingCharge = Number(this.addGstInvoice.get('OnboardingCharge')?.value) || 0;
    const   amtTaxableAmount1 = Number(this.addGstInvoice.get('TaxableAmount1')?.value) || 0;
    const   amtTaxableAmount2 =Number(this.addGstInvoice.get('TaxableAmount2')?.value) || 0;
    const   amtTaxableAmount3 = Number(this.addGstInvoice.get('TaxableAmount3')?.value) || 0;

    const amtBGVBL =  Number(this.addGstInvoice.get('BGVBilling')?.value) || 0;
    const amtASTFEE =  Number(this.addGstInvoice.get('AssessmentFee')?.value) || 0;
      const amtIDCARD =  Number(this.addGstInvoice.get('IDCardBilling')?.value) || 0;
      const amtEMAIL = Number(this.addGstInvoice.get('Email')?.value) || 0;
      const amtREGFEE =  Number(this.addGstInvoice.get('RegistrationFee')?.value) || 0;
      const amtTRNFEE= Number(this.addGstInvoice.get('TrainerFee')?.value) || 0;
      const amtGGDBT =  Number(this.addGstInvoice.get('GOVTGRANTS_DBT')?.value) || 0;
      const amtPPEKIT =  Number(this.addGstInvoice.get('PREKIT')?.value) || 0;
      const amtVMSFEE = Number(this.addGstInvoice.get('VMSFEE')?.value) || 0;
      const amtEDUFEE =  Number(this.addGstInvoice.get('EducationFee')?.value) || 0;       
      const amtRENMAC = Number(this.addGstInvoice.get('LaptopRental')?.value) || 0; 
      const amtEAPCT =  Number(this.addGstInvoice.get('EAPCT')?.value) || 0;       
      const amtHOSAC = Number(this.addGstInvoice.get('HOSAC')?.value) || 0; 

      const amtDRADED= (Number(this.addGstInvoice.get('DRADeduction')?.value) || 0)*-1;
      const amtOTHDD =  (Number(this.addGstInvoice.get('OtherDeduction')?.value) || 0)*-1;
      const amtNTPRY =  (Number(this.addGstInvoice.get('NoticePeriodRecovery')?.value) || 0)*-1;
      const amtDISCT1 =  (Number(this.addGstInvoice.get('Discount1')?.value) || 0)*-1;
      const amtDISCT2 =  (Number(this.addGstInvoice.get('Discount2')?.value) || 0)*-1;
 
       // Non taxable fields
    const amtMobileRecovery = Number(this.addGstInvoice.get('MobilerecoveryAmount')?.value) || 0;
    const amtPersonalLoan = Number(this.addGstInvoice.get('PersonalLoanAmount')?.value) || 0;
    const amtOtherDeduction =Number(this.addGstInvoice.get('OtherDeductionAmount')?.value) || 0;;
    const amtNonTaxableAmount1 = Number(this.addGstInvoice.get('NonTaxableAmount1')?.value) || 0;
    const  amtNonTaxableAmount2 = Number(this.addGstInvoice.get('NonTaxableAmount2')?.value) || 0;
    const   amtNonTaxableAmount3 =Number(this.addGstInvoice.get('NonTaxableAmount3')?.value) || 0;

    const amtTotalDeduction = amtMobileRecovery + amtPersonalLoan + amtOtherDeduction + amtNonTaxableAmount1 + amtNonTaxableAmount2 + amtNonTaxableAmount3;
       const amtTotalTaxable = finalCtcAmount + amtServiceCharge + amtSourcingFee + amtAbsorption + amtOnboardingCharge + amtTaxableAmount1 + amtTaxableAmount2 + amtTaxableAmount3 +amtBGVBL + amtASTFEE +  amtIDCARD + amtEMAIL + amtREGFEE + amtTRNFEE + amtGGDBT + amtPPEKIT + amtVMSFEE + amtEDUFEE  + amtRENMAC+amtEAPCT+amtHOSAC+( amtDRADED +  amtOTHDD+amtDISCT1 + amtDISCT2 + amtNTPRY) ;
        this.calculateGstAmounts();
       const totalGstAmount=this.getTotalcGst();
      const Compliance_Fee = Number(this.addGstInvoice.get('Compliance_Fee')?.value) || 0
      const Compliance_Fee_Amount = parseFloat(((Compliance_Fee * amtTotalTaxable) / 100).toFixed(2));

       // Net Amount
    var   NetAmount = (amtTotalTaxable + totalGstAmount) - amtTotalDeduction;

    //   // Adjust Net Amount
      const  isNetAdjustmentPositve =  this.addGstInvoice.get('NetAmtNorP')?.value;
      const vNetAdjAmount = this.addGstInvoice.get('NetAdjustmentAmount')?.value;
       NetAmount = isNetAdjustmentPositve ? (NetAmount + vNetAdjAmount) : (NetAmount - vNetAdjAmount);
 const f = this.addGstInvoice.getRawValue();

       this.addGstInvoice.patchValue({
  Amount: amtCTC,
  TaxableAmount3: Number(amtTaxableAmount3).toFixed(2),
  NetAmount: Number(NetAmount).toFixed(2)
});


// Assign values
this.totalTaxableAmount = amtTotalTaxable;
this.totalGstAmount = totalGstAmount;
this.totalNonTaxableAmount = amtTotalDeduction;
       return NetAmount
}
CalculateNetAmount()
{
const isCtcAdjustmentPositve =   this.addGstInvoice.get('CTCAmtNorP')?.value;
  console.log("Changed");
  console.log(isCtcAdjustmentPositve);
  const  amtCTC = Number(this.addGstInvoice.get('Amount')?.value) || 0;
  const  amtCtcAdjustment=Number(this.addGstInvoice.get('CTCAdjustmentAmount')?.value) || 0;

    //Gst precentages
      const CGST_Percentage = Number(this.addGstInvoice.get('CGSTper')?.value) || 0;
      const  SGST_Percentage = Number(this.addGstInvoice.get('SGSTper')?.value) || 0;
      const UTGST_Percentage = Number(this.addGstInvoice.get('UTGSTper')?.value) || 0;
      const IGST_Percentage =Number(this.addGstInvoice.get('IGSTper')?.value) || 0;

         //   // Taxable fields
    const   finalCtcAmount = isCtcAdjustmentPositve ? (amtCTC + amtCtcAdjustment) : (amtCTC - amtCtcAdjustment);
     const amtServiceCharge = Number(this.addGstInvoice.get('ServiceChargeAmount')?.value) || 0;
    const   amtSourcingFee = Number(this.addGstInvoice.get('SourcingChargeAmount')?.value) || 0;
     const  amtAbsorption = Number(this.addGstInvoice.get('AbsorptionAmt')?.value) || 0;
    const   amtOnboardingCharge = Number(this.addGstInvoice.get('OnboardingCharge')?.value) || 0;
    const   amtTaxableAmount1 = Number(this.addGstInvoice.get('TaxableAmount1')?.value) || 0;
    const   amtTaxableAmount2 =Number(this.addGstInvoice.get('TaxableAmount2')?.value) || 0;
    const   amtTaxableAmount3 = Number(this.addGstInvoice.get('TaxableAmount3')?.value) || 0;

    const amtBGVBL =  Number(this.addGstInvoice.get('BGVBilling')?.value) || 0;
    const amtASTFEE =  Number(this.addGstInvoice.get('AssessmentFee')?.value) || 0;
      const amtIDCARD =  Number(this.addGstInvoice.get('IDCardBilling')?.value) || 0;
      const amtEMAIL = Number(this.addGstInvoice.get('Email')?.value) || 0;
      const amtREGFEE =  Number(this.addGstInvoice.get('RegistrationFee')?.value) || 0;
      const amtTRNFEE= Number(this.addGstInvoice.get('TrainerFee')?.value) || 0;
      const amtGGDBT =  Number(this.addGstInvoice.get('GOVTGRANTS_DBT')?.value) || 0;
      const amtPPEKIT =  Number(this.addGstInvoice.get('PREKIT')?.value) || 0;
      const amtVMSFEE = Number(this.addGstInvoice.get('VMSFEE')?.value) || 0;
      const amtEDUFEE =  Number(this.addGstInvoice.get('EducationFee')?.value) || 0;       
      const amtRENMAC = Number(this.addGstInvoice.get('LaptopRental')?.value) || 0; 
       const amtEAPCT=  Number(this.addGstInvoice.get('EAPCT')?.value) || 0;       
      const amtHOSAC= Number(this.addGstInvoice.get('HOSAC')?.value) || 0;

      const amtDRADED= (Number(this.addGstInvoice.get('DRADeduction')?.value) || 0)*-1;
      const amtOTHDD =  (Number(this.addGstInvoice.get('OtherDeduction')?.value) || 0)*-1;
      const amtNTPRY =  (Number(this.addGstInvoice.get('NoticePeriodRecovery')?.value) || 0)*-1;
      const amtDISCT1 =  (Number(this.addGstInvoice.get('Discount1')?.value) || 0)*-1;
      const amtDISCT2 =  (Number(this.addGstInvoice.get('Discount2')?.value) || 0)*-1;
 
       // Non taxable fields
    const amtMobileRecovery = Number(this.addGstInvoice.get('MobilerecoveryAmount')?.value) || 0;
    const amtPersonalLoan = Number(this.addGstInvoice.get('PersonalLoanAmount')?.value) || 0;
    const amtOtherDeduction =Number(this.addGstInvoice.get('OtherDeductionAmount')?.value) || 0;;
    const amtNonTaxableAmount1 = Number(this.addGstInvoice.get('NonTaxableAmount1')?.value) || 0;
    const  amtNonTaxableAmount2 = Number(this.addGstInvoice.get('NonTaxableAmount2')?.value) || 0;
    const   amtNonTaxableAmount3 =Number(this.addGstInvoice.get('NonTaxableAmount3')?.value) || 0;

    const amtTotalDeduction = amtMobileRecovery + amtPersonalLoan + amtOtherDeduction + amtNonTaxableAmount1 + amtNonTaxableAmount2 + amtNonTaxableAmount3;
       const amtTotalTaxable = finalCtcAmount + amtServiceCharge + amtSourcingFee + amtAbsorption + amtOnboardingCharge + amtTaxableAmount1 + amtTaxableAmount2 + amtTaxableAmount3 +amtBGVBL + amtASTFEE +  amtIDCARD + amtEMAIL + amtREGFEE + amtTRNFEE + amtGGDBT + amtPPEKIT + amtVMSFEE + amtEDUFEE  + amtRENMAC+amtEAPCT+amtHOSAC+( amtDRADED +  amtOTHDD+amtDISCT1 + amtDISCT2 + amtNTPRY) ;
        this.calculateGstAmounts();
       const totalGstAmount=this.getTotalcGst();
      const Compliance_Fee = Number(this.addGstInvoice.get('Compliance_Fee')?.value) || 0
      const Compliance_Fee_Amount = parseFloat(((Compliance_Fee * amtTotalTaxable) / 100).toFixed(2));

       // Net Amount
    var   NetAmount = (amtTotalTaxable + totalGstAmount) - amtTotalDeduction;

    //   // Adjust Net Amount
      const  isNetAdjustmentPositve =  this.addGstInvoice.get('NetAmtNorP')?.value;
      const vNetAdjAmount = this.addGstInvoice.get('NetAdjustmentAmount')?.value;
       NetAmount = isNetAdjustmentPositve ? (NetAmount + vNetAdjAmount) : (NetAmount - vNetAdjAmount);
 const f = this.addGstInvoice.getRawValue();

       this.addGstInvoice.patchValue({
  Amount: amtCTC,
  TaxableAmount3: Number(amtTaxableAmount3).toFixed(2),
  NetAmount: Number(NetAmount).toFixed(2)
});


// Assign values
this.totalTaxableAmount = amtTotalTaxable;
this.totalGstAmount = totalGstAmount;
this.totalNonTaxableAmount = amtTotalDeduction;
}

getTotalcGst(): number {
  const f = this.addGstInvoice.getRawValue();

  return (
    Number(f.CGSTAmount) +
    Number(f.SGSTAmount) +
    Number(f.UTGSTAmount) +
    Number(f.IGSTAmount)
  );
}
UpdateParticulars(): void {

  const CompanyId = this.toBlank(this.selectedCompanyId);
  if (!CompanyId) {
    return;
  }

  const request = { Company_Id: CompanyId ,
  UserId: this.toBlank(this.userdetail?.user_Id)
  };
  console.log("Request for particulars:", request);
  this.gst.GetParticulars(request)
    .subscribe({
      next: (res: any) => {

      if (res?.StatusCode === 200 && res?.Data?.length > 0) {

        const payPeriodText = this.toBlank(this.payPeriod.pay_Period);
        this.addGstInvoice.get('Particulars')?.setValue(
          `${res.Data[0].Particulars} ${payPeriodText}`
        );
      }
    },
    error: (err) => {
      alert('Error ' + err.message);
    }
    });
}
toggleCtcSign(event: any): void {
  this.ctcSign = event.target.checked ? '+' : '-';
}
GetPayPeriod() {

  const CompanyId = this.toBlank(this.selectedCompanyId);
  if (!CompanyId || !this.selectedFinancialYear) return;

  const request = {
    Company_Id: CompanyId,
    Financial_Year_Id: this.toBlank(this.selectedFinancialYear)
  };

  this.gst.GetPayPeriod(request).subscribe({
    next: (res: any) => {

      const p = res?.Data?.[0];
      if (!p) return;
   this.payperiodId= p.pay_Frequency_Detail_Id;
      // ✅ ONLY set value, do NOT reload list
      this.addGstInvoice.get('PayPeriod')?.setValue(
        p.pay_Frequency_Detail_Id
      );
    }
 
  });
}
logInvalidControls(form: FormGroup, parentKey: string = ''): void {
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    const controlPath = parentKey ? `${parentKey}.${key}` : key;

    if (control instanceof FormGroup) {
      this.logInvalidControls(control, controlPath);
    } else if (control?.invalid) {
      console.log('❌ Invalid field:', controlPath);
      console.log('   Errors:', control.errors);
      console.log('   Value:', control.value);
    }
  });
}

loadInvoiceDetails(invoiceId: number) {
  const payload = {
      Action: "Get",
      UserId: this.userdetail?.user_Id?.toString() ?? null,
      Invoice_Id: this.toBlank(invoiceId)
  }
  this.gst.GetInvoiceDetailsById(payload).subscribe({
    next: (res: any) => {
      if (res?.StatusCode === 200) {
        console.log(res.Data);
        this.invoiceDetails = res.Data[0]; 
    //     this.successMessage = `Invoice Number : - ${this.invoiceDetails.Invoice_Number} created successfully`;
  this.successMessage = this.isEditMode
  ? `Invoice Number : ${this.invoiceDetails.Invoice_Number} updated successfully`
  : `Invoice Number : ${this.invoiceDetails.Invoice_Number} created successfully`;    
  }
    }
  });
}
clearForm() {
  this.addGstInvoice.reset();

  // optional defaults
  this.addGstInvoice.patchValue({
    CGSTper: 0,
    SGSTper: 0,
    UTGSTper: 0,
    IGSTper: 0,
    Amount: 0
  });
   this.addGstInvoice.markAsPristine();
  this.addGstInvoice.markAsUntouched();
}
createNewInvoice() {
  this.showInvoiceDetails = false;
  this.invoiceDetails = null;
}
loadInvoiceForEdit(invoiceId: number) {

  const payload = {
    Action: "Get",
    UserId: this.userdetail?.user_Id?.toString() ?? null,
    Invoice_Id: this.toBlank(invoiceId)
  };

  this.gst.GetInvoiceDetailsById(payload).subscribe({
    next: (res: any) => {

      if (res?.StatusCode === 200 && res?.Data?.length > 0) {

        const inv = res.Data[0];
console.log('Company List:', this.companyList);
console.log('Invoice Company_Id:', inv.Company_Id);
        this.selectedCompanyId=inv.Company_Id;
this.selectedCompany = this.companyList.find(
  c => Number(c.companyId) === Number(inv.Company_Id)
);
       //this.companyId = inv.Company_Id;
    
console.log('Selected Company:', this.selectedCompany);    //this.cityId = inv.City_Id;
        //this.selectedCity = inv.City_Name;
   this.selectedCompanyId = inv.Company_Id;
   this.selectedFinancialYear = inv.Financial_Year_Id;
   this.selectedPayPeriodId = inv.Pay_Period_Id;
   this.selectedMapId=inv.Cost_Center_Mapping_Id;
   this.selectedsiteId=inv.Group_Detail_Id;
  this.selectedStateId=inv.StateId;
this.selectedcityId=inv.City_Id;
this.mapNameId = inv.Cost_Center_Mapping_Id;
this.siteId = inv.Group_Detail_Id;
this.stateId = inv.StateId;
this.cityId = inv.City_Id;
this.payperiodId = inv.Pay_Period_Id;
        console.log("PRINT ", inv);
  console.log("Company Event",this.selectedCompanyId);
          this.addGstInvoice.patchValue({
companyCode: inv.Company_Id,
 GroupDetail: inv.Group_Detail_Id,
  CostCenterMapping: inv.Cost_Center_Mapping_Id,
  City: inv.City_Id,
  StateName: inv.StateId,
  PayPeriod: inv.Pay_Period_Id,
  FinancialYear: inv.Financial_Year_Id,
 InvoiceNumber: inv.Invoice_Number,
            NofEmployees: inv.No_Of_Employees,
            InvoiceType: inv.Invoice_Type_Id,

            Amount: inv.Amount,
            Particulars: inv.Particulars,
            Status: inv.Status,

            ServiceCharge: inv.Service_Charge,
            ServiceChargeAmount: inv.Service_Charge_Amount,

            AbsorptionFee: inv.Absorption_Fee,
            AbsorptionAmt: inv.Absorption_Amt,

            SourcingFee: inv.Sourcing_Fee,
            SourcingChargeAmount: inv.Sourcing_Fee_Amount,

            InEdgeCharges: inv.TaxableAmount1,
            InEdgeChargesNote: inv.TaxableAmount1_Note,

            CTCAdjustmentAmount: inv.CTC_Amt_Adjusted,
            CTCDeductionType: inv.Ctc_Deduction_Type_Id,
            CTCAdjustmentNote: inv.CTC_Adj_Note,

            OnboardingCharge: inv.Onboarding_Charge,

            UpfrontCharges: inv.TaxableAmount2,
            UpfrontChargesNote: inv.TaxableAmount2_Note,

            BGVBilling: inv.BGVBL,

            AssessmentFee: inv.ASTFEE,
            Discount1: inv.DISCT1,
            Discount2: inv.DISCT2,

            IDCardBilling: inv.IDCARD,
            Email: inv.EMAIL,
            RegistrationFee: inv.REGFEE,
            TrainerFee: inv.TRNFEE,

            GOVTGRANTS_DBT: inv.GGDBT,
            PREKIT: inv.PPEKIT,
            VMSFEE: inv.VMSFEE,

            CallCharges: inv.CALCRG,
            CallRate: inv.CALRT,

            MobilerecoveryAmount: inv.Mobile_Recovery_Amount,
            PersonalLoanAmount: inv.Personal_Loan_Amount,
            OtherDeductionAmount: inv.Other_Deduction_Amount,

            TaxableAmount3: inv.TaxableAmount3,
            TaxableAmount3_Note: inv.TaxableAmount3_Note,

            NonTaxableAmount1: inv.NonTaxableAmount1,
            NonTaxableAmount1Note: inv.NonTaxableAmount1_Note,

            NonTaxableAmount2: inv.NonTaxableAmount2,
            NonTaxableAmount2Note: inv.NonTaxableAmount2_Note,

            NonTaxableAmount3: inv.NonTaxableAmount3,
            NonTaxableAmount3Note: inv.NonTaxableAmount3_Note,

            NetAdjustmentAmount: inv.Net_Amt_Adjusted,
            NetDeductionType: inv.Net_Deduction_Type_Id,
            NetAdjNote: inv.Net_Adj_Note,
            NetAmount: inv.Net_Amount,

            CGSTAmount: inv.CGST_Amount,
            SGSTAmount: inv.SGST_Amount,
            UTGSTAmount: inv.UTGST_Amount,
            IGSTAmount: inv.IGST_Amount,

            CGSTper: inv.CGST_Percentage,
            SGSTper: inv.SGST_Percentage,
            IGSTper: inv.IGST_Percentage,
            UTGSTper: inv.UTGST_Percentage

          }, { emitEvent: false });

this.addGstInvoice.get('InvoiceDate')?.setValue(
  inv.Invoice_Date ? inv.Invoice_Date.split('T')[0] : null
);

this.cdRef.detectChanges();
     
          // ✅ Prevent NG0100
          this.addGstInvoice.patchValue({
            Amount: inv.Amount,
            NetAmount: inv.Net_Amount
          }, { emitEvent: false });

          this.calculateGstAmounts();
          this.getNetAmount();

        // ✅ Disable fields
        this.addGstInvoice.get('InvoiceNumber')?.disable();
        this.addGstInvoice.get('companyCode')?.disable();

        if (this.isEditMode) {
          [
            'companyCode','GroupDetail','CostCenterMapping','City','StateName',
            'Amount','InvoiceType','ServiceChargeAmount',
            'InvoiceDate','NofEmployees','AbsorptionAmt','Particulars',
            'SourcingChargeAmount','TaxableAmount1','CTCAdjustmentAmount'
          ].forEach(c => this.addGstInvoice.get(c)?.disable());
        }
      }
    }
  });
}

ngOnChanges() {
  if (this.selectedCompanyId && this.companyList?.length) {
    this.selectedCompany =
      this.companyList.find(c => c.company_Id === this.selectedCompanyId);
  }
}

}
