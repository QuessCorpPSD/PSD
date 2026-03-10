import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, TrackByFunction } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Company, Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { finalize } from 'rxjs';
import { IInputaggregator } from '../../../Repository/Inputaggregator/Iinputaggregator';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { InputaggregatorService } from '../../../Service/inputaggregator/inputaggregator.service';
export const Pay_TOKEN = new InjectionToken<IInputaggregator>('Pay_TOKEN');

interface ClientAttribute {
  Client_Attribute_Id: number;
  Client_Attribute_Name: string;
}

interface AttributeMapping {
  clientAttribute: string;
  quessAttribute: string;
  Template_Field_Name: string;
  SelectedQuessAttributeId: any;
}

interface QuessAttribute {
  Quess_Template_Field_Id: number;
  Quess_Template_Field_Name: string;
  IsActive: boolean;
}
@Component({
  selector: 'app-inputaggregatorattendance',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CompanyallComponent, MatIconModule, PayPeriodComponent],
  templateUrl: './inputaggregatorattendance.component.html',
  styleUrl: './inputaggregatorattendance.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: InputaggregatorService,
    }
  ]
})
export class InputaggregatorattendanceComponent {
  mapname: any;
  userdetail: any;
  sitename: any;
  isLoading = false;
  SelectedQuessAttributeId: any;
  selectCompanyId: any;
  selectCompanyCode: any;
  payPeriod!: Payperiodclass;
  payperiodId: any;
  payperiods: any;
  payPeriodType: any;
  Attendancesearch: any[] = [];
  payPeriodmain!: Payperiodclass;
  payperiodIdmain: any;
  payperiodsmain: any;
  constructor(@Inject(Pay_TOKEN) private service: IInputaggregator,
    private decry: EncryptionService, private _sessionStoreage: SessionStorageService) {

  }
  isCompanyDropdownOpen = false;
  isMapDropdownOpen = false;
  isSiteDropdownOpen = false;
  isManagerDropdownOpen = false;
  isAttendanceDropdownOpen = false;
  isReportDropdown = false;
  isTemplateDropdownOpen = false;
  openAttributeDropdown: number | null = null;


  searchQuery = '';
  selectedItem: string | null = null;
  quessMasterAttributes: QuessAttribute[] = [];

  selectedItems: { [key: number]: string } = {};

  selectedCompanyId: any;
  selectedCompanyCode: any;
  showInfoPopup = false;
  showreportPopup = false;

  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation(); // VERY IMPORTANT
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(type: string, fileInput2: HTMLInputElement) {
    this.isDropdownOpen = false;

    console.log(type + ' selected');
    this.ImportClickclient(fileInput2);
    // fileInput.click(); // open file picker
  }


