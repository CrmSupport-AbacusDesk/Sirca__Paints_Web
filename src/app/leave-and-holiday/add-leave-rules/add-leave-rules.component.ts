import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
// import { MyserviceService } from 'src/app/myservice.service';
import { PearlService } from 'src/app/pearl.service';

@Component({
  selector: 'app-add-leave-rules',
  templateUrl: './add-leave-rules.component.html',
  animations: [slideToTop()]
})
export class AddLeaveRulesComponent implements OnInit {
data:any={};
  constructor(public service:PearlService) 
  {

  }

  submit()
  {
    console.log(this.data);

    this.service.fetchData(this.data,'leave_holiday/add_leaves_rule').subscribe((resp)=>
    {
      console.log(resp);
      
    });
    
  }

  ngOnInit() {
  }

}
