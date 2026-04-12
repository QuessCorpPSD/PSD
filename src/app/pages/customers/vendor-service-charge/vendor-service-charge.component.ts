import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { DesignationaddComponent } from '../designationadd/designationadd.component';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { VendorServiceChargeService } from '../../../Service/CUSTOMER/vendor-service.service';
import { VendorServiceChargeAddComponent } from '../vendor-service-charge-add/vendor-service-charge-add.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vendor-service-charge',
 standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, CompanyallComponent, AlertpopupComponent],
  templateUrl: './vendor-service-charge.component.html',
  styleUrl: './vendor-service-charge.component.css'
})
export class VendorServiceChargeComponent {
vendorserviceSearch: any;
 showErrors = false;

  mapNameList: any[] = [];
  

constructor(
  private dialog: MatDialog,
  private vendorservice: VendorServiceChargeService,
  private _decrypt: EncryptionService,
  private _sessionStoreage: SessionStorageService,
   private snackBar: MatSnackBar
) {}
 VendorServiceChargeForm!: FormGroup;
  showTable = false;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  userdetail: any;
  @ViewChild(MatSort) sort!: MatSort;


  uploadDisplayedColumns: string[] = [
    'SNo', 'Company_Code', 'Map_Name', 'ServiceChargeType', 'billingType','FromValue','ToValue', 'Amount', 'Effective_Date'];

  uploadedData: any[] = []; // 🧾 No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }
  setUpCustomFilter() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.category?.toLowerCase().includes(search.category) &&
        data.date?.toLowerCase().includes(search.date) &&
        data.fromvalue?.toString().toLowerCase().includes(search.fromvalue) &&
        data.tovalue?.toString().toLowerCase().includes(search.tovalue) &&
        data.criteria?.toLowerCase().includes(search.criteria) &&
        data.criterianame?.toLowerCase().includes(search.criterianame)
      );
    };
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
onsearch() {
    if (!this.selectedCompanyId) {
      alert("please select Company Code")
      return;
    }
    this.isLoading = true;
    this.showTable = true;

    const companyCode = this.selectedCompanyId;
    this.vendorservice.getAllVendorServiceCharge(companyCode).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log("API Response:", res);
        const tableData = res?.Data?.data?.Table0 || [];
 this.vendorserviceSearch = tableData.map((item: any, index: number) => ({
        ...item,
        SNo: index + 1
      }));

      this.dataSource.data = this.vendorserviceSearch;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
      },
    });
  }

 exportToExcel(): void {
  if (!this.dataSource.data || this.dataSource.data.length === 0) {
    alert("No data to export");
    return;
  }

  const exportData = this.dataSource.data.map((row: any) => ({
    "S.No": row.SNo,
    "Company Code": row.Company_Code,
    "Map Name": row.Map_Name,
    "Service Charge Type": row.ServiceChargeType,
    "Billing Type": row.billingType,
    "From Value": row.FromValue,
    "To Value": row.ToValue,
    "Amount": row.Amount,
    "Effective Date": row.Effective_Date
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  const workbook: XLSX.WorkBook = {
    Sheets: { 'VendorServiceCharge': worksheet },
    SheetNames: ['VendorServiceCharge']
  };
  XLSX.writeFile(workbook, `VendorServiceCharge_${Date.now()}.xlsx`);
}
  downloadExcelFromBase64(base64String: string, fileName: string, fileType: string): void {
      try {
        const byteCharacters = atob(base64String);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
  
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${fileName}.${fileType}`;
  
  
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
  
  
        URL.revokeObjectURL(downloadLink.href);
      } catch (error) {
        console.error('Error downloading from base64:', error);
        alert("Error', 'Failed to process download file")
      }
    }
  
   ImportClick(fileInput: HTMLInputElement): void {
  fileInput.click();
}

onFileChange(event: Event): void {

  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0];

  if (!file) {
    alert("Please upload only one Excel file.");
    return;
  }

  this.isLoading = true;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('CreatedBy', this.userdetail?.user_Id || '');

  this.vendorservice.importVendorServiceCharge(formData).subscribe({

    next: (res) => {
      this.isLoading = false;

      if (!res || !res.Data) {
        alert("No response from server");
        input.value = '';
        return;
      }

      let parsed: any[] = [];

      // ✅ PRIORITY: Parse from errors (your case)
      const rawErr = res?.Data?.errors?.[0];

      try {
        if (rawErr) {
          parsed = typeof rawErr === 'string' ? JSON.parse(rawErr) : rawErr;
        }
        else if (typeof res.Data === 'string') {
          parsed = JSON.parse(res.Data);
        }
        else if (Array.isArray(res.Data)) {
          parsed = res.Data;
        }
        else if (res.Data?.response) {
          parsed = JSON.parse(res.Data.response);
        }
        else if (res.Data?.Error_Message) {
          parsed = [res.Data];
        }
      } catch {
        parsed = [];
      }

      // ✅ SUCCESS CHECK (fix for your issue)
      const successRow = parsed.find(x =>
        x?.Error_Message?.toLowerCase().includes('uploaded successfully')
      );

      if (successRow) {
        this.showAlertPopup(successRow.Error_Message);
        this.onsearch();
        input.value = '';
        return;
      }

      // ❌ ERROR CASE
      if (parsed.length > 0) {

        this.showAlertPopup(parsed[0].Error_Message);

        const exportData = parsed.map((item: any) => ({
          Error_Message: item?.Error_Message || 'Unknown Error'
        }));

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const workbook: XLSX.WorkBook = {
          Sheets: { ErrorMessages: worksheet },
          SheetNames: ['ErrorMessages']
        };

        XLSX.writeFile(workbook, 'VendorServiceCharge_Errors.xlsx');

        input.value = '';
        return;
      }

      // ⚠️ fallback
      alert(res?.Data?.response || "Unexpected response");
      input.value = '';
    },

    error: (err) => {
      this.isLoading = false;
      console.error(err);
      alert("Upload Failed");
      input.value = '';
    }
  });
}
    tryParseResponse(r: any): { parsed: any; msg: string } {
      if (r == null) return { parsed: null, msg: '' };
  
      if (Array.isArray(r)) return { parsed: r, msg: '' };
      if (typeof r === 'object') return { parsed: r, msg: '' };
  
      // string
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
  
  
    downloadTemplate() {
      const templateData = [
        {
          CompanyCode: "",
          MapName: "",
          Type: "",
          BillingType: '',
          From: "",
          To: "",
          Amount: "",
          EffectiveDate: ""
        }
      ];
  
      const workSheet = XLSX.utils.json_to_sheet(templateData);
  
      const workbook: XLSX.WorkBook = {
        Sheets: { 'table': workSheet },
        SheetNames: ['table']
      };
  
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
  
      FileSaver.saveAs(blob, `VendorServiceCharge${Date.now()}.xlsx`)
    }
  
    ngOnInit(): void {
      const userdetail = this._sessionStoreage.getItem('UserProfile');
      this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
      this.VendorServiceChargeForm = new FormGroup({
        companyCode: new FormControl(''),
      })
    }
     AddVendorServiceCharge() {
   
        this.dialog.open(VendorServiceChargeAddComponent, {
          width: '65%',
          height: '50vh',
          disableClose: true,
          data: {    companyId: this.selectedCompanyId  }
        });
      }

 
}
