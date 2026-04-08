import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StateComponent } from '../../../common/state/state.component';
import { OtherincomecultureService } from '../../../Service/invoice/otherincomeculture.service';
import { IOtherIncomeCulture } from '../../../Repository/invoice/IOtherIncomeCulture';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MapnameComponent } from "../../../common/Mapname/mapname/mapname.component";
import { Router } from '@angular/router';
export const Pay_Token = new InjectionToken<IOtherIncomeCulture>('Pay_Token');
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IListBoxItem } from '../attribute/attribute.component';

interface ChildDetail {
  InvoiceCulture_id: number;
  Company_Id: number;
  Paycode_Id: number;
  Paycode_Code: string;
  HasAccess: boolean;
}

@Component({
  selector: 'app-otherincome',
  imports: [CommonModule, DragDropModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule, MatCheckboxModule, StateComponent, MapnameComponent],
  templateUrl: './otherincome.component.html',
  styleUrl: './otherincome.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: OtherincomecultureService,
    }
  ]
})
export class OtherincomeComponent {
  availableFilterPlaceholder = 'Search & Select available Attribute';

  selectedFilterPlaceholder = ' Search & Selected Attribute';

  // Search inputs
  availableSearchInput = new FormControl('');
  selectedSearchInput = new FormControl('');

  // Data arrays
  availableItems: any[] = [];
  filteredAvailableItems: any[] = [];

  selectedDragItems: any[] = [];
  filteredSelectedItems: any[] = [];

