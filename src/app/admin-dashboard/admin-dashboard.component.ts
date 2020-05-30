import {Component, OnInit, PipeTransform} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {map, startWith} from "rxjs/operators";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";

interface Order {
  _id: any;
  email: any;
  status: any;
  rating: any;
  car: any;
  services?: any;
}

const ORDERS: Order[] = [
  {
    _id: '12312',
    email: 'alex@alex.com',
    status: 60,
    rating: 4,
    car: 'Mazda 6'
  }
];

function search(text: string, pipe: PipeTransform): Order[] {
  return ORDERS.filter(order => {
    const term = text.toLowerCase();
    return order.email.toLowerCase().includes(term)
      || pipe.transform(order._id).includes(term)
      || pipe.transform(order.car).includes(term);
  });
}
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  providers: [DecimalPipe]
})
export class AdminDashboardComponent implements OnInit {

  orders$: Observable<Order[]>;
  filter = new FormControl('');
  constructor(pipe: DecimalPipe) {
    this.orders$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => search(text, pipe))
    );}

  ngOnInit(): void {
  }

  makeOrder() {
    console.log('kek');
  }

  goToOrder(order) {

  }
}
