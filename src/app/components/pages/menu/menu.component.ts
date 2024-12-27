import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DiningTableListComponent } from '../../dialogs/dining-table-list/dining-table-list.component';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CategoryService } from '../../core/services/categories.service';
import { LangService } from '../../core/services/language.service';
import { distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../core/services/products.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessageInterceptor } from '../../core/interceptors/message-interceptor.service';
import { LoadingInterceptor } from '../../core/interceptors/loading.interceptor';
import { MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CartService } from '../../core/services/carts.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabViewModule,
    ButtonModule,
    DividerModule,
    FormsModule,
    RadioButtonModule,
    InputGroupModule,
    InputTextModule,
    MatDialogModule,
    NgxSpinnerModule,
  ],
  providers: [
    DialogService,
    ProductService,
    CategoryService,
    CartService,
    { provide: HTTP_INTERCEPTORS, useClass: MessageInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    MessageService,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  selectedCategory: string = 'salad';
  selectedOrders: any[] = [];
  categories: any[] = [];
  subCategories: any = [];
  totalAmount: number = 0;
  selectedCategoryId: number | null = null;
  orders: any[] = [];
  catFoods: any[] = [];
  foods: any[] = [];
  showSpinner: boolean = false;
  ref: DynamicDialogRef | undefined;
  selectedTableId: number | null = null;
  cartId: string | null = null;

  constructor(
    public dialogService: DialogService,
    private langService: LangService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getFilteredFoods(this.selectedCategory);
    this.langService.currentLanguage$
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.fetchCategories();
      });
    const savedOrders = sessionStorage.getItem('orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      console.log('Orders loaded from sessionStorage:', this.orders);
    }
  
    this.cartService.cartId$.subscribe((cartId) => {
      this.cartId = cartId;
      console.log('Received cartId:', this.cartId);
    });
  }

  show() {
    if (this.orders && this.orders.length > 0) {
      sessionStorage.setItem('orders', JSON.stringify(this.orders));
    }

    this.ref = this.dialogService.open(DiningTableListComponent, {
      header: this.Language.tableTitle,
      width: '70%',
      data: {},
    });

    // Check if saved orders are in sessionStorage
    const savedOrders = sessionStorage.getItem('orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      console.log('Orders from sessionStorage:', this.orders);
    }

    this.ref.onClose.subscribe((selectedTable) => {
      if (selectedTable && selectedTable.id) {
        this.selectedTableId = selectedTable.id;
        console.log('Selected Table ID:', this.selectedTableId);
      } else {
        console.log('Dialog closed without selection.');
      }
    });
  }

  updateOrder() {}

  confirmCart() {}

  fetchCategories() {
    this.categoryService.getCategoriesByLanguage().subscribe((response) => {
      const sortedResponse = response.sort((a: any, b: any) => b.id - a.id);
      this.categories = sortedResponse.filter(
        (category: any) => category.ownerId === null
      );

      if (this.categories.length > 0) {
        // Initialize the first category
        const firstCategory = this.categories[0];
        this.openMenu(firstCategory.id);
      }
    });
  }

  openMenu(categoryId: any) {
    const selectedCategory = this.categories.find((x) => x.id === categoryId);
    if (selectedCategory) {
      this.subCategories = selectedCategory.children;
      this.showSpinner = true;
      this.spinner.show();
      this.productService.getProductsByCategory(categoryId).subscribe(
        (products) => {
          this.catFoods = products.items;
          this.spinner.hide();
          this.showSpinner = false;
          console.log('Products for the category:', this.catFoods);
        },
        (error) => {
          console.error('Failed to fetch products for the category:', error);
          this.catFoods = [];
          this.spinner.hide(); // Hide spinner after error
        }
      );
    } else {
      console.error('Category not found for id:', categoryId);
      this.spinner.hide(); // Hide spinner if category is not found
    }
  }

  onCategoryChange(event: any) {
    console.log('event', event);
    const categoryId = this.subCategories[event]?.id;
    this.productService.getProductsByCategory(categoryId).subscribe(
      (products) => {
        this.catFoods = products.items;
        console.log('products', this.catFoods);
      },
      (error) => {
        console.error('Failed to fetch products:', error);
        this.catFoods = [];
      }
    );
  }

  getFilteredFoods(category: string) {
    this.catFoods = this.foods.filter((food) => food.category === category);
  }

  // onCategoryChange(category: string) {
  //   this.selectedCategory = category;
  //   this.getFilteredFoods(this.selectedCategory);
  // }

  toggleOrderSelection(order: any) {
    const index = this.selectedOrders.indexOf(order);
    if (index > -1) {
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(order);
    }
  }

  addToCart(item: any) {
    if (typeof item.price !== 'number' || isNaN(item.price)) {
      console.error('Invalid price:', item.price);
      return;
    }
    const existingOrder = this.orders.find((order) => order.name === item.name);
    if (existingOrder) {
      existingOrder.quantity++;
      existingOrder.amount += item.price;
    } else {
      this.orders.push({ ...item, quantity: 1, amount: item.price });
    }
    this.calculateTotal();
  
    // Save orders to sessionStorage
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }
  

  decreaseQuantity(order: any) {
    if (order.quantity > 1) {
      order.quantity--;
      order.amount -= order.price;
    }
    this.calculateTotal();
  
    // Save orders to sessionStorage
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }
  
  increaseQuantity(order: any) {
    order.quantity++;
    order.amount += order.price;
    this.calculateTotal();
  
    // Save orders to sessionStorage
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }
  

  calculateTotal() {
    this.totalAmount = this.orders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
  }

  removeOrder(index: number) {
    this.orders.splice(index, 1);
    this.calculateTotal();
  
    // Save orders to sessionStorage after removal
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }
  
  get Language() {
    return this.langService.getTranslate();
  }
}
