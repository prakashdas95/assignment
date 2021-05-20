import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../app.component';

interface Orders {
  orders: any[],
  subTotalPrice: any,
  subtotalItems: any,
  vat: any,
  discount: any
}

@Component({
  selector: 'app-product',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  public orders: Product[] = [];
  public subTotalPrice: number = 0
  public subtotalItems: number = 0;
  public vat: number = 0;
  public discount: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public orderDetails: Orders) { }

  ngOnInit(): void {
    const { orders, subTotalPrice, subtotalItems, vat, discount }: Orders = this.orderDetails;
    console.log('orders: ', orders);
    this.orders = orders
    this.subTotalPrice = subTotalPrice;
    this.subtotalItems = subtotalItems;
    this.vat = vat;
    this.discount = discount;

  }



}
