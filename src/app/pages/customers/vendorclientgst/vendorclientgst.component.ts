import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IStateRepository } from '../../../Repository/GlobalMasters/IState.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { Pay_TOKEN } from '../clientaddress/clientaddress.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { StateComponent } from '../../../common/state/state.component';
import { IClienGSTList } from '../../../Repository/customer/IClientGstlist';
import { ClientGSTListService } from '../../../Service/customersserv/client-gstlist.service';
export const Client_TOKEN = new InjectionToken<IClienGSTList>('Pay_TOKEN');
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { State } from '../../../Models/Common';
import { GroupnameComponent } from '../../groupname/groupname.component';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'vendorclientgst',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule, MatCardModule,
    CompanyallComponent,
    StateComponent,
    GroupnameComponent,
    MatMenuModule],
  templateUrl: './vendorclientgst.component.html',
  styleUrl: './vendorclientgst.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ClientGSTListService,
    }
  ]
})
export class VendorclientgstComponent {

  isAddclicked = false;
  clientform!: FormGroup;
  isEditMode = false;
  selectedRow: any = null;
  userdetail: any;
  isLoading: boolean = false;
  selectedCompanyId!: number;
  selectedCompanyCode: any;
  stateId?: number;
  stateName: string = "";
  stateUI: any;
  selectedState: any = null;
  selectedGroupId: number | null = null;
  selectedGroupName: string = '';
  UploadType: string = '';
  GSTTypeList: any[] = [];
  Clientgst: any;







  displayedColumns: string[] = [
    //"Delete",
    "Edit",
    // "Action",
    "Client Gst Id",
    "Company Code",
    "Group Name",
    "State",
    "Client Invoicing State",
    "Quess Invoicing State",
    "Gst Type",
    "Gst Number",
    "Pan Number",
    "Tan Number",
    "Created By",
    "Created On",
    "Sub Customer Code",
    "Invoice Category",

    // "Total Count",
    // "Company Id",
    // "State Id",
    // "Invoicing State Id",
    // "Client Invoicing State Id",
    // "Group Detail Id",
    // "Remarks",
    // "Gst Type Id",
    // "Invoice Category Id",
    // "State Code"
  ];

  dataSource = new MatTableDataSource<any>([]);
  totalCount: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValues: any = {
    vendorClientGstId: '',
    company_Code: '',
    group_Name: '',
    state_Name: '',
    clientInvoicingState_Name: '',
    invoicingState_Name: '',
    gstTypeName: '',
    gstNumber: '',
    panNumber: '',
    tanNumber: '',
    userName: '',
    createdOn: '',
    sapCustomerCode: '',
    invoiceCategory: ''
  };

