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
import { UnauthendicationComponent } from './pages/unauthendication/unauthendication.component';
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
import { ReprocessComponent } from './pages/process/reprocess/reprocess.component';
import { EmployeeComponents } from './pages/customers/employee/employee.component';
import { AdminnavigationComponent } from './pages/admin/adminnavigation/adminnavigation.component';
import { CompanypermissionComponent } from './pages/admin/companypermission/companypermission.component';
import { PasswordunlockComponent } from './pages/admin/passwordunlock/passwordunlock.component';
import { PayperiodunlockComponent } from './pages/admin/payperiodunlock/payperiodunlock.component';
import { ReimbrusementnavigationComponent } from './pages/reimbruements/reimbrusementnavigation/reimbrusementnavigation.component';
import { ReimbrusementComponent } from './pages/reimbruements/reimbrusement/reimbrusement.component';



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
          { path: "itcalender", component: ITcalenderComponent },
          { path: "companypaycodemapping", component: CompanypaycodemappingComponent },
          { path: "ServiceCharge", component: ServiceChargeComponent },
          { path: "employee", component: EmployeeComponents },
          { path: "cancelledinvoicerepository", component: CancelledinvoicerepositoryComponent },
          { path: "Company", component: CompanyComponent },

        ]
      },
      {
        path: 'reimbrusement', component: ReimbrusementnavigationComponent,
        children: [
          { path: 'reimbursement', component: ReimbrusementComponent }
        ]
      },
      { path: 'changepassword', component: ChangepasswordComponent },

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