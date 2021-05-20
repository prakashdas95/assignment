import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { ProductComponent } from './product/product.component';
import { filter, map, tap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
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

  public products: any = []; // check type assignment

  public cart: Product[] = [];
  public count: number = 0;

  public subTotalPrice: number = 0;
  public subTotalItems: number = 0;
  // public total: number = 0;

  public vat = new FormControl(0);
  public vatTotal: string = '0';
  // public discount = '10';
  public discount = new FormControl(0);

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
        console.log(data);
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
      console.log(`Dialog result: ${success}`);
      if (success) {
        this.cancelSale();
      }
    });
  }

  public clickToAdd(item: Product | any) {
    const filteredCartItems = this.addItemToCart(this.cart, item);

    if (filteredCartItems) {
      this.cart = filteredCartItems;
      console.log('filteredCartItems: ', filteredCartItems);
      this.calculateSubTotal(filteredCartItems);
    }
  }


  public addItemToCart(cart: Product[], item: Product) {
    console.log('vat', this.vat.value);

    const existingCartItem = cart.find(product => product.name === item.name);
    if (existingCartItem) {
      console.log('existingCartItem');
      console.log(existingCartItem);
      return cart.map(cartItem => {

        if (cartItem.name === item.name) {
          cartItem.count++;
          console.log('countttt', cartItem.count);
          return { ...cartItem, total: +cartItem.price * cartItem.count }
        }
        return cartItem;
      });
    }
    console.log(item);
    console.log('unique');
    item.count = item.count === 0 ? 1 : item.count;
    return [...cart, { ...item, count: 1, total: +item.price * item.count }];
  }


  public increaseProductCount(item: Product | any) {
    item.count++;
    console.log('test increase', item);
    item.total = item.count * +item.price
    this.calculateSubTotal(this.cart);
  }

  public decreaseProductCount(item: Product | any) {
    if (item.count === 1) {
      return;
    }
    item.count--;
    console.log('test decrease', item);
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
    // console.log(typeof cartItems[0].price, typeof cartItems[0].count);
    this.subTotalItems = cartItems.reduce((acc, cur) => acc + cur.count, 0);
    this.subTotalPrice = cartItems.reduce((acc, cur) => acc + cur.count * +cur.price, 0);
    // cartItems.reduce((acc, acc) => acc. + cur )

    this.vatTotal = this.calculateVAT(this.vat.value, this.subTotalPrice);
    // console.log('vat total: ', this.vatTotal);

    this.discountTotal = this.calculateDiscount(this.discount.value, this.subTotalPrice);
    // console.log('vat subtotal: ', this.subTotalPrice);

    this.grandTotal = this.grandTotalCalculation(this.vatTotal, this.discountTotal, this.subTotalPrice);
    // console.log('grandTotal: ', this.grandTotal);

  }

  public calculateVAT(vat: string, subTotal: number) {
    // console.log('vat', vat);
    return (subTotal * Number(vat) / 100).toFixed(2).toString();
  }

  public calculateDiscount(discount: string, subTotal: number) {
    return (subTotal * Number(discount) / 100).toFixed(2).toString();
  }

  public grandTotalCalculation(vatTotal: string, discountTotal: string, subTotalPrice: number): number {
    return +(Number(vatTotal) + Number(discountTotal) + subTotalPrice).toFixed(2);
  }

  // public calculateTotal() {
  //   this.total = 5;
  // }

  public productTotalWithoutCharges(price: number | string, count: number) {
    return +price * count;
  }

  public reCalculation() {
    this.calculateSubTotal(this.cart);
  }
}



