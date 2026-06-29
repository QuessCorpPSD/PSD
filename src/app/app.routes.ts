import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { AuthGuard } from './Shared/auth-guard.service';
import { MasterComponent } from './layout/master/master.component';

import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { AssignmentComponent } from './pages/assignment/assignment.component';
import { SeverityComponent } from './pages/severity/severity.component';
import { AllotedLotComponent } from './pages/alloted-lot/alloted-lot.component';


import { UserMappingComponent } from './pages/admin/user-mapping/user-mapping.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChangepasswordComponent } from './pages/changepassword/changepassword.component';
import { BreakdetailComponent } from './pages/breakdetail/breakdetail.component';
import { BreakComponent } from './pages/employee/break/break.component';
import { RevokComponent } from './pages/assignment/revok/revok.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { InitiateComponent } from './pages/Invoice/initiate/initiate.component';
import { GstInvoiceComponent } from './pages/Invoice/gst-invoice/gst-invoice.component';
import { DraftInvoiceComponent } from './pages/Invoice/draft-invoice/draft-invoice.component';
import { LoginmasterComponent } from './layout/loginmaster/loginmaster.component';
import { DashComponent } from './pages/dash/dash.component';
import { UnauthendicationComponent } from './pages/unauthendication/unauthendication.component';

