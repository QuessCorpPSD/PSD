import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';

import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';

import { PayPeriodComponent } from '../../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../../Models/Common';
import { IforeCast } from '../../../../Repository/BankInvoice/BankInvoiceRepository/IforeCast';
import { ForeCastService } from '../../../../Service/BankInvoice/BankInvoiceService/fore-cast.service';
export const Common_TOKEN = new InjectionToken<IforeCast>('Common_TOKEN');
@Component({
  selector: 'app-forecast',
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
    MatTooltipModule, MatCardModule, CompanyallComponent, PayPeriodComponent],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: ForeCastService }
  ],
})
export class ForecastComponent {

  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: [] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData)
  displayedColumns: string[] = [
    "delete",
    "edit",
    "Sno",
    "companyCode",
    "CompanyName",
    "InvoiceNumber",
    "Payperiod",
    "Region",
    "Sbu",
    "ZMForecast",
    "CollectedAmount",
    "BalanceAmount",
    "ManagementForest",
    "ModeOfPayment",
    "Status",
    "username",
    "PostedDate",
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
  Forecast!: FormGroup
  forecastList: any[] = [];
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
  month: any;
  selectedMonth: any = '';
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payPeriodId: number = 0;
  payperiods: String = '';
  SbuList: any[] = [];
  RegionList: any[] = [];
  InvoiceList: any[] = [];





  @ViewChild('paginator') paginator!: MatPaginator;
  clientAdvanceList: any;
  clientAdvancePaymentService: any;
  templateresponse: any;

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: ForeCastService
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

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
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

    this.Forecast = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl(''),

      PayPeriod: new FormControl('', Validators.required),
      Location: new FormControl(''),

      Sbu: new FormControl('', Validators.required),
      Region: new FormControl('', Validators.required),

      ZMForecast: new FormControl(''),
      CollectedAmount: new FormControl(''),
      ManagementForecast: new FormControl(''),
      BalanceAmount: new FormControl(''),

      InvoiceNumber: new FormControl('')
    });
    this.BindMonth();
    this.getSBU();
    this.getRegion();
    this.payPeriodType = "All";

  }
  onSearch() {
    this.isLoading = true;
    this.showTable = true;

    const companyId = this.selectedCompanyId || 0;
    const payPeriod = this.payperiods;
    const mode = 'ALL';

    this.service.SearchForecast(companyId, payPeriod, mode).subscribe({
      next: (res: any) => {

        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        let data = res?.Data?.data?.Table0 ?? [];

        this.forecastList = Array.isArray(data) ? data : [];

        if (this.forecastList.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource<any>(this.forecastList);
        this.dataSource.paginator = this.paginator;

        this.isLoading = false;
      },
      error: () => {
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
  }

  AddLtaOpen() {
    this.isAddclicked = true;
  }
  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert("Please select Company");
      return;
    }

    if (!this.payperiods) {
      alert("Please select Pay Period");
      return;
    }

    this.isLoading = true;

    const payload = {
      companyId: Number(this.selectedCompanyId),
      payPeriod: (this.payperiods || '').trim(),

    };
    this.service.ForecastExport(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0 ?? [];

        if (!jsonData.length) {
          alert("No data available");
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Forecast");

        XLSX.writeFile(wb, `Forecast_${new Date().toISOString().split('T')[0]}.xlsx`);
      },
      error: () => {
        this.isLoading = false;
        alert("Export failed");
      }
    });
  }
  handleCompanyEvent1(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.Forecast.patchValue({
      // CompanyCode: company.companyCode,
      CompanyName: company.companyName
    });

  }

  handlePayperiodEvent1(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    this.Forecast.patchValue({
      PayPeriod: this.payPeriodId
    });

    if (this.selectedCompanyId && this.payPeriodId) {
      this.getInvoiceNumber(this.selectedCompanyId, this.payPeriodId);
    }
  }


  getSBU() {
    this.service.GetSBU().subscribe((res: any) => {
      this.SbuList = res?.Data?.data?.Table0 ?? [];
    });
  }

  onSave() {

    if (this.Forecast.invalid) {
      this.Forecast.markAllAsTouched();
      return;
    }

    const form = this.Forecast.value;

    const payload = {
      Created_By: Number(this.userdetail?.user_Id),
      Mode: this.isEditMode ? "Edit" : "Add",

      forecast: [
        {
          Fore_Cast_Id: this.isEditMode
            ? Number(this.selectedRow?.Fore_Cast_Id)
            : 0,

          Company_Id: Number(this.selectedCompanyId),
          Company_Code: this.selectedCompanyCode,
          Pay_Period_Id: Number(this.payPeriodId),

          Region_Id: Number(form.Region),
          Sbu_Id: Number(form.Sbu),

          Projection_Amount: Number(form.ZMForecast || 0),
          Collected_Amount: Number(form.CollectedAmount || 0),
          Balance_Amount: Number(form.BalanceAmount || 0),
          Final_Projection: Number(form.ManagementForecast || 0),

          Invoice_Id: Number(form.InvoiceNumber || 0)
        }
      ]
    };

    this.service.SaveUpdateDeleteForecast(payload).subscribe({
      next: (res: any) => {

        let msg = "";
        if (res?.Data?.errors?.length > 0) {
          try {
            const result = JSON.parse(res.Data.errors[0]);
            msg = result[0]?.Error_Message;
          } catch {
            msg = res.Data.errors[0];
          }
        }

        if (msg && msg.toLowerCase().includes("success")) {
          alert(msg);

          // ✅ RESET LIKE NORMAL COMPONENT
          this.isAddclicked = false;
          this.isEditMode = false;
          this.selectedRow = null;

          this.Forecast.reset();
          this.onSearch();

        } else {
          alert(msg || "Operation Failed");
        }
      },
      error: () => {
        alert("Error while saving");
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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this.service.ImportForecast(formData).subscribe({
      next: (res) => {

        const response = res?.Data?.response;
        const statusCode = res?.StatusCode;

        if (!res || !res.Data) {
          alert('Server did not return any data.');
          this.isLoading = false;
          return;
        }


        if (
          statusCode === 200 &&
          response?.includes('Successfully')
        ) {
          alert(response); // 🔥 backend message
          this.isLoading = false;
          return;
        }

      
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
              item?.Validation ||
              item?.Message ||
              item || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'Forecast_Errors.xlsx');

          alert(response);
          this.isLoading = false;
          return;
        }

        if (response) {
          alert(response);
        } else {
          alert('Error while processing response.');
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



  BindMonth() {
    this.service.Getmonth().subscribe({
      next: res => { this.month = res.Data }
    });
  }
  getRegion() {
    this.service.GetRegion().subscribe({
      next: (res: any) => {
        this.RegionList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Region');
      }
    });
  }
  getInvoiceNumber(companyId: number, payPeriodId: number) {
    this.service.GetInvoiceNumber(companyId, payPeriodId).subscribe({
      next: (res: any) => {
        this.InvoiceList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Invoice Number');
      }
    });
  }

  bindEditData(data: any) {

    this.Forecast.patchValue({
      CompanyCode: data.Company_Code,
      CompanyName: data.Company_Name,
      PayPeriod: data.Pay_Period_Id,
      Sbu: Number(data.Sbu_Id),
      Region: Number(data.Region_Id),
      ZMForecast: data.Projection_Amount,
      CollectedAmount: data.Collected_Amount,
      BalanceAmount: data.Balance_Amount,
      ManagementForecast: data.Final_Projection,
      InvoiceNumber: data.Invoice_Id
    });

    ['CompanyName', 'PayPeriod'].forEach(c =>
      this.Forecast.get(c)?.disable()
    );

    this.selectedCompanyId = data.Company_Id;
    this.selectedCompanyCode = data.Company_Code;
    this.payPeriodId = data.Pay_Period_Id;
  }

  onEditRow(row: any) {

    this.isAddclicked = true;
    this.isEditMode = true;
    this.selectedRow = row;

    this.service.GetSBU().subscribe((res: any) => {

      this.SbuList = res?.Data?.data?.Table0 ?? [];

      this.bindEditData(row);


      if (this.selectedCompanyId && this.payPeriodId) {
        this.getInvoiceNumber(this.selectedCompanyId, this.payPeriodId);
      }

    });
  }

  onDeleteRow(row: any) {

    if (!confirm('Are you sure you want to delete this Forecast record?')) {
      return;
    }

    const payload = {
      Created_By: Number(this.userdetail?.user_Id),
      Mode: "Delete",

      forecast: [
        {
          Fore_Cast_Id: Number(row.Fore_Cast_Id),

          Company_Id: Number(row.Company_Id),
          Company_Code: row.Company_Code,
          Pay_Period_Id: Number(row.Pay_Period_Id),

          Region_Id: Number(row.Region_Id),
          Sbu_Id: Number(row.Sbu_Id),

          Projection_Amount: Number(row.Projection_Amount || 0),
          Collected_Amount: Number(row.Collected_Amount || 0),
          Balance_Amount: Number(row.Balance_Amount || 0),
          Final_Projection: Number(row.Final_Projection || 0),

          Invoice_Id: Number(row.Invoice_Id || 0)
        }
      ]
    };

    this.service.SaveUpdateDeleteForecast(payload).subscribe({
      next: (res: any) => {

        let msg = "";

        if (res?.Data?.errors?.length > 0) {
          try {
            const result = JSON.parse(res.Data.errors[0]);
            msg = result[0]?.Error_Message;
          } catch {
            msg = res.Data.errors[0];
          }
        }

        if (msg && msg.toLowerCase().includes('success')) {
          alert(msg);

          this.onSearch();

        } else {
          alert(msg || "Delete Failed");
          this.onSearch();
        }
      },
      error: () => {
        alert('Delete failed');
      }
    });
  }


  DownloadForecastTemplate() {
    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      return;
    }
    const flag = 'Forecast';

    this.service.GetForecasttemplate(flag, userId).subscribe({
      next: (res: any) => {

        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'Forecast': worksheet },
          SheetNames: ['Forecast']
        };

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });


        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        FileSaver.saveAs(blob, `Forecast_Template_${Date.now()}.xlsx`);
      },

      error: (err) => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }


}
