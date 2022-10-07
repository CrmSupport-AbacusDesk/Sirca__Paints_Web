import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog,   } from '@angular/material';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from '../dialog.component';
import { PearlService } from '../pearl.service';
@Component({
  selector: 'app-travel-plan-edit-model',
  templateUrl: './travel-plan-edit-model.component.html',
  styleUrls: ['./travel-plan-edit-model.component.scss']
})
export class TravelPlanEditModelComponent implements OnInit {
  login:any={};

  item:any=[];
  channelPartnerArray:any=[];
  channelPartnerArray2:any=[];
  stateList:any=[];
  stateList2:any=[];
  districtList:any=[];
  districtList2:any=[];
  cityList:any=[];
  loader:boolean=false;
  cityList2:any=[];
  district_name:any={};
  tempSearch:any='';
    constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog , public serve:PearlService , public alert:DialogComponent,public toastr:ToastrManager ) { 
      console.log("table data list",data.data);
      this.item=data.data;    
      this.getDistributorList();
      this.getStateList();
    }

  ngOnInit() {
    this.login= JSON.parse(sessionStorage.getItem('login'));
    console.log(this.login.data.id);
  }

  getDistributorList(){

    this.serve.fetchData({},'Travel/distributors_list').subscribe((res)=>{
      console.log(res);
      this.channelPartnerArray=res;
      this.channelPartnerArray2=res;
    })
  }

  getStateList(){

    this.serve.fetchData({},'Travel/state_list').subscribe((res)=>{
      console.log(res);
      this.stateList=res;
      this.stateList2=res;
    })
  }

  getDistrictList(){
    console.log(this.item.state_name);
    
    this.serve.fetchData({'state_name':this.item.state_name},'Travel/district_list').subscribe((res)=>{
      console.log(res);
      this.districtList=res;
      this.districtList2=res;
    })
  }
  getCityList(lead){
    console.log(lead);
    console.log(this.item.state_name);

    this.serve.fetchData({'state_name':this.item.state_name , 'district_name':lead},'Travel/city_list').subscribe((res)=>{
      console.log(res);
      this.cityList=res;
      this.cityList2=res;
    })
  }

  checks:any=[];

  // district_array(lead){
    

  
  // }
  searchState(state_name){
    console.log(state_name);
    console.log(this.tempSearch);
    this.stateList=[];
    for (let i = 0; i< this.stateList2.length; i++) {
      state_name=state_name.toLowerCase();
      this.tempSearch=this.stateList2[i].state_name.toLowerCase();
      console.log(this.tempSearch);
      if(this.tempSearch.includes(state_name)){
        this.stateList.push(this.stateList2[i])
      }
    }
 
    
  }

  searchDistrict(district_name){
    console.log(district_name);
    console.log(this.tempSearch);
    this.districtList=[];
    for (let index = 0; index < this.districtList2.length; index++) {
     district_name=district_name.toLowerCase();
     this.tempSearch=this.districtList2[index].district_name.toLowerCase();
     if(this.tempSearch.includes(district_name)){
      this.districtList.push(this.districtList2[index])
     }
    }
    
  }

  searchCity(city_name){
    console.log(city_name);
    console.log(this.tempSearch);
    this.tempSearch='';
    this.cityList=[];
      for(let x=0; x<this.cityList2.length; x++){
        city_name=city_name.toLowerCase();
        this.tempSearch=this.cityList2[x].city.toLowerCase();
        if(this.tempSearch.includes(city_name)){
          this.cityList.push(this.cityList2[x]);
        }
      }
  }


  searchDistributorList(channel_partner_name){
    console.log(channel_partner_name);
    console.log(this.tempSearch);
    this.tempSearch='';
    this.channelPartnerArray=[];
    for(let y=0; y<this.channelPartnerArray2.length;y++){
      channel_partner_name=channel_partner_name.toLowerCase();
      this.tempSearch=this.channelPartnerArray2[y].company_name.toLowerCase();
      if(this.tempSearch.includes(channel_partner_name)){
        this.channelPartnerArray.push(this.channelPartnerArray2[y]);
      }
    }
    
    
  }

  travelPlanEdit(){
    console.log(this.item);
    this.loader=true;
    this.serve.fetchData({'item':this.item,'status_changed_by':this.login.data.id},'Travel/update_travel_plan').subscribe((res)=>{
      console.log(res);
      if(res=="success"){
        setTimeout(() => {
          this.loader=false;
        }, 1000);
        this.toastr.successToastr("Successfully Updated");
        this.dialog.closeAll();
      }
      else{
        this.toastr.errorToastr("Something Went Wrong...");

      }
    })
  }
}
