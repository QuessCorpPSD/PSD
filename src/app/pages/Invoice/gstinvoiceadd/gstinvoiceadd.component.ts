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
import { MatDialogRef } from '@angular/material/dialog';
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
    StatenameComponent
  ],
  templateUrl: './gstinvoiceadd.component.html',
  styleUrl: './gstinvoiceadd.component.css'
})
export class GstinvoiceaddComponent {

  selectedCompanyId!: number;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  accordionLoaded = false;
  addGstInvoice!: FormGroup;
  InvoiceType: any;
  invoiceType: any;
  CTCDeductionType: any;
  BillingType: any;
  NetDeductionType: any;
  selectedFinancialYear: any;
  PayCode: any;
  payperiodId: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedMapId: any;
  siteId: number = 0;
  selectedSiteName: string = '';
  companyId: number = 0;
  mapNameId: any;
  selectedMap: any;
  cityId:any;
  selectedCity:any;
   stateId:any;
  selectedState:any;

  constructor(private dialogRef: MatDialogRef<GstinvoiceaddComponent>, private gst: InvoiceRepository, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;

    this.addGstInvoice.patchValue({
      CompanyName: company.companyName
    });
  }

  handleFinancialYear(year) {
    this.selectedFinancialYear = year.financial_Year_Id;
    this.addGstInvoice.patchValue({
      FinancialYear: year.financial_Year_Id
    });
  }

  groupnameEvent(event) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;

    this.addGstInvoice.patchValue({
      GroupDetail: event.GroupDetail
    });
  }

  mapnameEvent(event) {
    this.mapNameId = event.mapNameId;
    this.selectedMap = event.mapName;
    console.log("mapnameEvent", this.mapNameId);
    this.addGstInvoice.patchValue({
      CostCenterMapping: event.mapNameId
    });
  }
