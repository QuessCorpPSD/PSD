import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-qrsservicechargetype',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './qrsservicechargetype.component.html',
  styleUrl: './qrsservicechargetype.component.css'
})
export class QrsservicechargetypeComponent implements OnInit {

  qrsServiceChargeTypeSearch: string = '';
  showTable: boolean = false;
  selectedRow: any = null;

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'QRS_Service_Charge_Type'
  ];

  dataSource = {
    data: []
  };

  showQrsPopup: boolean = false;
  isEditMode: boolean = false;
  showErrors: boolean = false;
  qrsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.qrsForm = this.fb.group({
      qrsServiceChargeTypeName: ['', Validators.required]
    });
  }

  onSearch() {
    this.showTable = true;
  }

  exportToExcel() {
  }

  openAdd() {
    this.isEditMode = false;
    this.qrsForm.reset();
    this.showErrors = false;
    this.showQrsPopup = true;
  }

  editQrs(row: any) {
    this.isEditMode = true;
    this.selectedRow = row;
    this.qrsForm.patchValue({
      qrsServiceChargeTypeName: row.QRS_Service_Charge_Type
    });
    this.showErrors = false;
    this.showQrsPopup = true;
  }

  deleteQrs(row: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }

  closePopup() {
    this.showQrsPopup = false;
    this.showErrors = false;
  }

  saveQrs() {
    if (this.qrsForm.invalid) {
      this.showErrors = true;
      return;
    }
    this.closePopup();
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }
}