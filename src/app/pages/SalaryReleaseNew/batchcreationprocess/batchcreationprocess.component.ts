import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

import { HoldGrid } from '../../../Models/SalaryRelease/Hold';
import { IBatchreation } from '../../../Repository/SalaryRequestNew/Ibatchcreation';

import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { SelectionModel } from '@angular/cdk/collections';
import { BatchcreationService } from '../../../Service/Service/SalaryRequestNew/batchcreation.service';
export const Pay_TOKEN = new InjectionToken<IBatchreation>('Pay_TOKEN');

@Component({
  selector: 'app-batchcreationprocess',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent],
  templateUrl: './batchcreationprocess.component.html',
  styleUrl: './batchcreationprocess.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BatchcreationService,
    }
  ]
})
export class BatchcreationprocessComponent {
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading = false;
  searchText = '';
  selectedTemplate: any;
  istablevisible = false;
  dataSource = new MatTableDataSource<any>([]);
  userdetail: any;
  batchcreate: any;
  batchtype: any;
  entitylist: any;
  Batchtype: any;
  entity: any;
  Batchcreate: any;
  remarks: any;
  selection = new SelectionModel<any>(true, []);
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, @Inject(Pay_TOKEN) private service: IBatchreation,) { }
  displayedColumns: string[] = [
    'select',
    'Invoice_No',
    'company_code',
    'map_name',
    'payperiod',
    'Netamount',
    'Noofemployees',
    'remarks',
    'reject'
  ];



  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();

    this.dataSource.filter = filterValue;

  }
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.Bindbatchcreation();
    this.Bindbatchtype();
    this.Bindentity();
  }

  Bindbatchcreation() {
    this.service.Batchcreationtype(this.userdetail.user_Id).subscribe({
      next: res => { this.batchcreate = res.Data }
    });
  }
  Bindbatchtype() {
    this.service.Batchtype(this.userdetail.user_Id).subscribe({
      next: res => { this.batchtype = res.Data }
    });
  }
  Bindentity() {
    this.service.Entitylist(this.userdetail.user_Id).subscribe({
      next: res => { this.entitylist = res.Data }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  getSelectedRows() {
    console.log(this.selection.selected);
  }
  search() {
    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }
    if (!this.batchcreate) {
      alert("Please Select Batch Create");
      return;
    }
    if (!this.entity) {
      alert("Please Select Entity");
      return;
    }

    this.istablevisible = true;
    this.isLoading = true;

    const batchtype = this.Batchtype;
    const batchcreate = this.Batchcreate;
    const entity = this.entity;
    const userid = this.userdetail.user_Id;
    console.log("batchcreate", this.Batchcreate)

    this.service.Search(batchtype, batchcreate, entity, userid).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        const tableData = res.Data.data.Table0;

        if (!tableData.length) {
          alert('No data found');
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource<any>(res.Data.data.Table0);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });

  }

  exportToExcel(): void {
    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }
    if (!this.batchcreate) {
      alert("Please Select Batch Create");
      return;
    }
    if (!this.entity) {
      alert("Please Select Entity");
      return;
    }
    const batchtype = this.Batchtype;
    const batchcreate = this.Batchcreate;
    const entity = this.entity;
    const userid = this.userdetail.user_Id;
    this.isLoading = true;
    this.service.Export(batchtype, batchcreate, entity, userid).subscribe({
      next: (res) => {
        this.isLoading = false;
        try {
          const jsonData = res.Data.data.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No Data Found')
            this.isLoading = false;
            return;

          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'GST');
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `GST_Details_${timestamp}.xlsx`;
          XLSX.writeFile(wb, fileName);
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
      },
    });
  }
  Generate() {

    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.entity) {
      alert("Please Select Batch Unit Name / Entity");
      return;
    }

    if (!this.Batchcreate) {
      alert("Please Select Batch Creation Type");
      return;
    }

    if (this.selection.selected.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    this.isLoading = true;

    const payload = {
      entityId: this.entity,
      batchType: this.Batchtype,
      userId: this.userdetail.user_Id,
      batchList: this.selection.selected.map((row: any) => ({
        bankAdviceApprovalsId: row.Bank_Advice_Approvals_Id,
        Invoice_No: row.Invoice_No,
        companyCode: row.Company_Code,
        payPeriod: row.Pay_Period,
        mapName: row.Map_Name,
        netAmount: row.Net_Amount.toString(),
        noOfEmployees: row.No_of_Employees,
        batchCreationTypeId: row.BatchCreationTypeId
      }))
    };

    console.log("Generate Payload:", payload);

    this.service.generate(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.Data && res.Data.length > 0 && res.Data[0].validation) {

          const validationMessages = res.Data.map((item: any) => ({
            ValidationMessage: item.validation
          }));

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(validationMessages);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Validation Errors');

          const timestamp = new Date().toISOString().split('T')[0];
          XLSX.writeFile(wb, `Validation_Errors_${timestamp}.xlsx`);

        }
        else if (res?.message?.toLowerCase().includes('success')) {
          this.isLoading = false;
          alert("Batch Generated Successfully");
          this.selection.clear();

        }
        else {
          this.isLoading = false;
          alert(res?.message || "Something went wrong");
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error while generating batch");
      }
    });
  }

  ConfirmReject(row: any) {
    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }
    if (!row.Remarks || row.Remarks.trim() === '') {
      row.showError = true;
      return;
    }

    const confirmReject = confirm("Are you sure you want to reject this row?");
    if (!confirmReject) return;
    this.isLoading = false;
    const payload = {
      BatchType: this.Batchtype,
      UserId: this.userdetail.user_Id,
      RejectList: [
        {
          Bank_Advice_Approvals_Id: row.bankAdviceApprovalsId,
          Invoice_No: row.Invoice_No,
          Remarks: row.Remarks
        }
      ]
    };

    this.service.Reject(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.Data.validation?.toLowerCase().includes('success')) {
          alert("Row rejected successfully");
          row.Remarks = '';
          row.showError = false;
          this.isLoading = false;
        }
        else if (res?.Data && res.Data.length > 0) {
          const errorMessages = res.Data.map((item: any) => ({
            ValidationMessage: item.validation || item.error || 'Unknown error'
          }));
          this.isLoading = false;

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(errorMessages);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Error Messages');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Reject_Errors_${timestamp}.xlsx`;
          XLSX.writeFile(wb, fileName);

          alert("Error occurred. Please check downloaded Excel for details.");
        }
        else {
          alert(res?.message || "Something went wrong");
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error while rejecting row");
      }
    });
  }
}
