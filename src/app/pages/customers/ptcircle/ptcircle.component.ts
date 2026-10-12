import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-ptcircle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './ptcircle.component.html',
  styleUrl: './ptcircle.component.css',
})
export class PtcircleComponent {

  uploadDisplayedColumns: string[] = ['Action', 'StateName', 'CircleName'];
  dataSource = new MatTableDataSource<any>([]);
  totalCount = 0;
  showTable = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  stateList: any[] = [];
  selectedStateId: number | null = null;

  selectedFile: File | null = null;

  showCirclePopup = false;
  isEditMode = false;
  showErrors = false;
  circleForm: FormGroup;
  rowData: any;

  constructor(private fb: FormBuilder) {
    this.circleForm = this.fb.group({
      stateId: [null, Validators.required],
      circleName: ['', Validators.required],
    });
  }

  onsearch(): void {
    this.showTable = true;
  }

  openadd(): void {
    this.isEditMode = false;
    this.rowData = null;
    this.showErrors = false;
    this.circleForm.reset();
    this.circleForm.patchValue({ stateId: this.selectedStateId });
    this.showCirclePopup = true;
  }

  editCircle(row: any): void {
    this.isEditMode = true;
    this.rowData = row;
    this.showErrors = false;
    this.showCirclePopup = true;
    this.circleForm.patchValue({
      stateId: row.stateId,
      circleName: row.CircleName,
    });
  }

  deleteCircle(row: any): void {
    if (!confirm('Are you sure you want to delete this PT Circle?')) return;
  }

  closePopup(): void {
    this.showCirclePopup = false;
    this.showErrors = false;
  }

  saveCircle(): void {
    this.showErrors = true;
    if (this.circleForm.invalid) {
      this.circleForm.markAllAsTouched();
      return;
    }
    this.closePopup();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      this.selectedFile = null;
      return;
    }
    const name = file.name.toLowerCase();
    if (!(name.endsWith('.xlsx') || name.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      input.value = '';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  onImport(): void {
    if (!this.selectedFile) {
      alert('Please choose a file to import.');
      return;
    }
  }

  exportToExcel(): void {
    const data = this.dataSource.data.map((r: any) => ({
      'State Name': r.StateName,
      'Circle Name': r.CircleName,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { PTCircle: ws },
      SheetNames: ['PTCircle'],
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `PTCircle_${Date.now()}.xlsx`);
  }
}