  filterColumns: string[] = [
    //'filterDelete',
    'filterEdit',

    'filterVendorClientGstId',
    'filterCompanyCode',
    'filterGroupName',
    'filterState',
    'filterClientInvoicingState',
    'filterQuessInvoicingState',
    'filterGstType',
    'filterGstNumber',
    'filterPanNumber',
    'filterTanNumber',
    'filterCreatedBy',
    'filterCreatedOn',
    'filterSubCustomerCode',
    'filterInvoiceCategory',

    // 'filterTotalCount',
    // 'filterCompanyId',
    // 'filterStateId',
    // 'filterInvoicingStateId',
    // 'filterClientInvoicingStateId',
    // 'filterGroupDetailId',
    // 'filterRemarks',
    // 'filterGstTypeId',
    // 'filterInvoiceCategoryId',
    // 'filterStateCode'
  ];
  constructor(
    @Inject(Pay_TOKEN) private service: IClienGSTList,
    private fb: FormBuilder,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
  ) { }
  applyFilter(event: Event, column: string) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.filterValues[column] = filterValue;

    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.onsearch();
  }

  clearFilter() {

    Object.keys(this.filterValues).forEach(key => {
      this.filterValues[key] = '';
    });

    this.dataSource.filter = '';

    this.dataSource.filter = JSON.stringify(this.filterValues);
    this.onsearch();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  pageIndex: number = 0;
  pageSize: number = 10;
  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));


      this.onsearch();
      this.BindInvoiceCategory();



    }
    else {
      console.warn('UserProfile not found in session storage');
    }

    this.clientform = this.fb.group({
      CompanyCode: ['', Validators.required],
      GroupName: ['', Validators.required],
      State: [null, Validators.required],
      ClientInvoicingState: [null, Validators.required],
      QuessInvoicingState: [null, Validators.required],
      GstType: [null, Validators.required],
      GSTNumber: ['', Validators.required],
      PANNumber: ['', Validators.required],
      TANNumber: ['', Validators.required],
      InvoiceCatagory: [null, Validators.required],
      Remarks: [''],
      SubCustomerCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]
      ],
    });
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {

      const searchTerms = JSON.parse(filter);

      return Object.keys(searchTerms).every(key => {

        const searchValue = searchTerms[key];

        if (!searchValue) {
          return true;
        }

        let dataValue = data[key];

        if (dataValue === null || dataValue === undefined) {
          dataValue = '';
        }

        if (typeof dataValue === 'boolean') {
          dataValue = dataValue ? 'yes' : 'no';
        }

        return dataValue
          .toString()
          .toLowerCase()
          .includes(searchValue.toString().toLowerCase());
      });
    };
  }



  handleCompanyEvent(company: any) {

    if (!company) return; // ✅ important fix

    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

    this.clientform.patchValue({
      CompanyCode: company.companyCode
    });
  }

  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.selectedRow = null;
    this.clientform.reset();
  }


  closeclick() {
    this.isAddclicked = false;
  }


  editState(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.selectedRow = row;
  }
  onPageChange(event: PageEvent) {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    console.log("Current Page:", this.pageIndex + 1);
    console.log("Page Size:", this.pageSize);

    this.onsearch();

  }

  onsearch() {

    this.isLoading = true;

    if (!this.userdetail || !this.userdetail.user_Id) {
      console.warn("User Id not found");
      this.isLoading = false;
      return;
    }

    console.log('clientGstId:', this.filterValues.clientGstId);

    const payload = {

      VendorClientGstId: this.filterValues.vendorClientGstId || null,
      Company_Code: this.filterValues.company_Code || "",
      Group_Name: this.filterValues.group_Name || "",
      State_Name: this.filterValues.state_Name || "",
      ClientInvoicingState_Name: this.filterValues.clientInvoicingState_Name || "",
      InvoicingState_Name: this.filterValues.invoicingState_Name || "",
      GstTypeName: this.filterValues.gstTypeName || "",
      GstNumber: this.filterValues.gstNumber || "",
      PanNumber: this.filterValues.panNumber || "",
      TanNumber: this.filterValues.tanNumber || "",
      UserName: this.filterValues.userName || "",
      SapCustomerCode: this.filterValues.sapCustomerCode || "",
      InvoiceCategory: this.filterValues.invoiceCategory || "",
      PageNo: this.pageIndex + 1,
      PageSize: this.pageSize,

      // PageNo: this.paginator ? this.paginator.pageIndex + 1 : 1,
      // PageSize: this.paginator ? this.paginator.pageSize : 10,
      UserId: this.userdetail.user_Id.toString()

    };

    console.log("Search Payload", payload);

    this.service.SearchVendorgst(payload).subscribe({
      next: (res: any) => {
        console.log("API Count:", res?.Data?.length);

        console.table(
          res?.Data?.map((x: any) => ({
            clientGstId: x.clientGstId
          }))
        );
        console.log('result', res);
        this.Clientgst = res?.Data || [];
        console.log(this.Clientgst)
        if (this.Clientgst.length != 0) {
          // Bind table data
          this.dataSource = new MatTableDataSource(this.Clientgst);
          this.dataSource.paginator = this.paginator;
          //this.dataSource.data = this.Clientaddress;
          this.dataSource.sort = this.sort;
          this.totalCount = this.Clientgst[0].totalCount || 0;
        } else {
          this.dataSource.data = [];
          this.totalCount = 0;
        }

        console.log(this.dataSource.data)

        this.isLoading = false;
      },

      error: (err) => {

        this.isLoading = false;
        console.error("Search Error", err);

      }
    });

  }
  exportToExcel(): void {

    this.isLoading = true;

    if (!this.userdetail || !this.userdetail.user_Id) {
      console.warn("User Id not found");
      this.isLoading = false;
      return;
    }

    const userId = this.userdetail.user_Id;

    this.service.VendorExport(userId).subscribe({

      next: (res: any) => {

        this.isLoading = false;

        try {

          const base64File = res?.Data?.file;
          let apiFileName = res?.Data?.fileName;

          if (!base64File) {
            alert("No file received from API");
            return;
          }

          // Fix invalid filename characters
          apiFileName = apiFileName
            ?.replace(/\//g, "-")
            ?.replace(/:/g, "-")
            ?.replace(/ /g, "_");

          // Remove extension (will be added during download)
          apiFileName = apiFileName?.replace(".xlsx", "");

          this.downloadExcelFromBase64(base64File, apiFileName, "Excel");

        }
        catch (err) {

          console.error("Error exporting Excel:", err);

        }

      },

      error: (err) => {

        this.isLoading = false;
        console.error("Error exporting Client GST Excel", err);

      }

    });

  }
  downloadExcelFromBase64(base64String: string, fileName: string, fileType: string): void {

    const byteCharacters = atob(base64String);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob(
      [byteArray],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}_${fileType}.xlsx`;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(downloadLink.href);

  }


  stateEvent1(event: State) {

    if (!event) {
      this.stateId = 0;
      this.stateName = '';
      this.stateUI = undefined;
      this.selectedState = undefined;

      this.clientform.patchValue({
        State: null,
        GstType: null   // ✅ reset GST when state cleared
      });

      return;
    }

    // ✅ store values
    this.stateId = event.state_Id;
    this.stateName = event.state_Name;
    this.stateUI = event;
    this.selectedState = event;

    // ✅ update form
    this.clientform.patchValue({
      State: event
    });

    console.log('Selected State:', this.stateUI);

    // ✅ IMPORTANT: LOAD GST TYPES BASED ON STATE
    this.BindGSTTypes();
  }

  stateEvent2(event: State) {
    if (!event) {
      this.stateId = 0;
      this.stateName = '';
      this.stateUI = undefined;
      this.selectedState = undefined;
      // this.clientform.get('State')?.setValue(null);
      return;
    }

    this.stateId = event.state_Id;
    this.stateName = event.state_Name;
    this.stateUI = event;
    this.selectedState = event;


    console.log('State received in city component:', event);
    console.log('Selected State:', this.stateUI);

  }

  stateEvent3(event: State) {
    if (!event) {
      this.stateId = 0;
      this.stateName = '';
      this.stateUI = undefined;
      this.selectedState = undefined;

      return;
    }

    this.stateId = event.state_Id;
    this.stateName = event.state_Name;
    this.stateUI = event;
    this.selectedState = event;
    console.log('State received in city component:', event);
    console.log('Selected State:', this.stateUI);

  }
  handleGroupEvent(group: any) {
    this.selectedGroupId = Number(group.siteCode);
    this.selectedGroupName = group.siteName;

    console.log("Selected Group:", group);
    console.log("Group ID:", this.selectedGroupId);

    this.clientform.patchValue({
      GroupName: group.siteName
    });
  }

  InvoiceCategoryList: any[] = [];

  BindInvoiceCategory() {
    this.service.GetInvoiceCategory().subscribe({
      next: (res: any) => {
        this.InvoiceCategoryList = res.Data;
      },
      error: (err) => {
        console.error('Error fetching Invoice Category', err);
      }
    });
  }

  BindGSTType() {
    this.service.GetInvoiceCategory().subscribe({
      next: (res: any) => {
        this.InvoiceCategoryList = res.Data;
      },
      error: (err) => {
        console.error('Error fetching Invoice Category', err);
      }
    });
  }


  BindGSTTypes(selectedGstTypeId?: number) {

    if (!this.stateId) {
      this.GSTTypeList = [];
      return;
    }
    console.log("BindGSTTypes CALLED", selectedGstTypeId);

    this.service.GetGSTTypes(this.stateId).subscribe({
      next: (res: any) => {

        this.GSTTypeList = res?.Data || [];

        console.log('isEditMode:', this.isEditMode);
        console.log('selectedGstTypeId:', selectedGstTypeId);

        if (this.isEditMode && selectedGstTypeId != null) {

          this.clientform.patchValue({
            GstType: selectedGstTypeId
          });

          console.log('GstType after patch:', this.clientform.get('GstType')?.value);
        }

      },
      error: (err) => {
        console.error('Error fetching GST Types', err);
        this.GSTTypeList = [];
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement, Action: string): void {
    fileInput.value = '';
    this.UploadType = Action;
    fileInput.click();
  }

  onFileSelected(event: Event): void {

    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('flag', this.UploadType);
    formData.append('userId', this.userdetail.user_Id);

    this.service.PostVendorClientGSTUpload(formData).subscribe({

      next: (res: any) => {

        console.log('UPLOAD RESPONSE:', res);

        // ✅ SUCCESS
        if (
          res?.StatusCode === 200 &&
          res?.Data?.response?.includes('Row(s) Uploaded Successfully')
        ) {
          alert(res.Data.response);
          this.isLoading = false;
          this.onsearch();
        }

        // ❌ FAILED → DOWNLOAD EXCEL
        else if (
          res?.StatusCode === 200 &&
          res?.Data?.response?.toLowerCase().includes('failed to import')
        ) {

          let errorArray: any[] = [];

          try {
            errorArray = JSON.parse(res.Data.errors[0] || '[]');
          } catch (e) {
            console.error('Error parsing error array', e);
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item.Error_Message ||
              item.Message ||
              item.MESSAGE ||
              item.message ||
              ''
          }));

          const worksheet: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(exportData);

          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'ErrorMessages_ClientGST.xlsx');

          alert(res.Data.response);

          this.isLoading = false;
          return;
        }

        // ❌ OTHER ERROR
        else {
          alert(res?.Data?.response || 'Error while processing');
          this.isLoading = false;
          return;
        }
      },

      error: (err) => {
        console.error('Upload failed', err);
        alert('Upload failed');
        this.isLoading = false;
      }
    });
  }

  onDeleteRow(row: any) {
    if (!confirm('Are you sure you want to delete this Client GST?')) {
      return;
    }
    if (!row?.clientGstId) {
      alert("Invalid Client GST Id");
      return;
    }

    this.isLoading = true;
    const payload = {

      Action: "Delete",
      UserId: String(this.userdetail?.user_Id),
      XmlData: "",

      ClientGstId: String(row.clientGstId),

      CompanyId: String(row.companyId),
      Company_Code: row.company_Code,

      StateId: String(row.stateId),
      State_Name: row.state_Name,

      InvoicingStateId: String(row.invoicingStateId),
      InvoicingState_Name: row.invoicingState_Name,

      ClientInvoicingStateId: String(row.clientInvoicingStateId),
      ClientInvoicingState_Name: row.clientInvoicingState_Name,

      Group_Detail_Id: String(row.group_Detail_Id),
      Group_Name: row.group_Name,

      GstNumber: row.gstNumber,
      PanNumber: row.panNumber,
      TanNumber: row.tanNumber,

      GstTypeId: String(row.gstTypeId),
      GstTypeName: row.gstTypeName,

      SapCustomerCode: row.sapCustomerCode,

      InvoiceCategoryId: String(row.invoiceCategoryId),
      InvoiceCategory: row.invoiceCategory,

      Remarks: row.remarks || "",

      CreatedBy: String(this.userdetail?.user_Id),
      CreatedOn: new Date().toISOString(),

      PageNo: "1",
      PageSize: "10",
      TotalCount: row.totalCount ? String(row.totalCount) : "0",

      SortField: "",
      SortDirection: "",

      UserName: this.userdetail?.user_Name || "",

      StateCode: row.stateCode || ""
    };


    console.log("DELETE JSON:", JSON.stringify(payload));

    this.service.DeleteVendorClientGST(row.clientGstId, this.userdetail.user_Id).subscribe({

      next: (res: any) => {

        const msg = res?.response || res?.Message;

        if (msg) {
          alert("Client GST deleted successfully");
        }

        this.isLoading = false;

        // ✅ refresh
        this.onsearch();
      },

      error: (err) => {
        console.error("DELETE ERROR:", err);
        alert("Error while deleting");
        this.isLoading = false;
      }

    });
  }

  onEditRow(row: any) {

    this.isAddclicked = true;
    this.isEditMode = true;
    this.selectedRow = row;

    console.log("EDIT ROW:", row);
    // ✅ RESET FIRST (IMPORTANT)
    this.GSTTypeList = [];
    this.clientform.reset();
    // ✅ set main values
    this.selectedCompanyId = row.companyId;
    this.selectedCompanyCode = row.company_Code;

    this.stateId = row.stateId;
    this.stateName = row.state_Name;
    this.selectedState = {
      state_Id: row.stateId,
      state_Name: row.state_Name,
      state_Code: row.stateCode
    };

    this.selectedGroupId = row.group_Detail_Id;
    this.selectedGroupName = row.group_Name;

    // ✅ patch form (like TDS)
    this.clientform.patchValue({

      CompanyCode: row.company_Code,
      GroupName: row.group_Name,

      State: this.selectedState,
      ClientInvoicingState: this.selectedState,
      QuessInvoicingState: this.selectedState,

      // GstType: row.gstTypeId,

      GSTNumber: row.gstNumber,
      PANNumber: row.panNumber,
      TANNumber: row.tanNumber,

      InvoiceCatagory: row.invoiceCategoryId,

      Remarks: row.remarks,
      SubCustomerCode: row.sapCustomerCode
    });
    this.clientform.get('CompanyCode');
    this.BindGSTTypes(row.gstTypeId);
  }

  onSave() {
    if (this.clientform.invalid) {
      this.clientform.markAllAsTouched();
      return;
    }

    if (!this.selectedGroupId) {
      alert("Please select Group Name");
      return;
    }

    if (!this.stateId) {
      alert("Please select State");
      return;
    }

    this.isLoading = true;

    const form = this.clientform.value;

    // Build the payload object as required
    const payload = {
      Action: this.isEditMode ? "Edit" : "Add",
      UserId: String(this.userdetail?.user_Id),
      XmlData: "",
      ClientGstId: this.isEditMode ? String(this.selectedRow.clientGstId) : "0",
      CompanyId: String(this.selectedCompanyId),
      Company_Code: this.selectedCompanyCode,
      StateId: String(this.stateId),
      State_Name: this.stateName,
      InvoicingStateId: String(this.stateId),
      InvoicingState_Name: this.stateName,
      ClientInvoicingStateId: String(this.stateId),
      ClientInvoicingState_Name: this.stateName,
      Group_Detail_Id: String(this.selectedGroupId),
      Group_Name: this.selectedGroupName,
      GstNumber: form.GSTNumber ? String(form.GSTNumber).trim() : "",
      PanNumber: form.PANNumber ? String(form.PANNumber).trim() : "",
      TanNumber: form.TANNumber ? String(form.TANNumber).trim() : "",
      GstTypeId: String(form.GstType),
      GstTypeName: this.GSTTypeList.find(x => x.gstTypeId == form.GstType)?.gstTypeName || "",
      SapCustomerCode: form.SubCustomerCode,
      InvoiceCategoryId: String(form.InvoiceCatagory),
      InvoiceCategory: this.InvoiceCategoryList.find(x => x.invoiceCategoryId == form.InvoiceCatagory)?.invoiceCategory || "",
      Remarks: form.Remarks || "",
      CreatedBy: String(this.userdetail?.user_Id),
      CreatedOn: new Date().toISOString(),
      PageNo: "1",
      PageSize: "10",
      TotalCount: "0",
      SortField: "",
      SortDirection: "",
      UserName: this.userdetail?.user_Name || "",
      StateCode: this.selectedState?.state_Code || ""
    };

    // Wrap the payload inside the required 'Request' property
    const requestPayload = { Request: payload };

    console.log("EDIT/SAVE PAYLOAD:", JSON.stringify(requestPayload));

    this.service.SaveVendorClientGST(requestPayload).subscribe({
      next: (res: any) => {
        const msg = res?.response || res?.Message;
        if (msg && msg.toLowerCase().includes('success')) {
          alert(this.isEditMode
            ? "Client GST updated successfully"
            : "Client GST saved successfully"
          );
        }
        this.isLoading = false;
        this.clientform.reset();
        this.isAddclicked = false;
        this.isEditMode = false;
        this.onsearch();
      },
      error: () => {
        alert("Error while processing");
        this.isLoading = false;
      }
    });
  }
  AddTemplate() {
    const templateData = [
      {
        Company_Code: "",
        State: "",
        GST_Number: "",
        PAN_Number: "",
        TAN_Number: "",
        Quess_Invoicing_State: "",
        Client_Invoicing_State: "",
        Group_Name: "",
        Remarks: "",
        GstTypeName: "",
        SubCustomerCode: "",
        Invoice_Category: "",
        Ship_To_GST_Number: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = {
      Sheets: { 'ClientGSTTemplate': ws },
      SheetNames: ['ClientGSTTemplate']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Client_GST_AddTemplate_${Date.now()}.xlsx`);
  }
  EditTemplate() {
    const templateData = [
      {
        clientGstId: "",
        Company_Code: "",
        State: "",
        GST_Number: "",
        PAN_Number: "",
        TAN_Number: "",
        Quess_Invoicing_State: "",
        Client_Invoicing_State: "",
        Group_Name: "",
        Remarks: "",
        GstTypeName: "",
        SubCustomerCode: "",
        Invoice_Category: "",
        Ship_To_GST_Number: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = {
      Sheets: { 'ClientGSTTemplate': ws },
      SheetNames: ['ClientGSTTemplate']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Client_GST_EditTemplate_${Date.now()}.xlsx`);
  }
}




