import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { SEZWOPRepositoryService } from '../../../Service/invoice/sezwop-repository.service';
import { SEZWOPRepository, CompanyCode, PayPeriod, FinancialYear } from '../../../Models/sezwop-repository.model';
import { FinancialYearComponent } from "../../../common/financial-year/financial-year.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';


@Component({
  selector: 'app-sezwoprepositorynew',
  imports: [CommonModule, FormsModule, AgGridModule, FinancialYearComponent, CompanyallComponent, PayPeriodComponent],
  templateUrl: './sezwoprepositorynew.component.html',
  styleUrl: './sezwoprepositorynew.component.css'
})
export class SezwoprepositorynewComponent {
  companyCodes: CompanyCode[] = [];
  payPeriods: PayPeriod[] = [];
  financialYears: FinancialYear[] = [];
  payPeriodType: string = "";

  // Selected values
  selectedCompanyId!: number;
  selectedPayPeriodId: number | string = 0;
  selectedFinancialYear: number | string = '';
  invoiceNumber: string = '';

  // Grid
  gridApi!: GridApi;
  rowData: SEZWOPRepository[] = [];
  selectedRows: SEZWOPRepository[] = [];

  // Popup
  showUploadPopup = false;
  uploadRemark: string = '';
  selectedFile: File | null = null;
  acceptedFileTypes = '.pdf,.docx,.tiff,.tif,.msg,.eml';
  financialyear: any;
  companyUI: any;
  payperiodUI: any;
  pay_period?: string;


  // Validation popup
  showValidationPopup = false;
  validationMessages: string[] = [];

