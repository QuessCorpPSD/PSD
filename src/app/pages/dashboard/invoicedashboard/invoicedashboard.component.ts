import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashBoardServices } from '../../../Service/DashBoardService';

@Component({
  selector: 'app-invoicedashboard',
  imports: [MatIconModule],
  templateUrl: './invoicedashboard.component.html',
  styleUrl: './invoicedashboard.component.css',
  standalone: true,
})
export class InvoicedashboardComponent implements OnInit {

  activeTab: string = 'overview';

  InvoiceTotal: any;
  InvoiceCompleted: any;
  InvoicePending: any;
  InvoiceYetToCome: any;
  TotalInvoiceAmount: any;
  CompletedInvoiceAmount: any;
  PendingInvoiceAmount: any;
  yettoComeInvoiceAmount: any;
  InvoiceTotalPercentage: number = 0;
  InvoiceCompletedPercentage: number = 0;
  InvoicePendingPercentage: number = 0;
  InvoiceYetToComePercentage: number = 0;
  isLoading: boolean = false;


  constructor(private dashboardService: DashBoardServices) { }

  ngOnInit(): void {
    this.getInvoiceDashboard();
  }

  getInvoiceDashboard(): void {
    this.dashboardService.getadmindashboard().subscribe({
      next: (res: any) => {

        console.log('Admin Dashboard Response:', res);

        const data = res.Data;

        this.InvoiceTotal = data?.invoiceTotal ?? 0;
        this.InvoiceCompleted = data?.invoiceCompleted ?? 0;
        this.InvoicePending = data?.invoicePending ?? 0;
        this.InvoiceYetToCome = data?.invoiceYetToCome ?? 0;
        this.TotalInvoiceAmount = data?.totalInvoiceAmount ?? 0;
        this.CompletedInvoiceAmount = data?.completedInvoiceAmount ?? 0;
        this.PendingInvoiceAmount = data?.pendingInvoiceAmount ?? 0;
        this.yettoComeInvoiceAmount = data?.yettoComeInvoiceAmount ?? 0;
        if (this.InvoiceTotal > 0) {
          this.InvoiceTotalPercentage = 100;
          this.InvoiceCompletedPercentage =
            Number(((this.InvoiceCompleted / this.InvoiceTotal) * 100).toFixed(2));

          this.InvoicePendingPercentage =
            Number(((this.InvoicePending / this.InvoiceTotal) * 100).toFixed(2));

          this.InvoiceYetToComePercentage = 100;
        }
      },

      error: (error) => {
        console.error('Dashboard API Error:', error);
      }
    });
  }
  // InvoiceDashDetail(invoiceType):void{

  // }
  InvoiceDashDetail(invoiceType: string): void {

    console.log('Selected Invoice Type:', invoiceType);
    this.isLoading = true

    this.dashboardService.GetInvoiceDashboard(invoiceType).subscribe({

      next: (res: any) => {

        console.log('Invoice Dashboard Response:', res);

        const data = res?.Data;

        console.log('Invoice Dashboard Data:', data);

        if (!data) {
          this.resetInvoiceData();
          this.isLoading = false;
          return;
        }

        // Invoice Counts
        this.InvoiceTotal = data.invoiceTotal ?? 0;
        this.InvoiceCompleted = data.invoiceCompleted ?? 0;
        this.InvoicePending = data.invoicePending ?? 0;
        this.InvoiceYetToCome = data.invoiceYetToCome ?? 0;

        // Invoice Amounts
        this.TotalInvoiceAmount = data.totalInvoiceAmount ?? 0;
        this.CompletedInvoiceAmount = data.completedInvoiceAmount ?? 0;
        this.PendingInvoiceAmount = data.pendingInvoiceAmount ?? 0;
        this.yettoComeInvoiceAmount = data.yettoComeInvoiceAmount ?? 0;

        // Percentages
        if (this.InvoiceTotal > 0) {

          this.InvoiceTotalPercentage = 100;

          this.InvoiceCompletedPercentage =
            Number(
              ((this.InvoiceCompleted / this.InvoiceTotal) * 100).toFixed(2)
            );

          this.InvoicePendingPercentage =
            Number(
              ((this.InvoicePending / this.InvoiceTotal) * 100).toFixed(2)
            );

          this.InvoiceYetToComePercentage = 100;

        } else {

          this.InvoiceTotalPercentage = 0;
          this.InvoiceCompletedPercentage = 0;
          this.InvoicePendingPercentage = 0;
          this.InvoiceYetToComePercentage = 0;

        }

        console.log('Mapped Invoice Values:', {
          InvoiceTotal: this.InvoiceTotal,
          InvoiceCompleted: this.InvoiceCompleted,
          InvoicePending: this.InvoicePending,
          InvoiceYetToCome: this.InvoiceYetToCome,
          TotalInvoiceAmount: this.TotalInvoiceAmount,
          CompletedInvoiceAmount: this.CompletedInvoiceAmount,
          PendingInvoiceAmount: this.PendingInvoiceAmount,
          yettoComeInvoiceAmount: this.yettoComeInvoiceAmount
        });

      },

      error: (error) => {
        console.error('Invoice Dashboard API Error:', error);
        this.resetInvoiceData();
      }

    });
  }
  private resetInvoiceData(): void {

    this.InvoiceTotal = 0;
    this.InvoiceCompleted = 0;
    this.InvoicePending = 0;
    this.InvoiceYetToCome = 0;

    this.TotalInvoiceAmount = 0;
    this.CompletedInvoiceAmount = 0;
    this.PendingInvoiceAmount = 0;
    this.yettoComeInvoiceAmount = 0;

    this.InvoiceTotalPercentage = 0;
    this.InvoiceCompletedPercentage = 0;
    this.InvoicePendingPercentage = 0;
    this.InvoiceYetToComePercentage = 0;
  }
}