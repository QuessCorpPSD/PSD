import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { MatIconModule } from '@angular/material/icon';
import { PayperiodsequenceComponent } from '../../../common/payperiodsequence/payperiodsequence.component';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardContent, MatCardModule } from "@angular/material/card";
import { MatTabsModule } from '@angular/material/tabs';
import { IPayProcessRepository } from '../../../Repository/IPayProcessRepository';
import { PayProcessRepository } from '../../../Service/PayProcessRepository';

export const Pay_TOKEN = new InjectionToken<IPayProcessRepository>('Pay_TOKEN');

@Component({
  selector: 'app-reprocess',
  imports: [CommonModule,MatTabsModule, CompanyallComponent, PayperiodsequenceComponent, MatIconModule, FormsModule, MatCardModule],
  templateUrl: './reprocess.component.html',
  styleUrl: './reprocess.component.css',
  providers:[DatePipe,
    {
      provide: Pay_TOKEN,
      useClass: PayProcessRepository,
    }
  ]
})
export class ReprocessComponent implements OnInit {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  isLoading:boolean=false;
  selectedDate: string='' ;
  actual_Or_delcare:string='';
   constructor(private datePipe: DatePipe,@Inject(Pay_TOKEN) private _payProcessService: IPayProcessRepository){

   }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;

    console.log(this.selectedCompanyId);
    if(this.selectedCompanyId!=0 || this.selectedCompanyId != undefined)
    {
      console.log(this.payPeriod)

      const request = {
        "company_Id": this.selectedCompanyId,
        "End_At":this.payPeriod.end_At
      }
      console.log(request);
      this._payProcessService.GetITCalenderCompany(request).subscribe({
        next:res=>{console.log(res.Data)
          if(res.Data.length>0)
          {
            this.actual_Or_delcare='selva';
          }
          else{
            this.actual_Or_delcare='selva';
            //alert(${IT Calender is not defined for the Company corresponding to the Selected Pay Periods Financial Year})
          }
        },
        error:err=>{console.log(err)}
      })
    }
  }


  ngOnInit(): void {
    this.payPeriodType = "All";
     const now = new Date();
  const formatted = this.datePipe.transform(now, 'dd-MM-yyyy');
  this.selectedDate=String(formatted);
  }
}
