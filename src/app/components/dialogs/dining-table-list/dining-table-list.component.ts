import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DiningTablesService } from '../../core/services/diningtables.service';

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
  providers: [ConfirmationService, MessageService, DiningTablesService], // Ensure these services are provided
  templateUrl: './dining-table-list.component.html',
  styleUrls: ['./dining-table-list.component.scss'],
})
export class DiningTableListComponent implements OnInit {
  tables: any[] = [];
  selectedTable: string | null = null;

  // Dialog reference
  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private diningTablesService: DiningTablesService
  ) {}
  ngOnInit(): void {
    this.getAllTables();
  }

  // Select a table and highlight it
  selectTable(table: string) {
    this.selectedTable = table;
  }

  // Confirm the selection and open the dialog
  confirmSelection() {
    if (this.selectedTable) {
      console.log('Selected Table:', this.selectedTable);
      this.ref?.close();
    }
  }



  getAllTables() {
    this.diningTablesService.getDiningTables().subscribe((response) => {
      console.log("res", response);
      this.tables = response;
      console.log("this.tables", this.tables);
      
    });
  }
}
