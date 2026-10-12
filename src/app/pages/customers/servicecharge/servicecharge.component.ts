import {
  Component,
  Inject,
  InjectionToken,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IServiceCharge } from '../../../Repository/customer/IserviceCharge';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MapnameComponent } from '../../../common/Mapname/mapname/mapname.component';
import { ServiceChargeService } from '../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';

const Pay_TOKEN = new InjectionToken<IServiceCharge>('Pay_TOKEN');

@Component({
  selector: 'app-servicecharge',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MapnameComponent,
    CompanyallComponent
  ],
  templateUrl: './servicecharge.component.html',
  styleUrl: './servicecharge.component.css',
  providers: [
    { provide: Pay_TOKEN, useClass: ServiceChargeService }
  ]
})
export class ServicechargeComponent implements OnInit, AfterViewInit {


  isLoading = false;
  servicechargeadd = false;
  showTable = false;
  showtable = false;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  formErrors: any = {};
  showValidation = false;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  selectedServiceChargeTypeId: any;
  servicechargedata: any[] = [];
  serviceChargeMaster: any[] = [];
  serviceChargeTypes: any[] = [];
  selectedParentId = 0;
  selectedTypeId = 0;
  selectedServiceChargeId: any;
  dynamicFields: any[] = [];
  formValues: any = {};
  mapnameUI: any;
  userdetail: any;
  gridData: any;
  filterColumns: string[] = [
    'filterAction',
    'filterMapName',
    'filterValue',
    'filterEffectiveDate'
  ];
  filterValues: any = {
    map_Name: '',
    value: '',
    effective_Date: ''
  };
  isEditMode = false;
  editRowData: any = null;
  actionServiceChargeId: any;
  dynamicFormConfig: any = {
    '1_1': [
      { fieldName: 'MapNameId', label: 'Map Name', type: 'mapname', required: true },
      { fieldName: 'Value', label: 'Value', type: 'text' },
      { fieldName: 'ProrateId', label: 'Prorate', type: 'dropdown', required: true, options: [{ Id: 1, Name: 'Yes' }, { Id: 0, Name: 'No' }] },
      { fieldName: 'FandFProrateId', label: 'FandF Prorate', type: 'dropdown', required: true, options: [{ Id: 1, Name: 'Yes' }, { Id: 0, Name: 'No' }] },
      { fieldName: 'FandFArrearProrateId', label: 'FandF Arrear Prorate', type: 'dropdown', required: true, options: [{ Id: 1, Name: 'Yes' }, { Id: 0, Name: 'No' }] },
      { fieldName: 'NewJoineeProrateId', label: 'New Joinee Prorate', type: 'dropdown', required: true, options: [{ Id: 1, Name: 'Yes' }, { Id: 0, Name: 'No' }] },
      { fieldName: 'NewJoineeArrearProrateId', label: 'New Joinee Arrear Prorate', type: 'dropdown', required: true, options: [{ Id: 1, Name: 'Yes' }, { Id: 0, Name: 'No' }] },
      { fieldName: 'EffectiveDate', label: 'Effective Date', type: 'date', required: true },
      { fieldName: 'ComplianceFee', label: 'Compliance Fee', type: 'text', required: true },
      { fieldName: 'RandstadFee', label: 'Randstad Fee', type: 'text', required: true },
      { fieldName: 'UpfrontFeeTypeId', label: 'Upfront Fee Type', type: 'dropdown', required: true, options: [{ Id: 0, Name: 'Fixed' }, { Id: 1, Name: 'Percentage' }] },
      { fieldName: 'UpfrontFee', label: 'Upfront Fee', type: 'text', required: true },
      { fieldName: 'UpfrontPaycode', label: 'Upfront paycode', type: 'text', required: true },
      { fieldName: 'InsuranceAmount', label: 'Insurance Amount', type: 'text', required: true },
      { fieldName: 'QdemyFeeTypeId', label: 'Qdemy Fee type', type: 'dropdown', required: true, options: [{ Id: 0, Name: 'Fixed' }, { Id: 1, Name: 'Percentage' }] },
      { fieldName: 'QdemyCharge', label: 'Qdemy Charge', type: 'text', required: true },
      { fieldName: 'InEdgeFeeTypeId', label: 'InEdge Fee type', type: 'dropdown', required: true, options: [{ Id: 0, Name: 'Fixed' }, { Id: 1, Name: 'Percentage' }] },
      { fieldName: 'InEdgeCharge', label: 'InEdge Charge', type: 'text', required: true }
    ],
    '1_2': [
      { fieldName: 'MapNameId', label: 'Map Name', type: 'mapname', required: true },
      { fieldName: 'PayCodeId', label: 'PayCode', type: 'text', required: true },
      { fieldName: 'Value', label: 'Value', type: 'text' },
      { fieldName: 'CapValue', label: 'Cap Value', type: 'text', required: true },
      { fieldName: 'MaxAmount', label: 'Max Amount', type: 'text', required: true },
      { fieldName: 'EffectiveDate', label: 'Effective Date', type: 'date', required: true },
      { fieldName: 'ComplianceFee', label: 'Compliance Fee', type: 'text', required: true },
      { fieldName: 'RandstadFeeTypeId', label: 'Randstad Fee', type: 'number', required: true },
      { fieldName: 'UpfrontFeeTypeId', label: 'Upfront Fee Type', type: 'dropdown', required: true, options: [{ Id: 0, Name: 'Fixed' }, { Id: 1, Name: 'Percentage' }] },
      { fieldName: 'UpfrontFee', label: 'Upfront Fee', type: 'number', required: true },
      { fieldName: 'UpfrontPaycode', label: 'Upfront Paycode', type: 'text', required: true },
      { fieldName: 'InsuranceAmount', label: 'Insurance Amount', type: 'number', required: true },
      { fieldName: 'QdemyFeeTypeId', label: 'Qdemy Fee type', type: 'dropdown', required: true, options: [{ Id: 0, Name: 'Fixed' }, { Id: 1, Name: 'Percentage' }] },
      { fieldName: 'QdemyCharge', label: 'Qdemy Charge', type: 'number', required: true },
      { fieldName: 'InEdgeFeeTypeId', label: 'InEdge Fee type', type: 'dropdown', required: true, options: [{ Id: 0, Name: 'Fixed' }, { Id: 1, Name: 'Percentage' }] },
      { fieldName: 'InEdgeCharge', label: 'InEdge Charge', type: 'number', required: true }
    ],
    '1_3': [
      { fieldName: 'EmployeeCodeId', label: 'Employee Code', type: 'searchable-dropdown', required: true, options: [] },
      { fieldName: 'UnitPrice', label: 'Unit Price', type: 'number', required: true },
      { fieldName: 'UnitTypeId', label: 'Unit Type', type: 'dropdown', required: true, options: ['Monthly', 'Daily', 'Hourly'] },
      { fieldName: 'EffectiveDate', label: 'Effective Date', type: 'date', required: true },
      { fieldName: 'DiscountTypeId', label: 'Discount Type', type: 'dropdown', required: true, options: [{ Id: 1160, Name: 'Fixed' }, { Id: 1161, Name: 'Percentage' }] },
      { fieldName: 'DiscountAmount', label: 'Discount Amount', type: 'number', required: true }
    ],
    '2_1': [
      { fieldName: 'MapNameId', label: 'Map Name', type: 'mapname', required: true },
      { fieldName: 'PayCodeId', label: 'PayCode', type: 'text', required: true },
      { fieldName: 'Value', label: 'Value', type: 'text' },
      { fieldName: 'EffectiveDate', label: 'Effective Date', type: 'date', required: true }
    ],
    '2_2': [
      { fieldName: 'MapNameId', label: 'Map Name', type: 'mapname', required: true },
      { fieldName: 'PayCodeId', label: 'PayCode', type: 'text', required: true },
      { fieldName: 'Value', label: 'Value', type: 'text' },
      { fieldName: 'MaxAmount', label: 'Max Amount', type: 'text', required: true },
      { fieldName: 'EffectiveDate', label: 'Effective Date', type: 'date', required: true },
      { fieldName: 'MarginalPayCodeId', label: 'Marginal PayCode', type: 'dropdown', required: true, options: [] }
    ],
    '3_0': [
      { fieldName: 'Type', label: 'Type', type: 'dropdown', required: true, options: [] },
      { fieldName: 'Paycode', label: 'Paycode', type: 'text', required: true },
      { fieldName: 'Value', label: 'Value', type: 'text', required: true },
      { fieldName: 'MapNameId', label: 'Map Name', type: 'dropdown', required: true, options: ['Select MapName'] },
      { fieldName: 'ReplacementClauseApplicableId', label: 'Replacement Clause Applicable', type: 'dropdown', required: true, options: ['Yes', 'No'] },
      { fieldName: 'Replacement', label: 'Replacement', type: 'text', required: true },
      { fieldName: 'SourcingWaitingId', label: 'Sourcing Waiting', type: 'dropdown', required: true, options: ['Yes', 'No'] },
      { fieldName: 'SourcingValue', label: 'Sourcing Value', type: 'text', required: true },
      { fieldName: 'CriteriaValue', label: 'Criteria Value', type: 'text', required: true },
      { fieldName: 'TATDays', label: 'TAT Days', type: 'number', required: true },
      { fieldName: 'TATDaysTypeId', label: 'TAT Days Type', type: 'dropdown', required: true, options: ['Calendar Days', 'Business Days'] },
      { fieldName: 'EffectiveDate', label: 'Effective Date', type: 'date', required: true },
      { fieldName: 'CategoryId', label: 'Category', type: 'dropdown', options: ['General', 'Special'] }
    ],
    '4_0': []
  };

