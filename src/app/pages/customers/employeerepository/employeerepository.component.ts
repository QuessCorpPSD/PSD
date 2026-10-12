import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-employeerepository',
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
  templateUrl: './employeerepository.component.html',
  styleUrl: './employeerepository.component.css'
})
export class EmployeerepositoryComponent implements OnInit {

  employeeCodeSearch: string = '2000000700';
  showTable: boolean = true;
  selectedRow: any = null;

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'EmployeeCode',
    'EmployeeName',
    'Remarks'
  ];

  dataSource = {
    data: [
      {
        EmployeeCode: '2000000700',
        EmployeeName: 'MURALI K',
        Remarks: ''
      }
    ]
  };

  showDocumentPopup: boolean = false;
  showErrors: boolean = false;
  documentForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.documentForm = this.fb.group({
      remarks: ['', Validators.required]
    });
  }

  onSearch() {
    this.showTable = true;
  }

  onDownload() {
  }

  editDocument(row: any) {
    this.selectedRow = row;
    this.showDocumentPopup = true;
    this.showErrors = false;
    this.documentForm.reset();
    this.selectedFile = null;
  }

  closePopup() {
    this.showDocumentPopup = false;
    this.showErrors = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  attachDocument() {
    if (this.documentForm.invalid) {
      this.showErrors = true;
      return;
    }
    this.closePopup();
  }

  onRowSelect(row: any) {
    this.selectedRow = row;
  }
}