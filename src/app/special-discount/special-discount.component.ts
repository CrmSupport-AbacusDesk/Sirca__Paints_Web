import { Component, OnInit } from '@angular/core';
import {MatDatepicker} from '@angular/material';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../dialog.component';
import * as moment from 'moment';
// import {moment} from 'ngx-bootstrap/chronos/test/chain';
import { PearlService } from 'src/app/pearl.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-special-discount',
  templateUrl: './special-discount.component.html',
  styleUrls: ['./special-discount.component.scss']
})
export class SpecialDiscountComponent implements OnInit {


  constructor(public db: DatabaseService, public dialog: DialogComponent,public serve:PearlService,public toast:ToastrManager) { }

  discount: any = {};
  discount1: any = {};

  ngOnInit() {
    this.get_discount();
  }
  get_discount() {
    this.serve.fetchData({}, 'Discount_master/get_special_discount')
      .subscribe(resp => {
        console.log(resp);
        this.discount = resp['discount'];
      });
  }

  number(event: any) {
    const pattern = /^\d*(?:[.,]\d{1,2})?$/;
    const inputChar = String.fromCharCode(event.charCode);
    // tslint:disable-next-line:triple-equals
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  update_details() {

    // tslint:disable-next-line:max-line-length
    console.log('Type:-', this.discount.type, 'Distributor Premium:-', this.discount.distributor_discount , 'Dealer Premium:-', this.discount.dealer_discount, 'Label:-', this.discount.lable, 'Start Date:-', this.discount.start_date, 'End Date:-',  this.discount.end_date);


    this.discount.start_date = moment(this.discount.start_date).format('YYYY-MM-DD');
    this.discount.end_date = moment(this.discount.end_date).format('YYYY-MM-DD');
    this.serve.fetchData({'discount': this.discount}, 'discount_master/discount_update')
      .subscribe(resp => {
            console.log(resp);
            if (resp['discount_to_update'] == true) {
              // this.dialog.success('Updated Successfully !');
             this.toast.successToastr("sucess");
             this.get_discount();

            }
      });
  }
  openDatePicker(picker: MatDatepicker<Date>) {
    picker.open();
  }
  openDatePicker2(picker2: MatDatepicker<Date>) {
    picker2.open();
  }
}
