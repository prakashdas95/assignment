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
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public orders: Product[] = [];
  public subTotalPrice = 0
  public subtotalItems = 0;
  public vat = 0;
  public discount = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public orderDetails: Orders) { }

  ngOnInit(): void {
    const { orders, subTotalPrice, subtotalItems, vat, discount }: Orders = this.orderDetails;
    this.orders = orders
    this.subTotalPrice = subTotalPrice;
    this.subtotalItems = subtotalItems;
    this.vat = vat;
    this.discount = discount;
  }



}
