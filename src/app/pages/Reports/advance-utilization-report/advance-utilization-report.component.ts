import { Component, Inject, InjectionToken } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Iadvanceutilizationreport } from '../../../Repository/Reports/Iadvanceutilizationreport';
import { AdvanceUtilizationReportService } from '../../../Service/Reports/advanceutilizationreport';

export const Pay_TOKEN = new InjectionToken<Iadvanceutilizationreport>('Pay_TOKEN');
@Component({
  selector: 'app-advance-utilization-report',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CommonModule, FormsModule],
  
  templateUrl: './advance-utilization-report.component.html',
  styleUrl: './advance-utilization-report.component.css',
  providers: [
      {
        provide: Pay_TOKEN,
        useClass: AdvanceUtilizationReportService,
      }
    ]
})
export class AdvanceUtilizationReportComponent {
Payperiod: any = [];
  PayPeriod: string = '';  
  data: any;
  isLoading = false;

  constructor(@Inject(Pay_TOKEN) private service: AdvanceUtilizationReportService) { }

  ngOnInit() {
    this.BindPayPeriod();
  }

  BindPayPeriod() {
    this.service.GetPayPeriod().subscribe({
      next: (res: any) => {
        this.Payperiod = res?.Data ?? [];
      }
    });
  }

  exportToExcel(): void {
    if (!this.PayPeriod) {
      alert('Please select payperiod');
      return;
    }
 this.isLoading=true;
    this.service.Exporttoexcel(this.PayPeriod).subscribe({
      next: (res) => {
        try {
          const jsonData = res.Data?.data?.Table0 ?? [];
          this.data = res.Data?.message;

          if (jsonData.length === 0) {
            alert(this.data || "No records found.");
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "AdvanceUitilizationReport");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `AdvanceUtilizationReport  _${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
           this.isLoading=false;
        }
        catch (err) {
          console.error(err);
           this.isLoading=false;
        }
      }
    });
  }
}
