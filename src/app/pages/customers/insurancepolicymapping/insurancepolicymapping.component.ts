import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-insurancepolicymapping',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatCheckboxModule,
    CompanyallComponent
],
  templateUrl: './insurancepolicymapping.component.html',
  styleUrl: './insurancepolicymapping.component.css'
})
export class InsurancepolicymappingComponent implements OnInit {

  selectedCompanyId: any = null;
  showTable: boolean = true;
  selectedRow: any = null;

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'CompanyCode',
    'GroupName',
    'PremiumTracker',
    'CoverageType',
    'GMCPolicyCondition',
    'GMCPolicyNumber',
    'GMCSumInsured',
    'GPAPolicyNumber',
    'GPASumInsured',
    'GTLIPolicyNumber',
    'GTLISumInsured',
    'EffectiveDate',
    'DeductionPayCode',
    'DeductionAmount',
    'BillingPayCode',
    'BillingAmount',
    'Remarks',
    'DesignationName',
    'EmployeeType',
    'IsESIApplicable',
    'IsESINotApplicable',
    'MaritalStatus',
    'InsuranceVertical'
  ];

  dataSource = {
    data: []
  };

  showPopup: boolean = false;
  isEditMode: boolean = false;
  showErrors: boolean = false;
  policyForm!: FormGroup;

  companyList = [{ companyId: 1, companyCode: 'GTS00052' }];
  groupList = [{ id: 'Group A', name: 'Group A' }, { id: 'Group B', name: 'Group B' }];
  premiumTrackerList = [{ id: 'Tracker A', name: 'Tracker A' }];
  designationList = [{ id: 'Developer', name: 'Developer' }];
  coverageTypeList = [{ id: 'GMC', name: 'GMC' }, { id: 'GPA', name: 'GPA' }];
  gmcPolicyConditionList = [{ id: 'Condition A', name: 'Condition A' }];
  gmcPolicyNumberList = [{ id: 'POL-001', name: 'POL-001' }];
  gtliPolicyNumberList = [{ id: 'GTLI-001', name: 'GTLI-001' }];
  deductionPayCodeList = [{ id: 'DINSD', name: 'DINSD' }];
  billingPayCodeList = [{ id: 'AINR', name: 'AINR' }];
  maritalStatusList = [{ id: 'Single', name: 'Single' }, { id: 'Married', name: 'Married' }];
  employeeTypeList = [{ id: 'Permanent', name: 'Permanent' }];
  insuranceVerticalList = [{ id: 'Health', name: 'Health' }];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.policyForm = this.fb.group({
      CompanyCode: [null, Validators.required],
      groupName: [''],
      premiumTracker: [null, Validators.required],
      designation: [''],
      coverageType: [''],
      gmcPolicyCondition: [''],
      gmcSumInsured: [''],
      gmcPolicyNo: [''],
      gtliSumInsured: [''],
      gtliPolicyNo: [''],
      deductionPayCode: [''],
      billingPayCode: [''],
      deductionAmount: [''],
      billingAmount: [''],
      effectiveDate: [''],
      remarks: [''],
      maritalStatus: [null, Validators.required],
      isESIApplicable: [false],
      employeeType: [null, Validators.required],
      isESINotApplicable: [false],
      insuranceVertical: ['']
    });
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
  }

  onSearch() {
    this.showTable = true;
  }

  exportToExcel() {
  }

  onFileSelected(event: any) {
  }

  importData() {
  }

  downloadTemplate() {
  }

  openAdd() {
    this.isEditMode = false;
    this.policyForm.reset();
    this.showErrors = false;
    this.showPopup = true;
  }

  editPolicy(row: any) {
    this.isEditMode = true;
    this.selectedRow = row;
    this.policyForm.patchValue({
      CompanyCode: row.CompanyCode,
      groupName: row.GroupName,
      premiumTracker: row.PremiumTracker,
      designation: row.DesignationName,
      coverageType: row.CoverageType,
      gmcPolicyCondition: row.GMCPolicyCondition,
      gmcSumInsured: row.GMCSumInsured,
      gmcPolicyNo: row.GMCPolicyNumber,
      gtliSumInsured: row.GTLISumInsured,
      gtliPolicyNo: row.GTLIPolicyNumber,
      deductionPayCode: row.DeductionPayCode,
      billingPayCode: row.BillingPayCode,
      deductionAmount: row.DeductionAmount,
      billingAmount: row.BillingAmount,
      effectiveDate: row.EffectiveDate,
      remarks: row.Remarks,
      maritalStatus: row.MaritalStatus,
      isESIApplicable: row.IsESIApplicable === 'Yes',
      employeeType: row.EmployeeType,
      isESINotApplicable: row.IsESINotApplicable === 'Yes',
      insuranceVertical: row.InsuranceVertical
    });
    this.showErrors = false;
    this.showPopup = true;
  }

  deletePolicy(row: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }

  closePopup() {
    this.showPopup = false;
    this.showErrors = false;
  }

  savePolicy() {
    if (this.policyForm.invalid) {
      this.showErrors = true;
      return;
    }
    this.closePopup();
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }
}