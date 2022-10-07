import {Component,OnInit} from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-generate-secondary-packing-coupon',
  templateUrl: './generate-secondary-packing-coupon.component.html',
  styleUrls: ['./generate-secondary-packing-coupon.component.scss']
})
export class GenerateSecondaryPackingCouponComponent implements OnInit {
  
  total_coupon:any='0';
  filter:any={}
  
  
  constructor(public route: ActivatedRoute) {
    
    console.log(this.route);
    console.log(this.route.queryParams);
    console.log(this.route.queryParams['_value']);
    
  }
  
  ngOnInit() {
  }
  
  // generate_coupon(){
  //   console.log("generate_coupon method calls");
  // }
  
  get_coupon_code_list(){
    console.log("get_coupon_code_list method calls");
  }
  
}
