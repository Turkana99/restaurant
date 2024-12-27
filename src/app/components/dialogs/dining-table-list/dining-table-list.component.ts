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
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DiningTablesService } from '../../core/services/diningTables.service';
import { LangService } from '../../core/services/language.service';
import { CartService } from '../../core/services/carts.service';
@Component({
  selector: 'app-dining-table-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    NgxSpinnerModule,
  ],
  providers: [ConfirmationService, MessageService, DiningTablesService],
  templateUrl: './dining-table-list.component.html',
  styleUrls: ['./dining-table-list.component.scss'],
})
export class DiningTableListComponent implements OnInit {
  tables: any[] = [];
  selectedTable: { id: number; name: string } | null = null;
  showSpinner: boolean = false;
  cartId: number | null = null;

  constructor(
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private diningTablesService: DiningTablesService,
    private spinner: NgxSpinnerService,
    private langService: LangService,
    private cartService: CartService,
    private ref: DynamicDialogRef
  ) {}
  ngOnInit(): void {
    this.getAllTables();
  }

  // Select a table and highlight it
  selectTable(table: { id: number; name: string }) {
    this.selectedTable = table;
  }

  // Confirm the selection and open the dialog
  confirmSelection() {
    if (this.selectedTable) {
      console.log('Selected Table ID:', this.selectedTable?.id);

      // Retrieve the orders data from sessionStorage
      const ordersData = JSON.parse(sessionStorage.getItem('orders') || '[]');

      if (this.selectedTable?.id != null && ordersData.length > 0) {
        const cartRequest = {
          tableId: this.selectedTable.id,
          cartItems: ordersData.map((order: any) => ({
            productId: order.id,
            quantity: order.quantity,
          })),
        };

        this.cartService.addCart(cartRequest).subscribe(
          (response) => {
            console.log('Cart created successfully', response);
            this.cartService.setCartId(response.id);
            // Clear orders from sessionStorage after confirming the order
            // sessionStorage.removeItem('orders');
          },
          (error) => {
            console.error('Error creating cart', error);
          }
        );
      } else {
        console.warn('No orders found in session.');
      }

      this.ref.close(this.selectedTable);
    } else {
      console.warn('No table selected.');
    }
  }

  getAllTables() {
    this.showSpinner = true;
    this.spinner.show();

    this.diningTablesService.getDiningTables().subscribe(
      (response) => {
        console.log('Response before sorting:', response);
        this.tables = response.sort(
          (a: any, b: any) => Number(a.id) - Number(b.id)
        );

        console.log('Sorted tables:', this.tables);

        this.showSpinner = false;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching tables:', error);
        this.showSpinner = false;
        this.spinner.hide();
      }
    );
  }

  get Language() {
    return this.langService.getTranslate();
  }
}
