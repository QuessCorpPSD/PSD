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



export const routes: Routes = [
    // Default redirect first
   
  { path: '', component: LoginmasterComponent },

    // Login / forgot routes (lazy-loaded)
    {
        path:'Login',
        loadComponent: () => import('./layout/loginmaster/loginmaster.component')
            .then(c => c.LoginmasterComponent)
    },
    {
        path:'forgot',
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
            { path: 'dashboard', component: DashboardComponent },
            { path: 'app-revok', component: RevokComponent },
            { path: 'invoice', component: InitiateComponent },
            { path: 'draft-invoice', component: DraftInvoiceComponent },
            { path: 'gstinvoice', component: GstInvoiceComponent },
            { path: 'process', component: ReprocessComponent },
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
      provideRouter(routes,withHashLocation()),
    ],
  };