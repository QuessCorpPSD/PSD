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
import { SopformComponent } from './pages/sopform/sopform.component';



export const routes: Routes = [
    {
        path: 'Master', component: MasterComponent, children: [
            { path: 'Home', component: HomeComponent },
            { path: 'Assignment', component: AssignmentComponent },
            { path: 'Severity', component: SeverityComponent },
            { path: 'AllottedLot', component: AllotedLotComponent },
            { path: 'SOP', component: SopformComponent },
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