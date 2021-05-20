import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { ProductComponent } from './product/product.component';
import { FormControl } from '@angular/forms';
export interface Product {
  category: string;
  description: string;
  image: string;
  name: string;
  price: string;
  count: number;
  total: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public products: Product[] = [];

  public cart: Product[] = [];
  public count: number = 0;

  public subTotalPrice: number = 0;
  public subTotalItems: number = 0;

  public vat = new FormControl(10);
  public vatTotal: string = '0';
  public discount = new FormControl(10);
  public discountTotal: string = '0';

  public grandTotal: number = 0;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  public ngOnInit() {
    this.http.get("assets/pos.products.json")
      .pipe(
      )
      .subscribe((data: any) => {
        data.forEach((e: any) => {
          e.count = 0;
          e.total = 0;
        });
        this.products = data;
      });

  }


  public openDialog() {
    const dialogRef = this.dialog.open(ProductComponent, {
      height: '500px',
      width: '400px',
      data: {
        orders: this.cart,
        subTotalPrice: this.subTotalPrice,
        subtotalItems: this.subTotalItems,
        vat: this.vat.value,
        discount: this.discount.value
      }
    });

    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.cancelSale();
      }
    });
  }

  public clickToAdd(item: Product | any) {
    const filteredCartItems = this.addItemToCart(this.cart, item);

    if (filteredCartItems) {
      this.cart = filteredCartItems;
      this.calculateSubTotal(filteredCartItems);
    }
  }


  public addItemToCart(cart: Product[], item: Product) {
    const existingCartItem = cart.find(product => product.name === item.name);
    if (existingCartItem) {
      return cart.map(cartItem => {

        if (cartItem.name === item.name) {
          cartItem.count++;
          return { ...cartItem, total: +cartItem.price * cartItem.count }
        }
        return cartItem;
      });
    }
    item.count = item.count === 0 ? 1 : item.count;
    return [...cart, { ...item, count: 1, total: +item.price * item.count }];
  }


  public increaseProductCount(item: Product | any) {
    item.count++;
    item.total = item.count * +item.price
    this.calculateSubTotal(this.cart);
  }

  public decreaseProductCount(item: Product | any) {
    if (item.count === 1) {
      return;
    }
    item.count--;
    item.total = item.count * +item.price
    this.calculateSubTotal(this.cart);
  }


  public clearProductFromCart(product: Product) {
    const index = this.cart.findIndex((item) => item.name === product.name);
    this.cart.splice(index, 1);

    this.calculateSubTotal(this.cart);

    if (this.cart.length === 0) {
      this.cancelSale();
    }
  }

  public cancelSale() {
    this.cart = [];
    this.subTotalPrice = 0;
    this.subTotalItems = 0;
    this.vatTotal = '0';
    this.discountTotal = '0';
    this.grandTotal = 0;
    this.vat.setValue(0);
    this.discount.setValue(0);
  }

  public calculateSubTotal(cartItems: Product[]) {
    this.subTotalItems = cartItems.reduce((acc, cur) => acc + cur.count, 0);
    this.subTotalPrice = cartItems.reduce((acc, cur) => acc + cur.count * +cur.price, 0);

    this.vatTotal = this.calculateVAT(this.vat.value, this.subTotalPrice);

    this.discountTotal = this.calculateDiscount(this.discount.value, this.subTotalPrice);

    this.grandTotal = this.grandTotalCalculation(this.vatTotal, this.discountTotal, this.subTotalPrice);

  }

  public calculateVAT(vat: string, subTotal: number) {
    return (subTotal * Number(vat) / 100).toFixed(2).toString();
  }

  public calculateDiscount(discount: string, subTotal: number) {
    return (subTotal * Number(discount) / 100).toFixed(2).toString();
  }

  public grandTotalCalculation(vatTotal: string, discountTotal: string, subTotalPrice: number): number {
    return +(Number(vatTotal) + Number(discountTotal) + subTotalPrice).toFixed(2);
  }

  public productTotalWithoutCharges(price: number | string, count: number) {
    return +price * count;
  }

  public reCalculation() {
    this.calculateSubTotal(this.cart);
  }
}



