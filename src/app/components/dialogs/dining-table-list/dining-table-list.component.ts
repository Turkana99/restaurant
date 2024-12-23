import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dining-table-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    FormsModule,
    ConfirmDialogModule, // Ensure this module is imported
    ToastModule, // Ensure this module is imported
  ],
  providers: [ConfirmationService, MessageService], // Ensure these services are provided
  templateUrl: './dining-table-list.component.html',
  styleUrls: ['./dining-table-list.component.scss'],
})
export class DiningTableListComponent {
  tables: string[] = [
    'Masa 1',
    'Masa 2',
    'Masa 3',
    'Masa 4',
    'Masa 5',
    'Masa 6',
    'Masa 7',
    'Masa 8',
    'Masa 9',
    'Masa 10',
    'Masa 11',
    'Masa 12',
  ];
  selectedTable: string | null = null;

  // Dialog reference
  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  // Select a table and highlight it
  selectTable(table: string) {
    this.selectedTable = table;
  }

  // Confirm the selection and open the dialog
  confirmSelection() {
    if (this.selectedTable) {
      console.log('Selected Table:', this.selectedTable);

      // Show the confirmation dialog
      this.confirm1();
    }
  }

  // Show the confirmation dialog
  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      accept: () => {
        // Handle accept action
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted.',
        });
      },
      reject: () => {
        // Handle reject action
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected.',
          life: 3000,
        });
      },
    });
  }
}
