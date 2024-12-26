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
  ],
  providers: [DialogService, ProductService, CategoryService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  selectedCategory: string = 'salad';
  selectedOrders: any[] = [];
  categories: any[] = [];
  subCategories: any = [];
  totalAmount: number = 0;

  orders: any[] = [];
  catFoods: any[] = [];
  foods: any[] = [];

  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    private langService: LangService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  show() {
    this.ref = this.dialogService.open(DiningTableListComponent, {
      header: 'Masanı seçin',
    });
  }

  ngOnInit() {
    this.getFilteredFoods(this.selectedCategory);
    this.langService.currentLanguage$
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.fetchCategories();
      });
  }
  fetchCategories() {
    this.categoryService.getCategoriesByLanguage().subscribe((response) => {
      this.categories = response.filter(
        (category: any) => category.ownerId === null
      );

      if (this.categories.length > 0) {
        this.onCategoryChange(this.categories[0].id);
      }
    });
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

  openMenu(id: number) {
    this.subCategories = this.categories.find((x) => x.id == id).children;
    console.log('tsubb', this.subCategories);
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

  // get totalAmount() {
  //   return this.orders.reduce(
  //     (sum, order) => sum + order.quantity * order.amount,
  //     0
  //   );
  // }

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
  }


  decreaseQuantity(order: any) {
    if (order.quantity > 1) {
      order.quantity--;
      order.amount -= order.price;
    }
    this.calculateTotal();
  }

  increaseQuantity(order: any) {
    order.quantity++;
    order.amount += order.price;
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.orders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
  }

  removeOrder(index: number) {
    this.orders.splice(index, 1);
  }

  get Language() {
    return this.langService.getTranslate();
  }
}
