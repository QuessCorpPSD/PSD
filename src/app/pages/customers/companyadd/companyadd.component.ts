import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CompanyserviceService } from '../../../Service/CUSTOMER/companyservice.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-companyadd',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatRadioModule,
    MatCheckboxModule,
    AlertpopupComponent,
    MatAutocompleteModule
  ],
  templateUrl: './companyadd.component.html',
  styleUrl: './companyadd.component.css'
})
export class CompanyaddComponent {

  CompanyAddForm!: FormGroup;

  companyName: any;
  groupCode: any;
  entityName: any;
  BankName: any;
  segmentName: any;
  subSegmentName: any;
  paywithDeciamal: any;
  companyType: any;
  servicefee: any;
  reimPayment: any;
  bankAdvice: any;
  serviceClubbing: any;
  billingModel: any;
  BusinessUnitLocation: any;
  invoiceFormat: any;
  pfCategory: any;
  vertical: any;

  selectedEntityId: any;
  userdetail: any;

  isLoading = false;
  popupMessage = '';
  popupSubMessage = '';
  showPopup = false;
  isLoadingCities: boolean = false;
  cityname: any[] = [];
  filteredCities: any[] = [];
  searchTerm: string = '';
  selectedCity: any = null;
  reimbinvoiceFormat: any;
  getBankName: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyaddComponent>,
    private dialog: MatDialog,
    private company: CompanyserviceService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.BindGetCompanyName();
    this.BindGetCompanyGroupCode();
    this.BindGetEntityName();
    this.BindBankName();
    this.BindSegment();
    this.BindSubSegment();
    this.BindPayWithDecimal();
    this.BindGetCompanyType();
    this.BindServicefeewithDecimal();
    this.BindRiembPayment();
    this.BindBankAdvice();
    this.BindServiceClubbing();
    this.BindBillingModel();
    this.Bindpfcategory();
    this.BindInvoiceformats();
    this.loadcity();
    this.BindReimbInvoiceformats();
    this.BindGetbankname();
    this.CompanyAddForm = this.fb.group({
      CompanyCode: [''],
      ComapnyName: ['', Validators.required],
      MISName: [''],
      BusinessUnitName: ['', Validators.required],
      BusinessUnitLocation: [''],
      Zone: [''],
      CompanyGroupCode: [''],
      CompanyGroupName: [''],
      WBSCode: ['', Validators.required],
      ClientSince: ['', Validators.required],
      ContractStartDate: ['', Validators.required],
      ContractExpiryDate: ['', Validators.required],
      Active: ['1'],
      FPayMode: ['1'],
      PayrollType: ['1', Validators.required],
      InsuranceApplicable: ['1'],
      InvoiceType: ['Single', Validators.required],
      UploadContract: [null],
      UploadGST: [null],
      MonthDays: ['1'],
      WorkDaysBasedOn: ['1'],
      AttendanceCycleFrom: ['', Validators.required],
      AttendanceCycleTo: ['', Validators.required],
      CTC: ['1'],
      OnboardingCategory: [''],
      InedgeCategory: [''],
      IncentiveType: [''],
      POApplicable: ['1'],
      POWiseBatch: ['0'],
      FDuesBasedon: ['1'],
      IsNonInvoice: ['0'],
      SourcingOBApplicable: ['0'],
      Insurance: ['1'],
      SalarySMS: ['1'],
      Deviation: ['0'],
      RoundOffApplicable: ['0'],
      IncentiveDate: [''],
      OnboardingChargesValue: ['1'],
      OnboardingCharges: [''],
      InedgeChargesValue: ['1'],
      InedgeCharges: [''],
      QdemyChargesValue: ['1'],
      QdemyCharges: [''],
      TechSubscriptionChargesvalue: ['1'],
      TechSubscriptionCharges: [''],
      InvoiceFormats: [''],
      Segment: [''],
      SubSegment: [''],
      Modeofpayment: ['0'],
      ReimbInvoiceFormat: [0],
      PayslipFormats: [''],
      PortalPayslipFormat: [''],
      TAT: [''],
      ReimbursementType: [''],
      SalesPerson: [''],
      BranchLocation: [''],
      ProfitCenterCode: [''],
      Particulars: [''],
      SapCustomerCode: [''],
      PanNo: [''],
      TanNo: [''],
      PayrollWithDecimal: [''],
      ServiceFeeWithDecimal: [''],
      PFCategory: [''],
      Vertial: [0],
      IsOneTouchInvoicing: [0],
      IsInvoicePoBased: [0],
      ISESISplit: [0],
      CompanyType: [''],
      ReimbPayment: [''],
      BankAdvice: [''],
      ServiceChargeClubbing: [0],
      DGPSF: [0],
      Sector: [''],
      BillingModel: [0],
      DigitalPlatformConsent: [''],
      WorkingHours: [0],
      IsNewJoinee: [true],
      HeaderFooter: [false],
      IsBonusPayThroughFF: [false],
      AttendanceInputwithLeave: [false],
      MinimumWagesApplicability: [true],
      WorkingDaysServiceFee: [false],
      IsDecimal: [false],
      ManualNewJoinee: [false],
      IsProforma: [false],
      IsSignature: [false],
      IsCurrencyConversion: [false],
      Is40BillingModel: [false],
      billingType: [''],
      Incharge: [''],
      PFCode: [''],
      ValidDate: [''],
      EffectiveDate: [''],
      ReimbursementDate: [''],
      ManagementMIS: [''],
      BankName: ['', Validators.required],
      AccountNo: ['', Validators.required],
      SwiftCode: ['', Validators.required],
      BankAddress: ['', Validators.required],
      City: ['', Validators.required],
      State: [''],
      PinCode: ['', Validators.required],
      PhoneNo: [''],
      PTCode: [''],
      ServiceTax: [''],
      EmailId: [''],
      CertificateNo: [''],
      FaxNo: [''],
      Website: [''],
      Address: ['', Validators.required],
      ESICode: ['']
    });