import { BillingubrComponent } from './pages/Reports/billingubr/billingubr.component';
import { CreditnotebalancereportComponent } from './pages/Reports/creditnotebalancereport/creditnotebalancereport.component';
import { EmployeeReportProcessComponent } from './pages/Reports/employee-report-process/employee-report-process.component';
import { IncrementReportComponent } from './pages/Reports/increment-report/increment-report.component';
import { InvoiceLeaveBalanceReportComponent } from './pages/Reports/invoice-leave-balance-report/invoice-leave-balance-report.component';
import { InvoiceReportComponent } from './pages/Reports/invoice-report/invoice-report.component';
import { LeaveBalanceReportComponent } from './pages/Reports/leave-balance-report/leave-balance-report.component';
import { NetpayreportComponent } from './pages/Reports/netpayreport/netpayreport.component';
import { OtherIncomeProcessReportComponent } from './pages/Reports/other-income-process-report/other-income-process-report.component';
import { OtherincomeentitywisereportComponent } from './pages/Reports/otherincomeentitywisereport/otherincomeentitywisereport.component';
import { OtherincomereportComponent } from './pages/Reports/otherincomereport/otherincomereport.component';
import { PayregisterentitywiseComponent } from './pages/Reports/payregisterentitywise/payregisterentitywise.component';
import { PayregisterunprocessedComponent } from './pages/Reports/payregisterunprocessed/payregisterunprocessed.component';
import { PayslipComponent } from './pages/Reports/payslip/payslip.component';
import { PoactiveinactivereportComponent } from './pages/Reports/poactiveinactivereport/poactiveinactivereport.component';
import { PobalancereportComponent } from './pages/Reports/pobalancereport/pobalancereport.component';
import { PoemployeereportComponent } from './pages/Reports/poemployeereport/poemployeereport.component';
import { PomonthwisereportComponent } from './pages/Reports/pomonthwisereport/pomonthwisereport.component';
import { QITSBillingReportComponent } from './pages/Reports/qits-billing-report/qits-billing-report.component';
import { ReportsComponent } from './pages/Reports/reports.component';
import { TimesheetReportComponent } from './pages/Reports/timesheet-report/timesheet-report.component';
//import { ReimbursementnavigationComponent } from './pages/Reimbursement/reimbursementnavigation/reimbursementnavigation.component';
import { ReimbursementLoanPreClosureComponent } from './pages/Reimbursement/reimbursement-loan-pre-closure/reimbursement-loan-pre-closure.component';
import { SeparationNavigationComponent } from './pages/Separation/separation-navigation/separation-navigation.component';
import { FandFattendenceComponent } from './pages/Separation/fand-fattendence/fand-fattendence.component';
import { FullfinalsettlementComponent } from './pages/Separation/fullfinalsettlement/fullfinalsettlement.component';
import { ReportComponent } from './pages/Reports/report/report.component';
import { BankmasterComponent } from './pages/GlobalMasters/bankmaster/bankmaster.component';
import { CityComponent } from './pages/GlobalMasters/city/city.component';
import { ComputationruleComponent } from './pages/GlobalMasters/computationrule/computationrule.component';
import { CPFslabDetailsComponent } from './pages/GlobalMasters/cpfslab-details/cpfslab-details.component';
import { EntityMasterComponent } from './pages/GlobalMasters/entity-master/entity-master.component';
import { ESIslabComponent } from './pages/GlobalMasters/esislab/esislab.component';
import { FormulaComponent } from './pages/GlobalMasters/formula/formula.component';
import { GlobalmasternavigationComponent } from './pages/GlobalMasters/globalmasternavigation/globalmasternavigation.component';
import { GSTComponent } from './pages/GlobalMasters/gst/gst.component';
import { InvoiceLegalEntityComponent } from './pages/GlobalMasters/invoice-legal-entity/invoice-legal-entity.component';
import { LFWSlabComponent } from './pages/GlobalMasters/lfwslab/lfwslab.component';
import { MaterialcodeComponent } from './pages/GlobalMasters/materialcode/materialcode.component';
import { PaycodesComponent } from './pages/GlobalMasters/paycodes/paycodes.component';
import { ProfessionaltaxComponent } from './pages/GlobalMasters/professionaltax/professionaltax.component';
import { ProvidentfundComponent } from './pages/GlobalMasters/providentfund/providentfund.component';
import { SDLslabDetailComponent } from './pages/GlobalMasters/sdlslab-detail/sdlslab-detail.component';
import { ShgslabdetailComponent } from './pages/GlobalMasters/shgslabdetail/shgslabdetail.component';
import { SiteMasterComponent } from './pages/GlobalMasters/site-master/site-master.component';
import { StatesComponent } from './pages/GlobalMasters/state/state.component';
import { TDSslabComponent } from './pages/GlobalMasters/tdsslab/tdsslab.component';
import { VendorComponent } from './pages/GlobalMasters/vendor/vendor.component';
import { ReimbursenavigationComponent } from './pages/Reimbursement/reimbursenavigation/reimbursenavigation.component';
import { LoanandadvanceComponent } from './pages/Reimbursement/loanandadvance/loanandadvance.component';
import { NavigationComponent } from './pages/Taxandsavings/navigation/navigation.component';
import { ChildreneducationallowanceComponent } from './pages/Taxandsavings/childreneducationallowance/childreneducationallowance.component';
import { HRAcalculationComponent } from './pages/Taxandsavings/hracalculation/hracalculation.component';
import { IncomeLossOnHousePropertyComponent } from './pages/Taxandsavings/income-loss-on-house-property/income-loss-on-house-property.component';
import { LtacalculationComponent } from './pages/Taxandsavings/ltacalculation/ltacalculation.component';
import { PreviousemploymenttaxdetailsComponent } from './pages/Taxandsavings/previousemploymenttaxdetails/previousemploymenttaxdetails.component';
import { TaxdeclationandactualComponent } from './pages/Taxandsavings/taxdeclationandactual/taxdeclationandactual.component';
import { ToolsnavigationComponent } from './pages/tools/toolsnavigation/toolsnavigation.component';
import { DynamicuploadComponent } from './pages/tools/dynamicupload/dynamicupload.component';
import { EmployeeComponent } from './common/employee/employee.component';
import { BandDetailsComponent } from './pages/customers/band-details/band-details.component';
import { CancelledinvoicerepositoryComponent } from './pages/customers/cancelledinvoicerepository/cancelledinvoicerepository.component';
import { ClientaddressComponent } from './pages/customers/clientaddress/clientaddress.component';
import { CompanyComponent } from './pages/customers/company/company.component';
import { CompanypaycodemappingComponent } from './pages/customers/companypaycodemapping/companypaycodemapping.component';
import { CorporatebankComponent } from './pages/customers/corporatebank/corporatebank.component';
import { CostCenterMappingComponent } from './pages/customers/cost-center-mapping/cost-center-mapping.component';
import { CustomernavigationComponent } from './pages/customers/customernavigation/customernavigation.component';
import { DepartmentComponent } from './pages/customers/department/department.component';
import { DesignationComponent } from './pages/customers/designation/designation.component';
import { ITcalenderComponent } from './pages/customers/itcalender/itcalender.component';
import { PayfrequencyComponent } from './pages/customers/payfrequency/payfrequency.component';
import { ServiceChargeComponent } from './pages/customers/ServiceChargeMaster/service-charge/service-charge.component';
import { VendorServiceChargeComponent } from './pages/customers/vendor-service-charge/vendor-service-charge.component';
import { AdminnavigationComponent } from './pages/admin/adminnavigation/adminnavigation.component';
import { CompanypermissionComponent } from './pages/admin/companypermission/companypermission.component';
import { PasswordunlockComponent } from './pages/admin/passwordunlock/passwordunlock.component';
import { PayperiodunlockComponent } from './pages/admin/payperiodunlock/payperiodunlock.component';
import { BillableDaysComponent } from './pages/Invoice/billable-days/billable-days.component';
import { BillingpayfrequencyComponent } from './pages/Invoice/billingpayfrequency/billingpayfrequency.component';
import { ClientbillablereportsdatewiseComponent } from './pages/Invoice/clientbillablereportsdatewise/clientbillablereportsdatewise.component';
import { CompanyinvoiceformatComponent } from './pages/Invoice/companyinvoiceformat/companyinvoiceformat.component';
import { CreditnoteComponent } from './pages/Invoice/creditnote/creditnote.component';
import { CreditnoteapproveComponent } from './pages/Invoice/creditnoteapprove/creditnoteapprove.component';
import { CreditnoteupdateComponent } from './pages/Invoice/creditnoteupdate/creditnoteupdate.component';
import { GstinvoiceComponent } from './pages/Invoice/gstinvoice/gstinvoice.component';
import { InvoiceCultureComponent } from './pages/Invoice/invoice-culture/invoice-culture.component';
import { InvoicenavigationComponent } from './pages/Invoice/invoicenavigation/invoicenavigation.component';
import { PerfomainvoiceComponent } from './pages/Invoice/perfomainvoice/perfomainvoice.component';
import { POInitiateComponent } from './pages/Invoice/poinitiate/poinitiate.component';
import { ProvisionalinvoiceComponent } from './pages/Invoice/provisionalinvoice/provisionalinvoice.component';

