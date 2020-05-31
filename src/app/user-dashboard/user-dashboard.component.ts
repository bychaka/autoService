import {Component, OnInit, PipeTransform} from '@angular/core';
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {DecimalPipe} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {map, startWith} from "rxjs/operators";
import {OrderModalComponent} from "../shared/order-modal/order-modal.component";
import {IOrder} from "../shared/interfaces";
import {MainService} from "../shared/main.service";
import {LoginService} from "../login/login.service";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  ORDERS: IOrder[] = [];
  orders$: Observable<IOrder[]>;
  filter = new FormControl('');
  comments: any;
  constructor(private pipe: DecimalPipe, private modalService: NgbModal, private mainService: MainService, public loginService: LoginService) {
    this.orders$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );}

  ngOnInit(): void {
    this.mainService.getComments(this.loginService.loggedUser._id).then(result => {
      this.comments = result;
    });
    this.mainService.getOrders(this.loginService.loggedUser.email).then(orders => {
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
      if (mode === 'create'){
        this.mainService.saveOrder(result).then(orders => {
          this.ORDERS = orders;
          window.location.reload()
        });
      }
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
}