    this.CompanyAddForm.get('CompanyGroupCode')?.valueChanges.subscribe(code => {
      const selectedGroup = this.groupCode?.find((g: any) => g.value === code);
      this.CompanyAddForm.patchValue({
        CompanyGroupName: selectedGroup ? selectedGroup.name : ''
      });
    });

    this.CompanyAddForm.get('CompanyGroupName')?.disable();
    this.CompanyAddForm.get('CompanyCode')?.disable();
    this.CompanyAddForm.get('AccountNo')?.disable();
    this.CompanyAddForm.get('SwiftCode')?.disable();
    this.CompanyAddForm.get('BankAddress')?.disable();

    this.CompanyAddForm.get('InvoiceType')?.valueChanges.subscribe(value => {
      const cityControl = this.CompanyAddForm.get('City');
      const pinCodeControl = this.CompanyAddForm.get('PinCode');
      const addressControl = this.CompanyAddForm.get('Address');
      if (value === 'Single') {
        cityControl?.setValidators([Validators.required]);
        pinCodeControl?.setValidators([Validators.required]);
        addressControl?.setValidators([Validators.required]);
      } else {
        cityControl?.clearValidators();
        pinCodeControl?.clearValidators();
        addressControl?.clearValidators();
      }
      cityControl?.updateValueAndValidity();
      pinCodeControl?.updateValueAndValidity();
      addressControl?.updateValueAndValidity();
    });

