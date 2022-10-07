import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { _localeFactory } from '@angular/core/src/application_module';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  animations: [slideToTop()]

})
export class AddLeadComponent implements OnInit {

  data:any={};
  contact_person:any={};
  state_list:any=[];
  countryList:any = [];
  district_list:any=[];
  city_list:any=[];
  pinCode_list:any=[];
  login_user : any;
  login_id : any;

  constructor(public serve:PearlService,public rout:Router,public dialog:DialogComponent , public matdialog:MatDialog,public toast:ToastrManager) {
    this.getStateList();
    this.salesUserLIst();
    this.getCountryList();
    this.login_user = JSON.parse(sessionStorage.getItem('login'));

    this.login_id = parseInt(this.login_user['data']['id']);

  }

  ngOnInit() {
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

  getStateList()
  {
    console.log("addUser");
    console.log(this.data);

    this.serve.fetchData(0,"User/state_user_list").subscribe((response=>{
      console.log(response);
      this.state_list=response['query']['state_name'];
      console.log(this.state_list);
    }));

  }
  getDistrict(){
    console.log(this.data.state);
    this.serve.fetchData(this.data.state,"User/district_user_list").subscribe((response=>{
      // console.log(response);
      this.district_list=response['query']['district_name'];
      console.log(this.district_list);
      this.salesUserLIst();
    }));

  }

  getCityList()
  {
    console.log(this.data.district);
    let value={"state":this.data.state,"district":this.data.district}
    this.serve.fetchData(value,"User/city_user_list").subscribe((response=>{
      console.log(response);
      this.city_list=response['query']['city'];
      console.log(this.city_list);

    }));
  }

  getPinCodeList()
  {
    console.log(this.data.state,this.data.city,this.data.district);
    let value={"state":this.data.state,"district":this.data.district,"city":this.data.city}
    this.serve.fetchData(value,"User/pincode_user_list").subscribe((response=>{
      console.log(response);
      this.pinCode_list=response['query']['pincode'];
      console.log(this.pinCode_list);

    }));
  }
  tmp_list:any=[];
  addContactPerson()
  {
    console.log("hello");
    this.tmp_list.push(this.contact_person);
    this.contact_person={};
    console.log(this.tmp_list);

  }

  submitDetail(){
    console.log("hello");
    this.data.contact_person=this.tmp_list;
    this.data.sales_executive = this.ass_user;
    console.log(this.data);

    console.log(this.data);
    this.data.created_by = this.login_id
    this.serve.fetchData(this.data,"Distributors/add_lead").subscribe((result=>{
      console.log(result);
      if(result)
      {
        if(result['add_lead']['msg'] == 'success'){

          if(this.data.type==3){
            this.toast.successToastr("sucess");
            this.matdialog.closeAll();
            this.rout.navigate(['dealer-lead-list']);
          }else{
            this.rout.navigate(['lead-list']);
          }

        }else if(result['add_lead']['msg'] != 'success'){

          this.toast.errorToastr(result['add_lead']['msg']);

          this.matdialog.closeAll();

        }

      }
    }))
  }

  active:any = {};

  toggleterritory(key,action)
  {
    console.log(action);
    console.log(key);

    if(action == 'open')
    { this.active[key] = true; }
    if(action == 'close')
    { this.active[key] = false;}

    console.log(this.active);
    this.salesUserLIst();
    // key = '';
  }
  MobileNumber(event: any)
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar))
    {event.preventDefault(); }
  }
  search:any={};
  tmpsearch:any={};
  getItemsList(search)
  {
    console.log(search);
    console.log(this.tmp_userList);
    search=search.toLowerCase();

    this.asmList=[];
    for(var i=0;i<this.tmp_userList.length; i++)
    {
      console.log(i);
      this.tmpsearch=this.tmp_userList[i]['name'] != '' && this.tmp_userList[i]['name'] != null ? this.tmp_userList[i]['name'].toLowerCase():'';
      if(this.tmpsearch.includes(search))
      {
        this.asmList.push(this.tmp_userList[i]);
      }
    }
    console.log(this.asmList);

  }
  tmp_userList:any=[];

  asmList:any=[];
  assignUserList:any=[];
  assignUser:any=[];

  salesUserLIst(){
    this.serve.fetchData({'state':this.data.state?this.data.state:0},"User/active_sales_user_list").subscribe((result=>{
      console.log(result);
      this.asmList=result['sales_user_list'];
      this.tmp_userList=this.asmList;
      console.log(this.assignUserList[0]);


      for(let i=0;i<this.asmList.length;i++)
      {

        for(let j=0;j<this.assignUserList.length;j++)
        {
          if(this.asmList[i].id==this.assignUserList[j])
          {
            this.asmList[i].check=true;
            this.assignUser.push(this.asmList[i]);
            console.log(this.asmList[i].check);

          }
        }

      }
      console.log(this.assignUser);
    }))

  }

  removeContact(index)
  {
    this.tmp_list.splice(index,1);
  }
  rsm:any=[];
  ass_user:any=[];
  user_assign_check(value,index,event){
    console.log(value,index,event);

    {
      if(event.checked)
      {
        this.rsm.push(value);
        console.log(this.rsm);

      }
      else
      {
        for( var j=0;j<this.asmList.length;j++)
        {
          if(this.asmList[index]['id']==this.rsm[j])
          {
            this.rsm.splice(j,1);
          }
        }
        console.log(this.rsm);
      }
      this.ass_user =  this.rsm

    }

  }



  show_country_error(){
    this.dialog.error('Please Select Correct Country');
  }
}
