import { Component, InjectionToken, ViewChild } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { CategoryChangeService } from '../../../Service/Admin/category-change.service';
import { ICategoryChange } from '../../../Repository/Admin/ICategoryChange';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
export const Pay_TOKEN = new InjectionToken<ICategoryChange>('Pay_TOKEN');

@Component({
  selector: 'app-categorychange',
  imports: [MatCardModule, CompanyallComponent, MatIconModule, FormsModule, CommonModule, PayPeriodComponent, ReactiveFormsModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule],
  templateUrl: './categorychange.component.html',
  styleUrl: './categorychange.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CategoryChangeService,
    }
  ]
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
  lot_number!: number;
  categorySearch: any;
  showTable = false;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  ProcessCategory: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private service: CategoryChangeService) { }

  uploadDisplayedColumns: string[] = [
    'slNo', 'companycode', 'lotNumber', 'payrollinputtype', 'update'];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.companyname = company.companyName;
    console.log(this.selectedCompanyId, 'company')
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    console.log("payperiod", this.payPeriod)
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
  }

  ngOnInit() {
    this.payPeriodTypefromParentall = "All";
    this.BindProcessCategory();
  }

  BindProcessCategory() {
    this.service.GetProcessCategory().subscribe({
      next: res => { this.ProcessCategory = res.Data },
      error: err => { console.log(err) }
    })
  }

  onSearch() {
    if (!this.selectedCompanyId) {
      alert('Please select Company Code');
      return;
    }
    if (!this.payPeriod || !this.payPeriod.payPeriod) {
      alert('Please select Pay Period');
      return;
    }
    this.showTable = true;
    const payload = {
      CompanyID: this.selectedCompanyId,
      PayPeriod: this.payPeriodId,
      LotNumber: this.lot_number,
      Revised: 0,
      Flag: "s"

    }
    this.service.SearchCategory(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.categorySearch = res.Data;
        if (this.categorySearch && this.categorySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.categorySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'slNo', 'companycode', 'lotNumber', 'payrollinputtype', 'update'];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
      },
    });

  }
  onUpdate(){
    const payload = {
      CompanyID: this.selectedCompanyId,
      PayPeriod: this.payPeriodId,
      LotNumber: this.lot_number,
      Revised: 0,
      Flag: "U"
    }

     this.service.SearchCategory(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert("Updated Successfully")
        this.onSearch();
        
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
      },
    });
  }
}
