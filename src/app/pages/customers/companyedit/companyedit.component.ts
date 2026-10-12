import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { CompanyserviceService } from '../../../Service/CUSTOMER/companyservice.service';

@Component({
  selector: 'app-companyedit',
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
    MatPaginatorModule,
    MatTableModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    AlertpopupComponent,
    MatAutocompleteModule
  ],
  templateUrl: './companyedit.component.html',
  styleUrl: './companyedit.component.css'
})
export class CompanyeditComponent {

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
  reimbinvoiceFormat: any;
  getBankName: any;

  entityid: any;
  selectedEntityId: any;
  userdetail: any;
  companydata: any;
  companyBind: any;
  isLoading: boolean = false;

  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;

  isLoadingCities: boolean = false;
  cityname: any[] = [];
  filteredCities: any[] = [];
  searchTerm: string = '';
  selectedCity: any = null;

  @ViewChild('fileInput') fileInput: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyeditComponent>,
    private dialog: MatDialog,
    private company: CompanyserviceService,
    @Inject(MAT_DIALOG_DATA) public companyView: any,
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
    this.BindReimbInvoiceformats();
    this.BindGetbankname();
    this.loadcity();

    this.CompanyAddForm = this.fb.group({
      CompanyCode: [''],
      ComapnyName: ['', Validators.required],
      MISName: [''],
      BusinessUnitName: ['', Validators.required],
      BusinessUnitLocation: [''],
      Zone: [''],
      CompanyGroupCode: ['', Validators.required],
      CompanyGroupName: [''],
      WBSCode: ['', Validators.required],
      ClientSince: ['', Validators.required],
      ContractStartType: ['', Validators.required],
      ContractExpiryType: ['', Validators.required],
      Active: ['1'],
      FPayMode: ['1'],
      PayrollType: ['1', Validators.required],
      InsuranceApplicable: ['1'],
      InvoiceType: ['Single', Validators.required],
      MonthDays: ['1'],
      WorkDaysBasedOn: ['1'],
      CTC: ['1'],
      AttendanceCycleFrom: ['', Validators.required],
      AttendanceCycleTo: ['', Validators.required],
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
      Segment: ['', Validators.required],
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
      SapCustomerCode: ['', Validators.required],
      PanNo: [''],
      TanNo: [''],
      PayrollWithDecimal: ['', Validators.required],
      ServiceFeeWithDecimal: ['', Validators.required],
      PFCategory: ['', Validators.required],
      Vertial: [0],
      IsOneTouchInvoicing: [0],
      IsInvoicePoBased: [0],
      ISESISplit: [0],
      CompanyType: ['', Validators.required],
      ReimbPayment: ['', Validators.required],
      BankAdvice: ['', Validators.required],
      ServiceChargeClubbing: [0],
      DGPSF: [0, Validators.required],
      Sector: ['', Validators.required],
      BillingModel: [0],
      DigitalPlatformConsent: ['', Validators.required],
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
      EffectiveDate: ['', Validators.required],
      ReimbursementDate: [''],
      ManagementMIS: [''],
      BankName: ['', Validators.required],
      AccountNo: ['', Validators.required],
      SwiftCode: ['', Validators.required],
      BankAddress: ['', Validators.required],
      City: [''],
      State: [''],
      PinCode: [''],
      PhoneNo: [''],
      PTCode: [''],
      ServiceTax: [''],
      EmailId: [''],
      CertificateNo: [''],
      FaxNo: [''],
      Website: [''],
      Address: [''],
      ESICode: [''],
      Portal_Type: [''],
      weekday_type: [''],
      Weekday_Value: [''],
      Weekday_Formula: [''],
      Nightshift_type: [''],
      Nightshift_Value: [''],
      Nightshift_Formula: [''],
      OT_weekend_type: [''],
      Weekend_Value: [''],
      Weekend_Formula: [''],
      Holiday_type: [''],
      Holiday_Value: [''],
      Holiday_Formula: [''],
      adhoc_service_fee: [''],
      adhoc_service_formula: ['']
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

    this.BindCompanyId();
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
      next: res => {
        this.getBankName = res.Data.data?.getBankName;

        if (this.companydata?.Bank_Id) {
          this.CompanyAddForm.patchValue({
            BankName: this.resolveBankOptionValue(this.companydata.Bank_Id)
          });
        }
      }
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

  formatDate(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'number' && value < 100000) return '';

    // If already in dd/MM/yyyy, convert to ISO
    if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [dd, mm, yyyy] = value.split('/');
      return `${yyyy}-${mm}-${dd}`;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  showAlertPopup(message: string, subMessage = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }
  resolveBankOptionValue(bankId: any): string {
    if (!bankId || !this.getBankName) return '';
    const match = this.getBankName.find((b: any) =>
      String(b.value).split('|')[0] === String(bankId)
    );
    return match ? match.value : '';
  }
  BindCompanyId() {
    this.isLoading = true;
    const companyId = this.companyView.CompanyID;
    const companyCode = this.companyView.companyCode;

    this.company.viewCompanyDetails(companyId).subscribe({
      next: res => {
        this.isLoading = false;
        const table = res?.Data?.data?.Table0;
        const table3 = res?.Data?.data?.Table3;

        if (!table || table.length === 0) {
          alert("No data found for the given Company ID.");
          return;
        }

        this.companydata = table[0];
        this.companyBind = table3;

        this.CompanyAddForm.patchValue({
          CompanyCode: companyCode,
          ComapnyName: this.companydata.Client_Id,
          MISName: this.companydata.Mis_Name,
          BusinessUnitName: String(this.companydata.Business_Unit_Name_Id),
          BusinessUnitLocation: this.companydata.Business_Unit_Location_Id,
          Zone: this.companydata.Zone_Tagging,
          CompanyGroupCode: this.companydata.CompanyGroupCode,
          CompanyGroupName: this.companydata.CompanyGroupName,
          PayrollType: this.companydata.Payroll_Type === true ? '1' : '0',
          WBSCode: this.companydata.SAP_Code,
          ClientSince: this.formatDate(this.companydata.Client_Since),
          ContractStartType: this.formatDate(this.companydata.Contract_Start_Date),
          ContractExpiryType: this.formatDate(this.companydata.Contract_End_Date),
          Active: this.companydata.Company_Active,
          FPayMode: this.companydata.Is_Zip_Documents,
          InvoiceType: this.companydata.Invoicing_Type === true ? 'Multiple' : 'Single',
          InsuranceApplicable: this.companydata.Is_Insurance_Applicable,
          POWiseBatch: this.companydata.Is_PO_Wise_Batch,
          AttendanceCycleFrom: this.companydata.Attendance_Cycle_From,
          AttendanceCycleTo: this.companydata.Attendance_Cycle_To,
          WorkDaysBasedOn: this.companydata.Work_Days_Based_On,
          CTC: this.companydata.CTC,
          IsNewJoinee: this.companydata.IsNewJoinee,
          MonthDays: this.companydata.Month_Days,
          BankName: this.resolveBankOptionValue(this.companydata.Bank_Id), OnboardingCategory: this.companydata.OnBoarding_Category,
          OnboardingCharges: this.companydata.Absorption_Fee,
          InedgeCategory: this.companydata.InEdge_Category,
          InedgeCharges: this.companydata.Inedge_charges,
          InedgeChargesValue: this.companydata.Inedge_charges_Criteria_Type,
          IncentiveType: this.companydata.Incentive_Type,
          QdemyCharges: this.companydata.Qdemy_charges,
          QdemyChargesValue: Number(this.companyBind?.QDemyFee_Type_Id),
          POApplicable: this.companydata.Is_PO_Applicable === true ? '1' : '0',
          TechSubscriptionCharges: this.companydata.TechSubscriptionCharges,
          TechSubscriptionChargesvalue: this.companydata.Tech_Subscription_Charges_Criteria_Type,
          FDuesBasedon: this.companydata.Dues_Based_On,
          SourcingOBApplicable: this.companydata.Sourcing_Fee_Criteria_Type,
          InvoiceFormats: this.companydata.Invoice_Format,
          Insurance: this.companydata.Insurance_Amount,
          ReimbInvoiceFormat: this.companydata.ReimbInvoiceFormat_Id,
          PayslipFormats: this.companydata.Portal_Payslip_Format,
          BillingType: this.companydata.Billing_Type,
          Modeofpayment: this.companydata.Mode_Of_Payment,
          PortalPayslipFormat: this.companydata.Portal_Payslip_Format,
          Incharge: this.companydata.Incharge,
          RoundOffApplicable: this.companydata.Is_RoundOff_Applicable,
          TAT: this.companydata.TAT,

          // FIXED DATE BINDINGS
          ValidDate: this.formatDate(this.companydata.service_tax_date),
          EffectiveDate: this.formatDate(this.companydata.Effective_Date),      // was missing
          ReimbursementDate: this.formatDate(this.companydata.Reimbursement_Date), // was missing
          IncentiveDate: this.formatDate(this.companydata.Incentive_Date),      // number → date string
          ManagementMIS: this.companydata.Management_MIS === 'Invalid date'
            ? ''
            : this.formatDate(this.companydata.Management_MIS),                 // string "SAMSUNG..." → convert only if valid date

          Deviation: this.companydata.Deviation,
          SalarySMS: this.companydata.Salary_SMS,
          SalesPerson: this.companydata.Sales_Person,
          BranchLocation: this.companydata.Branch_Location,
          ProfitCenterCode: this.companydata.Profit_Center_Code,
          Particulars: this.companydata.Particulars,
          SapCustomerCode: this.companydata.Sap_Customer_Code,
          IsNonInvoice: this.companydata.Is_NonInvoice,
          HeaderFooter: this.companydata.IsHeaderFooter,
          MinimumWagesApplicability: this.companydata.Minimum_Wages,
          WorkingDaysServiceFee: this.companydata.IsExtraWorkingDaysServiceFee,
          IsBonusPayThroughFF: this.companydata.IsBonusPayThroughFF,
          AttendanceInputwithLeave: this.companydata.AttendanceInputWithLeave,
          ManagementMISDate: this.companydata.Management_MIS,
          PFCode: this.companydata.PfCode_Id,
          PayrollWithDecimal: this.companydata.PayrollWithDecimalId,
          IsDecimal: this.companydata.IsDecimal,
          CompanyType: this.companydata.CompanyType,
          ServiceFeeWithDecimal: this.companydata.ServiceFeeWithDecimalId,
          ManualNewJoinee: this.companydata.Manual_NewJoinee,
          ReimbPayment: this.companydata.ReimbPaymentId,
          Vertial: this.companydata.Vertical_Id,
          DigitalPlatformConsent: this.companydata.DigitalPlatformConsent,
          IsProforma: this.companydata.IsProforma,
          IsOneTouchInvoicing: this.companydata.IsOneTouchInvoicing,
          WorkingHours: this.companydata.WorkingHours1,
          IsSignature: this.companydata.IsSignature,
          IsInvoicePoBased: this.companydata.IsInvoicePoBased,
          Is40BillingModel: this.companydata.Is40BillingModel,
          IsCurrencyConversion: this.companydata.Is_Conversion,
          DGPSF: this.companydata.DGPSF,
          Sector: this.companydata.Sector,
          ReimbursementType: this.companydata.ReimbursementType,
          Segment: this.companydata.Segment_Id,
          SubSegment: this.companydata.SubSegment_Id,
          BankAdvice: this.companydata.BankAdviceId,
          ServiceChargeClubbing: this.companydata.ServiceChargeClubbing,
          BillingModel: this.companydata.Is40BillingModel,
          weekday_type: String(this.companydata.OT_WEEK_DAY_TYPE),
          Nightshift_type: String(this.companydata.OT_NIGHT_SHIFT_TYPE),
          OT_weekend_type: String(this.companydata.OT_WEEKEND_TYPE),
          Holiday_type: String(this.companydata.OT_HOLIDAY_TYPE),
          adhoc_service_fee: this.companydata.Adhoc_Service_Fee,
          adhoc_service_formula: this.companydata.Adhoc_Service_Formula,
          PFCategory: this.companydata.PfCategoryId
        });

        this.CompanyAddForm.patchValue({
          Weekend_Value: this.companydata.OT_WEEKEND_VLAUE,
          Weekend_Formula: this.companydata.OT_WEEKEND_FORMULA,
          Weekday_Value: this.companydata.OT_WEEK_DAY_VLAUE,
          Weekday_Formula: this.companydata.OT_WEEK_DAY_FORMULA,
          Nightshift_Value: this.companydata.OT_NIGHT_SHIFT_VLAUE,
          Nightshift_Formula: this.companydata.OT_NIGHT_SHIFT_FORMULA,
          Holiday_Value: this.companydata.OT_HOLIDAY_VLAUE,
          Holiday_Formula: this.companydata.OT_HOLIDAY_FORMULA
        });

        this.OnEntitychange({ target: { value: this.companydata.Business_Unit_Name_Id } });

        const bankValue = this.resolveBankOptionValue(this.companydata.Bank_Id);
        if (bankValue) {
          this.ongetBankChange({ target: { value: bankValue } });
        } else {
          this.CompanyAddForm.patchValue({
            AccountNo: this.companydata.Account_Number ?? '',
            SwiftCode: this.companydata.IFSC_Code ?? '',
            BankAddress: this.companydata.Bank_Address ?? ''
          });
        }
      },
      error: err => {
        this.isLoading = false;
        alert("Error fetching company details.");
      }
    });
  }
  toApiDate(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;

    const d = new Date(value);
    if (isNaN(d.getTime())) return '';

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  private boolToStr(value: any): string {
    if (value === true || value === 'true' || value === '1' || value === 1) return '1';
    return '0';
  }
  updateCompany() {
    if (this.CompanyAddForm.invalid) {
      this.CompanyAddForm.markAllAsTouched();

      const invalidFields: any[] = [];
      Object.keys(this.CompanyAddForm.controls).forEach(key => {
        const control = this.CompanyAddForm.get(key);
        if (control && control.invalid) {
          invalidFields.push({
            field: key,
            value: control.value,
            errors: control.errors
          });
        }
      });

      console.log('❌ INVALID FIELDS:', invalidFields);
      console.table(invalidFields.map(f => ({
        Field: f.field,
        Value: f.value,
        Errors: JSON.stringify(f.errors)
      })));

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
      mode: 'UPDATE',
      CreatedBy: String(this.userdetail?.user_Id ?? '0'),
      companyrequest: {
        Company_Id: String(this.companyView?.CompanyID ?? ''),
        Company_Contract_Id: String(this.companydata?.Company_Contract_id ?? '0'),
        Client_Id: Number(f?.ComapnyName ?? 0),
        Financial_Year_Id: 0,
        Client_Since: this.toApiDate(f?.ClientSince) || '',
        Company_Active: Number(f?.Active ?? 0),
        Is_Zip_Documents: 0,
        Payroll_Type: Number(f?.PayrollType ?? 0),
        Invoicing_Type: f?.InvoiceType === 'Multiple' ? 1 : 0,
        Investment_Block_Date: this.toApiDate(f?.ValidDate) || '',
        Business_Unit_Name_Id: String(f?.BusinessUnitName ?? '0'),
        Month_Days: this.boolToStr(f?.MonthDays),
        Salary_Fix_Days: '0',
        Business_Unit_Location_Id: String(f?.BusinessUnitLocation ?? '0'),
        Attendance_Cycle_From: String(f?.AttendanceCycleFrom ?? '0'),
        Attendance_Cycle_To: String(f?.AttendanceCycleTo ?? '0'),
        Is_PF_Remittance: '0',
        Input_Date: '1',
        Output_Date: '2',
        Work_Days_Based_On: this.boolToStr(f?.WorkDaysBasedOn),
        CTC: this.boolToStr(f?.CTC),
        Sourcing_Fee_Criteria_Type: '0',
        Sourcing_Fee: this.boolToStr(f?.SourcingOBApplicable),
        Absorption_Fee_Criteria_Type: '0',
        Absorption_Fee: '0',
        Incentive_Type: String(f?.IncentiveType ?? '0'),
        Is_PO_Applicable: String(f?.POApplicable ?? '0'),
        Salary_SMS: this.boolToStr(f?.SalarySMS),
        Dues_Based_On: this.boolToStr(f?.FDuesBasedon),
        Is_Insurance_Applicable: this.boolToStr(f?.InsuranceApplicable),
        Invoice_Format: String(f?.InvoiceFormats ?? '0'),
        ReimbInvoiceFormat_Id: Number(f?.ReimbInvoiceFormat ?? 0),
        Segment_Id: String(f?.Segment ?? '0'),
        SubSegment_Id: String(f?.SubSegment ?? '0'),
        Payslip_Format: String(f?.PayslipFormats ?? '0'),
        Mode_Of_Payment: this.boolToStr(f?.Modeofpayment),
        TAT: String(f?.TAT ?? '0'),
        Billing_Type:Number(f?.billingType) ?? 0,
        Is_RoundOff_Applicable: String(f?.RoundOffApplicable ?? '0'),
        Deviation: this.boolToStr(f?.Deviation),
        Incharge: String(f?.Incharge ?? ''),
        Credit_Days_Upfront: '0',
        Customer_Type: '0',
        Incentive_Date: this.toApiDate(f?.IncentiveDate) || '',
        Service_Tax_Applicable: 0,
        Reimbursement_Type: String(f?.ReimbursementType ?? '0'),
        Salary_Transfer_Date: '0',
        Effective_Date: this.toApiDate(f?.EffectiveDate) || '',
        Sales_Person: String(f?.SalesPerson ?? ''),
        Branch_Location: String(f?.BranchLocation ?? ''),
        Reimbursement_Date: this.toApiDate(f?.ReimbursementDate) || '',
        SAP_Code: String(f?.SAP_Code ?? ''),
        Pin_Code: String(f?.PinCode ?? ''),
        Address: String(f?.Address ?? ''),
        Phone_Number: String(f?.PhoneNo ?? ''),
        PAN_Number: String(f?.PanNo ?? ''),
        TAN_Number: String(f?.TanNo ?? ''),
        Service_Tax_Number: String(f?.ServiceTax ?? ''),
        PF_Code: String(f?.PFCode ?? ''),
        ESI_Code: String(f?.ESICode ?? ''),
        PT_Code: String(f?.PTCode ?? ''),
        Email_Id: String(f?.EmailId ?? ''),
        Certificate_Number: String(f?.CertificateNo ?? ''),
        Fax_Number: String(f?.FaxNo ?? ''),
        Website_Name: String(f?.Website ?? ''),
        Wages: this.boolToStr(f?.MinimumWagesApplicability),
        Particulars: String(f?.Particulars ?? ''),
        Is_NonInvoice: this.boolToStr(f?.IsNonInvoice),
        Mis_Name: String(f?.MISName ?? ''),
        Zone_Tagging: String(f?.Zone ?? ''),
        IsHeaderFooter: this.boolToStr(f?.HeaderFooter),
        Sap_Customer_Code: String(f?.SapCustomerCode ?? ''),
        Profit_Center_Code: String(f?.ProfitCenterCode ?? ''),
        Inedge_charges: String(f?.InedgeCharges ?? '0'),
        Inedge_charges_Criteria_Type: this.boolToStr(f?.InedgeChargesValue),
        CompanyGroupCode: String(f?.CompanyGroupCode ?? '0'),
        OnBoarding_Category: String(f?.OnboardingCategory ?? '0'),
        InEdge_Category: String(f?.InedgeCategory ?? '0'),
        Is_PO_Wise_Batch: this.boolToStr(f?.POWiseBatch),
        IsBonusPayThroughFF: this.boolToStr(f?.IsBonusPayThroughFF),
        IsExtraWorkingDaysServiceFee: this.boolToStr(f?.WorkingDaysServiceFee),
        AttendanceInputWithLeave: this.boolToStr(f?.AttendanceInputwithLeave),
        Management_MIS: String(f?.ManagementMIS ?? ''),
        PfCode_Id: Number(f?.PFCode ?? 0),
        IsDecimal: this.boolToStr(f?.IsDecimal),
        IsProforma: this.boolToStr(f?.IsProforma),
        CompanyType: Number(f?.CompanyType ?? 1),
        Manual_NewJoinee: this.boolToStr(f?.ManualNewJoinee),
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
        Portal_Payslip_Format: String(f?.PortalPayslipFormat ?? '0'),
        IsNewJoinee: this.boolToStr(f?.IsNewJoinee),
        ReimbPaymentId: Number(f?.ReimbPayment ?? 0),
        PayrollWithDecimalId: Number(f?.PayrollWithDecimal ?? 0),
        PfCategoryId: Number(f?.PFCategory ?? 0),
        IsSignature: this.boolToStr(f?.IsSignature),
        ServiceFeeWithDecimalId: Number(f?.ServiceFeeWithDecimal ?? 0),
        Qdemy_charges: String(f?.QdemyCharges ?? '0'),
        IsCurrencyConversion: this.boolToStr(f?.IsCurrencyConversion),
        TechSubscriptionCharges: String(f?.TechSubscriptionCharges ?? '0'),
        Tech_Subscription_Charges_Criteria_Type: this.boolToStr(f?.TechSubscriptionChargesvalue),
        DigitalPlatformConsent: Number(f?.DigitalPlatformConsent ?? 0),
        DGPSF: Number(f?.DGPSF ?? 0),
        Vertical_Id: Number(f?.Vertial ?? 0),
        ServiceChargeClubbing: Number(f?.ServiceChargeClubbing ?? 0),
        IsOneTouchInvoicing: Number(f?.IsOneTouchInvoicing ?? 0),
        IsInvoicePoBased: Number(f?.IsInvoicePoBased ?? 0),
        IS_ESI_split: Number(f?.ISESISplit ?? 0),
        WorkingHours: Number(f?.WorkingHours ?? 0),
        Is40BillingModel: this.boolToStr(f?.Is40BillingModel),
        BillingCompanyId: Number(f?.BillingModel ?? 0),
        Contract_Start_Date: this.toApiDate(f?.ContractStartType) || '',
        Contract_End_Date: this.toApiDate(f?.ContractExpiryType) || '',
        Contract_File_Path: String(f?.UploadContract ?? ''),
        Contract_File_Name: '',
        Contract_Uploaded_File_Name: '',
        Service_Tax_Date: this.toApiDate(f?.ValidDate) || '',
        Service_Tax_File_Path: '',
        Service_Tax_File_Name: '',
        Service_Tax_Uploaded_File_Name: '',
        Bank_Id: String(bankId ?? '0'),
        IFSC_Code: String(f?.SwiftCode ?? ''),
        Account_Number: String(f?.AccountNo ?? ''),
        Bank_Address: String(f?.BankAddress ?? ''),
        BankAdviceId: String(f?.BankAdvice ?? '0'),
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
        Portal_Type: ''
      }
    };

    console.log('payload', JSON.stringify(payload));

    this.company.updateCompany(payload).subscribe({
      next: (res: any) => {
        const msg = res?.Data?.data?.Table0?.[0]?.Message
          || res?.Data?.message
          || 'Company updated successfully';
        this.showAlertPopup(msg);
        this.isLoading = false;
        this.onClose();
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


  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  triggerFileUploadServiceTax() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // --- Upload functionality here ---
    }
  }

  onFileSelectedServiceTax(event: any) {
    const file = event.target.files[0];
    if (file) {
      // --- Upload functionality here ---
    }
  }
}