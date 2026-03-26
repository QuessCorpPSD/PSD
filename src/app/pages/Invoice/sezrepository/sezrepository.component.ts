import { Component } from '@angular/core';
import { FinancialYearComponent } from "../../../common/financial-year/financial-year.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';

@Component({
  selector: 'app-sezrepository',
  imports: [FinancialYearComponent, CompanyallComponent, PayPeriodComponent],
  templateUrl: './sezrepository.component.html',
  styleUrl: './sezrepository.component.css'
})
export class SEZRepositoryComponent {
 selectedCompanyId!: number;
 companyUI: any;
  payperiodUI: any;
   Company_Code?: string;
  pay_period?: string;
  payPeriodType: string = "All";
  defaultHeaderName=['Serial_No','Id','Company_Id','Payperiod_Id','Invoice_Id','Invoice_Number','Document_Name','Uploaded_Date','Document_FilePath','Obselete_Document_FilePath','Remark','Error_Message']
  handleCompanyEvent(company: any) {
     this.companyUI = company;
     this.Company_Code = company.company_Code;
     this.selectedCompanyId = this.companyUI.companyId;
     if (!this.companyUI) {
       alert("Select Company Code");
       return;
     }
     const request = {
       "id": 0,
       "AttributeName": "A",
       "ActionType": "G",
       "IsActive": false,
       "CreatedBy": 3,
       "DateTime": new Date()
     }
    
   }
   handlePayperiodEvent(payperiod: Payperiodclass) {
 
     this.payperiodUI = payperiod;
     this.pay_period = payperiod.payPeriod
     if (!this.companyUI) {
       alert("Select Company Code pay");
       return;
     }
     if (!this.payperiodUI) {
       alert("Select Pay Period");
       return;
     }
   }
}
