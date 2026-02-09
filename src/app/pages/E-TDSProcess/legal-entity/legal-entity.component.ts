import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-legal-entity',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatCardModule, FormsModule, ReactiveFormsModule],
  templateUrl: './legal-entity.component.html',
  styleUrls: ['./legal-entity.component.css']
})
export class LegalEntityComponent {
  uploadedData: any[] = [];
  showTable: boolean = false;
  isEditMode: boolean = false;
  isAddclicked: boolean = false;
  legalEntityForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  uploadDisplayedColumns: string[] = [
    'Action',
    'Legal Entity Code',
    'Legal Entity Name',
    'Branch/Division',
    'Flat/Door/Block No',
    'Name of the Building',
    'Street/Road Name',
    'State',
    'City'
  ];


  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  onSearchClick() {
    this.showTable = true;
    this.uploadedDataSource.data = this.uploadedData;
  }
  closeclick() {
    this.isAddclicked = false;
  }
  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  view(row: any) {
    console.log('View clicked for:', row);
  }
  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;

  }
  ngOnInit(): void {
    this.legalEntityForm = this.fb.group({

      // Deductor Details
      legalEntityCode: ['', Validators.required],
      legalEntityName: ['', Validators.required],
      branchDivision: [''],
      deductorFlatNo: [''],
      deductorBuilding: [''],
      deductorStreet: [''],
      deductorState: ['', Validators.required],
      deductorCity: ['', Validators.required],
      deductorPincode: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/)
      ]], deductorTelephone: [''],
      deductorStdCode: [''],
      deductorFax: [''],
      deductorEmail: ['', [
        Validators.required,
        Validators.email
      ]],

      // Responsible Person Details
      rpName: ['', Validators.required],
      rpGender: ['', Validators.required],
      rpFatherName: ['', Validators.required],
      rpDesignation: ['', Validators.required],
      rpFlatNo: [''],
      rpBuilding: [''],
      rpStreet: [''],
      rpState: ['', Validators.required],
      rpCity: ['', Validators.required],
      rpPincode: ['', Validators.required],
      rpTelephone: [''],
      rpStdCode: [''],
      rpFax: [''],
      rpMobile: ['', [
        Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/)
      ]],
      rpEmail: ['', Validators.required, Validators.email],

      // Statutory Details
      tan: ['', [
        Validators.required,
        Validators.pattern(/[A-Z]{4}[0-9]{5}[A-Z]{1}/)
      ]], pan: ['', [
        Validators.required,
        Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
      ]],
      status: ['', Validators.required],
      isTdsAssessee: ['', Validators.required],
      returnType: ['', Validators.required],
      rpPan: ['', Validators.required],
      deductorType: ['', Validators.required]
    });
  }

  save() {
    if (this.legalEntityForm.invalid) {
      this.legalEntityForm.markAllAsTouched();
      return;
    }
    console.log(this.legalEntityForm.value);
  }


}
