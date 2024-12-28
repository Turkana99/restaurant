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
import { MatDialogModule } from '@angular/material/dialog';
import { DiningTableListComponent } from '../../dialogs/dining-table-list/dining-table-list.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from '../../core/services/categories.service';
import { LangService } from '../../core/services/language.service';
import {
  combineLatest,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { ProductService } from '../../core/services/products.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessageInterceptor } from '../../core/interceptors/message-interceptor.service';
import { LoadingInterceptor } from '../../core/interceptors/loading.interceptor';
import { MessageService } from 'primeng/api';
import { CartService } from '../../core/services/carts.service';
import { OrderService } from '../../core/services/orders.service';
import { ToastModule } from 'primeng/toast';
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
    ToastModule,
  ],
  providers: [
    DialogService,
    ProductService,
    CategoryService,
    OrderService,
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
  cartId: number | null = null;
  orderState: string = 'other';
  isEdit$!: Observable<boolean>;
  isEdit: boolean = true;
  hasEdit: boolean = false;

  constructor(
    public dialogService: DialogService,
    private langService: LangService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    // Retrieve totalAmount from sessionStorage, or initialize to 0 if not set
    const savedTotal = sessionStorage.getItem('totalAmount');
    this.totalAmount = savedTotal ? parseFloat(savedTotal) : 0;

    // Existing initialization logic
    console.log('caartId', this.cartId);

    combineLatest([this.cartService.cartId$, this.cartService.orderState$])
      .pipe(
        switchMap(([cartId, orderState]) => {
          console.log('cartId:', cartId);
          this.cartId = +cartId;
          console.log(' this.cartId:', this.cartId);
          this.orderState = orderState;
          const isEdit =
            (!this.cartId && this.orderState == 'other') ||
            (!!this.cartId && this.orderState == 'edit');
          this.isEdit = isEdit;
          return of(isEdit);
        })
      )
      .subscribe();

    this.cartService.setCartId(sessionStorage.getItem('cartId') ?? 0);
    this.cartService.setOrderState('other');

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

  updateCart() {
    this.cartService.setOrderState('edit');
  }

  // confirmCart() {
  //   this.cartService.setOrderState('other');
  // }

  // fetchCategories() {
  //   this.categoryService.getCategoriesByLanguage().subscribe((response) => {
  //     const sortedResponse = response.sort((a: any, b: any) => b.id - a.id);
  //     this.categories = sortedResponse.filter(
  //       (category: any) => category.ownerId === null
  //     );

  //     if (this.categories.length > 0) {
  //       // Initialize the first category
  //       const firstCategory = this.categories[0];
  //       this.openMenu(firstCategory.id);
  //     }
  //   });
  // }

  fetchCategories() {
    this.categoryService.getCategoriesByLanguage().subscribe((response) => {
      const sortedResponse = response.sort((a: any, b: any) => b.id - a.id);
  
      // Filter for top-level categories
      this.categories = sortedResponse.filter(
        (category: any) => category.ownerId === null
      );
  
      if (this.categories.length > 0) {
        // Find the first category with children
        const categoryWithChildren = this.categories.find(
          (category: any) => category.children && category.children.length > 0
        );
  
        if (categoryWithChildren) {
          // Initialize with the first child of the first category that has children
          const firstChild = categoryWithChildren.children[0];
          console.log("First child:", firstChild);
          this.openMenu(categoryWithChildren.id);
        } else {
          // Fallback if no category has children
          const firstCategory = this.categories[0];
          console.log("First category without children:", firstCategory);
          this.openMenu(firstCategory.id); // Pass only the categoryId
        }
      } else {
        console.warn("No categories available.");
      }
    });
  }
  
  openMenu(categoryId: any) {
    console.log("Opening menu for category:", categoryId);
  
    this.selectedCategoryId = categoryId;
  
    // Find the selected category
    const selectedCategory = this.categories.find((x) => x.id === categoryId);
  
    if (selectedCategory) {
      this.subCategories = selectedCategory.children;
  
      let subcategoryId = null;
  
      // If the category has children, use the first child's ID
      if (this.subCategories && this.subCategories.length > 0) {
        console.log("this.subCategories[0]",this.subCategories.id);
        
        subcategoryId = this.subCategories[0].id;
      }
  
      this.showSpinner = true;
      this.spinner.show();
     if(subcategoryId!=null){
      this.productService.getProductsByCategory(subcategoryId).subscribe(
        (products) => {
          console.log("Products:", products);
  
          this.catFoods = products.items;
          this.spinner.hide();
          this.showSpinner = false;
  
          console.log("Products for subcategory:", this.catFoods);
        },
        (error) => {
          console.error("Failed to fetch products for subcategory:", error);
          this.catFoods = [];
          this.spinner.hide(); // Hide spinner after error
        }
      );
     }else{
      this.productService.getProductsByCategory(selectedCategory.id).subscribe(
        (products) => {
          console.log("Products:", products);
  
          this.catFoods = products.items;
          this.spinner.hide();
          this.showSpinner = false;
  
          console.log("Products for subcategory:", this.catFoods);
        },
        (error) => {
          console.error("Failed to fetch products for subcategory:", error);
          this.catFoods = [];
          this.spinner.hide(); // Hide spinner after error
        }
      );
     }
 
    } else {
      console.error("Category not found for id:", categoryId);
      this.spinner.hide(); // Hide spinner if category is not found
    }
  }
  
  
  onCategoryChange(event: any) {
    const categoryId = this.subCategories[event]?.id;
    this.productService.getProductsByCategory(categoryId).subscribe(
      (products) => {
        this.catFoods = products.items;
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
    this.hasEdit = true;
    this.updateTotalAmount();
    // Save orders to sessionStorage
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }

  decreaseQuantity(order: any) {
    if (order.quantity > 1) {
      order.quantity--;
      order.amount -= order.price;
    }
    this.hasEdit = true;
    this.calculateTotal();
    this.updateTotalAmount();

    // Save orders to sessionStorage
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }

  increaseQuantity(order: any) {
    order.quantity++;
    order.amount += order.price;
    this.hasEdit = true;
    this.calculateTotal();
    this.updateTotalAmount();

    // Save orders to sessionStorage
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }

  calculateTotal() {
    this.totalAmount = this.orders.reduce(
      (sum, order) => sum,
      0
    );
    sessionStorage.setItem('totalAmount', this.totalAmount.toString());
  }
  
  updateTotalAmount() {
    // Example: Calculate total amount from the orders
    this.totalAmount = this.orders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    // Save to sessionStorage
    sessionStorage.setItem('totalAmount', this.totalAmount.toString());
  }

  removeOrder(index: number) {
    this.orders.splice(index, 1);
    this.calculateTotal();
    this.hasEdit = true;
    this.updateTotalAmount();
    // Save orders to sessionStorage after removal
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }

  get Language() {
    return this.langService.getTranslate();
  }

  resetCart() {
    this.cartService.deleteCart(this.cartId).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Uğurlu',
          detail: 'Səbətiniz uğurla sıfırlandı !',
          life: 2000,
        });
        sessionStorage.removeItem('orders');
        sessionStorage.removeItem('cartId');
        sessionStorage.removeItem('orderState');
        sessionStorage.removeItem('totalAmount');
        location.reload();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Xəbərdarlıq',
          detail:
            error?.error?.error?.errors?.join('\n') ||
            this.Language.errorMessage,
          life: 2000,
        });
      }
    );
  }

  confirmCart() {
    if (this.hasEdit) {
      let req: any = {
        cartItems: this.orders.map((order: any) => ({
          productId: order.id,
          quantity: order.quantity,
        })),
      };
      if (this.cartId) {
        req.id = this.cartId;
        this.cartService.editCart(req).subscribe(
          (response) => {
            this.cartService.setOrderState('other');
            this.messageService.add({
              severity: 'success',
              summary: 'Uğurlu',
              detail: 'Uğurla yeniləndi!',
              life: 2000,
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Xəbərdarlıq',
              detail:
                error?.error?.error?.errors?.join('\n') ||
                'Yenilənmə uğursuz oldu!',
              life: 2000,
            });
          }
        );
        return;
      }
    } else {
      this.cartService.setOrderState('other');
    }
  }

  createOrder() {
    const ordRequest = {
      cartId: this.cartId,
    };

    this.orderService.addOrder(ordRequest).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Uğurlu',
          detail: 'Sifariş uğurla yaraddıldı!',
          life: 2000,
        });
        sessionStorage.removeItem('orders');
        sessionStorage.removeItem('cartId');
        sessionStorage.removeItem('orderState');
        sessionStorage.removeItem('totalAmount');
        location.reload();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Xəbərdarlıq',
          detail:
            error?.error?.error?.errors?.join('\n') ||
            'Əməliyyat uğursuz oldu!',
          life: 2000,
        });
      }
    );
  }
}
