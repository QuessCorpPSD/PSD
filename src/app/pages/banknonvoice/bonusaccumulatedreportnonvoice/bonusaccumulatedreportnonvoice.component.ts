import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";

@Component({
  selector: 'app-bonusaccumulatedreportnonvoice',
  imports: [MatIcon, CompanyallComponent],
  templateUrl: './bonusaccumulatedreportnonvoice.component.html',
  styleUrl: './bonusaccumulatedreportnonvoice.component.css'
})
export class BonusaccumulatedreportnonvoiceComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }
}
