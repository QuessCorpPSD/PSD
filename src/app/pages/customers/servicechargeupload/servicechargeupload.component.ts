import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-servicechargeupload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './servicechargeupload.component.html',
  styleUrl: './servicechargeupload.component.css'
})
export class ServicechargeuploadComponent {

  serviceCharge: string = 'Service Fee';
  serviceChargeType: string = 'Fixed';
  selectedFile: File | null = null;

  serviceChargeList = [
    { id: 'Service Fee', name: 'Service Fee' },
    { id: 'Other Charge', name: 'Other Charge' }
  ];

  serviceChargeTypeList = [
    { id: 'Fixed', name: 'Fixed' },
    { id: 'Variable', name: 'Variable' }
  ];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  importData() {
  }

  downloadTemplate() {
  }
}