  selectedCompanyId!: number;
  showTable = false;
  isAddclicked = false;
  isEditMode = false;
  addOtherIncome!: FormGroup;
  CompanyId: any[] = [];
  selectedCC: number = 0;
  showInvoiceTypeError = false;
  stateId?: number;
  stateName: string = "";
  search: any;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['delete', 'companyCode', 'companyName', 'CultureRef', 'InvoiceType', 'mapName'];
  uploadedData: any[] = []; // No mock data
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  userdetail: any;
  isLoading: boolean = false;
  excelFile: File | null = null;
  datatable: any;
  ServiceChargeOptions: any[] = [];
  InvoiceTypeList: any[] = [];
  InvoiceCategoryList: any[] = [];
  mapnameUI: any;
  selectedMN: string = '';
  typeInvoiceList: any;
  isPaycodesLoaded = false;
  searchText: string = "";
  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: OtherincomecultureService, private router: Router) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadServiceCharges();
    this.loadInvoiceTypes();
    this.loadInvoiceCategories();
    this.addOtherIncome = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl('', Validators.required),
      ServiceCharge: new FormControl('2', Validators.required),
      InvoiceRefNo: new FormControl({ value: '', disabled: true }),
      MapName: new FormControl('', Validators.required),
      Location: new FormControl('', Validators.required),
      InvoiceType: new FormControl('', Validators.required),
      InvoiceCategory: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
    })

    // 🔍 Available search
    this.availableSearchInput.valueChanges.subscribe(value => {
      const search = value?.toLowerCase() || '';

      this.filteredAvailableItems = this.availableItems.filter(item =>
        item.Paycode_Code.toLowerCase().includes(search)
      );
    });

    // 🔍 Selected search
    this.selectedSearchInput.valueChanges.subscribe(value => {
      const search = value?.toLowerCase() || '';

      this.filteredSelectedItems = this.selectedDragItems.filter(item =>
        item.Paycode_Code.toLowerCase().includes(search)
      );
    });

    this.addOtherIncome.get('CompanyName')?.disable();
    this.addOtherIncome.get('InvoiceRefNo')?.disable();
    this.addOtherIncome.get('Location')?.disable();

    // this.addOtherIncome.get('CompanyCode')?.valueChanges.subscribe((compCode: string) => {
    //   const selectedCompany = this.CompanyId.find(
    //     (c: any) => c.companyCode === compCode
    //   );

    //   this.addOtherIncome.patchValue({
    //     CompanyName: selectedCompany ? selectedCompany.companyName : ''
    //   });
    // });

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.addOtherIncome?.get('InvoiceCategory')?.valueChanges.subscribe((categoryId: number) => {
      if (categoryId == 1060) {
        // State Wise
        this.addOtherIncome.get('state')?.disable();
        this.addOtherIncome.get('state')?.setValue('');
      } else if (categoryId == 1059) {
        // Single
        this.addOtherIncome.get('state')?.enable();
      }
    });

    this.addOtherIncome?.get('InvoiceType')?.valueChanges.subscribe((invoiceType: any) => {
      // run only after user selects
      if (!invoiceType) return;

      if (invoiceType.invoiceType_Id == 2) {
        // SPLIT → enable checkboxes
        this.enablePaycodeCheckboxes();
      } else if (invoiceType.invoiceType_Id == 1) {
        // REGULAR → disable checkboxes
        this.disablePaycodeCheckboxes();
      }
    });

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.company_Code?.toLowerCase().includes(searchText) ||
        data.company_Name?.toLowerCase().includes(searchText) ||
        data.invoiceCul_Ref_No?.toLowerCase().includes(searchText) ||
        data.invoiceType?.toLowerCase().includes(searchText) ||
        data.map_Name?.toLowerCase().includes(searchText)
      );
    };

  }


  enablePaycodeCheckboxes() {
    this.typeInvoiceList.forEach(t => {
      this.addOtherIncome.get(t.Paycode_Id.toString())?.enable();
    });
  }

  drop(event: CdkDragDrop<any[]>) {

    if (event.previousContainer === event.container) {
      // Reorder inside same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    } else {

      const item = event.previousContainer.data[event.previousIndex];

      // 👉 Move to selected
      if (event.container.id === 'selectedList') {

        this.selectedDragItems.push(item);

        this.availableItems = this.availableItems.filter(
          x => x.Paycode_Id !== item.Paycode_Id
        );

      }

      // 👉 Move back to available
      else if (event.container.id === 'availableList') {

        this.availableItems.push(item);

        this.selectedDragItems = this.selectedDragItems.filter(
          x => x.Paycode_Id !== item.Paycode_Id
        );
      }
    }

    // 🔥 Always refresh filtered lists
    this.filteredAvailableItems = [...this.availableItems];
    this.filteredSelectedItems = [...this.selectedDragItems];
  }
  
  disablePaycodeCheckboxes() {
    this.typeInvoiceList.forEach(t => {
      const control = this.addOtherIncome.get(t.Paycode_Id.toString());
      control?.disable();
      control?.setValue(false); // clear selection
    });
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  handleCompany(company) {
    this.CompanyId = company;
    this.selectedCC = Number(company.companyId) || 0;
    this.addOtherIncome.patchValue({
      // CompanyCode: company.companyCode,
      CompanyName: company.companyName
    });
    console.log("company", company)
    this.loadPaycodes();
  }

  stateEvent(event: any) {
    // if (!event) {
    //   this.stateId = 0;
    //   this.stateUI = {};
    //   return;
    // }
    this.stateId = event.stateId ?? 0;    // updated to match backend
    // this.stateUI = event ?? {};
  }

  handleMapNameEvent(mapname: any) {
    this.mapnameUI = mapname;
    this.selectedMN = mapname.mapName;

    this.addOtherIncome.patchValue({
      MapName: mapname.mapName || '',
      // CostCenterMapping: mapname['costCenterMappingId'] || 1
    });

    this.addOtherIncome.get('MapName')?.markAsTouched();
  }

  loadServiceCharges(): void {
    this.isLoading = true;
    this.service.ServiceChargeMaster().subscribe({
      next: (res: any) => {
        this.ServiceChargeOptions = Array.isArray(res.Data) ? res.Data : [];
        this.isLoading = false;
      },
      error: err => {
        console.error('SERVICE CHARGES API ERROR:', err);
        this.ServiceChargeOptions = [];
        this.isLoading = false;
      }
    });
  }

  loadInvoiceTypes(): void {
    this.isLoading = true;
    this.service.InvoiceType().subscribe({
      next: (res: any) => {
        this.InvoiceTypeList = Array.isArray(res.Data) ? res.Data : [];
        this.isLoading = false;
      },
      error: err => {
        console.error('InvoiceTypes:', err);
        this.InvoiceTypeList = [];
        this.isLoading = false;
      }
    });
  }

  loadInvoiceCategories(): void {
    this.service.InvoiceCategory().subscribe({
      next: (res: any) => {
        this.InvoiceCategoryList = Array.isArray(res.Data) ? res.Data : [];
      },
      error: err => {
        console.error('INVOICE CATEGORIES API ERROR:', err);
        this.InvoiceCategoryList = [];
      }
    });

  }

  applyFilterscdkDrop() {

    // Available filter
    this.availableSearchInput.valueChanges.subscribe(value => {
      const search = value?.toLowerCase() || '';

      this.filteredAvailableItems = this.availableItems.filter(item =>
        item.Paycode_Code.toLowerCase().includes(search)
      );
    });

    // Selected filter
    this.selectedSearchInput.valueChanges.subscribe(value => {
      const search = value?.toLowerCase() || '';

      this.filteredSelectedItems = this.selectedDragItems.filter(item =>
        item.Paycode_Code.toLowerCase().includes(search)
      );
    });

    // Initialize selected list
    this.filteredSelectedItems = [...this.selectedDragItems];
  }

  loadPaycodes(): void {
    this.service.getAllPaycodes(this.selectedCC).subscribe({
      next: (res) => {
        console.log(res);
        this.typeInvoiceList = res?.Data?.data?.Table0 || [];
        this.availableItems = res?.Data || [];
        this.filteredAvailableItems = [...this.availableItems];

        this.applyFilters();
        // Create controls dynamically for each checkbox
        this.typeInvoiceList.forEach(t => {
          const name = t.Paycode_Id.toString();
          if (!this.addOtherIncome.contains(name)) {
            this.addOtherIncome.addControl(name, new FormControl(false));
          }
        });
        this.isPaycodesLoaded = true;
      },
      error: err => console.error(err)
    });
  }

  onCheckboxChange() {
    const selectedCount = this.typeInvoiceList.filter(t =>
      this.addOtherIncome.get(t.Paycode_Id.toString())?.value
    ).length;

    this.showInvoiceTypeError = selectedCount === 0;
  }


  checkInvoiceTypeSelection() {
    const selectedCount = this.typeInvoiceList.filter(t =>
      this.addOtherIncome.get(t.code)?.value
    ).length;
    this.showInvoiceTypeError = selectedCount === 0;
  }

  addInvoiceTypeControls() {
    this.typeInvoiceList.forEach(t => {
      if (!this.addOtherIncome.contains(t.code)) {
        this.addOtherIncome.addControl(t.code, new FormControl(false));
      }
    });
  }

  onSearch() {
    if (!this.selectedCompanyId) {
      alert('Please select a Company');
      return;
    }
    this.isLoading = true;
    this.showTable = true;
    const spiltTypeId = 2

    this.service.InvoicecultureSearch(this.selectedCompanyId, spiltTypeId).subscribe({
      next: (res) => {
        this.search = res.Data;
        console.log("Data", this.search)
        if (this.search && this.search.length > 0) {
          this.dataSource = new MatTableDataSource(this.search);
          this.dataSource.paginator = this.paginator;
          this.displayedColumns = [
            'delete', 'companyCode', 'companyName', 'CultureRef', 'InvoiceType', 'mapName'];
        } else {
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.isLoading = false;
      },
    });
    this.isLoading = false;
  }

  exportToExcel() {
    if (!this.selectedCompanyId) {
      alert('Please select a Company');
      return;
    }

    this.isLoading = true;
    this.service.ExportToExcel(this.userdetail.user_Id)
      .pipe(
        finalize(() =>
          this.isLoading = false
        )
      ).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName)
          }
        },
        error: error => console.error('Error:', error)
      })
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

  DownloadTemplate() {
    const templateData = [
      {
        Company_code: "", Service_Charge: "", Map_Name: "", Invoice_Type: ""
        , Invoice_category: "", State: "", Type_of_invoice: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    const wb = {
      Sheets: { 'OtherIncomeCulture': ws },
      SheetNames: ['OtherIncomeCulture']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, `OtherIncomeCulture_Template.xlsx`);
  }

  FileUpload(fileInput: HTMLInputElement): void {
    this.isLoading = true;
    fileInput.click();
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];

    if (!this.excelFile) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('userId', this.userdetail.user_Id);

      this.service.UploadInvoiceCulture(formData).subscribe({
        next: (res) => {
          this.datatable = res.Data;
          console.table(this.datatable);
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "InvoiceCulture_Validations");
            this.isLoading = false;
          } else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('Upload failed', err);
          this.isLoading = false;
        }
      });
    }
  }

  downloadExcel(data: any[], templateId: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  getSelectedInvoiceTypes() {
    return this.typeInvoiceList.filter(t =>
      this.addOtherIncome.get(t.Paycode_Id.toString())?.value === true
    );
  }

  closeclick() {
    this.isAddclicked = false;
    this.uploadedDataSource.data = [];
    this.addOtherIncome.reset();
    this.showInvoiceTypeError = false;
    this.selectedCC = 0;
  }

  AddOtherImcome() {
    this.isAddclicked = true;
  }

  SaveData() {
    if (this.addOtherIncome.invalid) {
      this.addOtherIncome.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.addOtherIncome.getRawValue();
    var company_code = this.addOtherIncome.get('CompanyCode')?.value
    const parentDetail = {
      InvoiceCulture_id: 0,
      Company_Id: this.selectedCC,
      Company_Code: company_code.companyCode,
      Company_Name: this.addOtherIncome.get('CompanyName')?.value,
      InvoiceCul_Ref_No: "",
      InvoiceType: formValue.InvoiceType?.invoiceType || '',
      InvoiceType_Id: formValue.InvoiceType?.invoiceType_Id,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Service_Charge_Master_Id: this.addOtherIncome.get('ServiceCharge')?.value,
      Map_Name_Id: this.mapnameUI.mapNameId,
      Map_Name: this.mapnameUI.mapName,
      Invoice_Category_Id: this.addOtherIncome.get('InvoiceCategory')?.value,
      State_Id: this.stateId,
      Spilt_Type_Id: 2
    };

    const childDetail: ChildDetail[] = [];

    const selectedItems = this.filteredSelectedItems;
    
    selectedItems.forEach(item => {
      childDetail.push({
        InvoiceCulture_id: 0,
        Company_Id: this.selectedCC,
        Paycode_Id: item.Paycode_Id,
        Paycode_Code: item.Paycode_Code,
        HasAccess: true
      });
    });

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: 'Add',
      parentDetail,
      childDetail
    };

    this.service.postInvoiceCulture(payload).subscribe({
      next: (res) => {
        if (res.Data.message == "Invoice Culture/Structure Already Exists") {
          this.isLoading = false;
          alert(res.Data.message);
          return;
        }
        else if (res.Data.data.Table0) {
          this.datatable = res.Data.data.Table0;
          this.downloadExcel(this.datatable, "OtherIncomeCulture  _Validations");
          this.router.navigate(['/Master/invoicenavigation/OtherIncome']);
          this.isAddclicked = false;
          this.addOtherIncome.reset();
          this.onSearch();
          this.isLoading = false;
        }
        else {
          alert("No validations returned");
          this.isLoading = false;
        }
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  deleteClick(invoiceCulture_id: number, invoiceType: string) {
    if (confirm("Are you sure you want to delete this?")) {

      const parentDetail = {
        InvoiceCulture_id: invoiceCulture_id,
        Company_Id: 0,
        Company_Code: '',
        Company_Name: '',
        InvoiceCul_Ref_No: "",
        InvoiceType: invoiceType,
        InvoiceType_Id: 0,
        Cost_Center_Mapping_Id: 0,
        Service_Charge_Master_Id: 0,
        Service_Charge_Type_Id: 0,
        Service_Charge_Slab_Item_Id: 0,
        Service_Charge_Slab_Inner_Item_Id: 0,
        Map_Name_Id: 0,
        Map_Name: '',
        Invoice_Category_Id: 0,
        Error_Message: ""
      }

      const childDetail: ChildDetail[] = [];

      childDetail.push({
        InvoiceCulture_id: 0,
        Company_Id: 0,
        Paycode_Id: 0,
        Paycode_Code: "",
        HasAccess: false
      });

      const InvoiceCultureAdd = {
        createdBy: this.userdetail.user_Id,
        mode: 'Delete',
        parentDetail: parentDetail,
        childDetail: childDetail
      }
      this.service.postInvoiceCulture(InvoiceCultureAdd).subscribe({
        next: (res) => {
          const errormsg = res.Data.data.Table0[0].Error_Message;
          alert(errormsg);
          this.isLoading = true;
          this.onSearch()
          error: err => {
            console.error('Error fetching data:', err.message);
            this.isLoading = false;
          }
        }
      });
    }
  }

}

