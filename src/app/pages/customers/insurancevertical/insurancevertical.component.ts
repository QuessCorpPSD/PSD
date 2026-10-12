import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-insurancevertical',
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
    CompanyallComponent
],
  templateUrl: './insurancevertical.component.html',
  styleUrl: './insurancevertical.component.css'
})
export class InsuranceverticalComponent implements OnInit {

  selectedCompanyId: any = null;
  showTable: boolean = false;
  selectedRow: any = null;

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Insurance_Vertical_ID',
    'Company_Code',
    'Insurance_Vertical'
  ];

  dataSource = {
    data: []
  };

  showInsurancePopup: boolean = false;
  isEditMode: boolean = false;
  showErrors: boolean = false;
  insuranceForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.insuranceForm = this.fb.group({
      CompanyCode: [null, Validators.required],
      insuranceVerticalName: ['', Validators.required]
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

  openAdd() {
    this.isEditMode = false;
    this.insuranceForm.reset();
    this.showErrors = false;
    this.showInsurancePopup = true;
  }

  editInsurance(row: any) {
    this.isEditMode = true;
    this.selectedRow = row;
    this.insuranceForm.patchValue({
      CompanyCode: row.Company_Code,
      insuranceVerticalName: row.Insurance_Vertical
    });
    this.showErrors = false;
    this.showInsurancePopup = true;
  }

  deleteInsurance(row: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }

  closePopup() {
    this.showInsurancePopup = false;
    this.showErrors = false;
  }

  saveInsurance() {
    if (this.insuranceForm.invalid) {
      this.showErrors = true;
      return;
    }
    this.closePopup();
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }
}