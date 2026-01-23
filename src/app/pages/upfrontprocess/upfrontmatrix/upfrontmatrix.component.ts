import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatSort } from '@angular/material/sort';
import { IUpfrontMatrix } from '../../../Repository/upfrontprocess/Iupfrontmatrix';
import { UpfrontmatrixService } from '../../../Service/upfrontprocess/upfrontmatrix.service';
export const Pay_TOKEN = new InjectionToken<IUpfrontMatrix>('Pay_TOKEN');

@Component({
  selector: 'app-upfrontmatrix',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginator, MatTableModule, MatTooltipModule],
  templateUrl: './upfrontmatrix.component.html',
  styleUrl: './upfrontmatrix.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: UpfrontmatrixService,
    }
  ]
})
export class UpfrontmatrixComponent {
  isAddclicked = false;
  isEditMode = false;
  isUploadGridVisible = false;
  roletype: any;
  isLoading = false;
  upfrontmatrix!: FormGroup;
  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  data: any[] = [];
  displayedColumns: string[] = [
    'edit',
    'Userid',
    'Username',
    'Min_approve_limit',
    'Max_approve_limit',
    'Zone',
    'roletype',
    'Isactive',
    'Mail_id'

  ];
  dataSource = new MatTableDataSource<any>([]);
  constructor(private fb: FormBuilder, @Inject(Pay_TOKEN) private service: IUpfrontMatrix,) { }

  ngOnInit(): void {
    this.upfrontmatrix = this.fb.group({
      roleType: ['', Validators.required],
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      minApproveLimit: ['', Validators.required],
      maxApproveLimit: ['', Validators.required],
      mailId: ['', [Validators.required, Validators.email]],
      zone: ['', Validators.required]
    });
  }
  closeclick() {
    this.isAddclicked = false;
  }
  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;

  }
  EditOpen() {
    this.isAddclicked = true;
    this.isEditMode = true;

  }

  onsearch() {
    this.isLoading = true;
    this.isUploadGridVisible = true;
    const roletype = 1;

    this.service.Search(roletype).subscribe({
      next: (res) => {
        this.dataSource.data = [];


        if (res.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.isLoading = false;
          return;
        }
        this.data = res.data.data.Table0;
        console.log('data', this.data);

        if (this.data && this.data.length > 0) {
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          alert('No data found for the selected criteria');
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.isLoading = false;
        alert('Failed to load data');
      }
    });
  }

}
