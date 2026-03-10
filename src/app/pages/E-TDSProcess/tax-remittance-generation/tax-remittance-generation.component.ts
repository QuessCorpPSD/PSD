import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-tax-remittance-generation',
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    CompanyallComponent,
    FormsModule,
    MatRadioModule
  ],
  templateUrl: './tax-remittance-generation.component.html',
  styleUrl: './tax-remittance-generation.component.css'
})
export class TaxRemittanceGenerationComponent {

  selectedCompanyId!: number;
  payPeriodType!: string;
  selectedCompanyCode: any;
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;
  isAddclicked = false;
  TaxRemForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  todayDate: string = '';




  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete',
    'edit',
    'SNo',
    'CompanyCode',
    'EmployeeCode',
    'PayPeriodCode',
    'TaxableIncome',
    'TDS',
    'SurCharge',
    'EduCess',
    'Interest',
    'Others',
    'TotalTDS',
    'ReferenceNumber',
    'EmployementType',
    'EntityName',
    'DateFrom',
    'SalaryReleaseDate',
    'IsActive'
  ];

  constructor(private dialog: MatDialog, private decry: EncryptionService, private _sessionStoreage: SessionStorageService, private fb: FormBuilder) { }


  dataSource = new MatTableDataSource<any>([]);
  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

  }
  handleCompanyEvent2(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    const userInfo = {
      userId: this.userdetail.user_Id,
      userName: this.userdetail.userName,
    };
    this.todayDate = new Date().toISOString().split('T')[0];

    this.TaxRemForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      FinancialYear: ['', Validators.required],
      PayPeriod: ['', Validators.required],
      TaxableIncome: [''],
      TDSAmount: [''],
      EmployeeCode: ['', Validators.required],
      SurCharge: ['', Validators.required],
      EducationCharge: ['', Validators.required],
      Interest: ['', Validators.required],
      Others: ['', Validators.required],
      TotalTDS: ['', Validators.required],
      ReferenceNumber: ['', Validators.required],
      DataFrom: ['', Validators.required],
      SalaryReleaseDate: ['', Validators.required],
      IsActive: [false]
    });

  }


  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.TaxRemForm.reset();
  }

  closeclick() {
    this.isAddclicked = false;
  }

  onSearchClick() {
    this.showTable = true;
    this.dataSource.data = this.uploadedData;

  }




}