  constructor(
    @Inject(Pay_TOKEN) private service: IServiceCharge,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
 
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    this.loadServiceChargeMaster();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues[column] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
  clearFilter() {
    Object.keys(this.filterValues).forEach(k => this.filterValues[k] = '');
    this.dataSource.filter = '';
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  // editOpen(row: any) {
  //   this.isEditMode = true;
  //   this.editRowData = row;
  //   this.selectedParentId = row.Company_Service_Charge_Master_Id
  //     ?? row.Service_Charge_Master_Id
  //     ?? 0;
  //   this.selectedTypeId = row.Company_Service_Charge_Type_Id
  //     ?? row.Service_Charge_Type_Id
  //     ?? 0;
  //   this.selectedServiceChargeId = this.selectedParentId;
  //   this.actionServiceChargeId = row.Service_Charge_Id ?? row.Id ?? 0;

  //   this.servicechargeadd = true;

  //   this.loadServiceFeeTypes();
  //   this.loadMapNameById(row);


  //   this.formValues = {
  //     MapNameId: row.Map_Name_Id ?? row.Cost_Center_Mapping_Id ?? 0,
  //     Value: row.Value ?? '',
  //     PayCodeId: row.PayCode_Code ?? row.Pay_Code ?? '',
  //     CapValue: row.Cap_Value ?? '',
  //     MaxAmount: row.MaxAmount ?? '',
  //     EffectiveDate: row.Effective_Date ?? '',
  //     ComplianceFee: row.Compliance_Fee ?? '',
  //     RandstadFee: row.RandStad_Fee ?? '',
  //     UpfrontFeeTypeId: row.Upfront_Type_Id ?? 0,
  //     UpfrontFee: row.Upfront_Charge ?? '',
  //     UpfrontPaycode: row.Upfront_PayCode ?? '',
  //     InsuranceAmount: row.Insurance_Amount ?? '',
  //     QdemyFeeTypeId: row.QDemyFee_Type_Id ?? 0,
  //     QdemyCharge: row.QDemyFee ?? '',
  //     InEdgeFeeTypeId: row.InEdgeFee_Type_Id ?? 0,
  //     InEdgeCharge: row.InEdgeFee ?? '',
  //     ProrateId: row.IsAttendanceProrated ?? 0,
  //     FandFProrateId: row.IsFAndFProrate ?? 0,
  //     FandFArrearProrateId: row.IsFAndFArrearProrate ?? 0,
  //     NewJoineeProrateId: row.IsNewjoineeProrate ?? 0,
  //     NewJoineeArrearProrateId: row.IsNewJoineeArrearProrate ?? 0,
  //     Type: row.Type ?? 0,
  //     ReplacementClauseApplicableId: row.IsReplacementClauseApplicable ?? '',
  //     Replacement: row.Replacement ?? '',
  //     SourcingWaitingId: row.IsSourcingWaitingPeriod_Id ?? '',
  //     SourcingValue: row.SourcingValue ?? '',
  //     CriteriaValue: row.Criteria ?? '',
  //     TATDays: row.TATDays ?? '',
  //     TATDaysTypeId: row.TATDaysTypeId ?? '',
  //     CategoryId: row.Category_Id ?? '',
  //     UnitPrice: row.UnitPrice ?? '',
  //     UnitTypeId: row.UnitType_Id ?? '',
  //     DiscountTypeId: row.Discount_Type_Id ?? '',
  //     DiscountAmount: row.Discount_Amount ?? ''
  //   };

  // }
  editOpen(row: any) {
    this.isEditMode = true;
    this.editRowData = row;

    this.selectedParentId = row.Service_Charge_Master_Id ?? 0;
    this.selectedTypeId = row.Service_Charge_Type_Id ?? 0;
    this.selectedServiceChargeId = row.Service_Charge_Master_Id ?? 0;
    this.actionServiceChargeId = row.Service_Charge_Id ?? 0;

    this.mapnameUI = row.Map_Name_Id
      ? { mapNameId: row.Map_Name_Id, mapName: row.Map_Name || '' }
      : null;

    this.loadServiceFeeTypesForEdit();

    this.servicechargeadd = true;
  }
  openDatePicker(event: Event) {
    const input = event.target as HTMLInputElement;

    if (typeof (input as any).showPicker === 'function') {
      try {
        (input as any).showPicker();
      } catch {
      }
    }
  }
  private loadServiceFeeTypesForEdit() {
    const masterId = this.selectedServiceChargeId;
    if (!masterId) return;

    this.service.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.serviceChargeTypes = res?.Data?.data?.Table0 || [];

        const key = `${this.selectedParentId}_${this.selectedTypeId}`;
        this.dynamicFields = this.dynamicFormConfig[key] || [];

        if (this.selectedParentId === 3) {
          const typeField = this.dynamicFields.find(f => f.fieldName === 'Type');
          if (typeField) {
            typeField.options = this.serviceChargeTypes.map(t => ({
              Id: t.Service_Charge_Type_Id,
              Name: t.Type_Name
            }));
          }
        }

        this.patchFormValuesFromRow(this.editRowData);
      }
    });
  }
  private patchFormValuesFromRow(row: any) {
    this.formValues = {};
    this.formErrors = {};

    const to01 = (v: any) =>
      (v === true || v === 1 || v === 'true' || v === '1') ? 1 : 0;

    const rowMap: any = {
      MapNameId: row.Map_Name_Id,
      PayCodeId: row.PayCode_Code ?? row.Pay_Code,
      Value: row.Value,
      CapValue: row.Cap_Value,
      MaxAmount: row.MaxAmount,
      EffectiveDate: this.toIsoDate(row.Effective_Date),
      ComplianceFee: row.Compliance_Fee,
      RandstadFee: row.RandStad_Fee,
      RandstadFeeTypeId: row.RandStad_Fee,
      UpfrontFeeTypeId: row.Upfront_Type_Id,
      UpfrontFee: row.Upfront_Charge,
      UpfrontPaycode: row.Upfront_PayCode,
      InsuranceAmount: row.Insurance_Amount,
      QdemyFeeTypeId: row.QDemyFee_Type_Id,
      QdemyCharge: row.QDemyFee,
      InEdgeFeeTypeId: row.InEdgeFee_Type_Id,
      InEdgeCharge: row.InEdgeFee,

      // Boolean → 1/0 for the Yes/No dropdowns
      ProrateId: to01(row.IsAttendanceProrated),
      FandFProrateId: to01(row.IsFAndFProrate),
      FandFArrearProrateId: to01(row.IsFAndFArrearProrate),
      NewJoineeProrateId: to01(row.IsNewjoineeProrate),
      NewJoineeArrearProrateId: to01(row.IsNewJoineeArrearProrate),

      Type: row.Types ?? 0,
      ReplacementClauseApplicableId: to01(row.IsReplacementClauseApplicable),
      Replacement: row.Replacement,
      SourcingWaitingId: to01(row.IsSourcingWaitingPeriod),
      SourcingValue: row.SourcingValue,
      CriteriaValue: row.Criteria,
      TATDays: row.TATDays,
      TATDaysTypeId: row.TATDaysType ?? row.TATDaysTypeId,
      CategoryId: row.Category_Id,
      UnitPrice: row.Unit_Type,
      UnitTypeId: row.UnitType_Id,
      DiscountTypeId: row.Discount_Type_Id,
      DiscountAmount: row.Discount_Amount
    };

    for (const field of this.dynamicFields) {
      const val = rowMap[field.fieldName];
      if (val !== undefined && val !== null) {
        this.formValues[field.fieldName] = val;
      }
    }

    if (row.Map_Name_Id) {
      this.mapnameUI = {
        mapNameId: row.Map_Name_Id,
        mapName: row.Map_Name || ''
      };
    }

    console.log('patched formValues:', this.formValues);
  }
  private toIsoDate(val: string | null | undefined): string {
    if (!val) return '';
    const s = String(val).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
      const [d, m, y] = s.split('/');
      return `${y}-${m}-${d}`;
    }

    const months: any = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const parts = s.split(' ');
    if (parts.length === 3) {
      const [d, mon, y] = parts;
      const m = months[mon] ?? '01';
      return `${y}-${m}-${d.padStart(2, '0')}`;
    }

    const dt = new Date(s);
    if (!isNaN(dt.getTime())) {
      return dt.toISOString().slice(0, 10);
    }

    return '';
  }


  setColumns() {
    const type = (this.selectedServiceChargeTypeId ?? '').toString().trim();

    if (type === 'ServiceFee Fixed') {
      this.gridData = [
        'Action', 'SNo', 'Map_Name', 'Value',
        'IsAttendanceProrated_Text', 'IsFAndFProrate_Text', 'IsFAndFArrearProrate_Text',
        'IsNewjoineeProrate_Text', 'IsNewJoineeArrearProrate_Text',
        'Effective_Date', 'Compliance_Fee', 'RandStad_Fee',
        'Upfront_Type', 'Upfront_Charge', 'Upfront_PayCode', 'Insurance_Amount',
        'QDemyFee', 'InEdgeFee'
      ];
    }
    else if (type === 'ServiceFee Percentage') {
      this.gridData = [
        'Action', 'SNo', 'Map_Name', 'PayCode_Code', 'Value', 'Cap_Value', 'MaxAmount',
        'Effective_Date', 'Compliance_Fee', 'RandStad_Fee',
        'Upfront_Type', 'Upfront_Charge', 'Upfront_PayCode', 'Insurance_Amount',
        'QDemyFee', 'InEdgeFee'
      ];
    }
    else if (type === 'ServiceFee Bill To Rate') {
      this.gridData = [
        'Action', 'SNo', 'Map_Name', 'Employee_Code',
        'Unit_Price', 'Unit_Type',
        'Effective_Date', 'Discount_Type', 'Discount_Amount'
      ];
    }
    else if (type === 'SuppFee Fixed') {
      this.gridData = [
        'Action', 'SNo', 'Map_Name', 'PayCode_Code', 'Value', 'Effective_Date'
      ];
    }
    else if (type === 'SuppFee Percentage') {
      this.gridData = [
        'Action', 'SNo', 'Map_Name', 'PayCode_Code', 'Value', 'MaxAmount',
        'Effective_Date', 'MarginalPayCode'
      ];
    }
    else if (type === 'SourcingFee') {
      this.gridData = [
        'Action', 'SNo', 'Type_Names', 'Map_Name', 'PayCode_Code', 'Value',
        'IsReplacementClauseApplicable_Text', 'Replacement',
        'IsSourcingWaitingPeriod_Text', 'SourcingValue', 'Criteria', 'TATDays',
        'Effective_Date', 'Category_Name'
      ];
    }
    else {
      this.gridData = ['Action', 'SNo', 'Map_Name', 'Value'];
    }

    this.displayedColumns = this.gridData;
    console.log('Final columns:', this.displayedColumns);
  }
  onSearchClick() {
    if (!this.selectedCompanyId) {
      alert('Please select company');
      return;
    }
    if (!this.selectedServiceChargeTypeId) {
      alert('Please select service charge type');
      return;
    }



    this.isLoading = true;
    this.setColumns();
    this.showtable = true;
    this.dataSource.data = [];
    this.service.GetSearch(this.selectedCompanyId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const data = res?.Data?.data?.Table0 || [];
        if (data.length === 0) {
          this.showTable = false;
          this.dataSource.data = [];
          alert('No records found');
          return;
        }
        this.dataSource.data = data;
        this.showTable = true;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  deleteRow(row: any) {
    const id = row.Service_Charge_Id ?? row.Id;
    if (!id) return;

    if (!confirm(`Delete service charge "${row.Map_Name ?? ''}"?`)) return;

    const userId =
      this.userdetail?.user_Id;

    const payload = {
      ServiceChargeId: id,
      CreatedBy: String(userId),
      Mode: 'Delete'
    };

    this.isLoading = true;
    this.service.ServiceChargeDelete(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const msg =
          res?.response ??
          res?.Data?.response ??
          '';

        alert(msg);
        this.onSearchClick();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Delete failed', err);
      }
    });
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
    this.BindserviceChargeNew(this.selectedCompanyId);
    this.loadEmployees();
  }

  loadEmployees() {
    this.service.employeecode(this.selectedCompanyId, 0).subscribe({
      next: (res: any) => {
        const list = res?.Data?.data?.Table0 || [];
        const employees = list.map((x: any) => `${x.Employee_Code}`);
        const field = this.dynamicFields.find(f => f.fieldName === 'EmployeeCodeId');
        if (field) {
          field.options = employees;
        }
      }
    });
  }

  BindserviceChargeNew(companyId: number) {
    this.service.GetServiceChargeNew(companyId).subscribe({
      next: (res: any) => {
        this.servicechargedata = res.Data.data.Table0;
      }
    });
  }

  openadd() {
    if (!this.selectedCompanyId) {
      alert('Please select a company');
      return;
    }
    this.isEditMode = false;
    this.editRowData = null;
    this.actionServiceChargeId = 0;

    this.resetDynamicForm();
    this.selectedParentId = 0;
    this.selectedServiceChargeId = '';
    this.serviceChargeTypes = [];

    this.servicechargeadd = true;
  }

  closeForm() {
    this.servicechargeadd = false;
  }

  onServiceChargeChange(event: any) {
    this.resetDynamicForm();
    this.selectedParentId = Number(event.target.value);
    this.selectedServiceChargeId = this.selectedParentId;
    this.loadServiceFeeTypes();
  }


  onTypeChange(event: any) {
    this.formValues = {};
    this.formErrors = {};
    this.showValidation = false;
    this.mapnameUI = null;
    this.selectedTypeId = Number(event.target.value);

    const key = `${this.selectedParentId}_${this.selectedTypeId}`;
    this.dynamicFields = this.dynamicFormConfig[key] || [];

    if (this.selectedParentId === 3) {
      const typeField = this.dynamicFields.find(x => x.fieldName === 'Type');
      if (typeField) {
        typeField.options = this.serviceChargeTypes.map(t => ({
          Id: t.Service_Charge_Type_Id,
          Name: t.Type_Name
        }));
      }
    }
  }

  handleMapNameEvent(mapname: any) {
    this.mapnameUI = mapname;

    const mapField = this.dynamicFields.find(f => f.type === 'mapname');
    if (mapField && this.formErrors[mapField.fieldName]) {
      this.formErrors[mapField.fieldName] = false;
    }
  }

  resetDynamicForm() {
    this.formValues = {};
    this.formErrors = {};
    this.showValidation = false;
    this.dynamicFields = [];
    this.selectedTypeId = 0;
    this.mapnameUI = null;
  }

  loadServiceChargeMaster() {
    this.service.GetServiceCharge().subscribe({
      next: (res: any) => {
        this.serviceChargeMaster = res?.Data?.data?.Table0 || [];
      }
    });
  }

  loadServiceFeeTypes() {
    const masterId = this.selectedServiceChargeId;
    this.service.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.serviceChargeTypes = res?.Data?.data?.Table0 || [];
        const typeOptions = this.serviceChargeTypes.map(x => ({
          Id: x.Service_Charge_Type_Id,
          Name: x.Service_Charge_Type_Name
        }));
        const key = `${this.selectedParentId}_0`;
        this.dynamicFields = this.dynamicFormConfig[key] || [];
        if (this.selectedParentId === 3) {
          const typeField = this.dynamicFields.find(f => f.fieldName === 'Type');
          if (typeField) {
            typeField.options = typeOptions;
          }
        }
      }
    });
  }

  saveServiceCharge() {
    this.showValidation = true;
    this.formErrors = {};

    let isValid = true;

    if (!this.selectedServiceChargeId) {
      isValid = false;
    }

    if (this.selectedParentId !== 3 && this.serviceChargeTypes.length > 1) {
      if (!this.selectedTypeId) {
        isValid = false;
      }
    }

    // ─── Dynamic fields ───
    for (const field of this.dynamicFields) {
      const value = this.formValues[field.fieldName];

      let missing = value === undefined || value === null || value === '';

      if (field.type === 'mapname') {
        missing = !this.mapnameUI?.mapNameId;
      }

      if (field.required && missing) {
        this.formErrors[field.fieldName] = true;
        isValid = false;
      }
    }

    if (!isValid) {
      return;
    }

    // ─── Build payload ───
    const f = this.formValues;

    const getValue = (value: any) =>
      value?.Id ?? value?.id ?? value ?? 0;

    const mode = this.isEditMode ? 'Update' : 'Add';

    const userId =
      this.userdetail?.user_Id ??
      0;

    const serviceChargeId = this.isEditMode
      ? (this.actionServiceChargeId ?? 0)
      : 0;

    const serviceChargeObj = {
      Service_Charge_Id: serviceChargeId,

      Company_Service_Charge_Master_Id: this.selectedParentId || 0,
      Company_Service_Charge_Type_Id: this.selectedTypeId || 0,

      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,

      Cost_Center_Mapping_Id: this.mapnameUI?.mapNameId || 0,
      Map_Name: this.mapnameUI?.mapName || '',

      Invoicing_Type: false,
      Service_Charge_Name: '',

      PayCode_Code: f.PayCodeId || '',
      MaxAmount: Number(f.MaxAmount || 0),

      Type: Number(f.Type || 0),
      Value: String(f.Value ?? ''),

      Effective_Date: f.EffectiveDate || '',

      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,

      IsAttendanceProrated: Number(getValue(f.ProrateId)),
      IsCriteriaApplicable: 0,
      Criteria: f.CriteriaValue || '',

      IsReplacementClauseApplicable: Number(getValue(f.ReplacementClauseApplicableId)),
      Replacement: Number(f.Replacement || 0),
      IsSourcingWaitingPeriod_Id: Number(getValue(f.SourcingWaitingId)),
      SourcingValue: Number(f.SourcingValue || 0),
      TATDays: Number(f.TATDays || 0),

      IsMapNameRequired: 0,
      Category_Id: Number(getValue(f.CategoryId)),
      Invoice_Map_Name_Id: 0,

      Compliance_Fee: Number(f.ComplianceFee || 0),
      RandStad_Fee: Number(f.RandstadFee || 0),

      UnitType_Id: Number(getValue(f.UnitTypeId)),
      Discount_Type_Id: Number(getValue(f.DiscountTypeId)),
      Discount_Amount: Number(f.DiscountAmount || 0),

      Type_Id: Number(getValue(f.ServiceFeeTypeId)),
      Pay_Code_Id: Number(getValue(f.PayCodeId)),

      From: 0,
      To: 0,
      Slab_Calculation_Type_Id: 0,

      Cap_Value: Number(f.CapValue || 0),
      Upfront_Charge: Number(f.UpfrontFee || 0),
      Upfront_PayCode: f.UpfrontPaycode || '',
      Upfront_Type_Id: Number(getValue(f.UpfrontFeeTypeId)),
      Insurance_Amount: String(f.InsuranceAmount ?? ''),

      MarginalPayCodeId: Number(getValue(f.MarginalPayCodeId)),

      QDemyFee: Number(f.QdemyCharge || 0),
      InEdgeFee: Number(f.InEdgeCharge || 0),

      IsNewjoineeProrate: Number(getValue(f.NewJoineeProrateId)),
      IsFAndFProrate: Number(getValue(f.FandFProrateId)),
      IsFAndFArrearProrate: Number(getValue(f.FandFArrearProrateId)),
      IsNewJoineeArrearProrate: Number(getValue(f.NewJoineeArrearProrateId)),

      QDemyFee_Type_Id: Number(getValue(f.QdemyFeeTypeId)),
      InEdgeFee_Type_Id: Number(getValue(f.InEdgeFeeTypeId)),

      Employee_Code: '',
      Employee_Id: ''
    };

    const payload = {
      CompanyId: this.selectedCompanyId,
      Created_By: String(userId),
      Mode: mode,
      ServiceChargemaster: [serviceChargeObj]
    };

    console.log('FINAL PAYLOAD:', JSON.stringify(payload));

    this.isLoading = true;
    this.service.SaveServiceCharge(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const msg =
          res?.Data?.response ??
          res?.Data?.[0]?.Error_Message ??
          res?.response ??
          '';

        alert(msg);

        this.resetDynamicForm();
        this.selectedParentId = 0;
        this.selectedTypeId = 0;
        this.selectedServiceChargeId = 0;
        this.serviceChargeTypes = [];
        this.isEditMode = false;
        this.actionServiceChargeId = 0;

        this.closeForm();

        this.onSearchClick();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Save failed', err);
      }
    });
  }
  exportToExcel() {
    if (!this.dataSource.data.length) {
      alert('No data available to export');
      return;
    }

    const rows = this.dataSource.data.map((r: any) => ({
      SNo: r.SNo,
      'Map Name': r.Map_Name,
      'Pay Code': r.PayCode_Code,
      Value: r.Value,
      'Max Amount': r.MaxAmount,
      'Effective Date': r.Effective_Date,
      'Compliance Fee': r.Compliance_Fee,
      'Randstad Fee': r.RandStad_Fee,
      'Upfront Type': r.Upfront_Type,
      'Upfront Charge': r.Upfront_Charge,
      'Upfront PayCode': r.Upfront_PayCode,
      'Insurance Amount': r.Insurance_Amount,
      'Qdemy Fee Type': r.QDemyFee_Type,
      'Qdemy Fee': r.QDemyFee,
      'InEdge Fee Type': r.InEdgeFee_Type,
      'InEdge Fee': r.InEdgeFee
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ServiceCharge');
    XLSX.writeFile(wb, `ServiceCharge_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  clearFieldError(fieldName: string) {
    if (this.formErrors[fieldName]) {
      this.formErrors[fieldName] = false;
    }
  }

  onFieldChange(fieldName: string, value: any) {
    this.formValues[fieldName] = value;
    this.clearFieldError(fieldName);
  }
}