import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-salaryreleaseprocess',
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatCardModule],
  templateUrl: './salaryreleaseprocess.component.html',
  styleUrl: './salaryreleaseprocess.component.css'
})
export class SalaryreleaseprocessComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  showSearchGrid: boolean = true;

  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  user_Id: any;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  srpBatchList: any[] = [];
  SelectedBatch: any = "";

  selectedBatchType: string = '';   // correct variable
  selectedBatchId: string = '';

  batchtype: any[] = [];
  batchList: any[] = [];

  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'EmployeeCode', 'EmployeeName',
    'BatchId', 'InvoiceNo', 'NetPay', 'BankName', 'NeftBankName'

  ];


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    // this.Bindbatchtype();
    this.payPeriodTypefromParent = "All";

  }




  // Bindbatchtype() {
  //   this.service.Batchtype(this.userdetail.user_Id).subscribe({
  //     next: res => {
  //       this.batchtype = res.Data;
  //     }
  //   });
  //   this.BindBatchId();
  // }


  // BindBatchId() {

  //   this.service.Batchload(
  //     this.selectedBatchType,
  //     this.userdetail.user_Id
  //   )
  //     .subscribe({
  //       next: res => {
  //         this.batchList = res.Data;
  //       }
  //     });
  // }

  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }

  search() {
    this.istablevisible = true;
    // this.isLoading = true;

    // if (!this.selectedBatchType) {
    //   alert("Please Select Batch Type");
    //   return;
    // }

    // if (!this.selectedBatchId) {
    //   alert("Please Select Batch Id");
    //   return;
    // }

    // this.istablevisible = true;
    // this.isLoading = true;

    // const batchType = this.selectedBatchType;
    // const batchId = this.selectedBatchId || 0;
    // const userId = this.userdetail.user_Id;

    // this.service.Search(batchType, batchId, userId)
    //   .subscribe({
    //     next: res => {

    //       const tableData = res?.Data?.data?.Table0;

    //       if (!tableData || tableData.length === 0) {
    //         alert("No data available to display.");
    //         return;
    //       }

    //       this.dataSource = new MatTableDataSource<any>(tableData);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //     },

    //     error: err => {
    //       this.isLoading = false;
    //       console.error('Error fetching data:', err);
    //       alert('Error while fetching data');
    //     },

    //     complete: () => {
    //       this.isLoading = false;
    //     }
    //   });
  }

  onInitiate() {

    //   if (!this.selectedBatchType) {
    //     alert("Please Select Batch Type");
    //     return;
    //   }

    //   if (!this.selectedBatchId) {
    //     alert("Please Select Batch Id");
    //     return;
    //   }

    //   const payload = {
    //     batchType: this.selectedBatchType,
    //     batchId: this.selectedBatchId,
    //     userId: this.userdetail.user_Id
    //   };

    //   this.isLoading = true;

    //   this.service.Initiate(payload).subscribe({
    //     next: (response: any) => {
    //       this.isLoading = false;

    //       const blob = response.body;

    //       // 🔥 Get filename from backend header
    //       let fileName = this.selectedBatchId + '.rar'; // fallback

    //       const contentDisposition = response.headers.get('content-disposition');
    //       if (contentDisposition) {
    //         const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
    //         if (matches && matches[1]) {
    //           fileName = matches[1];
    //         }
    //       }

    //       // 🔥 Download file
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement('a');
    //       a.href = url;
    //       a.download = fileName;
    //       a.click();
    //       window.URL.revokeObjectURL(url);

    //       alert('File downloaded successfully!');
    //     },

    //     error: (err) => {
    //       this.isLoading = false;
    //       console.error(err);
    //       alert('Error while processing');
    //     }
    //   });
    // }

  }
}