//import { ReimbrusementnavigationComponent } from './pages/reimbruements/reimbrusementnavigation/reimbrusementnavigation.component';
import { ReimbrusementComponent } from './pages/Reimbursement/reimbrusement/reimbrusement.component';

import { ETDSProcessnavigationComponent } from './pages/E-TDSProcess/e-tdsprocessnavigation/e-tdsprocessnavigation.component';
import { LegalEntityMappingComponent } from './pages/E-TDSProcess/legal-entity-mapping/legal-entity-mapping.component';

import { CompanyprovidedbenefitsComponent } from './pages/Taxandsavings/companyprovidedbenefits/companyprovidedbenefits.component';
import { GratuityComponent } from './pages/Taxandsavings/gratuity/gratuity.component';
import { IncreamentComponent } from './pages/Promotion/increament/increament.component';
import { PromotionNavigationComponent } from './pages/Promotion/promotion-navigation/promotion-navigation.component';
import { AllowReProcessComponent } from './pages/process/allow-re-process/allow-re-process.component';
import { ArrearAttendanceComponent } from './pages/process/arrear-attendance/arrear-attendance.component';
import { AttendanceComponent } from './pages/process/attendance/attendance.component';
import { AttendancebatchidUpdateComponent } from './pages/process/attendancebatchid-update/attendancebatchid-update.component';
import { FFprocessComponent } from './pages/process/ffprocess/ffprocess.component';
import { FNFRevokeComponent } from './pages/process/fnfrevoke/fnfrevoke.component';
import { ITAdjustmentComponent } from './pages/process/itadjustment/itadjustment.component';
import { LockpayperiodComponent } from './pages/process/lockpayperiod/lockpayperiod.component';
import { LOPAdjustmentsComponent } from './pages/process/lopadjustments/lopadjustments.component';
import { OneTimeReplacementComponent } from './pages/process/one-time-replacement/one-time-replacement.component';

