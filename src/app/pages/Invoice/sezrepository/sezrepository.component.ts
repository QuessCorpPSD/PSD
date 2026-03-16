import { Component } from '@angular/core';
import { FinancialYearComponent } from "../../../common/financial-year/financial-year.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";

@Component({
  selector: 'app-sezrepository',
  imports: [FinancialYearComponent, CompanyallComponent, PayPeriodComponent],
  templateUrl: './sezrepository.component.html',
  styleUrl: './sezrepository.component.css'
})
export class SEZRepositoryComponent {

}
