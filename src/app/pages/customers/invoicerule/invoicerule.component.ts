import { Component, Inject, InjectionToken, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { CommonModule } from '@angular/common';
export const IR_TOKEN = new InjectionToken<IinvoiceRuleService>('IR_TOKEN');
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from "../../../Shared/encryption.service";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoiceRuleGrid } from '../../../Models/InvoiceRuleGrid';
import { InvoiceForm } from '../../../Models/InvoiceRuleGrid';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from "@angular/material/checkbox";
import { Company, Groupnameclass } from '../../../Models/Common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { invoiceRuleService } from '../../../Service/CUSTOMER/invoiceRuleService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IinvoiceRuleService } from '../../../Repository/customer/IinvoiceRuleService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { finalize } from 'rxjs';
import { AsyncKeyword } from 'typescript';
import { saveAs } from 'file-saver';

@Component({
  selector: 'invoicerule',
  imports: [GroupnameComponent, CommonModule, MatPaginator, MatTableModule,
    MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckbox, MatCardModule,
    MatIconModule, MatTooltipModule, FormsModule, CompanyallComponent, ReactiveFormsModule, AlertpopupComponent],
  templateUrl: './invoicerule.component.html',
  styleUrl: './invoicerule.component.css',
  providers: [{
    provide: IR_TOKEN,
    useClass: invoiceRuleService
  }]
})

export class InvoiceruleComponent {
  selectedCC?: number;
  selectedGN?: string;
  companyUI?: any;
  sitenameUI?: any;
  isLoading = false;
  isAddclicked = false;
  userdetail!: any;
  isChecked = false;
  isCarryForward = false;
  previousMonthText: string = '';
  isEditMode = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  datatable: Array<{ [key: string]: any }> = [];
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  selectedInvoiceRuleId: number = 0;
  templateresponse: any;
  editCompany: any;
  months = [
    { id: 1, text: 'January' },
    { id: 2, text: 'February' },
    { id: 3, text: 'March' },
    { id: 4, text: 'April' },
    { id: 5, text: 'May' },
    { id: 6, text: 'June' },
    { id: 7, text: 'July' },
    { id: 8, text: 'August' },
    { id: 9, text: 'September' },
    { id: 10, text: 'October' },
    { id: 11, text: 'November' },
    { id: 12, text: 'December' }
  ];

  billingType = [
    { id: 1, text: 'Hourly' },
    { id: 2, text: 'Daily' },
    { id: 3, text: 'Monthly' },
    { id: 4, text: 'Networking Days' }
  ];

  leavetypes = [
    { id: 1, text: 'Cumulative' },
    { id: 2, text: 'Non-Cumulative' },
    { id: 3, text: 'Not Billable' },
  ];
  standardSelect = [
    { id: 1, text: 'Yes' },
    { id: 2, text: 'No' },
  ]

  standardSelectweekend = [
    { id: 1, text: 'Yes' },
    { id: 0, text: 'No' },
  ]