import { PayProcessComponent } from './pages/process/pay-process/pay-process.component';
import { PayregisteruploadComponent } from './pages/process/payregisterupload/payregisterupload.component';
import { PaytransactionComponent } from './pages/process/paytransaction/paytransaction.component';
import { ProcessComponent } from './pages/process/process.component';
import { ReimbrusmentcalenderComponent } from './pages/process/reimbrusmentcalender/reimbrusmentcalender.component';
import { ReprocessComponent } from './pages/process/reprocess/reprocess.component';
import { UpfrontmatrixComponent } from './pages/upfrontprocess/upfrontmatrix/upfrontmatrix.component';
import { EmployeeComponents } from './pages/customers/employee/employee.component';
import { TaxRemittanceGenerationComponent } from './pages/E-TDSProcess/tax-remittance-generation/tax-remittance-generation.component';
import { TaxremittancedetailComponent } from './pages/E-TDSProcess/taxremittancedetail/taxremittancedetail.component';
import { BillingdashboardComponent } from './pages/Invoice/billingdashboard/billingdashboard.component';
import { EInvoiceComponent } from './pages/Invoice/einvoice/einvoice.component';
import { InputnavigationComponent } from './pages/inputaggregator/inputnavigation/inputnavigation.component';
import { InputaggregatorwithclientComponent } from './pages/inputaggregator/inputaggregatorwithclient/inputaggregatorwithclient.component';
import { InvoiceCancelComponent } from './pages/Invoice/invoicecancel/invoicecancel.component';
import { InputaggregatorattendanceComponent } from './pages/inputaggregator/inputaggregatorattendance/inputaggregatorattendance.component';
import { LeavetypemasterComponent } from './pages/inputaggregator/leavetypemaster/leavetypemaster.component';
import { LeavetypemastermappingComponent } from './pages/inputaggregator/leavetypemastermapping/leavetypemastermapping.component';
import { InvoiceCultureAddpoComponent } from './pages/Invoice/invoice-culture-addpo/invoice-culture-addpo.component';
import { OtherincomeComponent } from './pages/Invoice/otherincome/otherincome.component';
import { VendorclientaddressComponent } from './pages/customers/vendorclientaddress/vendorclientaddress.component';
import { MulticommercialComponent } from './pages/GlobalMasters/multicommercial/multicommercial.component';
import { ClientgstlistComponent } from './pages/customers/clientgstlist/clientgstlist.component';
import { VendorclientgstComponent } from './pages/customers/vendorclientgst/vendorclientgst.component';
import { SEZRepositoryComponent } from './pages/Invoice/sezrepository/sezrepository.component';
import { GrossmarginComponent } from './pages/Reports/grossmargin/grossmargin.component';
import { SEZRepositoryApprovalComponent } from './pages/Invoice/sezrepository-approval/sezrepository-approval.component';
import { SalaryReleaseMenuComponent } from './pages/SalaryReleaseNew/salary-release-menu/salary-release-menu.component';
import { BatchcreationprocessComponent } from './pages/SalaryReleaseNew/batchcreationprocess/batchcreationprocess.component';
import { SalaryReleaseProcessComponent } from './pages/SalaryReleaseNew/salary-release-process/salary-release-process.component';

