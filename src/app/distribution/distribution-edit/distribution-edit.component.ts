
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { PearlService } from '../../pearl.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-distribution-edit',
  templateUrl: './distribution-edit.component.html',
  styleUrls: ['./distribution-edit.component.scss']
})
export class DistributionEditComponent implements OnInit {

  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  pinCode_list:any=[];
  countryList:any=[];

  constructor(@Inject(MAT_DIALOG_DATA)public data,public serve:PearlService,public rout:Router,public dialog2:MatDialog,public toast:ToastrManager) {
    this.getCountryList();
    this.getStateList(data.country, 1);
    this.getDistrict(data.state, 1);
    this.getCityList(data.district,data.state, 1);
    this.getPinCodeList(data.district,data.state,data.city, 1);
    console.log(data);

  }

  ngOnInit() {
  }

  update()
  {
    console.log(this.data.value);

  }

  update_address(data)
  {
    console.log(data);
    this.serve.fetchData(data,"Distributors/distributors_address_update").subscribe((result=>{
      console.log(result);
      this.dialog2.closeAll();

    }))


  }

  update_basic_address(data)
  {
    console.log(data);
    this.serve.fetchData(data,"Distributors/distributors_address_update").subscribe((result=>{
      console.log(result);

      if(result['update_address']['msg'] == 'success'){

        this.toast.successToastr("sucess");

      }else if(result['update_address']['msg'] != 'success'){

        this.toast.errorToastr(result['update_address']['msg']);

      }

      this.dialog2.closeAll();

    }))


  }

  getCountryList()
  {
    console.log("addUser");
    this.serve.fetchData(0,"User/country_list").subscribe((response=>{
      console.log(response);
      this.countryList=response['query']['country_name'];
      console.log(this.countryList);
    }));

  }

  getStateList(country_name, src)
  {
    console.log(country_name);

    console.log("addUser");
    this.serve.fetchData(0,"User/state_user_list").subscribe((response=>{
      console.log(response);
      this.state_list=response['query']['state_name'];
      // this.state_list=this.state
      console.log(this.state_list);


    }));

  }
    getDistrict(state_name, src)
    {
      console.log(state_name);

      if(src == 2) {
        this.data.district = '';
        this.data.city = '';
        this.data.pincode = '';
      }
      this.serve.fetchData(state_name,"User/district_user_list").subscribe((response=>{
        // console.log(response);
        this.district_list=response['query']['district_name'];
        console.log(this.district_list);

      }));

    }
    MobileNumber(event: any)
    {
      console.log(event);

      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar))
      {event.preventDefault(); }
     }

    getCityList(district,state, src)
    {
      console.log(district);
      console.log(state);

      if(src == 2) {
        this.data.city = '';
        this.data.pincode = '';
      }

      let value={"state":state,"district":district}
      this.serve.fetchData(value,"User/city_user_list").subscribe((response=>{
        console.log(response);
        this.city_list=response['query']['city'];
        console.log(this.city_list);

      }));
    }

   getPinCodeList(district,state,city, src)
    {

      if(src == 2) {
        this.data.pincode = '';
      }

      console.log(district,state,city);
      let value={"state":state,"district":district,"city":city}
      this.serve.fetchData(value,"User/pincode_user_list").subscribe((response=>{
        console.log(response);
        this.pinCode_list=response['query']['pincode'];
        console.log(this.pinCode_list);

      }));
    }


}

