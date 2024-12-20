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
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  selectedCategory: string = 'salad';
  selectedOrders: any[] = [];
  totalAmount: number = 0;
  orders = [
    { name: 'Cheese', amount: '$ 10' },
    { name: 'Caesar Salad', amount: '$ 30' },
    { name: 'Soup', amount: '$ 30' },
    { name: 'Margarita', amount: '$ 100' },
    { name: 'Coca-cola', amount: '$ 110' },
  ];
  catFoods: any[] = [];
  categories: string[] = ['salad', 'pizza', 'burger', 'mainDeal', 'sushi'];
  foods = [
    {
      img: 'assets/images/pizza.jpg',
      dealName: 'Aspen',
      category: 'pizza',
      description: 'Bacon, Onion, Mushroom, Mozzarella',
      price: '$ 50',
    },
    {
      img: 'assets/images/pizza2.jpg',
      dealName: 'Bolognese',
      category: 'pizza',
      description: 'Ragu, Mozzarella',
      price: '$ 40',
    },
    {
      img: 'assets/images/pizza3.jpg',
      dealName: 'Castello',
      category: 'pizza',
      description: 'Bacon, Sausage, Jalapeno, Onion, Mozzarella',
      price: '$ 60',
    },
    {
      img: 'assets/images/pizza4.jpg',
      dealName: 'Fitness',
      category: 'pizza',
      description: 'Tomato, Corn, Broccoli, Paprika, Feta Cheese, Mozzarella',
      price: '$ 100',
    },
    {
      img: 'assets/images/Salad1.jpg',
      dealName: 'Caesar Salad',
      category: 'salad',
      description: 'Lettuce, Grilled Chicken, Toasted Bread, Garlic Dressing',
      price: '$ 30',
    },
    {
      img: 'assets/images/Salad2.jpg',
      dealName: 'Greek Salad',
      category: 'salad',
      description: 'Tomato, Onion, Olives, Cucumber, Feta Cheese',
      price: '$ 50',
    },
    {
      img: 'assets/images/fish.jpg',
      dealName: 'Grilled Salmon',
      category: 'mainDeal',
      description: 'Salmon, Lime, Pasta',
      price: '$ 80',
    },
    {
      img: 'assets/images/sushi.jpg',
      dealName: 'Sushi',
      category: 'sushi',
      description: 'Sushi, Rice, Soy Sauce, Toasted Sesame Seeds',
      price: '$ 50',
    },
    {
      img: 'assets/images/burger1.jpg',
      dealName: 'Beef Burger',
      category: 'burger',
      description: 'Beef Meat, Bacon, Cucumber, Cheese, Caramelized Onion Jam',
      price: '$ 30',
    },
    {
      img: 'assets/images/burger2.jpg',
      dealName: 'Double Beef Burger',
      category: 'burger',
      description:
        'Double Beef Meat, Bacon, Cucumber, Cheese, Caramelized Onion Jam',
      price: '$ 50',
    },
    {
      img: 'assets/images/burger4.jpg',
      dealName: 'Chicken Burger',
      category: 'burger',
      description:
        'Chicken Meat, Double Cheese, Tomato, Cucumber, Parsley, Caramelized Onion Jam',
      price: '$ 80',
    },
    {
      img: 'assets/images/burger3.jpg',
      dealName: 'Mexican Burger',
      category: 'burger',
      description: 'Chicken Meat, Mexican Topping, Bacon, Onion, Cheese',
      price: '$ 60',
    },
  ];

  constructor() {}

  ngOnInit() {
    this.getFilteredFoods(this.selectedCategory);
  }

  getFilteredFoods(category: string) {
    this.catFoods = this.foods.filter((food) => food.category === category);
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.getFilteredFoods(this.selectedCategory);
  }

  toggleOrderSelection(order: any) {
    const index = this.selectedOrders.indexOf(order);
    if (index > -1) {
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(order);
    }
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    this.totalAmount = this.selectedOrders.reduce(
      (total, order) => total + order.amount,
      0
    );
  }

  isSelected(order: any): boolean {
    return this.selectedOrders.includes(order);
  }
}