import { SalaryReleaseStatusComponent } from './pages/SalaryReleaseNew/salary-release-status/salary-release-status.component';
import { DownloadbatchComponent } from './pages/SalaryReleaseNew/downloadbatch/downloadbatch.component';
import { SalaryReleaseApproveComponent } from './pages/SalaryReleaseNew/salary-release-approve/salary-release-approve.component';
import { AdvanceUtilizationReportComponent } from './pages/Reports/advance-utilization-report/advance-utilization-report.component';
import { SezcertificateuploadComponent } from './pages/customers/sezcertificateupload/sezcertificateupload.component';
import { BankInvoiceNEFTCultureComponent } from './pages/SalaryReleaseNew/bank-invoice-neftculture/bank-invoice-neftculture.component';
import { InvoiceBatchConsolidationReportComponent } from './pages/SalaryReleaseNew/invoice-batch-consolidation-report/invoice-batch-consolidation-report.component';
import { ReIssueProcessApproveComponent } from './pages/SalaryReleaseNew/re-issue-process-approve/re-issue-process-approve.component';
import { ReIssueProcessReportComponent } from './pages/SalaryReleaseNew/re-issue-process-report/re-issue-process-report.component';
import { BanknonvoicenavigationComponent } from './pages/banknonvoice/banknonvoicenavigation/banknonvoicenavigation.component';
import { BankneftcultureComponent } from './pages/banknonvoice/bankneftculture/bankneftculture.component';
import { FinanceholdreportComponent } from './pages/banknonvoice/financeholdreport/financeholdreport.component';
import { DownloadbatchbanknonvoiceComponent } from './pages/banknonvoice/downloadbatchbanknonvoice/downloadbatchbanknonvoice.component';
import { GratuitydownloadbatchComponent } from './pages/banknonvoice/gratuitydownloadbatch/gratuitydownloadbatch.component';
import { SalaryreleasestatusComponent } from './pages/banknonvoice/salaryreleasestatus/salaryreleasestatus.component';
import { PartialsalaryreleaseComponent } from './pages/banknonvoice/partialsalaryrelease/partialsalaryrelease.component';
import { BonussalaryreleaseComponent } from './pages/banknonvoice/bonussalaryrelease/bonussalaryrelease.component';
import { BankconsolidatedreportComponent } from './pages/banknonvoice/bankconsolidatedreport/bankconsolidatedreport.component';
import { BonusaccumulatedreportnonvoiceComponent } from './pages/banknonvoice/bonusaccumulatedreportnonvoice/bonusaccumulatedreportnonvoice.component';
import { GenericuploadComponent } from './pages/banknonvoice/genericupload/genericupload.component';
import { GratuityBatchGenerationComponent } from './pages/banknonvoice/gratuity-batch-generation/gratuity-batch-generation.component';
import { BonusBatchCreationComponent } from './pages/banknonvoice/bonus-batch-creation/bonus-batch-creation.component';
import { SalaryreleaseprocessComponent } from './pages/banknonvoice/salaryreleaseprocess/salaryreleaseprocess.component';