  typeofbillingSelect = [
    { id: 1, text: 'Bill To Rate' },
    { id: 2, text: 'Billable Report' },
  ]
  dataSource = new MatTableDataSource<InvoiceRuleGrid>([]);
  invoiceruleform!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete', 'companyCode', 'siteName', 'billingType', 'asPerTimesheetText', 'daysPerMonth',
    'weekends', 'holidays', 'compOff', 'maternity', 'leaveAddition', 'discounts', 'rebates',
    'serviceFee', 'reimbursement', 'gratuity', 'ot', 'leaveRule', 'billableDaysFormula',
    'leavetypesText', 'leavePeriod', 'carryforward', 'noofCarryfarward', 'typE_OF_BILLING_NAME',
    'payroll_weekends_billable'
  ];

  constructor(@Inject(IR_TOKEN) private invoicerule: IinvoiceRuleService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, private fb: FormBuilder
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.selectedCC = company.companyId;

  }

  handleGroupNameEvent(sitename: any) {
    this.sitenameUI = sitename
    this.selectedGN = sitename.siteCode;
  }
  searchClick() {
    if (!this.companyUI) {
      this.companyUI = {
        companyId: 0,
        companyCode: '',
        companyName: '',
        displayName: ''
      };
    }
    if (!this.sitenameUI) {
      this.sitenameUI = {
        siteCode: '0',
        siteName: '** Select **'
      };
    }

    if (this.companyUI) {
      this.BindDashBoard(this.companyUI.companyId, this.sitenameUI.siteCode)
    }
  }

  selection = new SelectionModel<InvoiceRuleGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoicingRulesID === sel.invoicingRulesID)
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  toggleRow(row: InvoiceRuleGrid) {
    this.selection.toggle(row);
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.invoiceruleform = this.fb.group({
      company: [null],
      group: [null],
      billingType: ['', Validators.required],
      daysAsPerTimesheet: [false],
      dayspermonth: ['', Validators.required],
      weekendsrule: ['', Validators.required],
      holidaysrule: ['', Validators.required],
      comppoffrule: ['', Validators.required],
      maternityleave: ['', Validators.required],
      leavetypes: ['', Validators.required],
      leavecredit: ['', Validators.required],
      leaverule: ['', Validators.required],
      payperiodfrom: ['', Validators.required],
      payperiodto: ['', Validators.required],
      carryforward: ['', Validators.required],
      noofcarryforwards: [{ value: '', disabled: true }],
      otrule: ['', Validators.required],
      gratuity: ['', Validators.required],
      reimbursement: ['', Validators.required],
      servicefeeonexpenses: ['', Validators.required],
      rebates: ['', Validators.required],
      discounts: ['', Validators.required],
      billabledaysformula: ['', Validators.required],
      weekend_billable: ['', Validators.required],
      type_of_billing: ['', Validators.required]
    });

    this.invoiceruleform.get('daysAsPerTimesheet')?.valueChanges.subscribe((checked: boolean) => {
      const daysControl = this.invoiceruleform.get('dayspermonth');
      if (checked) {
        daysControl?.disable();
      } else {
        daysControl?.enable();
      }
    });
    this.invoiceruleform.get('carryforward')?.valueChanges.subscribe((value: any) => {
      const noOfCarryCtrl = this.invoiceruleform.get('noofcarryforwards');
      if (value.id === 1) {
        noOfCarryCtrl?.enable();
      } else {
        noOfCarryCtrl?.disable();
        noOfCarryCtrl?.reset();
      }
    });
  }
  BindDashBoard(companyId: number, siteId: string) {
    this.invoicerule.GetAllInvoiceRule(companyId, siteId).
      pipe(finalize(() => { this.isLoading = false; })).subscribe({
        next: res => {
          if (!res.Data || res.Data.length === 0) {
            alert("No data available to display.");
            return;
          }
          this.dataSource = new MatTableDataSource<any>(res.Data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: err => {
          console.error('Error fetching data:', err.message);
        }
      });
  }

  Addclicked(): void {
    this.isAddclicked = true;
  }
  deleteClick(invoicingRulesID: number) {
    if (confirm("Are you sure you want to delete this?")) {
      this.invoicerule.PostDeleteInvoiceRule(invoicingRulesID).subscribe({
        next: (res) => {
          const errormsg = res.Data[0].msg;
          alert(errormsg);
          this.isLoading = true;
          this.BindDashBoard(this.companyUI.companyId, this.sitenameUI.siteCode)
        }
      });
    } else {

    }

  }

  closeclick() {
    this.invoiceruleform.reset({
      billingType: '',
      daysAsPerTimesheet: false,
      dayspermonth: '',
      weekendsrule: '',
      holidaysrule: '',
      comppoffrule: '',
      maternityleave: '',
      leavetypes: '',
      leavecredit: '',
      leaverule: '',
      payperiodfrom: '',
      payperiodto: '',
      carryforward: '',
      noofcarryforwards: '',
      otrule: '',
      gratuity: '',
      reimbursement: '',
      servicefeeonexpenses: '',
      rebates: '',
      discounts: '',
      billabledaysformula: ''
    });
    this.isAddclicked = false;
    this.isEditMode = false;
    this.selectedInvoiceRuleId = 0;
    this.companyUI = null;
    this.sitenameUI = null;
  }

  TemplateClick(): void {
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }
    else {
      this.InvoiceRuleDownload();
    }
  }
  InvoiceRuleDownload() {
    const formData = new FormData();
    if (this.companyUI) {
      formData.append('companyId', this.companyUI.companyId);
      formData.append('companyCode', this.companyUI.companyCode);
      if (!this.sitenameUI) {
        this.sitenameUI = {
          siteCode: 0,
          siteName: '** Select **'
        }
      }
      formData.append('siteName', this.sitenameUI.siteName);

      this.invoicerule.GetInvoiceRuleTemplate(formData).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName)
            this.isLoading = false;
          }
        },
        error: error => console.error('Error:', error)
      })
    }
    this.isLoading = false;
    return;
  }

  ExportClick(): void {
    this.InvoiceRuleExport();
  }

  InvoiceRuleExport() {
    const formData = new FormData();
    if (!this.companyUI) {
      this.companyUI = {
        companyId: 0,
        companyCode: ''
      }
    }
    formData.append('companyId', this.companyUI.companyId);
    formData.append('companyCode', this.companyUI.companyCode);
    if (!this.sitenameUI) {
      this.sitenameUI = {
        siteCode: '0',
        siteName: ''
      }
    }
    formData.append('siteCode', this.sitenameUI.siteCode);
    this.isLoading = true;
    this.invoicerule.InvoiceRuleExport(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName)
            this.companyUI = null;
            this.sitenameUI = null;
          }
        },
        error: error => console.error('Error:', error)
      })

    return;
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
  CarryforwardChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value == "1") {
      this.isCarryForward = true;
    }
    else {
      this.isCarryForward = false;
    }
  }
  onMonthChange() {
    const selected = this.invoiceruleform.get('payperiodfrom')?.value;

    if (selected && selected.id > 0) {
      const prevIndex = (selected.id - 2 + 12) % 12;
      this.previousMonthText = this.months[prevIndex].text;
    } else {
      this.previousMonthText = '';
    }
    this.invoiceruleform.get('payperiodto')?.setValue(this.previousMonthText);
  }
  onCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isChecked = input.checked;
  }

  SaveData() {
    if (this.invoiceruleform.invalid) {
      this.invoiceruleform.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.UpdateInvoiceRule();
      return;
    }

    const formValue = this.invoiceruleform.value;
    const InvoiceRuleAdd = {
      companyId: this.companyUI?.companyId,
      companyCode: this.companyUI?.companyCode,
      siteId: this.sitenameUI?.siteCode,
      siteName: this.sitenameUI?.siteName,
      billingtype: formValue.billingType.text,
      daysAsPerTimesheet: formValue.daysAsPerTimesheet,
      dayspermonth: formValue.dayspermonth,
      weekendsrule: formValue.weekendsrule.text,
      holidaysrule: formValue.holidaysrule.text,
      comppoffrule: formValue.comppoffrule.text,
      maternityleave: formValue.maternityleave.text,
      leavetypes: formValue.leavetypes.id,
      leavecredit: String(formValue.leavecredit),
      leaverule: formValue.leaverule.text,
      payperiodfrom: formValue.payperiodfrom.text,
      payperiodto: formValue.payperiodto,
      carryforward: String(formValue.carryforward.id),
      noofcarryforwards: formValue.noofcarryforwards,
      otrule: formValue.otrule.text,
      gratuity: formValue.gratuity.text,
      reimbursement: formValue.reimbursement.text,
      servicefeeonexpenses: formValue.servicefeeonexpenses.text,
      rebates: formValue.rebates.text,
      discounts: formValue.discounts.text,
      billabledaysformula: formValue.billabledaysformula,
      userId: String(this.userdetail.user_Id),
      payroll_weekends_billable: String(formValue.weekend_billable),
      type_of_billing: String(formValue.type_of_billing.id),
      type_of_billing_name: String(formValue.type_of_billing.text)
    };
    this.isLoading = true;
    this.invoicerule.PostAddInvoiceRule(InvoiceRuleAdd).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe({
      next: (res) => {
        const errormsg = res.Data[0].msg;

        if (errormsg === 'true') {
          this.isAddclicked = false;
          this.showPopup = true;
          this.popupMessage = "Invoice Rule Added Successfully";
          this.sitenameUI = null;
          this.BindDashBoard(this.companyUI.companyId, this.sitenameUI.siteCode)
        }
        else {
          alert("Invoice Rule already availabe for this company");
          this.invoiceruleform.reset({
            billingType: '',
            daysAsPerTimesheet: false,
            dayspermonth: '',
            weekendsrule: '',
            holidaysrule: '',
            comppoffrule: '',
            maternityleave: '',
            leavetypes: '',
            leavecredit: '',
            leaverule: '',
            payperiodfrom: '',
            payperiodto: '',
            carryforward: '',
            noofcarryforwards: '',
            otrule: '',
            gratuity: '',
            reimbursement: '',
            servicefeeonexpenses: '',
            rebates: '',
            discounts: '',
            billabledaysformula: ''
          });
          this.isLoading = false;

        }
        error: (err) => {
          console.error("Error saving:", err);
        }
      }
    });
  }


  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
  }

  editClick(row: any) {

    this.isEditMode = true;
    this.isAddclicked = true;

    this.companyUI = {
      companyId: row.companyId,
      companyCode: row.companyCode
    };

    this.sitenameUI = {
      siteCode: row.siteId,
      siteName: row.siteName
    };

    this.selectedInvoiceRuleId = row.invoicingRulesID;

    this.invoiceruleform.patchValue({

      billingType: this.billingType.find(x =>
        x.text.toUpperCase() === row.billingType.toUpperCase()),

      daysAsPerTimesheet: Number(row.asPerTimesheet) === 1,

      dayspermonth: row.daysPerMonth,

      weekendsrule: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.weekends.toUpperCase()),

      holidaysrule: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.holidays.toUpperCase()),

      comppoffrule: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.compOff.toUpperCase()),

      maternityleave: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.maternity.toUpperCase()),

      leavetypes: this.leavetypes.find(x =>
        x.id == +row.leavetypes),

      leavecredit: row.leaveAddition,

      leaverule: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.leaveRule.toUpperCase()),

      carryforward: this.standardSelect.find(
        x => x.text.toUpperCase() === String(row.carryforward).toUpperCase()
      ),
      noofcarryforwards: row.noofCarryfarward,

      otrule: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.ot.toUpperCase()),

      gratuity: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.gratuity.toUpperCase()),

      reimbursement: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.reimbursement.toUpperCase()),

      servicefeeonexpenses: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.serviceFee.toUpperCase()),

      rebates: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.rebates.toUpperCase()),

      discounts: this.standardSelect.find(x =>
        x.text.toUpperCase() === row.discounts.toUpperCase()),

      billabledaysformula: row.billableDaysFormula,

      weekend_billable:
        row.payroll_weekends_billable?.toUpperCase() === 'YES' ? 1 : 0,

      type_of_billing: this.typeofbillingSelect.find(x =>
        x.id == +row.typE_OF_BILLING_ID)
    });

    // Leave Period Example: "March-February"
    if (row.leavePeriod) {

      const fromMonth = row.leavePeriod.split('-')[0];

      const payMonth = this.months.find(x =>
        x.text.toUpperCase() === fromMonth.toUpperCase());

      this.invoiceruleform.patchValue({
        payperiodfrom: payMonth,
        payperiodto: row.leavePeriod.split('-')[1]
      });
    }
  }

  UpdateInvoiceRule() {

    const formValue = this.invoiceruleform.value;

    const payload = {
      invoicingRulesID: this.selectedInvoiceRuleId,
      billingtype: String(formValue.billingType.text),
      daysAsPerTimesheet: formValue.daysAsPerTimesheet,
      dayspermonth: formValue.dayspermonth,
      weekendsrule: String(formValue.weekendsrule.text),
      holidaysrule: String(formValue.holidaysrule.text),
      comppoffrule: String(formValue.comppoffrule.text),
      maternityleave: String(formValue.maternityleave.text),
      leavetypes: formValue.leavetypes.id,
      leavecredit: String(formValue.leavecredit),
      leaverule: String(formValue.leaverule.text),
      payperiodfrom: String(formValue.payperiodfrom.text),
      payperiodto: String(formValue.payperiodto),
      carryforward: String(formValue.carryforward.id),
      noofcarryforwards: formValue.noofcarryforwards,
      otrule: String(formValue.otrule.text),
      gratuity: String(formValue.gratuity.text),
      reimbursement: String(formValue.reimbursement.text),
      servicefeeonexpenses: String(formValue.servicefeeonexpenses.text),
      rebates: String(formValue.rebates.text),
      discounts: String(formValue.discounts.text),
      billabledaysformula: String(formValue.billabledaysformula),
      payroll_weekends_billable: String(formValue.weekend_billable),
      type_of_billing: String(formValue.type_of_billing.id),
      type_of_billing_name: String(formValue.type_of_billing.text),
      userId: String(this.userdetail.user_Id)
    };

    this.invoicerule.PostUpdateInvoiceRule(payload).subscribe({
      next: (res) => {

        this.showPopup = true;
        this.popupMessage = 'Invoice Rule Updated Successfully';

        this.isAddclicked = false;
        this.isEditMode = false;
        this.sitenameUI = null;

        this.BindDashBoard(
          this.companyUI.companyId,
          this.sitenameUI.siteCode
        );
      }
    });
  }

  DownloadTemplate() {

    if (!this.companyUI) {
      alert('Please select Company');
      return;
    }

    if (!this.sitenameUI) {
      this.sitenameUI = {
        siteCode: 0,
        siteName: '** Select **'
      }
    }

    this.invoicerule.GetInvoiceruleTemplate(this.companyUI.companyId, this.sitenameUI.siteName).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'InvoiceRule': worksheet },
          SheetNames: ['InvoiceRule']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `InvoiceRule_Template.xlsx`);
      },
      error: err => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }

  downloadExcel(data: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'InvoiceRule': worksheet },
      SheetNames: ['InvoiceRule']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    var fileName;
    fileName = `Invoice_Rule_Template.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }
  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', String(this.userdetail.user_Id));

    this.invoicerule.PostInvoiceRuleUpload(formData).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        const messages = res?.Data?.map((x: any) => x.Message) || [];

        if (messages.some((msg: string) =>
          msg.toLowerCase().includes('uploaded successfully'))) {

          alert(messages[0]);
          return;
        }

        if (messages.length > 0) {
          this.downloadValidationErrors(res.Data);
          alert('Validation failed. Error file downloaded.');
          return;
        }
      },
      error: (err) => {
        console.error(' Upload failed', err);
        alert('Upload failed due to a network or server error.');
      }
    });
  }

  downloadValidationErrors(errors: any[]) {

    const excelData = errors.map((x, index) => ({
      'S.No': index + 1,
      'Error Message': x.Message
    }));

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook: XLSX.WorkBook = {
      Sheets: { Errors: worksheet },
      SheetNames: ['Errors']
    };

    const excelBuffer: any =
      XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

    const blob = new Blob(
      [excelBuffer],
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    saveAs(blob, 'InvoiceRuleUploadErrors.xlsx');
  }
}