  handleCompanysEvent(company: Company | null) {
    if (!company) {
      this.selectCompanyId = null;
      this.selectCompanyCode = null;
      return;
    }

    this.selectCompanyId = company.companyId;
    this.selectCompanyCode = company.companyCode;
  }


  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;

  }
  toggleInfoPopup() {
    this.showInfoPopup = !this.showInfoPopup;
  }

  closeInfoPopup() {
    this.showInfoPopup = false;
  }

  closereportPopup() {
    this.showreportPopup = false;
  }
  togglereportPopup() {
    this.showreportPopup = !this.showreportPopup;
  }
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.loadQuessAttributes();
    this.payPeriodType = "All";
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
    this.BindMapname();
    this.BindSitename();
  }

  handlePayperiodEventmain(payperiod: Payperiodclass) {
    this.payPeriodmain = payperiod;
    this.payperiodIdmain = payperiod.payfrequencyid;
    this.payperiodsmain = payperiod.payPeriod;

  }
  BindMapname() {
    const companyid = this.selectedCompanyId;
    this.service.getmapname(companyid).subscribe({
      next: res => {
        this.mapname = res.Data;
        console.log(this.mapname)
      }
    });
  };
  BindSitename() {
    const companyid = this.selectedCompanyId || 0;
    const groupid = 0;

    this.service.SiteSearch(companyid, groupid).subscribe({
      next: res => {
        this.sitename = res.Data?.data?.Table0;
        console.log(this.mapname)
      }
    });
  };
  loadQuessAttributes() {
    this.service.getQuessAttendanceAttributes().subscribe(res => {
      this.quessMasterAttributes =
        res?.Data?.data?.Table0 as QuessAttribute[] || [];

    });
  }
  trackByIndex(index: number, item: any) {
    return index;
  }


  attributeMappings: AttributeMapping[] = [];

  selectItem(name: string) {
    this.selectedItem = name;
  }

  get filteredAttributes(): QuessAttribute[] {
    if (!this.searchQuery) {
      return this.quessMasterAttributes;
    }

    return this.quessMasterAttributes.filter(item =>
      item.Quess_Template_Field_Name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  toggleTemplateDropdown() {
    this.isTemplateDropdownOpen = !this.isTemplateDropdownOpen;
    console.log('Template dropdown:', this.isTemplateDropdownOpen);
  }

  toggleReprotDropdown() {
    this.isReportDropdown = !this.isReportDropdown;
    console.log('Template dropdown:', this.isReportDropdown);
  }


  downloadTemplate(type: 'mapping' | 'client') {
    this.isTemplateDropdownOpen = false;

    let worksheet: XLSX.WorkSheet;
    let workbook: XLSX.WorkBook;
    let fileName: string;

    if (type === 'mapping') {
      console.log('Download Attributes Mapping Template');

      const headers = [
        'COMPANY_CODE',
        'CLIENT_ATTRIBUTE_NAME',
        'QUESS_ATTRIBUTE_NAME',
        'EFFECTIVE_DATE',
        'ISACTIVE',
        'MODE'
      ];

      const data = this.filteredAttributes.map(item => ({
        COMPANY_CODE: this.selectedCompanyCode || '',
        CLIENT_ATTRIBUTE_NAME: '',
        QUESS_ATTRIBUTE_NAME: item.Quess_Template_Field_Name,
        EFFECTIVE_DATE: '',
        ISACTIVE: '',
        MODE: ''
      }));

      worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
      fileName = 'Attributes_attendance_Mapping_Template.xlsx';

    } else {
      console.log('Download Client Attributes Template');

      const headers = [
        'COMPANY_CODE',
        'CLIENT_ATTRIBUTE_NAME',
        'ISACTIVE',
        'MODE'
      ];

      worksheet = XLSX.utils.aoa_to_sheet([headers]);
      fileName = 'Client_Attributes_attendance_Template.xlsx';
    }

    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    XLSX.writeFile(workbook, fileName);
  }

  downloadExcelBillablereport() {
    if (!this.selectCompanyId || !this.payperiodId) {
      alert("Please Select Company and PayPeriod");
      return;
    }

    this.isLoading = true;
    console.log(this.selectCompanyId, this.payperiodId);
    this.service
      .downloadBillableReportattendance(this.selectCompanyId, this.payperiodId)
      .subscribe({
        next: (res: any) => {
          console.log("res", res)
          if (res.StatusCode === 200) {
            const data = res?.Data?.data?.Table0;
            const err = res;
            if (!data || data.length === 0) {
              alert('No records Found');
              this.isLoading = false;
              return;
            }

            const worksheet: XLSX.WorkSheet =
              XLSX.utils.json_to_sheet(data);

            const workbook: XLSX.WorkBook = {
              Sheets: { 'Attendance Report': worksheet },
              SheetNames: ['Attendance Report']
            };

            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array'
            });

            const blob = new Blob([excelBuffer], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            });

            saveAs(blob, 'Attendance_Report.xlsx');
          } else if (res.StatusCode === 404) {
            alert('No Resource found');
          } else if (res.Data.statusCode === 400) {
            alert('Invalid request');
          } else if (res.Data.statusCode === 500) {
            alert('Server error, please try again later');
          } else {
            alert('Something went wrong');
          }
          this.isLoading = false;

        },
        error: (err) => {
          console.log("err", err);
          alert('Server error, please try again later');

          this.isLoading = false;
        }
      });
  }


