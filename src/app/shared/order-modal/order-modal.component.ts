import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbRating} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../login/login.service";
import * as moment from 'moment';
import {MainService} from "../main.service";

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {
  @Input() order: any;
  @Input() modalMode: any;
  @ViewChild('rate',  {static: false}) rateElement:NgbRating;
  orderForm: FormGroup;
  servicePointsControlsConfig = {
    point: '',
    progress: 0,
    cost: 0
  };
  orderRate: FormGroup;
  orderRatingValue: any;
  isRateSent = false;

  constructor(
    public modal: NgbActiveModal, private fb: FormBuilder, public loginService: LoginService, private mainService: MainService) { }

  ngOnInit(): void {
    console.log(this.order);
    this.orderForm = this.fb.group({
      car: [this.order ? this.order.car : '', Validators.required],
      email: [this.order ? this.order.email : this.loginService.isRoleAdmin ? '' : this.loginService.loggedUser.email, Validators.required],
      servicePoints: this.fb.array([this.fb.group(this.servicePointsControlsConfig)])
    });
    this.orderRate = this.fb.group({
      rating: [''],
      comment: ['']
    });

    if (this.order) {
      this.mapOrderToForm(this.order);
    }
  }

  get f() {
    return this.orderForm.controls;
  }

  mapOrderToForm(order: any) {
    if (order.servicePoints && order.servicePoints.length) {
      order.servicePoints.forEach( service => {
        this.servicePoints.push(this.fb.group(service));
      });
      this.servicePoints.removeAt(0);
    }
  }

  get servicePoints() {
    return this.orderForm.get('servicePoints') as FormArray;
  }

  get modalTitle() {
    return this.order ? `Заказ #${this.order._id}` : 'Новый заказ';
  }

  get totalProgressAndCost() {
    const services = this.servicePoints.value;
    let totalProgress = 0;
    let totalCost = 0;
    if (services.length) {
      services.forEach((service) => {
        totalProgress+= parseInt(service.progress);
        totalCost+= parseInt(service.cost)
      });
      totalProgress = Math.round(totalProgress / services.length);
    }
    return { progress: totalProgress, cost: totalCost};
  }

  get totalServices() {
    return this.servicePoints.value.length;
  }

  get isCreateMode() {
    return this.modalMode === 'create';
  }
  get isEditMode() {
    return this.modalMode === 'edit';
  }

  addServicePoint() {
    this.servicePoints.push(this.fb.group(this.servicePointsControlsConfig));
  }

  deleteServicePoint(index) {
    this.servicePoints.removeAt(index);
  }

  save() {
    // if (this.modalMode === 'edit' && this.loginService.isRoleAdmin) {
    //   console.log('admin');
    // }
    let orderFormValue = this.orderForm.value;
    orderFormValue.cost = this.totalProgressAndCost.cost;
    orderFormValue.progress = this.totalProgressAndCost.progress;
    if (this.order && this.order._id) {
      orderFormValue._id = this.order._id;
    }
    this.modal.close(orderFormValue);
  }

  saveComment() {
    let comment = this.orderRate.value;
    comment.date = moment().format('DD.MM.YYYY');
    comment.userName = this.loginService.loggedUser.name;
    comment.userId = this.loginService.loggedUser._id;
    comment.orderId = this.order._id;
    comment.car = this.orderForm.value.car;
    this.mainService.sendComment(comment).then(result => {
      this.isRateSent = true;
    });
  }

  setRate() {
    this.orderRate.controls['rating'].setValue(this.rateElement.rate);
  }
}
