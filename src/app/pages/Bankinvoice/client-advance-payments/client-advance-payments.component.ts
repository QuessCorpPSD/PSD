import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ILTA, Pay_Token } from '../../Taxandsavings/ltacalculation/ltacalculation.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IClientAdvancePaymets } from '../../../Repository/BankInvoice/IClientAdvancepayments';
import { ClientadvancepaymentsService } from '../../../Service/BankInvoice/clientadvancepayments.service';
export const Common_TOKEN = new InjectionToken<IClientAdvancePaymets>('Common_TOKEN');
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { CompanyfilterComponent } from '../../../common/companyfilter/companyfilter.component';


@Component({
  selector: 'app-client-advance-payments',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule, MatCardModule, CompanyallComponent, CompanyfilterComponent],
  templateUrl: './client-advance-payments.component.html',
  styleUrl: './client-advance-payments.component.css',
  providers: [
    { provide: Pay_Token, useClass: ClientadvancepaymentsService }
  ],

})
export class ClientAdvancePaymentsComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: [] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData)
  displayedColumns: string[] = [
    "delete",
    // "edit",
    "sno",
    "companyCode",
    "referenceNumber",
    "CompanyName",
    "CreatedMode",
    "ModeOfCollections",
    "ChequeUTRNumber",
    "ChequeDate",
    "CreditDate",
    "BankName",
    "AccountNumber",
    "Amount",
    "Action",
    "Remarks",
    "username",
    "PostedDate",
    "GroupName",
    "SubCustomerCode",
    "PostingDate"
  ];
  dataSource = new MatTableDataSource<any>([]);
  companyname: any;
  showTable = false;
  startDate: any;
  endDate: any;
  userdetail: any;
  isLoading = false;
  isAddclicked = false;
  isEditMode: boolean = false;
  ClientAdvance!: FormGroup
  ModeOfCollectionList: any[] = [];
  AccountNumberList: any[] = [];
  BankNameList: any[] = [];
  isTransferClicked = false;
  transferData: any;
  selectedGroupId: number | null = null;
  selectedGroupName: string = '';
  GroupNameList: any[] = [];
  ToCompanyList: any[] = [];
  AllCompanyList: any[] = [];
  selectedToCompanyId: number | null = null;
  selectedRow: any = null;
  selectedToCompanyCode: string = '';
  selectedToCompanyName: string = '';
  transferAmount: number | null = null;
  transferPostingDate: any;
  amountError: string = '';
  selectedFile: File | null = null;

  @ViewChild('paginator') paginator!: MatPaginator;
  clientAdvanceList: any;
  clientAdvancePaymentService: any;
  templateresponse: any;

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: ClientadvancepaymentsService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    if (company == null) {
      this.companyname = '';
    } else {
      this.companyname = company.companyName;
      this.selectedCompanyId = company.companyId;
      this.selectedCompanyCode = company.companyCode;
    }

  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;

    this.ClientAdvance = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl(''),
      ModeOfCollections: new FormControl('', Validators.required),
      GroupName: new FormControl(''),
      CreditDate: new FormControl('', Validators.required),
      UTRChequeNumber: new FormControl('', Validators.required),
      BankName: new FormControl('', Validators.required),
      ChequeDate: new FormControl(''),
      Amount: new FormControl('', Validators.required),
      AccountNumber: new FormControl('', Validators.required),
      PostingDate: new FormControl('', Validators.required),
      Remarks: new FormControl('')
    });
    this.BindModeOfCollections();
    this.BindAccountNumbers();
    this.BindBankName();
  }

  onSearch() {
    this.isLoading = true;

    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      this.isLoading = false;
      this.showTable = false;
      return;
    }

    this.showTable = true;

    const companyId = this.selectedCompanyId || 0;
    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    this.service.Search(companyId, fromDate, toDate).subscribe({
      next: (res) => {

        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.clientAdvanceList = res?.Data?.data?.Table0 ?? [];

        if (this.clientAdvanceList.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.clientAdvanceList);
        this.dataSource.paginator = this.paginator;

        this.displayedColumns = [
          "delete",
          // "edit",
          "sno",
          "companyCode",
          "referenceNumber",
          "CompanyName",
          "CreatedMode",
          "ModeOfCollections",
          "ChequeUTRNumber",
          "ChequeDate",
          "CreditDate",
          "BankName",
          "AccountNumber",
          "Amount",
          "Action",
          "Remarks",
          "username",
          "PostedDate",
          "GroupName",
          "SubCustomerCode",
          "PostingDate"
        ];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.isLoading = false;
      }
    });
  }

  formatDate(date: any): string {
    if (!date) return '';

    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }


  closeclick() {
    this.isAddclicked = false;
    this.ClientAdvance.reset();
  }

  AddLtaOpen() {
    this.isAddclicked = true;
    this.ClientAdvance.reset();
  }

  exportToExcel(): void {

    this.isLoading = true;

    const payload = {
      companyId: (this.selectedCompanyId || 0).toString(),
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate)
    };

    this.service.ClientAdvancePaymentExport(payload).subscribe({
      next: (res) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || jsonData.length === 0) {
          alert("No data available");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ClientAdvancePayment");

        const date = new Date().toISOString().split('T')[0];
        const fileName = `ClientAdvancePayment_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },
      error: (err) => {
        this.isLoading = false;
        alert("Export failed");
        console.error(err);
      }
    });
  }

  handleCompanyEvent1(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.ClientAdvance.patchValue({
      // CompanyCode: company.companyCode,
      CompanyName: company.companyName
    });
    this.BindGroupName();
  }

  BindModeOfCollections() {
    this.service.GetModeOfCollections('GetModeOfCollections').subscribe({
      next: (res: any) => {
        this.ModeOfCollectionList = res.Data.data.Table0;
      }
    });
  }

  BindAccountNumbers() {
    this.service.GetOnAccountNumbers('ONACCOUNT', 'GetOnAccountNumbers').subscribe(res => {
      this.AccountNumberList = res.Data.data.Table0;
    });
  }


  BindBankName() {
    this.service.GetBankNameForOnAccount().subscribe(res => {
      this.BankNameList = res.Data.data.Table0;
    });
  }
  onBankChange() {
    const bankId = this.ClientAdvance.value.BankName;
    if (!bankId) {
      this.AccountNumberList = [];
      return;
    }
    const bank = this.BankNameList.find(x => x.Bank_Id == bankId);
    const bankName = bank ? bank.Bank_Name : '';

    this.service.GetOnAccountNumbers(bankName, 'GetOnAccountNumbers')
      .subscribe(res => {
        this.AccountNumberList = res?.Data?.data?.Table0 || [];
      });
  }

  openTransferPopup(row: any) {
    this.transferData = row;
    this.isTransferClicked = true;
  }

  closeTransferPopup() {
    this.isTransferClicked = false;
  }

  handleGroupEvent(group: any) {
    this.selectedGroupId = Number(group.siteCode);
    this.selectedGroupName = group.siteName;

    this.transferData.patchValue({
      GroupName: group.siteName
    });
  }


  onSave() {
    if (this.ClientAdvance.invalid) {
      this.ClientAdvance.markAllAsTouched();
      return;
    }

    const form = this.ClientAdvance.value;
    const payload = {
      Created_By: Number(this.userdetail.user_Id),
      Mode: "Add",
      clientadvancepayment: [
        {
          Client_Advance_Payment_Id: 0,
          Reference_Id: "",
          Company_Id: Number(this.selectedCompanyId),

          UTRChequeNumber: form.UTRChequeNumber,
          Cheque_Date: form.ChequeDate ? this.formatDateApi(form.ChequeDate) : null,
          Credit_Date: this.formatDateApi(form.CreditDate),
          Posting_Date: this.formatDateApi(form.PostingDate),

          Bank_Id: Number(form.BankName),
          Amount: Number(form.Amount),
          Remarks: form.Remarks,

          Client_Id: 0,
          OnAccountTypeValue: 0,
          ModeOfCollectionsValue: Number(form.ModeOfCollections),
          OnAccountNumbersValue: Number(form.AccountNumber),
          Group_Detail_Id: Number(form.GroupName)
        }
      ]
    };

    this.service.SaveUpdateDeleteClientAdvancePayment(payload).subscribe({
      next: (res: any) => {
        let msg = "";

        if (res?.Data?.response) {
          const result = JSON.parse(res.Data.response);
          msg = result[0]?.Error_Message;
        }

        if (msg && msg.toLowerCase().includes("success")) {
          alert(msg);
          this.isAddclicked = false;
          this.onSearch();
        } else {
          alert(msg || "Save Failed");
        }
      },
      error: () => {
        alert("Error while saving");
      }
    });
  }


  onDeleteRow(row: any) {
    if (!confirm('Are you sure you want to delete this Client Advance Payment?')) {
      return;
    }

    const payload = {
      Created_By: Number(this.userdetail.user_Id),
      Mode: "Delete",
      clientadvancepayment: [
        {
          Client_Advance_Payment_Id: row.Client_Advance_Payment_Id,
          Reference_Id: row.Reference_Id,
          Company_Id: row.Company_Id,
          UTRChequeNumber: row.UTRChequeNumber,
          Cheque_Date: row.Cheque_Date,
          Credit_Date: row.Credit_Date,
          Posting_Date: row.Posting_Date,
          Bank_Id: row.Bank_Id,
          Amount: row.Amount,
          Remarks: row.Remarks,
          Client_Id: 0,
          OnAccountTypeValue: row.OnAccountTypeValue,
          ModeOfCollectionsValue: row.ModeOfCollectionsValue,
          OnAccountNumbersValue: row.OnAccountNumbersValue,
          Group_Detail_Id: row.Group_Detail_Id
        }
      ]
    };



    this.service.SaveUpdateDeleteClientAdvancePayment(payload).subscribe({
      next: (res: any) => {

        let msg = "Delete Failed";

        // Success message directly from response
        if (res?.Data?.response?.toLowerCase().includes("success")) {
          msg = res.Data.response;
          alert(msg);
          this.onSearch();   // refresh grid
          return;
        }

        // Handle backend error array
        if (res?.Data?.errors?.length > 0) {
          try {
            const parsed = JSON.parse(res.Data.errors[0]);
            msg = parsed[0]?.Error_Message || msg;
          } catch {
            msg = res.Data.errors[0];
          }
        } else if (res?.Data?.response) {
          msg = res.Data.response;
        }

        alert(msg);
        this.onSearch();   // refresh grid even on failure
      },

      error: (err: any) => {
        console.error("Delete Error:", err);
        alert("Delete failed");
        this.onSearch();   // refresh if API error
      }
    });
  }

  formatDateApi(date: any): string | null {
    if (!date) return null;

    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }



  BindGroupName() {
    if (!this.selectedCompanyId) return;

    this.service.GetGroupNameByCompanyID(this.selectedCompanyId)
      .subscribe(res => {
        this.GroupNameList = res.Data.data.Table0;
      });
  }

  handleToCompanyFilterEvent(company: any) {
    if (!company) return;

    this.selectedToCompanyId = Number(company.companyId);
    this.selectedToCompanyCode = company.companyCode;
    this.selectedToCompanyName = company.companyName;

    this.service.GetGroupNameByCompanyID(this.selectedToCompanyId!)
      .subscribe(res => {
        this.GroupNameList = res.Data.data.Table0;
      });
  }

  validateTransferAmount() {
    this.amountError = '';
    if (this.transferAmount == null) return;

    if (this.transferAmount <= 0) {
      this.amountError = 'Amount must be greater than 0';
    }
    else if (this.transferAmount > this.transferData.Amount) {
      this.amountError = 'Amount cannot be greater than Max Transferable Amount';
    }
  }

  onTransfer() {

    if (!this.selectedRow) {
      alert("Please select a row to transfer");
      return;
    }

    if (!this.selectedToCompanyId) {
      alert("Please select To Company");
      return;
    }

    if (!this.selectedGroupId) {
      alert("Please select Group");
      return;
    }

    if (this.transferAmount === null || this.transferAmount === undefined) {
      alert("Enter valid Transfer Amount");
      return;
    }

    if (this.transferAmount === 0) {
      alert("Amount cannot be zero");
      return;
    }

    if (this.transferAmount < 0) {
      alert("Enter valid Transfer Amount");
      return;
    }

    if (this.transferAmount > this.transferData.Amount) {
      alert("Amount cannot be greater than Max Transferable Amount");
      return;
    }
    if (!this.transferPostingDate) {
      alert("Select Posting Date");
      return;
    }

    const payload = {
      Created_By: Number(this.userdetail.user_Id),
      Mode: "Transfer",
      clientadvancepayment: [
        {
          Client_Advance_Payment_Id: Number(this.selectedRow.Client_Advance_Payment_Id),
          Company_Id: Number(this.selectedToCompanyId),
          UTRChequeNumber: this.selectedRow.UTRChequeNumber,
          Cheque_Date: this.selectedRow.Cheque_Date,
          Credit_Date: this.selectedRow.Credit_Date,
          Bank_Id: Number(this.selectedRow.Bank_Id),
          Amount: Number(this.transferAmount),
          Remarks: this.selectedRow.Remarks,
          Client_Id: 0,
          OnAccountTypeValue: 0,
          ModeOfCollectionsValue: Number(this.selectedRow.ModeOfCollectionsValue),
          OnAccountNumbersValue: Number(this.selectedRow.OnAccountNumbersValue),
          Posting_Date: this.formatDateApi(this.transferPostingDate),
          Group_Detail_Id: Number(this.selectedGroupId)
        }
      ]
    };


    this.service.TransferClientAdvancePayment(payload).subscribe({
      next: (res: any) => {
        const message = res?.Data?.response;

        if (message === "Transfer Successful") {
          this.closeTransferPopup();
          alert(message);
          this.onSearch();
        } else {
          alert(message);
        }
      },
      error: () => {
        alert("API Error");
      }
    });
  }
  onRowSelect(event: any) {
    this.selectedRow = event.args.row;
  }

  onRowClick(row: any) {
    this.selectedRow = row;
    console.log("Selected Row:", this.selectedRow);
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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this.service.ImportClientAdvancePayment(formData).subscribe({
      next: (res) => {

        const response = res?.Data?.response;
        const statusCode = res?.StatusCode;

        if (!res || !res.Data) {
          alert('Server did not return any data.');
          this.isLoading = false;
          return;
        }

        // ✅ SUCCESS
        if (
          statusCode === 200 &&
          response?.includes('Row(s) Uploaded Successfully.')
        ) {
          alert(response); // 🔥 dynamic message
          this.isLoading = false;
          return;
        }

        // ❌ FAILED IMPORT WITH ERRORS
        if (
          statusCode === 200 &&
          response === 'Failed to Import.'
        ) {

          let errorArray: any[] = [];

          try {
            const rawErr = res?.Data?.errors?.[0];

            if (typeof rawErr === 'string') {
              errorArray = JSON.parse(rawErr);
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }

          } catch {
            errorArray = [{ Error_Message: 'Error parsing server response' }];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item?.Error_Message ||
              item?.Message ||
              item?.message ||
              item || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'ClientAdvancePayment_Errors.xlsx');

          alert(response);
          this.isLoading = false;
          return;
        }

        if (response) {
          alert(response);
        } else {
          alert('response');
        }

        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        alert('Upload Failed');
        this.isLoading = false;
      }
    });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }


  DownloadClientAdvancePaymentTemplate() {
    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      return;
    }

    const flag = 'Onaccount';

    this.service.GetClientAdvancePaymentTemplate(flag, userId).subscribe({
      next: (res: any) => {

        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'ClientAdvancePayment': worksheet },
          SheetNames: ['ClientAdvancePayment']
        };

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        // ✅ Correct MIME type
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        FileSaver.saveAs(blob, `Client_Advance_Payment_Template_${Date.now()}.xlsx`);
      },

      error: (err) => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }
}
