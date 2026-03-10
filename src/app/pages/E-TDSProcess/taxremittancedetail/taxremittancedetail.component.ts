import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { FinancialYearComponent } from '../../../common/financial-year/financial-year.component';

@Component({
  selector: 'app-taxremittancedetail',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, MatTooltipModule],
  templateUrl: './taxremittancedetail.component.html',
  styleUrl: './taxremittancedetail.component.css'
})
export class TaxremittancedetailComponent {
  addTaxRemittanceDetail!: FormGroup;
  isAddclicked = false;
  isEditMode: boolean = false;
  showTable: boolean = false;
  challanNumber: any;

  uploadDisplayedColumns: string[] = [
    'legalEntityCode', 'remittanceDate', 'branch', 'bank', 'BrsCode', 'financialYear', 'chequeNumber', 'challanNUmber', 'monthNumber', 'year', 'serialNumber', 'employeeType', 'amount', 'referenceNUmber', 'file_name'
  ];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.addTaxRemittanceDetail = new FormGroup({
      LegalEntity: new FormControl('', Validators.required),
      RemittanceDate: new FormControl('', Validators.required),
      BankBranch: new FormControl('', Validators.required),
      bank: new FormControl({ value: '', disabled: true }),
      BrsCode: new FormControl({ value: '', disabled: true }),
      FinancialYear: new FormControl('', Validators.required),
      UTRNumber: new FormControl(''),
      ChallanNumber: new FormControl('', Validators.required),
      MonthNumber: new FormControl('', Validators.required),
      Year: new FormControl("", Validators.required),
      SerialNumber: new FormControl('', Validators.required),
      EmployeeType: new FormControl('', Validators.required),
      ReferenceNumber: new FormControl('', Validators.required),
      Amount: new FormControl({ value: '', disabled: true }),
      UploadRemittance: new FormControl('')
    })

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.addTaxRemittanceDetail.patchValue({
        UploadRemittance: file
      });

      this.addTaxRemittanceDetail.get('UploadRemittance')?.updateValueAndValidity();
    }
  }


  onSearch() {
    this.showTable = true;
    this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
    this.uploadedDataSource.paginator = this.paginator;
  }

  Save() {

    if (this.addTaxRemittanceDetail.invalid) {
      this.addTaxRemittanceDetail.markAllAsTouched();
      return;
    }
  }

  closeclick() {
    this.isAddclicked = false;
  }


  AddTaxOpen() {
    this.isAddclicked = true;
  }


}