  // Column definitions matching the original jqxGrid
  columnDefs: ColDef[] = [
    { field: 'Serial_No', headerName: 'SNo', hide: true },
    { field: 'Id', hide: true },
    { field: 'Company_Id', hide: true },
    { field: 'Payperiod_Id', hide: true },
    { field: 'Invoice_Id', hide: true },
    {
      field: 'Invoice_Number',
      headerName: 'Invoice Number',
      width: 130,
      filter: 'agTextColumnFilter',
      tooltipField: 'Invoice_Number'
    },
    {
      field: 'Document_Name',
      headerName: 'Document Name',
      width: 260,
      tooltipField: 'Document_Name',
      cellRenderer: (params: any) => {
        if (params.value && params.data?.Document_FilePath) {
          return `<a href="javascript:void(0)" class="document-link">${params.value}</a>`;
        }
        return params.value || '';
      }
    },
    {
      field: 'Uploaded_Date',
      headerName: 'Uploaded Date',
      width: 170,
      tooltipField: 'Uploaded_Date'
    },
    {
      field: 'Remark',
      headerName: 'Document Remarks',
      width: 230,
      tooltipField: 'Remark'
    },
    {
      field: 'ApprovalStatus',
      headerName: 'Approval Status',
      width: 150,
      tooltipField: 'ApprovalStatus'
    },
    { field: 'Document_FilePath', hide: true },
    {
      field: 'UploadStatus',
      headerName: 'Upload Status',
      width: 150,
      tooltipField: 'UploadStatus'
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true
  };

  constructor(private sezService: SEZWOPRepositoryService) { }

  ngOnInit(): void {
    this.loadGridData(true);
  }


  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  handlefinancialYearEvent(financialYear: any) {
    this.financialyear = financialYear;
    this.selectedFinancialYear=this.financialyear.financial_Year_Id;
    console.log('Fin',this.financialyear);
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectedRows = this.gridApi.getSelectedRows();
    const approvedRows = this.selectedRows.filter(r => r.ApprovalStatus === 'Approved');
    if (approvedRows.length > 0) {
      approvedRows.forEach(row => {
        const rowNode = this.gridApi.getRowNode(String(row.Id));
        if (rowNode) {
          rowNode.setSelected(false);
        }
      });
      alert('This record is already approved and cannot be selected.');
      this.selectedRows = this.gridApi.getSelectedRows();
    }
  }

  handleCompanyEvent(company) {
      this.companyUI=company;
      this.selectedCompanyId = this.companyUI.companyId;
      console.log('companyId',this.selectedCompanyId);
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payperiodUI = payperiod;
    this.pay_period = payperiod.payPeriod
    this.selectedPayPeriodId=this.payperiodUI.payfrequencyid
    if (!this.companyUI) {
      alert("Select Company Code pay");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
  }

  onInvoiceNumberInput(): void {
    this.selectedCompanyId = 0;
    this.selectedPayPeriodId = 0;
    this.selectedFinancialYear = '';
  }

  onSearch(): void {
    this.loadGridData(false);
  }

  loadGridData(isInitial: boolean): void {
    let companyId = 0;
    let payPeriodId = 0;
    let year = 0;
    const invoiceNumbers = this.invoiceNumber || '';

    if (!isInitial) {
      companyId = this.getNumericValue(this.selectedCompanyId);
      payPeriodId = this.getNumericValue(this.selectedPayPeriodId);
      year = this.getNumericValue(this.selectedFinancialYear);
    }

    this.sezService.search(companyId, payPeriodId, invoiceNumbers, year).subscribe({
      next: (data) => this.rowData = data,
      error: (err) => console.error('Error loading grid data:', err)
    });
  }

  onEditClick(): void {
    this.selectedRows = this.gridApi.getSelectedRows();

    if (this.selectedRows.length === 0) {
      this.showValidation('Please select any row');
      return;
    }

    this.uploadRemark = '';
    this.selectedFile = null;
    this.showUploadPopup = true;
  }

  onDeleteClick(): void {
    const selectedRows = this.gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      this.showValidation('Please select any row');
      return;
    }

    const record = selectedRows[0];
    if (confirm('Are you sure you want to delete the Document?')) {
      this.sezService.delete(record.Id, record.Document_FilePath).subscribe({
        next: (message) => {
          this.showValidation(message || 'Deleted successfully');
          this.loadGridData(false);
        },
        error: (err) => console.error('Error deleting:', err)
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSave(): void {
    if (!this.selectedFile) {
      alert('Please select only PDF/Word/TIF file');
      return;
    }

    const ext = this.selectedFile.name.substring(this.selectedFile.name.lastIndexOf('.') + 1).toLowerCase();
    if (!['pdf', 'docx', 'tiff', 'tif', 'msg'].includes(ext)) {
      alert('Upload .pdf/.docx/.tif/.msg files only');
      return;
    }

    const formData = new FormData();
    formData.append('Remark', this.uploadRemark);
    formData.append('Obselete_Document_FilePath', '');
    formData.append('DocumentFile', this.selectedFile);
    formData.append('selectedrecord', JSON.stringify(this.selectedRows));

    this.sezService.uploadFile(formData).subscribe({
      next: (data) => {
        alert(data.Error_Message || 'Upload successful');
        this.showUploadPopup = false;
        this.selectedFile = null;
        this.loadGridData(false);
      },
      error: (err) => console.error('Error uploading:', err)
    });
  }

  onCancelPopup(): void {
    this.showUploadPopup = false;
    this.selectedFile = null;
    this.uploadRemark = '';
  }

  onExportToExcel(): void {
    if (this.rowData.length === 0) {
      this.showValidation('No data to export.');
      return;
    }

    let companyId = this.getNumericValue(this.selectedCompanyId) || 0;
    let statusId = (this.getNumericValue(this.selectedPayPeriodId) || 0).toString();
    let invoiceNumbers = this.invoiceNumber || '0';
    let year = this.getNumericValue(this.selectedFinancialYear) || 0;

    if (statusId === '-1') statusId = '0';
    if (!invoiceNumbers || invoiceNumbers.trim() === '') invoiceNumbers = '0';

    this.sezService.exportToExcel(companyId, statusId, invoiceNumbers, year).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SEZWOPRepositoryDetails.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Export failed:', err)
    });
  }

  onCellClicked(event: any): void {
    if (event.colDef.field === 'Document_Name' && event.data?.Document_FilePath) {
      this.sezService.downloadFile(event.data.Document_FilePath).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = event.data.Document_FilePath;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error('Download failed:', err)
      });
    }
  }

  showValidation(message: string): void {
    this.validationMessages = message.split('|').filter(m => m.trim() !== '');
    this.showValidationPopup = true;
  }

  closeValidationPopup(): void {
    this.showValidationPopup = false;
    this.validationMessages = [];
  }

  private getNumericValue(value: any): number {
    if (value === '' || value === null || value === undefined || value === ' ') return 0;
    const parsed = typeof value === 'string' ? parseInt(value.split('|')[0], 10) : Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
