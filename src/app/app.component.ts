import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatDialog } from '@angular/material/dialog';
import { ProductComponent } from './product/product.component';
import { filter, map, tap } from 'rxjs/operators';
interface Product {
  category: string;
  description: string;
  image: string;
  name: string;
  price: string;
  count?: string
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

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  public ngOnInit() {
    this.http.get("assets/pos.products.json")
      .pipe(
      )
      .subscribe((data: any) => {
        data.forEach((e: any) => {
          e.count = 0;
        });
        this.products = data;
        console.log(data);
      });

  }


  public openDialog() {
    const dialogRef = this.dialog.open(ProductComponent, {
      height: '500px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public clickToAdd(item: Product | any) {
    item.count++;
    this.cart.push(item);
    // console.log(item);
  }


  public increaseProductCount(item: Product | any) {
    item.count++;
    console.log(item);
  }
  public decreaseProductCount(item: Product | any) {
    item.count--;
    console.log(item);
  }

}