    const initialInvoiceType = this.CompanyAddForm.get('InvoiceType')?.value;
    if (initialInvoiceType === 'Single') {
      this.CompanyAddForm.get('City')?.setValidators([Validators.required]);
      this.CompanyAddForm.get('PinCode')?.setValidators([Validators.required]);
      this.CompanyAddForm.get('Address')?.setValidators([Validators.required]);
    }

  }
  loadcity() {
    this.isLoadingCities = true;
    this.company.getcity().subscribe({
      next: (res) => {
        this.cityname = res.Data.data?.Table0;
        this.isLoadingCities = false;
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        this.isLoadingCities = false;
      }
    });
  }

  onCitySearch(event: any): void {
    const value = event.target.value.trim();
    this.searchTerm = value;
    if (value.length < 3) {
      this.filteredCities = [];
      if (value.length === 0) {
        this.CompanyAddForm.patchValue({ State: '' });
        this.selectedCity = null;
      }
      return;
    }
    this.filterCities(value);
  }

  filterCities(searchText: string): void {
    if (!this.cityname || this.cityname.length === 0) {
      this.loadcity();
      return;
    }
    this.isLoadingCities = true;
    this.filteredCities = this.cityname.filter((city: any) =>
      city.CityName?.toLowerCase().includes(searchText.toLowerCase()) ||
      city.CityCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      city.StateName?.toLowerCase().includes(searchText.toLowerCase())
    );
    if (this.filteredCities.length > 20) {
      this.filteredCities = this.filteredCities.slice(0, 20);
    }
    this.isLoadingCities = false;
  }

  onCitySelected(event: any): void {
    const selectedCityName = event.option.value;
    this.selectedCity = this.filteredCities.find(
      (city: any) => city.CityName === selectedCityName
    );
    if (this.selectedCity) {
      this.CompanyAddForm.patchValue({
        State: this.selectedCity.StateName || this.selectedCity.State,
        City: this.selectedCity.CityName
      });
    }
  }

  BindGetCompanyName() {
    this.company.getCompanySearch().subscribe({
      next: (res: any) => { this.companyName = res?.Data?.data?.Table0; }
    });
  }

  BindGetbankname() {
    this.company.getCompanyName().subscribe({
      next: res => { this.getBankName = res.Data.data?.getBankName }
    });
  }
  ongetBankChange(event: any) {
    const selectedValue = event.target.value;
    if (!selectedValue) {
      this.CompanyAddForm.patchValue({
        AccountNo: '',
        SwiftCode: '',
        BankAddress: ''
      });
      return;
    }
    const parts = selectedValue.split('|');
    if (parts.length === 4) {
      this.CompanyAddForm.patchValue({
        AccountNo: parts[1] || '',
        SwiftCode: parts[2] || '',
        BankAddress: parts[3] || ''
      });
    }
  }

  BindGetCity() {
    this.company.getCompanySearch().subscribe({
      next: (res: any) => { this.companyName = res?.Data?.data?.Table0; }
    });
  }

  BindGetCompanyGroupCode() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.groupCode = res?.Data?.data?.getCompanyGroupCode; }
    });
  }
  BindInvoiceformats() {
    this.company.getInvoiceformats().subscribe({
      next: (res: any) => { this.invoiceFormat = res?.Data?.data?.Table0; }
    });
  }
  BindReimbInvoiceformats() {
    this.company.getReimInvoiceformats().subscribe({
      next: (res: any) => { this.reimbinvoiceFormat = res?.Data?.data?.Table0; }
    });
  }

  BindGetEntityName() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.entityName = res?.Data?.data?.getEntityName; }
    });
  }

  OnEntitychange(event: any) {
    this.selectedEntityId = event.target.value;
    if (this.selectedEntityId) {
      this.BindBusinessUnitLocation();
    }
  }

  BindBankName() {
    this.company.getBankName().subscribe({
      next: (res: any) => { this.BankName = res?.Data?.data?.Table0; }
    });
  }

  onBankChange(event: any) {
    const selectedId = Number(event.target.value);
    const bank = this.BankName?.find((b: any) => b.Bank_Id === selectedId);

    if (bank) {
      this.CompanyAddForm.patchValue({
        AccountNo: bank.Account_No,
        SwiftCode: bank.Swift_Code,
        BankAddress: bank.Address
      });
    }
  }

  BindSegment() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.segmentName = res?.Data?.data?.getSegmentName; }
    });
  }

  BindSubSegment() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.subSegmentName = res?.Data?.data?.getSubSegmentName; }
    });
  }

  BindPayWithDecimal() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.paywithDeciamal = res?.Data?.data?.getPayrollWithDecimal; }
    });
  }

  BindGetCompanyType() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.companyType = res?.Data?.data?.getCompanyType; }
    });
  }

  BindServicefeewithDecimal() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.servicefee = res?.Data?.data?.getServiceFeeWithDecimal; }
    });
  }

  BindRiembPayment() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.reimPayment = res?.Data?.data?.getReimbPayment; }
    });
  }

  Bindpfcategory() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.pfCategory = res?.Data?.data?.getPfCategory; }
    });
  }



  BindBankAdvice() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.bankAdvice = res?.Data?.data?.getBankAdvice; }
    });
  }

  BindServiceClubbing() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.serviceClubbing = res?.Data?.data?.getServiceChargeClubbing; }
    });
  }

  BindBillingModel() {
    this.company.getCompanyName().subscribe({
      next: (res: any) => { this.billingModel = res?.Data?.data?.getBillingCompanyCodeList; }
    });
  }

  BindBusinessUnitLocation() {
    this.company.getBusinessUnitLoation(this.selectedEntityId).subscribe({
      next: (res: any) => { this.BusinessUnitLocation = res?.Data?.data?.Table0; }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  showAlertPopup(message: string, subMessage = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

onSubmit() {
  if (this.CompanyAddForm.invalid) {
    this.CompanyAddForm.markAllAsTouched();
    alert('Please fill all required fields marked with *');
    const firstInvalid = document.querySelector('.ng-invalid[formControlName]');
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  this.isLoading = true;
  const f = this.CompanyAddForm.getRawValue();

  let bankId = f?.BankName?.toString() ?? '';
  if (bankId.includes('|')) bankId = bankId.split('|')[0];

  const payload = {
    mode: 'Add',
    CreatedBy: this.userdetail?.user_Id?.toString() ?? '0',
    companyrequest: {
      Client_Id: f?.ComapnyName ?? 0,
      Financial_Year_Id: 0,
      Client_Since: this.formatDate(f?.ClientSince),
      Company_Active: Number(f?.Active ?? 1),
      Is_Zip_Documents: 0,
      Payroll_Type: Number(f?.PayrollType ?? 0),
      Invoicing_Type: f?.InvoiceType === 'Single' ? 1 : 0,
      Investment_Block_Date: this.formatDate(f?.ValidDate),
      Business_Unit_Name_Id: f?.BusinessUnitName ?? 0,
      Month_Days: f?.MonthDays || '0',
      Salary_Fix_Days: '0',
      Business_Unit_Location_Id: f?.BusinessUnitLocation || '0',
      Attendance_Cycle_From: f?.AttendanceCycleFrom || '0',
      Attendance_Cycle_To: f?.AttendanceCycleTo || '0',
      Is_PF_Remittance: '0',
      Input_Date: '1',
      Output_Date: '2',
      Work_Days_Based_On: f?.WorkDaysBasedOn || '0',
      CTC: f?.CTC || '0',
      Sourcing_Fee_Criteria_Type: '0',
      Sourcing_Fee: f?.SourcingOBApplicable || '0',
      Absorption_Fee_Criteria_Type: '0',
      Absorption_Fee: '0',
      Incentive_Type: f?.IncentiveType || '0',
      Is_PO_Applicable: f?.POApplicable || '0',
      Salary_SMS: f?.SalarySMS || '0',
      Dues_Based_On: f?.FDuesBasedon || '0',
      Is_Insurance_Applicable: f?.InsuranceApplicable || '0',
      Invoice_Format: f?.InvoiceFormats || '0',
      ReimbInvoiceFormat_Id: Number(f?.ReimbInvoiceFormat ?? 0),
      Segment_Id: f?.Segment || '0',
      SubSegment_Id: f?.SubSegment || '0',
      Payslip_Format: f?.PayslipFormats || '0',
      Mode_Of_Payment: f?.Modeofpayment || '0',
      TAT: f?.TAT || '0',
      Billing_Type: f?.billingType || '0',
      Is_RoundOff_Applicable: f?.RoundOffApplicable || '0',
      Deviation: f?.Deviation || '0',
      Incharge: f?.Incharge ?? '',
      Credit_Days_Upfront: '0',
      Customer_Type: '0',
      Incentive_Date: this.formatDate(f?.IncentiveDate),
      Service_Tax_Applicable: 0,
      Reimbursement_Type: f?.ReimbursementType || '0',
      Salary_Transfer_Date: '0',
      Effective_Date: this.formatDate(f?.EffectiveDate),
      Sales_Person: f?.SalesPerson ?? '',
      Branch_Location: f?.BranchLocation ?? '',
      Reimbursement_Date: this.formatDate(f?.ReimbursementDate),
      SAP_Code: f?.SAP_Code ?? '',
      Pin_Code: f?.PinCode ?? '',
      Address: f?.Address ?? '',
      Phone_Number: f?.PhoneNo ?? '',
      PAN_Number: f?.PanNo ?? '',
      TAN_Number: f?.TanNo ?? '',
      Service_Tax_Number: f?.ServiceTax ?? '',
      PF_Code: f.PFCode || '',
      ESI_Code: f?.ESICode ?? '',
      PT_Code: f?.PTCode ?? '',
      Email_Id: f?.EmailId ?? '',
      Certificate_Number: f?.CertificateNo ?? '',
      Fax_Number: f?.FaxNo ?? '',
      Website_Name: f?.Website ?? '',
      Wages: f?.MinimumWagesApplicability ? '1' : '0',
      Particulars: f?.Particulars ?? '',
      Is_NonInvoice: f?.IsNonInvoice || '0',
      Mis_Name: f?.MISName ?? '',
      Zone_Tagging: f?.Zone ?? '',
      IsHeaderFooter: f?.HeaderFooter ? '1' : '0',
      Sap_Customer_Code: f?.SapCustomerCode ?? '',
      Profit_Center_Code: f?.ProfitCenterCode ?? '',
      Inedge_charges: f?.InedgeCharges || '0',
      Inedge_charges_Criteria_Type: f?.InedgeChargesValue || '0',
      CompanyGroupCode: f?.CompanyGroupCode ?? '0',
      OnBoarding_Category: f?.OnboardingCategory || '0',
      InEdge_Category: f?.InedgeCategory || '0',
      Is_PO_Wise_Batch: f?.POWiseBatch || '0',
      IsBonusPayThroughFF: f?.IsBonusPayThroughFF ? 1 : 0,
      IsExtraWorkingDaysServiceFee: f?.WorkingDaysServiceFee ? 1 : 0,
      AttendanceInputWithLeave: f?.AttendanceInputwithLeave ? 1 : 0,
      Management_MIS: f?.ManagementMIS ?? '0',
      PfCode_Id: Number(f?.PFCode ?? 0),
      IsDecimal: f?.IsDecimal ? '1' : '0',
      IsProforma: f?.IsProforma ? '1' : '0',
      CompanyType: f?.CompanyType || '1',
      Manual_NewJoinee: f?.ManualNewJoinee ? '1' : '0',
      Invoice_Submission_Date: 0,
      Collection_Date: 0,
      PE_User_ID: '',
      PE_Name: '',
      PE_Email_Id: '',
      RM_User_ID: '',
      RM_Name: '',
      RM_Email_Id: '',
      Client_SPOC_Name: '',
      Client_SPOC_Email_Id: '',
      Client_SPOC_Mobile_No: '',
      Client_Escalation_Manager_Name: '',
      Client_Escalation_Manager_Email_Id: '',
      Client_Escalation_Manager_Mobile_No: '',
      Portal_Payslip_Format: f?.PortalPayslipFormat ?? '0',
      IsNewJoinee: f?.IsNewJoinee ? '1' : '0',
      ReimbPaymentId: Number(f?.ReimbPayment ?? 0),
      PayrollWithDecimalId: Number(f?.PayrollWithDecimal ?? 0),
      PfCategoryId: Number(f?.PFCategory ?? 0),
      IsSignature: f?.IsSignature ? 1 : 0,
      ServiceFeeWithDecimalId: Number(f?.ServiceFeeWithDecimal ?? 0),
      Qdemy_charges: f?.QdemyCharges || '0',
      IsCurrencyConversion: f?.IsCurrencyConversion ? 1 : 0,
      TechSubscriptionCharges: f?.TechSubscriptionCharges || '0',
      Tech_Subscription_Charges_Criteria_Type: f?.TechSubscriptionChargesvalue || '0',
      DigitalPlatformConsent: Number(f?.DigitalPlatformConsent ?? 0),
      DGPSF: Number(f?.DGPSF ?? 0),
      Vertical_Id: Number(f?.Vertial ?? 0),
      ServiceChargeClubbing: Number(f?.ServiceChargeClubbing ?? 0),
      IsOneTouchInvoicing: Number(f?.IsOneTouchInvoicing ?? 0),
      IsInvoicePoBased: Number(f?.IsInvoicePoBased ?? 0),
      IS_ESI_split: Number(f?.ISESISplit ?? 0),
      WorkingHours: Number(f?.WorkingHours ?? 0),
      Is40BillingModel: f?.Is40BillingModel ? 1 : 0,
      BillingCompanyId: Number(f?.BillingModel ?? 0),
      Contract_Start_Date: this.formatDate(f?.ContractStartDate),
      Contract_End_Date: this.formatDate(f?.ContractExpiryDate),
      Contract_File_Path: f?.UploadContract ?? '',
      Bank_Id: bankId,
      IFSC_Code: f?.SwiftCode ?? '',
      Account_Number: f?.AccountNo ?? '',
      Bank_Address: f?.BankAddress ?? '',
      BankAdviceId: f?.BankAdvice || '0',
      OT_WEEK_DAY_TYPE: 0,
      OT_WEEK_DAY_VLAUE: '',
      OT_WEEK_DAY_FORMULA: '',
      OT_NIGHT_SHIFT_TYPE: 0,
      OT_NIGHT_SHIFT_VLAUE: '',
      OT_NIGHT_SHIFT_FORMULA: '',
      OT_WEEKEND_TYPE: 0,
      OT_WEEKEND_VLAUE: '',
      OT_WEEKEND_FORMULA: '',
      OT_HOLIDAY_TYPE: 0,
      OT_HOLIDAY_VLAUE: '',
      OT_HOLIDAY_FORMULA: '',
      Adhoc_Service_Fee: '',
      Adhoc_Service_Formula: '',
      Portal_Type: '',
     
    }
  };

  this.company.createCompany(payload).subscribe({
    next: (res: any) => {
      const msg = res?.Data?.message ?? 'Company saved successfully';
      this.showAlertPopup(msg);
      this.isLoading = false;
      this.onClose();
      this.dialogRef.close('refresh');
    },
    error: (err: any) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}

  onClose() {
    this.dialogRef.close();
  }
}