import { Component } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { MatCardModule } from "@angular/material/card";
import { Payperiodclass, Company } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-invoicecollection',
  imports: [MatPaginator, MatTableModule, MatIcon, CompanyallComponent, PayPeriodComponent, MatCardModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './invoicecollection.component.html',
  styleUrl: './invoicecollection.component.css'
})
export class InvoicecollectionComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  payPeriodmain!: Payperiodclass;
  payperiodIdmain: any;
  payperiodsmain: any;
  payPeriodType: any;
  userdetail: any;
  uploadtype: any;
  showTable = false;
  searchText: any;
  uploadedData: any[] = [];

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'CompanyName',
    'PayPeriod',
    'ModeOfCollection',
    'MapName',
    'RefId',
    'TotalCollectionAmount',
    'TotalTdsAmount',
    'TotalDifferenceAmount',
    'UserName',
    'PostedDate'
  ];

  uploadedDataSource = new MatTableDataSource<any>();
  constructor(
    private decry: EncryptionService, private _sessionStoreage: SessionStorageService) {

  }
  handleCompanyEvent(company: Company | null) {
    if (!company) {
      // alert("please Select Company")
      this.selectedCompanyId = null;
      this.selectedCompanyCode = null;
      return;
    }
    this.selectedCompanyId = company.companyId ?? null;
    this.selectedCompanyCode = company.companyCode ?? null;

  }

  handlePayperiodEventmain(payperiod: Payperiodclass) {
    this.payPeriodmain = payperiod;
    this.payperiodIdmain = payperiod.payfrequencyid;
    this.payperiodsmain = payperiod.payPeriod;

  }

  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.payPeriodType = "All";
  }

  applyFilters() {

  }

}
