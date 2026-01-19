import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { AuthGuard } from './Shared/auth-guard.service';
import { MasterComponent } from './layout/master/master.component';

import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { AssignmentComponent } from './pages/assignment/assignment.component';
import { SeverityComponent } from './pages/severity/severity.component';
import { AllotedLotComponent } from './pages/alloted-lot/alloted-lot.component';

import { SopnewComponent } from './pages/sopnew/sopnew.component';
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
import { ReprocessComponent } from './pages/process/reprocess/reprocess.component';
import { UnauthendicationComponent } from './pages/unauthendication/unauthendication.component';
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
      { path: 'SOP', component: SopnewComponent },
      { path: 'user', component: UserListComponent },
      { path: 'dashboard', component: DashComponent },
      { path: 'app-revok', component: RevokComponent },
      { path: 'invoice', component: InitiateComponent },
      { path: 'draft-invoice', component: DraftInvoiceComponent },
      { path: 'gstinvoice', component: GstInvoiceComponent },
      { path: 'process', component: ReprocessComponent },
      { path: 'changepassword', component: ChangepasswordComponent },
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
          // { path: "corporatebank", component: CorporatebankComponent, },
          // { path: "itcalender", component: ITcalenderComponent, },
          // { path: 'companypaycodemapping', component: CompanypaycodemappingComponent },
          // { path: 'clientaddress', component: ClientaddressComponent },
        ]
      },
      {
        path: 'taxnavigation', component: NavigationComponent,
        children: [
          { path: 'cea', component: ChildreneducationallowanceComponent },
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
          { path: "loanandadvance", component: LoanandadvanceComponent }

        ]
      },

      // Wildcard inside children
      { path: '**', redirectTo: 'Home', pathMatch: 'full' }
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