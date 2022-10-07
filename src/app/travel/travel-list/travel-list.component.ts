import { Component, OnInit } from '@angular/core';
import { PearlService } from 'src/app/pearl.service';
import * as moment from 'moment';
import { LocalStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { TravelplanModalComponent } from 'src/app/travelplan-modal/travelplan-modal.component';


@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss']
})
export class TravelListComponent implements OnInit {
  travel_list:any=[];
  loader:any=false;
  page_limit:any=50
  search:any={};
  skelton:any={}
  data_not_found=false;


  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  login_id:any='0';
  active_tab:any = 'Pending';
  travel_list_count: any = {};


  constructor(public serve:PearlService,public session:LocalStorage , public dialog:DialogComponent , public dailogR:MatDialog)
  {
    this.skelton = new Array(10);

    console.log(this.session.getSession());
    
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.login_id = this.assign_login_data['data'].id;
    console.log(this.login_id);
    this.assign_login_data = this.assign_login_data.assignModule;
   
    
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'travel plan');
    console.log(index);

    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;

    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);

    this.search = this.serve.travelPlanFilter;

    if(this.serve.travelPlanTab){

      this.active_tab = this.serve.travelPlanTab;

    }



  }

  ngOnInit()
  {
    this.getTravelList();
  }

  getTravelList(action:any='')
  {
    if(action == "refresh")
    {
      this.search = {};
    }

    this.loader=true;

    this.serve.fetchData({'start':this.travel_list.length,'pagelimit':this.page_limit,'search':this.search,'status':this.active_tab},"Travel/travel_list").subscribe((result=>
      {
        console.log(result);
        this.loader= false;
        this.travel_list = result['travel_list'];
        this.travel_list_count = result['travel_plan_status_wise_count_data'];


        if(this.travel_list.length == 0)
        {
          this.data_not_found = true;
        }
        else
        {
          this.data_not_found = false;
        }
      }))
    }

    public onDate(event): void
    {
      this.search.travel_date=moment(event.value).format('YYYY-MM-DD');
      console.log(this.search.travel_date);

      this.getTravelList();
    }

    goToDetailPage(){

      this.serve.travelPlanFilter = this.search;

      this.serve.travelPlanTab = this.active_tab;

    }

    deleteTravelPlan(travel_id){
      console.log(travel_id);
      this.serve.fetchData({id:travel_id},'Travel/delete_travel_plan').subscribe((r)=>{
        console.log(r);
         if(r['msg'] == 'plan deleted successfully.'){
          this.dialog.success('Travel Plan' , 'Deleted Successfully');
          this.getTravelList();
         } else{
          this.dialog.error('Something Went Wrong.. Please Try Again.');
         }
      })
    }


    // editTravelPlanDate(date){
    //   console.log(date);
      
    //   let dialogRef=this.dailogR.open(TravelplanModalComponent,{
    //     width:'400px',
    //     data:{
    //       'from':'travel_plan',
    //       'date':date
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log("dialogRef Closed");
        
    //   });
    // }

  }