export const routes: Routes = [
  // Default redirect first
  { path: '', component: LoginmasterComponent },

  // Login / forgot routes (lazy-loaded)
  {
    path: 'Login',
    loadComponent: () => import('./layout/loginmaster/loginmaster.component')
      .then(c => c.LoginmasterComponent)
  },
  { path: 'unauthendicate', component: UnauthendicationComponent },
  {
    path: 'forgot',
    loadComponent: () => import('./pages/forgot/forgot.component')
      .then(c => c.ForgotComponent)
  },
  // Master layout with children
  {
    path: 'Master', component: MasterComponent, children: [
      { path: 'Home', component: HomeComponent },
      { path: 'Assignment', component: AssignmentComponent },
      { path: 'Severity', component: SeverityComponent },
      { path: 'AllottedLot', component: AllotedLotComponent },
      { path: 'Break', component: BreakdetailComponent },
      { path: 'user', component: UserListComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'app-revok', component: RevokComponent },
      { path: 'invoice', component: InitiateComponent },
      { path: 'draft-invoice', component: DraftInvoiceComponent },
      { path: 'gstinvoice', component: GstinvoiceComponent },
      //{ path: 'process', component: ReprocessComponent },
      { path: 'changepassword', component: ChangepasswordComponent },
      {
        path: 'grossmargin', component: GrossmarginComponent
      },
      {
        path: 'process',
        component: ProcessComponent,
        children: [
          { path: 'reprocess', component: ReprocessComponent },
          { path: 'attendance', component: AttendanceComponent },
          { path: 'arrearattendance', component: ArrearAttendanceComponent },
          { path: 'LOPAdjustment', component: LOPAdjustmentsComponent },
          { path: 'AttendancebatchIdupdate', component: AttendancebatchidUpdateComponent },
          { path: 'payprocess', component: PayProcessComponent },
          { path: 'ITAdjustment', component: ITAdjustmentComponent },
          { path: 'otherincome', component: OtherincomeComponent },
          { path: 'app-one-time-replacement', component: OneTimeReplacementComponent },
          { path: 'app-fnfrevoke', component: FNFRevokeComponent },
          { path: 'FFprocess', component: FFprocessComponent },
          { path: 'AllowReProcess', component: AllowReProcessComponent },
          { path: "paytransaction", component: PaytransactionComponent, },
          { path: "lockpayperiod", component: LockpayperiodComponent, },
          { path: "payregisterupload", component: PayregisteruploadComponent, },
          { path: "reimbrusmentcalendar", component: ReimbrusmentcalenderComponent, },
        ]
      },
      {
        path: 'reports',
        component: ReportsComponent,
        children: [
          { path: 'payregisterunprocessed', component: PayregisterunprocessedComponent },
          { path: 'payslip', component: PayslipComponent },
          { path: 'app-invoice-leave-balance-report', component: InvoiceLeaveBalanceReportComponent },
          { path: 'app-leave-balance-report', component: LeaveBalanceReportComponent },
          { path: 'poactiveinactivereport', component: PoactiveinactivereportComponent },
          { path: 'poemployeereport', component: PoemployeereportComponent },
          { path: 'pomonthwisereport', component: PomonthwisereportComponent },
          { path: 'app-qits-billing-report', component: QITSBillingReportComponent },
          { path: 'app-timesheet-report', component: TimesheetReportComponent },
          { path: 'poactiveinactivereport', component: PoactiveinactivereportComponent },
          { path: 'app-invoice-report', component: InvoiceReportComponent },
          { path: 'app-netpayreport', component: NetpayreportComponent },
          { path: 'payregisterentitywise', component: PayregisterentitywiseComponent },
          { path: 'billingubr', component: BillingubrComponent },
          { path: 'creditnotbalancereport', component: CreditnotebalancereportComponent },
          { path: 'pobalancereport', component: PobalancereportComponent },
          { path: "otherincomereport", component: OtherincomereportComponent },
          { path: 'otherincomereportentitywise', component: OtherincomeentitywisereportComponent },
          { path: 'billingubr', component: BillingubrComponent },
          { path: 'otherIncomeProcessReport', component: OtherIncomeProcessReportComponent },
          { path: 'employeReportProcess', component: EmployeeReportProcessComponent },
          { path: 'IncreamnetReport', component: IncrementReportComponent },
          { path: 'Report', component: ReportComponent },
          { path: 'AdvanceUtilizationReport', component: AdvanceUtilizationReportComponent },
        ]
      },
      {
        path: 'PromationNavigation', component: PromotionNavigationComponent,
        children: [
          { path: 'Increament', component: IncreamentComponent },
        ]
      },
      {
        path: 'Separation',
        component: SeparationNavigationComponent,
        children: [
          { path: 'fandfattendence', component: FandFattendenceComponent },
          { path: 'fullfinalSettlement', component: FullfinalsettlementComponent },
        ]
      },
      {
        path: 'navigationglobal', component: GlobalmasternavigationComponent,
        children: [
          { path: "paycodes", component: PaycodesComponent },
          { path: "shgslabdetail", component: ShgslabdetailComponent },
          { path: "SDLslabDetail", component: SDLslabDetailComponent },
          { path: "CPFslabDetails", component: CPFslabDetailsComponent },
          { path: "app-entity-master", component: EntityMasterComponent },
          { path: "InvoiceLegalEntity", component: InvoiceLegalEntityComponent },
          { path: "Vendor", component: VendorComponent },
          { path: "gst", component: GSTComponent },
          { path: "sitemaster", component: SiteMasterComponent },
          { path: "materialcode", component: MaterialcodeComponent },
          { path: 'BankMaster', component: BankmasterComponent },
          { path: 'Formula', component: FormulaComponent },
          { path: 'city', component: CityComponent },
          { path: 'states', component: StatesComponent },
          { path: 'Formula', component: FormulaComponent },
          { path: 'multicommercial', component: MulticommercialComponent },
          { path: 'ESIslab', component: ESIslabComponent },
          { path: 'Formula', component: FormulaComponent },
          { path: "professionaltax", component: ProfessionaltaxComponent },
          { path: "providentfund", component: ProvidentfundComponent },
          { path: "computationrule", component: ComputationruleComponent },
          { path: "providentfund", component: ProvidentfundComponent },
          { path: 'Formula', component: FormulaComponent },
          { path: 'lfw', component: LFWSlabComponent },
          { path: 'tds', component: TDSslabComponent }
        ]
      },
      {
        path: 'tools', component: ToolsnavigationComponent,
        children: [
          { path: "dynamiupload", component: DynamicuploadComponent },
          { path: "upfrontmatrix", component: UpfrontmatrixComponent }
        ]
      },
      {
        path: 'taxnavigation', component: NavigationComponent,
        children: [
          { path: 'cea', component: ChildreneducationallowanceComponent },
          { path: 'cpb', component: CompanyprovidedbenefitsComponent },
          { path: 'gratuity', component: GratuityComponent },
          { path: "ltacalculation", component: LtacalculationComponent },
          { path: "previousemploymenttaxdetails", component: PreviousemploymenttaxdetailsComponent },
          { path: "taxanddeclarationactual", component: TaxdeclationandactualComponent },
          { path: 'IncomeLoss', component: IncomeLossOnHousePropertyComponent },
          { path: 'HRAcalculation', component: HRAcalculationComponent },
        ]
      },
      {
        path: 'reimbursementnavigation', component: ReimbursenavigationComponent,
        children: [
          { path: "loanandadvance", component: LoanandadvanceComponent },
          { path: 'loanpreclosure', component: ReimbursementLoanPreClosureComponent },
          { path: 'reimbursement', component: ReimbrusementComponent }
        ]
      },
      {
        path: 'etdsprocess', component: ETDSProcessnavigationComponent,
        children: [
          { path: "legalentitymapping", component: LegalEntityMappingComponent },
          { path: "taxremittancegeneration", component: TaxRemittanceGenerationComponent },
          { path: "taxremittancedetail", component: TaxremittancedetailComponent }
        ]
      },
      {
        path: 'input', component: InputnavigationComponent,
        children: [
          { path: "inputaggregatorclient", component: InputaggregatorwithclientComponent },
          { path: "inputaggregatorattendance", component: InputaggregatorattendanceComponent },
          { path: "leavemaster", component: LeavetypemasterComponent },
          { path: "leavemastermapping", component: LeavetypemastermappingComponent }
          //  path:"inputaggregatorclient",component:InputaggregatorwithclientComponent
        ]
      },
      {
        path: 'banknonvoicenavigation', component: BanknonvoicenavigationComponent,
        children: [
          { path: "bankneftculture", component: BankneftcultureComponent },
          { path: "gratuitydownloadbatch", component: GratuitydownloadbatchComponent },
          { path: "salaryreleasestatus", component: SalaryreleasestatusComponent },
          { path: "partialsalaryrelease", component: PartialsalaryreleaseComponent },
          { path: "bonussalaryrelease", component: BonussalaryreleaseComponent },
          {path: "bankconsolidatedreport", component: BankconsolidatedreportComponent},
          {path: "bonusaccumulatedreportnonvoice", component: BonusaccumulatedreportnonvoiceComponent},
          {path: "genericupload", component: GenericuploadComponent},
          {path: "Salaryreleaseprocess", component: SalaryreleaseprocessComponent},
          {path: "GratuityBatchGeneration", component: GratuityBatchGenerationComponent},
          {path: "BonusBatchCreation", component: BonusBatchCreationComponent},
          { path: "financeholdreport", component: FinanceholdreportComponent },
          { path: "bankconsolidatedreport", component: BankconsolidatedreportComponent },
          { path: "downloadbatch", component: DownloadbatchbanknonvoiceComponent },
          { path: "bonusaccumulatedreport", component: BonusaccumulatedreportnonvoiceComponent }
        ]
      },
      {
        path: 'admin', component: AdminnavigationComponent,
        children: [
          { path: "companypermission", component: CompanypermissionComponent, },
          { path: "passwordunlock", component: PasswordunlockComponent, },
          { path: "payperiodunlock", component: PayperiodunlockComponent, },
        ]
      },
      {
        path: 'customer', component: CustomernavigationComponent,
        children: [
          { path: "department", component: DepartmentComponent, },
          { path: "designation", component: DesignationComponent, },
          { path: "BandDetails", component: BandDetailsComponent, },
          { path: "CostCenterMapping", component: CostCenterMappingComponent, },
          { path: "payfrequency", component: PayfrequencyComponent },
          { path: "corporatebank", component: CorporatebankComponent },
          { path: "clientaddress", component: ClientaddressComponent },
          { path: "vendorclientaddress", component: VendorclientaddressComponent },
          { path: "clientgstlist", component: ClientgstlistComponent },
          { path: "vendorclientgst", component: VendorclientgstComponent },
          { path: "itcalender", component: ITcalenderComponent },
          { path: "companypaycodemapping", component: CompanypaycodemappingComponent },
          { path: "ServiceCharge", component: ServiceChargeComponent },
          { path: "VendorServiceCharge", component: VendorServiceChargeComponent },
          { path: "employee", component: EmployeeComponents },
          { path: "cancelledinvoicerepository", component: CancelledinvoicerepositoryComponent },
          { path: "Company", component: CompanyComponent },
          { path: "sezcertificateupload", component: SezcertificateuploadComponent }

        ]
      },
      {
        path: 'invoicenavigation',
        component: InvoicenavigationComponent,
        children: [
          { path: 'billingdashboard', component: BillingdashboardComponent },
          { path: 'initiate', component: DraftInvoiceComponent },
          { path: 'provisionalinvoice', component: ProvisionalinvoiceComponent },
          { path: 'perfomainvoice', component: PerfomainvoiceComponent },
          { path: 'billabledays', component: BillableDaysComponent },
          { path: 'gstinvoice', component: GstinvoiceComponent },
          { path: 'einvoice', component: EInvoiceComponent },
          { path: 'billingpayfrequency', component: BillingpayfrequencyComponent },
          { path: 'poinitiate', component: POInitiateComponent },
          { path: 'IRN', component: EInvoiceComponent },
          { path: 'app-invoice-culture', component: InvoiceCultureAddpoComponent },
          { path: 'ClientBillableReportDatewise', component: ClientbillablereportsdatewiseComponent },
          //{ path: 'creditnote', component: CreditnoteComponent },
          // { path: 'creditnoteapprove', component: CreditnoteapproveComponent },
          { path: 'invoicecancel', component: InvoiceCancelComponent },
          //{ path: 'creditnoteupdate', component: CreditnoteupdateComponent },
          { path: 'companyinvoiceformat', component: CompanyinvoiceformatComponent },
          { path: 'OtherIncome', component: OtherincomeComponent },
          { path: 'sezrepository-approval', component: SEZRepositoryApprovalComponent },
        ]
      },
      {
        path: 'salaryreleasemenu',
        component: SalaryReleaseMenuComponent,
        children: [

          { path: 'downloadbatch', component: DownloadbatchComponent },
          { path: 'batchcreation', component: BatchcreationprocessComponent },
          { path: 'SalaryReleaseProcess', component: SalaryReleaseProcessComponent },
          { path: 'SalaryReleaseApproval', component: SalaryReleaseApproveComponent },
          { path: 'SalaryReleaseStatus', component: SalaryReleaseStatusComponent },
          { path: 'bankinvoiceneftculuture', component: BankInvoiceNEFTCultureComponent },
          { path: 'InvoiceBatchConsolidationReport', component: InvoiceBatchConsolidationReportComponent },
          { path: 'ReIssueProcessApprove', component: ReIssueProcessApproveComponent },
          { path: 'ReIssueProcessReport', component: ReIssueProcessReportComponent },

        ]

      },
      { path: 'changepassword', component: ChangepasswordComponent },

      // Wildcard inside children
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  //{ path: '', redirectTo: 'Login', pathMatch: 'full' },
  // Wildcard route
  // { path: '**', redirectTo: 'Login' }



];


export const appConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
  ],
};