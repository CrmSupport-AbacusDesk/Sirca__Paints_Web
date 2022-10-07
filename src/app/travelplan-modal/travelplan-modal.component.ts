import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import * as moment from 'moment';
import { DialogComponent } from '../dialog.component';
import { PearlService } from '../pearl.service';


@Component({
  selector: 'app-travelplan-modal',
  templateUrl: './travelplan-modal.component.html',
  styleUrls: ['./travelplan-modal.component.scss']
})
export class TravelplanModalComponent implements OnInit {
  login:any={};

    travel_id:any='';
    item:any={};
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog , public serve:PearlService , public alert:DialogComponent) { 
    console.log("table modal list",this.data);
    this.item=this.data;
    console.log(this.item);
    console.log(this.item.date.travel_date_from);
    console.log(this.item.date.travel_date_to);
    console.log(this.item.date.id);
    this.item.travelPlan_date_from=this.item.date.travel_date_from;
    this.item.travelPlan_date_to=this.item.date.travel_date_to;
    this.travel_id=this.item.date.id;
  }


  ngOnInit() {
    this.login= JSON.parse(sessionStorage.getItem('login'));
    console.log(this.login.data.id);
    
  }


  travelplan_date_change(){
    console.log("travel plan date called");

    console.log(this.item.travelPlan_date_from);
    this.item.travelPlan_date_from=moment(this.item.travelPlan_date_from).format('YYYY-MM-DD');

    console.log(this.item.travelPlan_date_to);
    this.item.travelPlan_date_to=moment(this.item.travelPlan_date_to).format('YYYY-MM-DD');

    this.serve.fetchData({travel_date_to: this.item.travelPlan_date_to, travel_date_from:this.item.travelPlan_date_from, travel_id:this.travel_id ,'status_changed_by':this.login.data.id },'Travel/update_travel_plan_date').subscribe((ew)=>{
      console.log(ew);
        if(ew['msg']=='Travel Date updated successfully.'){
          this.alert.success('Travel Plan','Travel Date updated successfully.')
        }
    })
    this.dialog.closeAll();


  }

}
