import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  animations: [slideToTop()]
})
export class AddDiscountComponent implements OnInit {

  detail:any=[];
  product_id;
  old_distributor_discount: any = '0';
  old_direct_dealer_discount: any = '0';
  old_dealer_discount: any = '0';

  constructor(public rout:Router,public serve:PearlService,public route:ActivatedRoute) {
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.product_id = params.id;
      console.log(this.product_id);
      
      });
      this.discountDetail(this.product_id);
    // this.addDiscount();
   }

  ngOnInit() {
    // this.detail=this.serve.get_data()
    // console.log(this.detail);
    

  }

  MobileNumber(event: any) 
  {
    console.log(event);
    
    const pattern = /[0-9\+\-\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) 
    {event.preventDefault(); }
   }

  discountDetail(id)
  {
    console.log(id);
    let value={"id":id}
    this.serve.fetchData(value,"Discount/discount_detail").subscribe((result=>{
      console.log(result);
      this.detail=result['discount_detail'];
      this.old_distributor_discount = this.detail['distributor']
      this.old_direct_dealer_discount = this.detail['direct_retailer']
      this.old_dealer_discount = this.detail['dealer']
      // this.serve.setdiscountdata(result);
      // this.rout.navigate(['/add-discount/'+id]);
      
    }))
    
  }

  addDiscount()
  {

    let value={"detail":this.detail,"id":this.detail['id'],'old_distributor_discount' : this.old_distributor_discount,'old_dealer_discount' : this.old_dealer_discount,'old_direct_dealer_discount' : this.old_direct_dealer_discount }
    this.serve.fetchData(value,"Discount/update_discount_detail").subscribe((result=>{
      console.log(result)
      if(result){
        this.rout.navigate(['/discount-list'])
      }
      
    }))
    
  }

}
