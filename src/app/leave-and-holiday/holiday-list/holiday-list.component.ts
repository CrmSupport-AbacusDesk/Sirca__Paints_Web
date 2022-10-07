import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
// import { MyserviceService } from 'src/app/myservice.service';
import { PearlService } from 'src/app/pearl.service';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  animations: [slideToTop()]
})
export class HolidayListComponent implements OnInit {
  holidays_data:any=[];
  holidays_state:any=[];
  constructor(public service:PearlService) 
  {
    this.holiday_data();
   }

  holiday_data()
  {
    this.service.fetchData(0,'leave_holiday/holiday_list').subscribe((resp)=>
    {
      console.log(resp);
      this.holidays_data=resp;
    })
  }

  ngOnInit() {
  }

}
