import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';

@Component({
  selector: 'app-categorychange',
  imports: [MatCardModule, CompanyallComponent, MatIconModule, FormsModule, CommonModule, PayPeriodComponent],
  templateUrl: './categorychange.component.html',
  styleUrl: './categorychange.component.css'
})
export class CategorychangeComponent {

  selectedCompanyId: any;
  selectedCompanyCode: any;
  companyname: any;
  isLoading: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payPeriodId: number = 0;
  payperiods: String = '';
  payPeriodTypefromParentall: string = '';

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.companyname = company.companyName;
    console.log(this.selectedCompanyId, 'company')
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
  }

  ngOnInit() {
    this.payPeriodTypefromParentall = "All";
  }
  onSearch() {
    // this.isLoading = true;
    if (!this.selectedCompanyId) {
      alert('Please select Company Code');
      // this.isLoading = false;
      return;
    }
    if (!this.payPeriod) {
      alert('please select Payperiod');
      return;
    }

  }
}
