import { Component, HostListener, Inject, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IGenericUploadRepository } from '../../Repository/IGenericUpload.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
import { GenericUploadService } from '../../Service/GenericUploadRepository.service';
import { finalize } from 'rxjs';
export const Generic_TOKEN = new InjectionToken<IGenericUploadRepository>('Generic_TOKEN');
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

@Component({
  selector: 'genericupload',
  imports: [CommonModule, FormsModule],
  templateUrl: './genericupload.component.html',
  styleUrl: './genericupload.component.css',
  providers: [
    {
      provide: Generic_TOKEN,
      useClass: GenericUploadService,
    }
  ]
})
export class GenericuploadComponent {

  allOptions: any[] = [];
  filteredOptions: any[] = [];
  searchQuery: string = '';
  selectedFile: any = null;
  dropdownOpen: boolean = false;
  isDownloading: boolean = false;
  statusMessage: string = '';
  userdetail: any;
  isLoading = false;

  // get filteredOptions(): any[] {
  //   const q = this.searchQuery?.toLowerCase().trim() || '';
  //   return q
  //     ? this.allOptions.filter(o =>
  //       o.uploadTypeName?.toLowerCase().includes(q)
  //     )
  //     : this.allOptions;
  // }

  // --- Dropdown ---
  openDropdown(): void {
    this.dropdownOpen = true;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  constructor(
    @Inject(Generic_TOKEN) private GenericService: IGenericUploadRepository,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
  ) { }

  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      this.BindUploadTypeDD();
      console.log('filteredOptions', this.filteredOptions);
    }
    else {
      console.warn('UserProfile not found in session storage');
    }
  }

  BindUploadTypeDD() {
    this.GenericService.BindUploadType(this.userdetail.user_Id).subscribe({
      next: (res: any) => {
        this.allOptions = res?.Data || [];

        if (this.allOptions.length === 0) {
          this.allOptions = [{
            GEN_vDescription: 'Not Available',
            GEN_iID: 0
          }];
        }
        this.filteredOptions = [...this.allOptions];
      },
      error: (err) => {
        console.error('Error fetching Invoice Category', err);
      }
    });
  }
  onSearch() {
    const q = this.searchQuery.toLowerCase().trim();

    this.filteredOptions = q
      ? this.allOptions.filter(o =>
        o.GEN_vDescription?.toLowerCase().includes(q)
      )
      : [...this.allOptions];

    // 👉 No results case
    if (this.filteredOptions.length === 0) {
      this.filteredOptions = [{
        GEN_iID: null,
        GEN_vDescription: 'No results found',
        isDisabled: true
      }];
    }
  }
  selectItem(item: any) {
    if (item.isDisabled) return;

    this.selectedFile = item;

    // ✅ IMPORTANT: set string, not object
    this.searchQuery = item.GEN_vDescription;

    this.dropdownOpen = false;
  }

  // Close dropdown on outside click
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.fm-dropdown-wrap')) {
      this.dropdownOpen = false;
    }
  }

  // --- Download ---
  handleDownload(): void {
    if (!this.selectedFile) {
      this.showStatus('Please select an Upload Type!.');
      return;
    }
    this.isDownloading = true;
    this.showStatus(`Downloading <strong>${this.selectedFile?.GEN_vDescription} Template</strong>&hellip;`);
    const uploadType = this.selectedFile?.GEN_vDescription.replace(/ /g, '');
    this.GenericService.GetGenericTemplate(uploadType)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: res => {
          console.log(res);
          const File = res?.Data?.file;
          if (File) {
            this.downloadExcelFromBase64(res?.Data?.file, res?.Data?.fileName);
            this.isDownloading = false;
            this.showStatus(`<strong>${this.selectedFile?.GEN_vDescription} Template</strong> downloaded successfully.`);
          } else {
            console.error('File not found');
            this.showStatus(`<strong>${this.selectedFile?.GEN_vDescription} Template</strong> download Failed!.`);
            this.isDownloading = false;
          }
        },
        error: error => {
          console.error('Error:', error);
          this.isLoading = false;
        }
      });
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

  // --- Upload ---
  handleUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const sizeKb = (file.size / 1024).toFixed(1);
    this.showStatus(`Uploaded: <strong>${file.name}</strong> &mdash; ${sizeKb} KB`);

    // Reset input so same file can be re-uploaded
    input.value = '';
  }


  ImportClick(fileInput: HTMLInputElement): void {
    if (!this.selectedFile) {
      this.showStatus('Please select an Upload Type!.');
      return;
    }
    else{
    fileInput.value = '';
    fileInput.click();
    }
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
    formData.append('userId', this.userdetail.user_Id);
    formData.append('uploadType', this.selectedFile?.GEN_vDescription);

    this.GenericService.PostGenericUpload(formData).subscribe({

      next: (res: any) => {

        console.log('UPLOAD RESPONSE:', res);

        // ✅ SUCCESS
        if (
          res?.StatusCode === 200 &&
          res?.Data?.response?.includes('Row(s) Uploaded Successfully')
        ) {
          alert(res.Data.response);
          this.isLoading = false;
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

          XLSX.writeFile(workbook, `${this.selectedFile?.GEN_vDescription}_Validation.xlsx`);

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

  private showStatus(message: string): void {
    this.statusMessage = message;
  }
}
