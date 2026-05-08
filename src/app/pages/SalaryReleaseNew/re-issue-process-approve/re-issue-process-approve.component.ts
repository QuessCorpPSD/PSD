import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';

import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { IReissueProcessApproval } from '../../../Repository/SalaryRequestNew/IReissueProcessApproval';
import { ReissueProcessApprovalService } from '../../../Service/Service/SalaryRequestNew/reissue-process-approval.service';
export const Common_TOKEN = new InjectionToken<IReissueProcessApproval>('Common_TOKEN');

@Component({
  selector: 'app-re-issue-process-approve',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    CompanyallComponent,
    PayPeriodComponent
  ],
  templateUrl: './re-issue-process-approve.component.html',
  styleUrl: './re-issue-process-approve.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: ReissueProcessApprovalService }
  ]
})
export class ReIssueProcessApproveComponent {

  selectedCompanyId: any;
  selectedCompanyCode: any;
  selectedPP: any;
  startDate: any;
  endDate: any;
  Remarks: any = '';
  selectedReIssueType: any = '';
  selectedChequeStatus: any = '';
  selectedCancellationCharges: any = '';
  selectedStatus: any = '';
  selectedPayMode: any = '';
  payPeriodTypefromParentall: string = 'All';
  userdetail: any;
  showTable = false;
  ReIssueTypeList: any[] = [];
  ChequeStatusList: any[] = [];
  CancellationChargesList: any[] = [];
  PayModesList: any[] = [];
  ModeOfCollectionList: any[] = [];
  StatusList: any[] = [];
  isLoading = false;
  selectedRows: any[] = [];
  searchText: string = '';
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'select',
    'sno',
    'companyCode',
    'payperiod',
    'invoicenumber',
    'employeecode',
    'employeename',
    'Checknumber',
    'CheckAmount',
    'ReIssuetyes',
    'PayMode',
    'BankName',
    'AccountNumber',
    'IFSCcode',
    'Remarks'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: ReissueProcessApprovalService
  ) { }

  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;


    this.BindReIssueTypes();
    this.BindChequeStatus();
    this.BindCancellationCharges();
    this.BindPayModes();
    this.BindModeOfCollections();
    this.BindStatusList();
    // ADD THIS INSIDE ngOnInit() AFTER OTHER CODE

    this.dataSource.filterPredicate = (
      data: any,
      filter: string
    ) => {

      const searchText = filter.trim().toLowerCase();

      return (

        data.SNo?.toString().includes(searchText) ||
        data.Company_Code?.toLowerCase().includes(searchText) ||
        data.Pay_Period?.toLowerCase().includes(searchText) ||
        data.Invoice_No?.toLowerCase().includes(searchText) ||
        data.Employee_Code?.toLowerCase().includes(searchText) ||
        data.Employee_Name?.toLowerCase().includes(searchText) ||
        data.UTR_CHEQUE_NO?.toLowerCase().includes(searchText) ||
        data.Cheque_Amount?.toString().includes(searchText) ||
        data.ReIssue_Type?.toLowerCase().includes(searchText) ||
        data.Pay_Mode?.toLowerCase().includes(searchText) ||
        data.Bank_Name?.toLowerCase().includes(searchText) ||
        data.Account_No?.toLowerCase().includes(searchText) ||
        data.IFSC_Code?.toLowerCase().includes(searchText) ||
        data.Remarks?.toLowerCase().includes(searchText)

      );
    };
  }

  // ADD THIS METHOD INSIDE COMPONENT

  applyFilters(): void {

    const filterValue =
      this.searchText?.trim().toLowerCase() || '';

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company: any) {
    if (company) {
      this.selectedCompanyId = company.companyId;
      this.selectedCompanyCode = company.companyCode;
    }
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payfrequencyid;
  }


  formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

  onSearch() {
    this.isLoading = true;

    if (!this.startDate) {
      alert('Please select From Date');
      this.isLoading = false;
      return;
    }

    // To Date mandatory
    if (!this.endDate) {
      alert('Please select To Date');
      this.isLoading = false;
      return;
    }

    this.showTable = true;

    const companyId = this.selectedCompanyId || 0;
    const payPeriodId = this.selectedPP || 0;
    const reIssueTypes = this.selectedReIssueType || 0;
    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    const param = 0;
    const status = this.selectedChequeStatus || 0;

    this.service.SearchReIssueApprove(
      companyId,
      payPeriodId,
      reIssueTypes,
      fromDate,
      toDate,
      param,
      status
    ).subscribe({
      next: (res: any) => {

        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        const reIssueList = res?.Data?.data?.Table0 ?? [];

        if (reIssueList.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(reIssueList);
        this.dataSource.paginator = this.paginator;

        this.isLoading = false;
      },

      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.isLoading = false;
      }
    });
  }

  exportToExcel(): void {

    this.isLoading = true;

    const payload = {
      companyId: this.selectedCompanyId || 0,
      payPeriodId: this.selectedPP || 0,
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate),
      reissueTypeId: this.selectedReIssueType || 0,
      status: this.selectedChequeStatus || 0
    };

    this.service.ExportToExcel(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || jsonData.length === 0) {
          alert('No data available');
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ReIssueApprove');

        const date = new Date().toISOString().split('T')[0];
        const fileName = `ReIssueApprove_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },

      error: (err) => {
        this.isLoading = false;
        alert('Export failed');
        console.error(err);
      }
    });
  }




  BindReIssueTypes() {
    this.service.GetDropdown('GetReIssueTypes').subscribe({
      next: (res: any) => {
        this.ReIssueTypeList = res.Data.data.Table0;
      }
    });
  }

  BindStatus() {
    this.service.GetDropdown('StatusList').subscribe({
      next: (res: any) => {
        this.StatusList = res.Data.data.Table0;
      }
    });
  }

  BindChequeStatus() {
    this.service.GetDropdown('GetChequeStatus').subscribe({
      next: (res: any) => {
        this.ChequeStatusList = res.Data.data.Table0;
      }
    });
  }

  BindCancellationCharges() {
    this.service.GetDropdown('GetCancellationCharges').subscribe({
      next: (res: any) => {
        this.CancellationChargesList = res.Data.data.Table0;
      }
    });
  }

  BindPayModes() {
    this.service.GetDropdown('GetPayModes').subscribe({
      next: (res: any) => {
        this.PayModesList = res.Data.data.Table0;
      }
    });
  }

  BindModeOfCollections() {
    this.service.GetDropdown('GetModeOfCollections').subscribe({
      next: (res: any) => {
        this.ModeOfCollectionList = res.Data.data.Table0;
      }
    });
  }

  BindStatusList() {
    this.service.GetDropdown('StatusList').subscribe({
      next: (res: any) => {
        this.StatusList = res.Data.data.Table0;
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {

    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload one Excel file.');
      this.isLoading = false;
      return;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt !== 'xls' && fileExt !== 'xlsx') {
      alert('Please upload only .xls or .xlsx file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this.service.ReissueProcessApproveBulkUpload(formData).subscribe({
      next: (res: any) => {

        const response = res?.Data?.response;
        const statusCode = res?.StatusCode;

        if (!res || !res.Data) {
          alert(response);
          this.isLoading = false;
          return;
        }

        if (
          statusCode === 200 &&
          response?.toLowerCase().includes('success')
        ) {
          alert(response);
          this.isLoading = false;
          this.onSearch();
          return;
        }

        if (
          statusCode === 200
        ) {

          let errorArray: any[] = [];

          try {

            const rawErr = res?.Data?.errors?.[0];

            if (typeof rawErr === 'string') {
              errorArray = JSON.parse(rawErr);
            }
            else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            }
            else if (rawErr) {
              errorArray = [rawErr];
            }

          } catch {

            errorArray = [
              {
                Error_Message: res.Data.errors
              }
            ];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item?.Error_Message ||
              item?.Message ||
              item?.message ||
              item || ''
          }));

          const worksheet: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(exportData);

          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(
            workbook,
            'ReIssueApprove_Errors.xlsx'
          );

          alert(response);
          this.isLoading = false;
          return;
        }

        if (response) {
          alert(response);
        } else {
          alert(response);
        }

        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  toggleRow(row: any, event: any): void {
    row.selected = event.checked;

    if (event.checked) {
      const exists = this.selectedRows.find(
        x => x.Bank_Invoice_Id === row.Bank_Invoice_Id
      );

      if (!exists) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(
        x => x.Bank_Invoice_Id !== row.Bank_Invoice_Id
      );
    }
  }

  isAllSelected(): boolean {
    return this.dataSource.data.length > 0 &&
      this.selectedRows.length === this.dataSource.data.length;
  }

  toggleAllRows(event: any): void {
    const checked = event.checked;

    this.selectedRows = [];

    this.dataSource.data.forEach((row: any) => {
      row.selected = checked;

      if (checked) {
        this.selectedRows.push(row);
      }
    });
  }


  Approval(): void {

    if (this.selectedRows.length === 0) {
      alert('Please select at least one row.');
      return;
    }

    if (
      this.selectedRows.length === 1 &&
      (!this.Remarks || this.Remarks.trim() === '')
    ) {
      alert('Remarks cannot be blank.');
      return;
    }

    const payload = {
      Groupdetail: this.selectedRows,
      Cheque_Status: this.selectedChequeStatus || '',
      Cancellation_Charges: this.selectedCancellationCharges || '',
      Remarks: this.Remarks,
      mode: 'Approve',
      userId: this.userdetail.user_Id
    };

    this.service.CreateReIssueApproveReject(payload).subscribe({
      next: (res: any) => {

        let msg =
          res?.Data?.response ||
          res?.response ||
          '';

        try {
          if (typeof msg === 'string' && msg.startsWith('[')) {
            const parsed = JSON.parse(msg);
            msg =
              parsed?.[0]?.Error_Message ||
              parsed?.[0]?.Message ||
              parsed?.[0]?.message ||
              msg;
          }
        } catch {
        }

        alert(msg);

        if (
          typeof msg === 'string' &&
          msg.toLowerCase().includes('success')
        ) {
          this.selectedRows = [];
          this.onSearch();
        }
      },

      error: (err) => {
        console.error(err);

        const errorMsg =
          err?.error?.Data?.response ||
          err?.error?.response ||
          err?.message;

        alert(errorMsg);
      }
    });
  }

  // REJECT

  Reject(): void {

    if (this.selectedRows.length === 0) {
      alert('Please select at least one row.');
      return;
    }

    if (
      this.selectedRows.length === 1 &&
      (!this.Remarks || this.Remarks.trim() === '')
    ) {
      alert('Remarks cannot be blank.');
      return;
    }

    const payload = {
      Groupdetail: this.selectedRows,
      Cheque_Status: this.selectedChequeStatus || '',
      Cancellation_Charges: this.selectedCancellationCharges || '',
      Remarks: this.Remarks,
      mode: 'Reject',
      userId: this.userdetail.user_Id
    };

    this.service.CreateReIssueApproveReject(payload).subscribe({
      next: (res: any) => {

        let msg =
          res?.Data?.response ||
          res?.response ||
          '';

        try {
          if (typeof msg === 'string' && msg.startsWith('[')) {
            const parsed = JSON.parse(msg);
            msg =
              parsed?.[0]?.Error_Message ||
              parsed?.[0]?.Message ||
              parsed?.[0]?.message ||
              msg;
          }
        } catch {
        }

        alert(msg || 'No response from server');

        if (
          typeof msg === 'string' &&
          msg.toLowerCase().includes('success')
        ) {
          this.selectedRows = [];
          this.onSearch();
        }
      },

      error: (err) => {
        console.error(err);

        const errorMsg =
          err?.error?.Data?.response ||
          err?.error?.response ||
          err?.message

        alert(errorMsg);
      }
    });
  }


  Hold(): void {

    if (this.selectedRows.length === 0) {
      alert('Please select at least one row.');
      return;
    }

    if (
      this.selectedRows.length === 1 &&
      (!this.Remarks || this.Remarks.trim() === '')
    ) {
      alert('Remarks cannot be blank.');
      return;
    }

    const payload = {
      Groupdetail: this.selectedRows,
      Cheque_Status: this.selectedChequeStatus || '',
      Cancellation_Charges: this.selectedCancellationCharges || '',
      Remarks: this.Remarks,
      mode: 'Hold',
      userId: this.userdetail.user_Id
    };

    this.service.CreateReIssueApproveReject(payload).subscribe({
      next: (res: any) => {

        let msg =
          res?.Data?.response ||
          res?.response ||
          '';

        try {
          if (typeof msg === 'string' && msg.startsWith('[')) {
            const parsed = JSON.parse(msg);
            msg =
              parsed?.[0]?.Error_Message ||
              parsed?.[0]?.Message ||
              parsed?.[0]?.message ||
              msg;
          }
        } catch {
        }

        alert(msg || 'No response from server');

        if (
          typeof msg === 'string' &&
          msg.toLowerCase().includes('success')
        ) {
          this.selectedRows = [];
          this.onSearch();
        }
      },

      error: (err) => {
        console.error(err);

        const errorMsg =
          err?.error?.Data?.response ||
          err?.error?.response ||
          err?.message ||
          'Hold Failed';

        alert(errorMsg);
      }
    });
  }



  DownloadReissueApproveTemplate() {
    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      return;
    }

    const flag = 'ReissueApprove';

    this.service.GetReissueApproveTemplate(flag, userId).subscribe({
      next: (res: any) => {

        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'ReissueApprove': worksheet },
          SheetNames: ['ReissueApprove']
        };

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        FileSaver.saveAs(blob, `Reissue_Approve_Template_${Date.now()}.xlsx`);
      },

      error: (err) => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }



}