import { Component } from '@angular/core';

@Component({
  selector: 'app-invoicelayout',
  imports: [],
  templateUrl: './invoicelayout.component.html',
  styleUrl: './invoicelayout.component.css'
})
export class InvoicelayoutComponent {

  tabRoutes: string[] = [
    '/layout/pinavigation/gridOnboarding',
    '/layout/pinavigation/activation',
    '/layout/pinavigation/unseize',
    '/layout/pinavigation/timesheet',
    '/layout/pinavigation/increment',
    // '/layout/pinavigation/onetimeinput',
    '/layout/pinavigation/finalsubmission',
    '/layout/pinavigation/invoice',
    '/layout/pinavigation/provisionalinvoice',
    '/layout/pinavigation/iiap',
    '/layout/pinavigation/einvoice',
    '/layout/pinavigation/einvoicecancellation',
  ];
}
