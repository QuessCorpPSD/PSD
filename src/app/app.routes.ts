import { provideRouter, Routes } from '@angular/router';

import { IndexComponent } from './account/index/index.component';

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



export const routes: Routes = [
    {
        path: 'Master', component: MasterComponent, children: [
            { path: 'Home', component: HomeComponent },
            { path: 'Assignment', component: AssignmentComponent },
            { path: 'Severity', component: SeverityComponent },
            { path: 'AllottedLot', component: AllotedLotComponent },
            { path: 'Break', component: BreakdetailComponent },
            // { path: 'Employee', component: BreakComponent },
             { path: 'SOP', component: SopnewComponent },
            { path: 'user', component: UserListComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'app-revok', component: RevokComponent},
            { path: 'invoice', component: InitiateComponent},
            { path: 'gstinvoice', component: GstInvoiceComponent},
            { path: 'changepassword', component: ChangepasswordComponent },
         //   { path: 'UI', component: SopComponent },
            { path: '**', redirectTo: '/Home', pathMatch: 'full' }

        ],

    },
    // {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    //   },
    // {
    //     path:'',
    //     component:MasterComponent, 
    //     data:{
    //         title:'Master'
    //     }  ,             
    //     children:[
    //         {
    //             loadChildren:()=>import('./pages/routes').then(m=>m.routes)
    //         }
    //     ]
    // },

    {path:'Login',loadComponent:()=>import('./layout/loginmaster/loginmaster.component').then((c)=>c.LoginmasterComponent)},
     {path:'forgot',loadComponent:()=>import('./pages/forgot/forgot.component').then((c)=>c.ForgotComponent)},
    {path:'**',redirectTo:'Login',pathMatch:'full'}
    
    //, canActivate: [AuthGuard]
    // { path: 'Login', component: IndexComponent },
    // { path: 'not-authorized', component: NotAuthorizedComponent },   
    // { path: '', redirectTo: '/Login', pathMatch: 'full' },
];

export const appConfig = {
    providers: [
      provideRouter(routes),
    ],
  };