downloadExcel() {
  if (!this.filteredAttributes || this.filteredAttributes.length === 0) {
    console.warn('No data to export');
    return;
  }
  this.isLoading = true;

  const excelData = this.filteredAttributes.map(item => ({
    ID: item.Quess_Template_Field_Id,
    Quess_Template_Field_Name: item.Quess_Template_Field_Name
  }));

  console.log('Excel data to export:', excelData);

  try {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Attributes_Attendance': worksheet },
      SheetNames: ['Attributes_Attendance']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    console.log('Blob size:', blob.size);

    saveAs(blob, 'Quess_Attributes_Attendance.xlsx');
  } catch (error) {
    console.error('Excel export failed:', error);
  } finally {
    this.isLoading = false;
  }
}


  handleSearchattendance(): void {
    if (!this.selectedCompanyId) {
      alert("Please Select Company");
      return;
    }
    // this.isshowtable = true;
    this.isLoading = true;

    this.service.searchattendance(this.selectedCompanyId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {

          const tableData = res?.Data?.data?.Table0;
          console.log(tableData);
          if (!tableData || tableData.length === 0) {
            alert("No records found");
            this.Attendancesearch = [];
            return;
          }

          this.bindAttendance(tableData);
        },
        error: (err) => {
          console.error(err);
          this.Attendancesearch = [];
        }
      });
  }
  bindAttendance(data: any[]): void {

    this.Attendancesearch = data.map(item => ({
      clientattributes: item.ClientAttributes,
      quessatributes: item.QuessMasterAttributes,
    }));

  }


  loadClientAttributesFallback(): void {
    this.service.getClientAttributes(this.selectedCompanyId).subscribe(res => {
      const tableData = res?.Data?.data?.Table0 || [];
      this.bindClientAttributes(tableData);
    });
  }
  bindClientAttributes(data: any[]): void {
    this.attributeMappings = data.map(item => ({
      clientAttribute: item.Template_Field_Name,
      quessAttribute: item.Quess_Template_Field_Name || '',
      Template_Field_Name: item.Template_Field_Name,
      SelectedQuessAttributeId: item.Quess_Template_Field_Id || ''
    }));
  }

  toggleAttributeDropdown(index: number): void {
    if (this.openAttributeDropdown === index) {
      this.openAttributeDropdown = null;
    } else {
      this.openAttributeDropdown = index;
    }
  }

  updateAttribute(index: number, value: string) {
    this.attributeMappings[index].quessAttribute = value;
    this.openAttributeDropdown = null;
  }
  ImportClickcli(fileInput1: HTMLInputElement): void {
    fileInput1.click();
  }
  onFileChangecli(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.Uploadattendancecli(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (res) => {
          console.log('📥 API Response:', res);

          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any data.');
            return;
          }

          const response = res.Data.response;

          if (response && response.includes("Row(s) Uploaded Successfully.")) {
            alert(res.Data.response);
            return;
          }

          const { parsed, msg } = this.tryParseResponse(response);

          const successMsg = 'Data uploaded successfully.';
          const successMatch =
            (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
            (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

          if (res?.StatusCode === 200 && successMatch) {
            alert('Data uploaded successfully.');
            return;
          }

          if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            // ✅ Use Error_Message instead of Validation
            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `ClientAttributesAttendance_ErrorMessages.xlsx`
            );
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback || 'Error while processing response.');
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          alert('Upload failed due to a network or server error.');
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
  ImportClickatt(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChangeatt(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }



    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    // 🔄 START LOADING
    this.isLoading = true;
    console.log('service test');
    this.service.Uploadattendanceattributes(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          console.log('📥 API Response:', res);

          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any data.');
            return;
          }

          const response = res.Data.response;

          if (response && response.includes("Row(s) Uploaded Successfully.")) {
            alert(res.Data.response);
            return;
          }

          const { parsed, msg } = this.tryParseResponseatt(response);

          const successMsg = 'Data uploaded successfully.';
          const successMatch =
            (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
            (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

          if (res?.StatusCode === 200 && successMatch) {
            alert(' Data uploaded successfully.');
            return;
          }

          if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            // ✅ Use Error_Message instead of Validation
            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `AttributesAttendanceMapping_ErrorMessages.xlsx`
            );
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback || 'Error while processing response.');
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          alert('Upload failed due to a network or server error.');
        }
      });
  }




  tryParseResponseatt(r: any): { parsed: any; msg: string } {
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



  showUploadPopup = false;
  selectedFile!: File;
  previewData: any[] = [];
  previewColumns: string[] = [];

  ImportClickclient(fileInput2: HTMLInputElement): void {

    if (!this.selectedCompanyId) {
      alert("Please Select Company");
      return;
    }
    if (!this.payperiodIdmain) {
      alert("Please Select Pay Period");
      return;
    }

    fileInput2.value = '';
    fileInput2.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      this.previewData = jsonData;
      this.previewColumns = jsonData.length ? Object.keys(jsonData[0]) : [];
      this.showUploadPopup = true; // show popup with table
    };

    reader.readAsArrayBuffer(file);
  }

  submitUpload() {
    if (!this.selectedFile) {
      alert("Please Select File");
      return;
    };
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyId', this.selectedCompanyId);
    formData.append('PayPeriodId', this.payperiodIdmain);
    this.isLoading = true;

    this.service.Uploadclientattendance(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any data.');
            return;
          }

          const response = res.Data.response;

          // Success message
          if (response && response.includes("Row(s) Uploaded Successfully.")) {
            alert(res.Data.response);
            this.closeUploadPopup();
            return;
          }

          const { parsed, msg } = this.tryParseResponseClient(response);

          const successMsg = 'Data uploaded successfully.';
          const successMatch =
            (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
            (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

          if (res?.StatusCode === 200 && successMatch) {
            alert('Data uploaded successfully.');
            this.closeUploadPopup();
            return;
          }

          // Error parsing → download Excel
          if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, `AttributesAttendanceMapping_ErrorMessages.xlsx`);
            this.closeUploadPopup();
            return;
          }

          // fallback
          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) : parsed?.Error_Message ?? '');
          alert(fallback || 'Error while processing response.');
        },
        error: (err) => {
          console.error('❌ Upload failed', err);
          alert('Upload failed due to a network or server error.');
        }
      });
    this.closeUploadPopup();
  }

  tryParseResponseClient(r: any): { parsed: any; msg: string } {
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


  closeUploadPopup() {
    this.showUploadPopup = false;
    this.previewData = [];
    this.previewColumns = [];
  }


}