citynameEvent(event) {
    this.cityId = event.City_Id;
    this.selectedCity = event.City_Name;
    console.log("citynameEvent", this.cityId);
    this.addGstInvoice.patchValue({
      CityName: event.City_Id
    });
  }
  statenameEvent(event) {
    this.stateId = event.stateId;
    this.selectedState = event.state_Name;
    console.log("statenameEvent", event);
    this.addGstInvoice.patchValue({
      StateName: event.stateId
    });
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;

    this.addGstInvoice.patchValue({
      PayPeriod: payperiod.payPeriod
    });
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindGstInvoiceType();
    this.BindCTCDeductionType();
    this.BindGetBillingType();
    this.BindNetDeductionType();
    this.payPeriodType = "All";
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    this.addGstInvoice = new FormGroup({
      InvoiceNumber: new FormControl(  { value: 'NEW', disabled: true }, Validators.required),
      companyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl('', Validators.required),
      GroupDetail: new FormControl(''),
      CostCenterMapping: new FormControl('', Validators.required),
      CityName: new FormControl('', Validators.required),
      StateName: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
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
      ServiceFeeAmount: new FormControl(""),
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
      TaxableAmount3: new FormControl(""),
      TaxableAmount3Note: new FormControl(""),
      BGVBilling: new FormControl(""),
      AssessmentFee: new FormControl(""),
      Discount1: new FormControl(""),
      Discount2: new FormControl(""),
      IDCardBilling: new FormControl(""),
      EmailId: new FormControl(""),
      RegistartionFee: new FormControl(""),
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
      GST: new FormControl("", Validators.required),
      GSTAmount: new FormControl(""),
      MobilerecoveryAmount: new FormControl(""),
      PersonalLoanAmount: new FormControl(""),
      OtherDeductionAmount: new FormControl(""),
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
      State: new FormControl(""),
    });
  }

  BindGstInvoiceType() {
    this.gst.getGSTInvoiceType().subscribe({
      next: res => { this.invoiceType = res.Data }
    });
    console.log(this.invoiceType)
  }

  BindCTCDeductionType() {
    this.gst.getCTCDeductionType().subscribe({
      next: res => { this.CTCDeductionType = res.Data }
    });
  }

  BindGetBillingType() {
    this.gst.getBillingType().subscribe({
      next: res => { this.BillingType = res.Data }
    });
  }

  BindNetDeductionType() {
    this.gst.getNetDeductionType().subscribe({
      next: res => { this.NetDeductionType = res.Data }
    });
  };

  CreateGSTInvoice() {

    if (this.addGstInvoice.invalid) {
      this.addGstInvoice.markAllAsTouched();
      return;
    }

    const formValue = this.addGstInvoice.getRawValue();
    const today = new Date().toISOString().split('T')[0] + "T00:00:00";

    const payload = {
      Action: "Add",
      Created_Mode: null,

      UserId: this.userdetail?.user_Id?.toString() ?? null,
      Invoice_Id: null,

      Invoice_Number: formValue?.InvoiceNumber?.toString() ?? null,
      Company_Id: this.selectedCompanyId?.toString() ?? null,
      Cost_Center_Mapping_Id: this.mapNameId?.toString() ?? null,

      City_Id: this.cityId?.toString() ?? null,

      Financial_Year_Id: this.selectedFinancialYear?.toString() ?? null,
      Pay_Period_Id: this.payperiodId?.toString() ?? null,
      Invoice_Type_Id: formValue?.InvoiceType?.toString() ?? null,

      Invoice_Date: formValue?.InvoiceDate?.toString() ?? null,
      Invoice_Due_Date: formValue?.InvoiceDate?.toString() ?? null,

      Particulars: formValue?.Particulars?.toString() ?? null,
      Amount: formValue?.Amount?.toString() ?? null,
      StateId: this.stateId?.toString() ?? null,
     //StateId: "1",
      //InvoicingStateId: "1",

      CGST_Percentage: null,
      SGST_Percentage: null,
      UTGST_Percentage: null,
      IGST_Percentage: formValue?.GSTAmount?.toString() ?? null,

      Client_PO: null,
      Purchase_Order_Id: null,

      Input_Date: today?.toString() ?? null,
      Output_Date: today?.toString() ?? null,

      Service_Charge: formValue?.ServiceCharge?.toString() ?? null,
      Service_Charge_Amount: formValue?.ServiceChargeAmount?.toString() ?? null,

      Sourcing_Fee: formValue?.SourcingFee?.toString() ?? null,
      Sourcing_Fee_Amount: formValue?.SourcingFeeAmount?.toString() ?? null,

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
      Employer_ESI: formValue?.EmployerESI?.toString() ?? null,
      Employee_PF: formValue?.EmployeePF?.toString() ?? null,
      Employer_PF: formValue?.EmployerPF?.toString() ?? null,

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

      IsActive: null,
      WO_Date: formValue?.WODate?.toString() ?? null,
      InvoiceNotes: formValue?.InvoiceNotes?.toString() ?? null,

      CreatedBy: this.userdetail?.user_Id?.toString() ?? null,
      CreatedOn: today?.toString() ?? null,
      ModifiedBy: null,
      ModifiedOn: null,

      Discrepancy_By: formValue?.DiscrepancyBy?.toString() ?? null,
      Discrepancy_Reason: formValue?.DiscrepancyReason?.toString() ?? null,

      Onboarding_Charge: formValue?.OnboardingCharge?.toString() ?? null,

      Group_Detail_Id: null,

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

      Compliance_Fee: formValue?.ComplianceFee?.toString() ?? null,
      Compliance_Fee_Amount: formValue?.ComplianceFeeAmount?.toString() ?? null,

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
      EMAIL: formValue?.EmailId?.toString() ?? null,
      REGFEE: formValue?.RegistrationFee?.toString() ?? null,
      TRNFEE: formValue?.TrainerFee?.toString() ?? null,

      GGDBT: formValue?.GOVTGRANTS_DBT?.toString() ?? null,
      PPEKIT: formValue?.PREKIT?.toString() ?? null,
      VMSFEE: formValue?.VMSFEEF?.toString() ?? null,

      CALCRG: formValue?.CallCharges?.toString() ?? null,
      CALRT: formValue?.CallRate?.toString() ?? null
    };

    console.log("payload", JSON.stringify(payload))
    this.gst.addGstInvoice(payload).subscribe({
      next: (res: string) => {
        const message = res.replace(/<br\s*\/?>/gi, '\n')
        if (message.includes('Invoice ID')) {
          alert(message)
          this.onClose();
        }
        else {
          alert(message);
          return;
        }

      },
      error: saveErr => {
        console.error('PO save error:', saveErr);
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

onChange() {
  if (!this.selectedCompanyId || !this.stateId) return;

  const formValue = this.addGstInvoice.getRawValue();

  const request = {
    Company_Id: this.selectedCompanyId ? String(this.selectedCompanyId) : null,
    Cost_Center_Mapping_Id: this.mapNameId ? String(this.mapNameId) : null,
     Group_Detail_id: this.siteId ? String(this.siteId) : null,
    StateId: this.stateId ? String(this.stateId) : null,
    Invoice_Date: formValue?.InvoiceDate? new Date(formValue.InvoiceDate).toISOString() : null,
    Invoice_Id: "",
    UserId: this.userdetail?.user_Id?.toString() ?? null
  }

console.log('payload', request);
 this.gst.GetGstRates(request).subscribe({
    next: (res: any) => {
      const message = typeof res === 'string'
        ? res.replace(/<br\s*\/?>/gi, '\n')
        : res?.Message ?? '';

      console.log(res);

      if (message.includes('Invoice ID')) {
        this.onClose();
      }
    },
    error: err => {
      console.error('PO save error:', err);
    }
  });
}

  CalculateNetAmount() {
const formValue = this.addGstInvoice.getRawValue();
    //   const isCtcAdjustmentPositve = $("#CTC_Amt_NorP").is(':checked');
    //   amtCTC = parseFloat($('#Amount').val());
    //   amtCtcAdjustment = parseFloat($('#CTC_Amt_Adjusted').val());

    //   //Gst precentages
    //   CGST_Percentage = parseFloat($('#CGST_Percentage').val());
    //   SGST_Percentage = parseFloat($('#SGST_Percentage').val());
    //   UTGST_Percentage = parseFloat($('#UTGST_Percentage').val());
    //   IGST_Percentage = parseFloat($('#IGST_Percentage').val());

    //   // Taxable fields
    //   finalCtcAmount = isCtcAdjustmentPositve ? (amtCTC + amtCtcAdjustment) : (amtCTC - amtCtcAdjustment);
    //   amtServiceCharge = parseFloat($('#Service_Charge_Amount').val());
    //   amtSourcingFee = parseFloat($('#Sourcing_Fee_Amount').val());
    //   amtAbsorption = parseFloat($('#Absorption_Amt').val());
    //   amtOnboardingCharge = parseFloat($('#Onboarding_Charge').val());
    //   amtTaxableAmount1 = parseFloat($('#TaxableAmount1').val());
    //   amtTaxableAmount2 = parseFloat($('#TaxableAmount2').val());
    //   amtTaxableAmount3 = parseFloat($('#TaxableAmount3').val());

    //  var amtBGVBL = parseFloat($('#BGVBL').val());
    //   var amtASTFEE = parseFloat($('#ASTFEE').val()); 
    //  var amtIDCARD = parseFloat($('#IDCARD').val());
    //  var amtEMAIL = parseFloat($('#EMAIL').val());
    //  var amtREGFEE = parseFloat($('#REGFEE').val());
    //  var amtTRNFEE= parseFloat($('#TRNFEE').val());
    //  var amtGGDBT = parseFloat($('#GGDBT').val());
    //  var amtPPEKIT = parseFloat($('#PPEKIT').val());
    //  var amtVMSFEE = parseFloat($('#VMSFEE').val());
    //  var amtEDUFEE = parseFloat($('#EDUFEE').val());         
    //   var amtRENMAC = parseFloat($('#RENMAC').val());

    //  var amtDRADED= parseFloat($('#DRADED').val())*-1;
    //  var amtOTHDD = parseFloat($('#OTHDD').val())*-1;
    //  var amtNTPRY = parseFloat($('#NTPRY').val())*-1;
    //  var amtDISCT1 = parseFloat($('#DISCT1').val())*-1;
    //  var amtDISCT2 = parseFloat($('#DISCT2').val())*-1;


    //   amtTotalTaxable = finalCtcAmount + amtServiceCharge + amtSourcingFee + amtAbsorption + amtOnboardingCharge + amtTaxableAmount1 + amtTaxableAmount2 + amtTaxableAmount3 +amtBGVBL + amtASTFEE +  amtIDCARD + amtEMAIL + amtREGFEE + amtTRNFEE + amtGGDBT + amtPPEKIT + amtVMSFEE + amtEDUFEE  + amtRENMAC+( amtDRADED +  amtOTHDD+amtDISCT1 + amtDISCT2 + amtNTPRY) ;
      

    //   // Non taxable fields
    //   var amtMobileRecovery = parseFloat($("#Mobile_Recovery_Amount").val());
    //   var amtPersonalLoan = parseFloat($("#Personal_Loan_Amount").val());
    //   var amtOtherDeduction = parseFloat($("#Other_Deduction_Amount").val());
    //   amtNonTaxableAmount1 = parseFloat($('#NonTaxableAmount1').val());
    //   amtNonTaxableAmount2 = parseFloat($('#NonTaxableAmount2').val());
    //   amtNonTaxableAmount3 = parseFloat($('#NonTaxableAmount3').val());

    //   amtTotalDeduction = amtMobileRecovery + amtPersonalLoan + amtOtherDeduction + amtNonTaxableAmount1 + amtNonTaxableAmount2 + amtNonTaxableAmount3;

    //   // Calculate GST Rates
    //   CGST_Amount = parseFloat(((CGST_Percentage * amtTotalTaxable) / 100).toFixed(2));
    //   SGST_Amount = parseFloat(((SGST_Percentage * amtTotalTaxable) / 100).toFixed(2));
    //   UTGST_Amount = parseFloat(((UTGST_Percentage * amtTotalTaxable) / 100).toFixed(2));
    //   IGST_Amount = parseFloat(((IGST_Percentage * amtTotalTaxable) / 100).toFixed(2));

    //   totalGstAmount = CGST_Amount + SGST_Amount + UTGST_Amount + IGST_Amount;

    //   Compliance_Fee = parseFloat($('#Compliance_Fee').val());
    //   Compliance_Fee_Amount = parseFloat(((Compliance_Fee * amtTotalTaxable) / 100).toFixed(2));

    //   // Net Amount
    //   NetAmount = (amtTotalTaxable + totalGstAmount) - amtTotalDeduction;

    //   // Adjust Net Amount
    //   isNetAdjustmentPositve = $("#Net_Amt_NorP").is(':checked');
    //   vNetAdjAmount = parseFloat($("#Net_Amt_Adjusted").val());
    //   NetAmount = isNetAdjustmentPositve ? (NetAmount + vNetAdjAmount) : (NetAmount - vNetAdjAmount);

    //   // Update Amount Fields
    //   $('#Amount').val(amtCTC);
    //   $('#CGST_Amount').val(CGST_Amount);
    //   $('#SGST_Amount').val(SGST_Amount);
    //   $('#UTGST_Amount').val(UTGST_Amount);
    //   $('#IGST_Amount').val(IGST_Amount);

    //   amtTaxableAmount3 = amtTaxableAmount3.toFixed(2);
    //   $("#TaxableAmount3").val(amtTaxableAmount3);

    //   NetAmount = NetAmount.toFixed(2);
    //   //NetAmount = Math.round(NetAmount);
    //   $("#Net_Amount").val(NetAmount);

    //   $('#totalTaxableAmount').html(' Total: ' + amtTotalTaxable)
    //   $('#totalGstAmount').html(' Total: ' + totalGstAmount)
    //   $('#totalNonTaxableAmount').html(' Total: ' + amtTotalDeduction)
  }
 

}
