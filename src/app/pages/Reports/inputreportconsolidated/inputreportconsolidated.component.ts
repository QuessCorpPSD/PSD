import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { APIResponse } from '../../../Models/apiresponse';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { PayregisterunprocessedService } from '../../../Service/Reports/payregisterunprocessed.service';
import { finalize } from 'rxjs';



@Component({
  selector: 'app-inputreportconsolidated',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    PayPeriodComponent],
  templateUrl: './inputreportconsolidated.component.html',
  styleUrl: './inputreportconsolidated.component.css'
})
export class InputreportconsolidatedComponent {
  companyId: any;
  selectedCompanyCode: any;
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPP?: any;
  isLoading: boolean = false;
  inputtype: any;
  Input_Id?: number;

  constructor(private payregisterService: PayregisterunprocessedService) { }

  ngOnInit(): void {
    this.payPeriodTypefromParentall = "All";
    this.payregisterService.getInputType().subscribe({
      next: res => {
        this.inputtype = res.Data || [];
      }
    });
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = String(payperiod.payfrequencyid);
  }

  Download() {
    this.isLoading = true;
    if (!this.companyId) {
      this.companyId = 0;

    }

    if (!this.selectedPP) {
      this.selectedPP = 0;

    }
    console.log('Selected Input Type ID:', this.Input_Id); // Log the selected input type ID for debugging
    this.payregisterService.GetInputReportConsolidated(
      this.companyId,
      this.selectedPP,
      this.Input_Id
    )
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: res => {
          console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName);
          } else {
            console.error('Unexpected status code', res.StatusCode);
          }
        },
        error: error => {
          console.error('Error:', error);
        }
      });
  }
  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
    this.isLoading = false;
  }

}

