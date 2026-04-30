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
import { ReleaseGrid } from '../../../Models/SalaryRelease/Release';
import { ReleaseImportGrid } from '../../../Models/SalaryRelease/ReleaseImportGrid';
import { SalaryHoldGrid } from '../../../Models/SalaryRelease/SalaryHold';
import { DBTHoldGrid } from '../../../Models/SalaryRelease/DBTHold';
import { PartialHoldGrid } from '../../../Models/SalaryRelease/PartialHold';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { SalaryReleaseApprovalService } from '../../../Service/Service/SalaryRequestNew/salary-release-approval.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { ISalaryReleaseApproval } from '../../../Repository/SalaryRequestNew/ISalaryReleaseApproval';
import * as FileSaver from 'file-saver';

export const Pay_TOKEN = new InjectionToken<ISalaryReleaseApproval>('Pay_TOKEN');

@Component({
  selector: 'app-salary-release-approve',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginator, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, MatIconModule, MatTooltipModule, MatCardModule],
  templateUrl: './salary-release-approve.component.html',
  styleUrl: './salary-release-approve.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: SalaryReleaseApprovalService,
    }
  ]

})
export class SalaryReleaseApproveComponent {

  payPeriodTypefromParent: string = '';
  selectedTemplate: string = '';
  companyUI: any;
  payperiodUI: any;
  isLoading = false;
  istablevisible = false;
  dataSource = new MatTableDataSource<any>([]);
  userdetail: any;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  searchText: string = '';
  showTable = false;
  batchtype: any;
  entitylist: any;
  Batchtype: any;
  CollectionStatus: any;
  collectionStatus: any;
  remarks: any;
  currentView: 'search' | 'upload' | null = null;
  uploadDataSource = new MatTableDataSource<any>([]);
  isUploadTableVisible = false;
  selectedUploadRows: any[] = [];
  dynamicUploadColumns: string[] = [];
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _sessionStoreage: SessionStorageService, private decry: EncryptionService, @Inject(Pay_TOKEN) private service: ISalaryReleaseApproval,) { }


  displayedColumns: string[] = [
    'select', 'slno', 'company_code', 'InvoiceNumber', 'ReleaseStatus',
    'payPeriod', 'remarks'
  ];

  displayedColumnsImport: string[] = [
    'select', 'InvoiceNumber'];


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
    this.Bindbatchtype();

  }


  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }

  onTemplateChange(): void {
    if (this.selectedTemplate === "") {
      this.selectedTemplate = "";
    }

    this.dataSource.data = [];

  }

  Bindbatchtype() {
    this.service.Batchtype(this.userdetail.user_Id).subscribe({
      next: res => { this.batchtype = res.Data }
    });
  }


  // searchClick() {

  //   // if (!this.companyUI) {
  //   //   alert("Select Company Code");
  //   //   return;
  //   // }
  //   // if (!this.payperiodUI) {
  //   //   alert("Select Pay Period");
  //   //   return;
  //   // }

  //   this.showTable = true;
  //   this.dataSource.data = [];


  //   // if (this.companyUI && this.payperiodUI) {

  //   //   // this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
  //   // }
  // }

  searchClick() {

    if (!this.Batchtype) {
      alert("Please Select Batchtype");
      return;
    }

    if (!this.CollectionStatus) {
      alert("Please Select CollectionStatus");
      return;
    }

    this.currentView = 'search';
    this.isLoading = true;

    const batchtype = this.Batchtype;
    const collectionStatus = this.CollectionStatus;
    const userid = this.userdetail.user_Id;

    this.service.Search(batchtype, collectionStatus, userid).subscribe({
      next: res => {

        const tableData = res?.Data?.data?.Table0;

        if (!tableData || tableData.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource<any>(tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },

      error: err => {
        console.error('Error fetching data:', err);
        this.isLoading = false;
      }
    });
  }

  exportToExcel(): void {
    if (!this.Batchtype) {
      alert("Please Select Batchtype");
      return;
    }

    if (!this.CollectionStatus) {
      alert("Please Select CollectionStatus");
      return;
    }

    this.istablevisible = true;
    this.isLoading = true;

    const batchtype = this.Batchtype;
    const collectionStatus = this.CollectionStatus;
    const userid = this.userdetail.user_Id;

    this.isLoading = true;
    this.service.Export(batchtype, collectionStatus, userid).subscribe({
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

          XLSX.utils.book_append_sheet(wb, ws, 'SalaryReleaseApporoval');
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `SalaryReleaseApporoval_Details_${timestamp}.xlsx`;
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
  selectedRows: any[] = [];


  onRowSelect(element: any) {
    if (element.selected) {
      this.selectedRows.push(element);
    } else {
      this.selectedRows = this.selectedRows.filter(row => row !== element);
    }
  }


  selectAllRows(event: any) {
    const isSelected = event.checked;
    this.dataSource.data.forEach(row => {
      row.selected = isSelected;
      if (isSelected && !this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      } else if (!isSelected) {
        this.selectedRows = [];
      }
    });
  }

  // Method to check if all rows are selected
  isAllSelected(): boolean {
    const numSelected = this.selectedRows.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Method to check if some rows are selected
  isSomeSelected(): boolean {
    const numSelected = this.selectedRows.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }



  Approval() {
    // Validate Batchtype and CollectionStatus
    if (!this.Batchtype) {
      alert("Please Select Batchtype");
      return;
    }

    if (!this.CollectionStatus) {
      alert("Please Select CollectionStatus");
      return;
    }

    if (this.selectedRows.length === 0) {
      alert("Please select at least one row.");
      return;
    }
    const payload = {
      BatchType: this.Batchtype,
      CollectionStatus: this.CollectionStatus,
      UserId: this.userdetail.user_Id,

      approvedata: this.selectedRows.map((r: any) => ({
        InvoiceNumber: r.Invoice_No,
        Status: "APPROVE",
        Remarks: r.Remarks
      }))
    };

    console.log('Generated Payload:', JSON.stringify(payload));


    this.service.Apporoval(payload).subscribe({
      next: (res: any) => {
        console.log('Response:', res);

        const msg = res?.Data || res.Data.message;


        if (res.Data && res.Data.length > 0 && res.Data[0].validation) {
          const validationMessages = res.Data.map((item: any) => ({
            ValidationMessage: item.validation
          }));

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(validationMessages);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Validation Errors');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Validation_Errors_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } else {
          if (msg?.toLowerCase().includes('success')) {
            // alert(msg);

            const approvalData = res.Data;

            if (approvalData && approvalData.length > 0) {
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(approvalData);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Approval Data');

              const timestamp = new Date().toISOString().split('T')[0];
              const fileName = `Approval_Data_${timestamp}.xlsx`;

              XLSX.writeFile(wb, fileName);
            } else {
              alert('No data available to download.');
            }
          } else {
            alert(msg);
          }
        }
      },
      error: () => {
        alert('Error while processing');
      }
    });
  }


  Reject() {

    if (!this.Batchtype) {
      alert("Please Select Batchtype");
      return;
    }

    if (!this.CollectionStatus) {
      alert("Please Select CollectionStatus");
      return;
    }
    if (!this.remarks) {
      alert("Remarks are required to complete the rejection process. Please enter your comments.");
      return;
    }

    if (this.selectedRows.length === 0) {
      alert("Please select at least one row.");
      return;
    }
    const isConfirmed = confirm("Are you sure you want to reject?");

    if (!isConfirmed) {
      return;
    }

    const payload = {
      BatchType: this.Batchtype,
      CollectionStatus: this.CollectionStatus,
      UserId: this.userdetail.user_Id,

      approvedata: this.selectedRows.map((r: any) => ({
        InvoiceNumber: r.Invoice_No,
        Status: "REJECT",
        Remarks: this.remarks
      }))
    };

    console.log('Generated Payload:', JSON.stringify(payload));


    this.service.Apporoval(payload).subscribe({
      next: (res: any) => {
        console.log('Response:', res);

        const msg = res?.Data || res.Data.message;


        if (res.Data && res.Data.length > 0 && res.Data[0].validation) {
          const validationMessages = res.Data.map((item: any) => ({
            ValidationMessage: item.validation
          }));

          // Generate Excel with validation messages
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(validationMessages);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Validation Errors');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Validation_Errors_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

          alert("Validation errors found! Excel with error details has been downloaded.");
        } else {
          if (msg?.toLowerCase().includes('success')) {
            // alert(msg);

            const rejectionData = res.Data;

            if (rejectionData && rejectionData.length > 0) {
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rejectionData);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Rejection Data');

              const timestamp = new Date().toISOString().split('T')[0];
              const fileName = `Rejection_Data_${timestamp}.xlsx`;

              // Download the Excel file for rejected data
              XLSX.writeFile(wb, fileName);
            } else {
              alert('No data available to download.');
            }
          } else {
            alert(msg);  // Handle error message if any
          }
        }
      },
      error: () => {
        alert('Error while processing');
      }
    });
  }

  onFileUpload(event: any) {
    if (!this.Batchtype) {
      alert("Please Select Batchtype");
      return;
    }

    if (!this.CollectionStatus) {
      alert("Please Select CollectionStatus");
      return;
    }
    const file = event.target.files[0];
    if (!file) return;
    this.isLoading = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];

      const jsonData: any[] = XLSX.utils.sheet_to_json(ws);

      if (!jsonData || jsonData.length === 0) {
        alert('Empty file');
        return;
      }

      const headers = Object.keys(jsonData[0]).map(h =>
        h.trim().toLowerCase().replace(/\s+/g, '_')
      );
      const updatedData = jsonData.map((row: any) => {
        const newRow: any = { selected: false };

        Object.keys(row).forEach(key => {
          const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
          newRow[cleanKey] = row[key];
        });

        return newRow;
      });

      this.dynamicUploadColumns = ['select', ...headers];

      this.uploadDataSource = new MatTableDataSource(updatedData);
      this.currentView = 'upload';
      this.selectedUploadRows = [];
    };

    reader.readAsBinaryString(file);
    this.isLoading = false;
  }

  sendUploadRequest() {
    if (!this.Batchtype) {
      alert("Please Select Batchtype");
      return;
    }

    if (!this.CollectionStatus) {
      alert("Please Select CollectionStatus");
      return;
    }

    if (this.selectedUploadRows.length === 0) {
      alert("No rows selected");
      return;
    }

    const payload = {
      BatchType: this.Batchtype,
      CollectionStatus: this.CollectionStatus,
      UserId: this.userdetail.user_Id,

      approvedata: this.selectedUploadRows.map((r: any) => ({
        InvoiceNumber: (r.invoicenumber ?? r.invoice_number ?? '').toString(),
        Status: r.status,
        Remarks: r.remarks   
      }))
    };

    console.log("Upload Payload:", payload);

    this.service.Apporoval(payload).subscribe({
      next: (res: any) => {

        let excelData: any[] = [];

        if (res.Data && Array.isArray(res.Data) && res.Data[0]?.validation) {

          excelData = res.Data.map((item: any, index: number) => ({

            Message: item.validation
          }));

        }
        else if (res.Data && Array.isArray(res.Data)) {

          excelData = res.Data.map((item: any, index: number) => ({

            ...item
          }));

        }
        else {
          excelData = [{
            Status: "INFO",
            Message: res?.Data?.message
          }];
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, 'Upload Result');

        const fileName = `Upload_Result_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(wb, fileName);

        alert("Result downloaded in Excel");
        this.searchClick();
      },

      error: (err: any) => {
        console.error('Error while processing upload request', err);

        const errorsObj = err?.error?.Data?.errors;

        if (!errorsObj) {
          alert('No error data found');
          return;
        }

        const errorData: any[] = [];

        Object.keys(errorsObj).forEach((key) => {
          const messages = errorsObj[key];
          messages.forEach((msg: string) => {
            errorData.push({
              Field: key,
              Error_Message: msg
            });
          });
        });

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(errorData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, 'Error');

        XLSX.writeFile(wb, `Upload_Error_${new Date().getTime()}.xlsx`);

        alert('❌ Upload failed. Error file downloaded.');
      }
    });
  }

  onUploadRowSelect(row: any) {
    if (row.selected) {
      if (!this.selectedUploadRows.includes(row)) {
        this.selectedUploadRows.push(row);
      }
    } else {
      this.selectedUploadRows = this.selectedUploadRows.filter(r => r !== row);
    }
  }

  selectAllUploadRows(event: any) {
    const checked = event.checked;

    this.uploadDataSource.data.forEach(row => {
      row.selected = checked;
    });

    this.selectedUploadRows = checked ? [...this.uploadDataSource.data] : [];
  }

  isAllUploadSelected(): boolean {
    const numSelected = this.selectedUploadRows.length;
    const numRows = this.uploadDataSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  isSomeUploadSelected(): boolean {
    const numSelected = this.selectedUploadRows.length;
    const numRows = this.uploadDataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  downloadTemplate() {
    const userid = this.userdetail.user_Id;
    const flag = 'BankAdviceApprove';
    this.service.Downloadtemplate(flag, userid).subscribe({
      next: (res) => {
        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'SalaryReleasetemplate': worksheet },
          SheetNames: ['SalaryReleasetemplate']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `SalaryReleasePending/Approval_${Date.now()}.xlsx`);
      },
      error: (err) => {
        console.error('Error downloading template', err);
      }
    });
  }
}



