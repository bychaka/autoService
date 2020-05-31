import {Component, OnInit, PipeTransform} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {map, startWith} from "rxjs/operators";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {OrderModalComponent} from "../shared/order-modal/order-modal.component";
import {IOrder} from "../shared/interfaces";
import {MainService} from "../shared/main.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  ORDERS: IOrder[] = [];
  orders$: Observable<IOrder[]>;
  filter = new FormControl('');
  constructor(private pipe: DecimalPipe, private modalService: NgbModal, private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.getOrders().then(orders => {
      this.ORDERS = orders;
      this.orders$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
    }, error => console.error(error));
  }

  openOrder(order?:any, mode?:any) {
    const modalInstance: NgbModalRef = this.modalService.open(OrderModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
    modalInstance.componentInstance.order = order || null;
    modalInstance.componentInstance.modalMode = mode || null;
    modalInstance.result.then(result => {
      this.mainService.saveOrder(result).then(orders => {
        this.ORDERS = orders;
        window.location.reload()
      });
    }, reason => {
      console.warn(reason);
    })
  }

  search(text: string, pipe: PipeTransform): IOrder[] {
    return this.ORDERS.filter(order => {
      const term = text.toLowerCase();
      return order.email.toLowerCase().includes(term)
        || order._id.toLowerCase().includes(term)
        || pipe.transform(order.cost).includes(term)
        || order.car.toLowerCase().includes(term);
    });
  }

  toInt(progress: any) {
    return parseInt(progress);
  }
}
