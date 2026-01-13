import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export interface IReimbursement {
  slNo: number;
  reimbursementCode: number | null;
  description: string | null;
  claimAmount: number | null;
}

@Component({
  selector: 'app-reimbrusement',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule],
  templateUrl: './reimbrusement.component.html',
  styleUrl: './reimbrusement.component.css'
})
export class ReimbrusementComponent {
  ceaform!: FormGroup;
  isAddclicked = false;
  FinancialYear: any;
  EmpCode: any;
  showTable = false;
  addReimbursement!: FormGroup;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  CompanyId: any;
  CompanyCode: any;
  isEditMode: boolean = false;
  uploadData: IReimbursement[] = [];
  uploadedDataSource = new MatTableDataSource<IReimbursement>(this.uploadData)
  uploadedData1: any[] = [];
  uploadedDataSources = new MatTableDataSource<any>(this.uploadedData1);

  uploadDisplayedColumns: string[] = [
    'slNo', 'companyCode', 'employeeCode', 'date', 'financialYear', 'payperiod', 'reimbursementCode', 'claimAmount'];

  uploadedData: any[] = []; // No mock data
  selectedRowSlNo: number | null = null;
  selectedRow: IReimbursement | null = null;
  userdetail: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.addReimbursement = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      Date: new FormControl('', Validators.required),
      EmployeeCode: new FormControl('', Validators.required),
      EmployeeName: new FormControl({ value: '', disabled: true }),
      FinancialYear: new FormControl('', Validators.required),
      PayPeriod: new FormControl('', Validators.required),
    })
    this.initializeForm();

    // this.addReimbursement.get('EmployeeCode')?.valueChanges.subscribe(empId => {

    //   const selectedEmp = this.employeeCodes.find(
    //     (e: any) => e.Employee_Id == empId
    //   );

    //   if (selectedEmp) {
    //     this.addReimbursement.patchValue({
    //       EmployeeName: selectedEmp.Employee_Name
    //     });
    //   } else {
    //     this.addReimbursement.patchValue({
    //       EmployeeName: ''
    //     });
    //   }
    // });

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handleCompany(company) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
  }

  selectRow(row: IReimbursement) {
    this.selectedRow = row;
  }

  initializeForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];  // 'yyyy-MM-dd'
    this.addReimbursement.patchValue({
      Date: formattedDate
    });
  }

  addNewRow() {

    // if (this.addReimbursement.invalid) {
    //   this.addReimbursement.markAllAsTouched();
    //   alert('Please fill all required fields');
    //   return;
    // }

    this.uploadData.push({
      slNo: this.uploadData.length + 1,
      reimbursementCode: null,
      description: null,
      claimAmount: null
    });

    this.uploadedDataSource.data = [...this.uploadData];
  }

  deleteSelectedRow() {
    if (!this.selectedRowSlNo) {
      alert('Please select a row before deleting');
      return;
    }

    this.uploadData = this.uploadData.filter(row => row.slNo !== this.selectedRowSlNo);

    // Re-index slNo after deletion
    this.uploadData.forEach((row, index) => row.slNo = index + 1);

    this.uploadedDataSource.data = [...this.uploadData];

    // Reset selection
    this.selectedRowSlNo = null;
  }

  onSearch() {
    this.showTable = true;
    this.uploadedDataSources = new MatTableDataSource(this.uploadedData1);
    this.uploadedDataSources.paginator = this.paginator;
  }

  closeclick() {
    this.isAddclicked = false;
  }

  AddLtaOpen() {
    this.isAddclicked = true;
  }
}
