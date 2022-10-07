import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import {MatDialog} from '@angular/material';
import { UserEmailModalComponent } from '../user-email-modal/user-email-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/dialog.service';
import { EditAddressComponent } from 'src/app/edit-address/edit-address.component';
import { DialogComponent } from 'src/app/dialog.component';
// import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-sale-user-detail',
  templateUrl: './sale-user-detail.component.html',
  animations: [slideToTop()]
})
export class SaleUserDetailComponent implements OnInit {
  manager:any;
  rsm:any=[];
  ass_user:any=[];
  detail:any={};
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  area_list:any=[];
  user_types:any ;
  pinCode_list:any=[];
  user_id;
  input_type="";
  visible=true;
  loader:any;
  rsm_list:any=[];
  datauser: any = {};
  assign_module_data:any=[];
  team_edit:any=[];
  constructor(public alert:DialogComponent,public  serve:PearlService, public dialog: MatDialog,public rout:Router,public editdialog:DialogService,public route:ActivatedRoute) {
    this.datauser = JSON.parse(sessionStorage.getItem('st_user'));
    console.log(this.datauser);
    this.user_types = this.datauser['data'];
    console.log(this.user_types);
       
    this.route.params.subscribe( params => {
      console.log(params);
      this.user_id = params.id;
      console.log(this.user_id);

    });
    this.userDetail();
    this.getStateList();

  }

  //  openDialog(): void
  //  {
  //     const dialogRef = this.dialog.open(UserEmailModalComponent, {
  //     width: '250px',
  //        });
  //     dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
  access_level:any;
  userDetail()
  {
    this.loader=1;

    // console.log(id);
    let value={"id":this.user_id}
    this.serve.fetchData(value,"User/user_detail").subscribe((result)=>{
      console.log(result);
      this.detail=result['user_detail']['data'];
      this.assign_module_data=result['user_detail']['assignModule'];

      this.access_level=this.detail.access_level;
      console.log(this.access_level)
      this.assign_users(this.access_level);
      this.team_edit = result['user_detail']['data']['assign_user'];
      console.log(this.team_edit);

      // this.rsm_list=result;


      // this.manager=result['user_detail']['manager'];

      setTimeout (() => {
        this.loader='';

      }, 700);

    })

  }


  ngOnInit() {
    this.input_type="password";
    // this.detail=this.serve.get_data()
  }

  getStateList()
  {
    console.log("addUser");
    this.serve.fetchData(0,"User/state_user_list").subscribe((response=>{
      console.log(response);
      this.state_list=response['query']['state_name'];
      console.log(this.state_list);
    }));

  }
  getDistrict()
  {
    console.log(this.detail.state_name);
    this.serve.fetchData(this.detail.state_name,"User/district_user_list").subscribe((response=>{
      // console.log(response);
      this.district_list=response['query']['district_name'];
      console.log(this.district_list);

    }));

  }

  getCityList()
  {
    console.log(this.detail.district_name);

    console.log(this.detail.state_name);
    let value={"state":this.detail.state_name,"district":this.detail.district_name}
    this.serve.fetchData(value,"User/city_user_list").subscribe((response=>{
      console.log(response);
      this.city_list=response['query']['city'];
      console.log(this.city_list);

    }));
  }

  getAreaList()
  {
    console.log(this.detail.district);
    let value={"state":this.detail.state_name,"district":this.detail.district_name,"city":this.detail.city}
    this.serve.fetchData(value,"User/area_user_list").subscribe((response=>{
      console.log(response);
      this.area_list=response['query']['area'];
      console.log(this.area_list);

    }));
  }

  getPinCodeList()
  {
    console.log(this.detail.state_name,this.detail.district_name,this.detail.city,this.detail.area);
    let value={"state":this.detail.state_name,"district":this.detail.district_name,"city":this.detail.city,"area":this.detail.area}
    this.serve.fetchData(value,"User/pincode_user_list").subscribe((response=>{
      console.log(response);
      this.pinCode_list=response['query']['pincode'];
      console.log(this.pinCode_list);

    }));
  }

  updateDetail()
  {
    console.log(this.detail.id);
    console.log(this.detail);
    let value={'id':this.detail.id,'data':this.detail};
    this.serve.fetchData(value,"User/update_user").subscribe((result=>{
      console.log(result);

      if(result)
      {
        this.rout.navigate(['/sale-user-list']);
      }

    }))

  }

  // editaddress()
  // {
  //   console.log("hello");
  //   this.editdialog.editAddress();
  // }
  category="user";

  openEditDialog(value,type): void
  {
    const dialogRef = this.dialog.open(UserEmailModalComponent, {
      width: '350px',
      data:{
        // 'warehouse_id' : value,
        'value' : value,
        type,
        user_id : this.user_id,
        category:this.category,
        'user_type':this.detail['user_type']
      }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        //  this.toast.successToastr("detail");
        this.userDetail();


      });
    }

    openWareHouseEditDialog(value,type){

      const dialogRef = this.dialog.open(UserEmailModalComponent, {
        width: '350px',
        data:{
          'warehouse_id' : value,
          type,
          user_id : this.user_id,
          category:this.category
        }});
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          console.log('The dialog was closed');
          //  this.toast.successToastr("detail");
          this.userDetail();


        });

    }

    editaddress()
    {
      const dialogRef = this.dialog.open(EditAddressComponent, {
        width:'590px',
        data:{
          data:this.detail
        }});
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          console.log('The dialog was closed');
          this.userDetail();

        });

      }
      show_password()
      {
        this.input_type = 'text';
        this.visible=false;
      }

      hide_password()
      {
        this.input_type = 'password';
        this.visible=true;
      }
      team_update:any = false;
      edit_assigned_team(){
        //  alert('fd');
        this.team_update=true;

      }
      active:any={};

      toggleterritory(key,action)
      {
        console.log(action);
        console.log(key);

        if(action == 'open')
        { this.active[key] = true; }
        if(action == 'close')
        { this.active[key] = false;}

        console.log(this.active);
        //  this.salesUserLIst()

      }
      product_Brand(value,index,event)
      {



        if(event.checked)
        {
          this.rsm.push(value);
          console.log(this.rsm);

        }
        else
        {
          for( var j=0;j<this.rsm_list.length;j++)
          {
            if(this.rsm_list[index]['id']==this.rsm[j])
            {
              this.rsm.splice(j,1);
            }
          }
          console.log(this.rsm);
        }
        this.ass_user =  this.rsm

      }
      tmp_userList:any=[];

      search:any={};
      tmpsearch:any={};
      getItemsList(search)
      {
        console.log(search);

        this.rsm_list=[];
        for(var i=0;i<this.tmp_userList.length; i++)
        {
          search=search.toLowerCase();
          this.tmpsearch=this.tmp_userList[i]['name'].toLowerCase() + ' '+ this.tmp_userList[i]['role_name'].toLowerCase();
          if(this.tmpsearch.includes(search))
          {
            this.rsm_list.push(this.tmp_userList[i]);
          }
        }
        console.log(this.rsm_list);

      }
      // checked_array(){
      //   console.log(this.rsm_list);
      //   if(this.rsm_list)
      //   {
      //     console.log('in1');
      //     for(let i=0;i<this.rsm_list.length;i++)
      //     {
      //     console.log('in2');

      //       for(let j=0;j<this.team_edit.length;j++)
      //       {
      //     console.log('in3');

      //         if(this.rsm_list[i]['name']==this.team_edit[j]['name'])
      //         {
      //     console.log('in4s');

      //           this.rsm.push(this.rsm_list[i]['id']);
      //           console.log(this.rsm);
      //         }
      //       }

      //     }
      //   }
      // }
      assign_users(accesslevel){
        console.log(accesslevel);
        this.serve.fetchData({'user_type':accesslevel},"User/assign_users").subscribe((response=>{
          console.log(response);


          this.rsm_list=response['assign_users'];
          console.log(this.rsm_list);
          if(this.rsm_list)
          {
            console.log('in if');
            for(let i=0;i<this.rsm_list.length;i++)
            {
              console.log('in for1');

              for(let j=0;j<this.team_edit.length;j++)
              {
                console.log('in for2');

                if(this.rsm_list[i]['name']==this.team_edit[j]['name'])
                {
                  console.log('in if 2');

                  this.rsm_list[i].check=true;
                  console.log(this.rsm_list[i]);
                  if(this.rsm.indexOf(this.rsm_list[i]['id']) === -1) {
                    this.rsm.push(this.rsm_list[i]['id']);
                    console.log(this.rsm);
                  }



                  this.rsm.push();
                  console.log(this.rsm);

                }
              }

            }
          }
          this.tmp_userList = this.rsm_list;
        }));
        // this.checked_array();
      }
      update_assignusers(){
        this.team_update=false;
        console.log(this.detail.id);
        console.log(this.rsm);
        this.serve.fetchData({'users':this.rsm,'user_id':this.detail.id},"User/update_assigned_users").subscribe((response=>{
          console.log(response);

        }));
        this.userDetail();

      }

      assign_module(module_name, event , index)
      {

        console.log(module_name);
        console.log(event);
        console.log(index);

        if (event.checked) {
          this.assign_module_data[index][module_name] = 'true';
          this.assign_module_data[index]['view'] = 'true';

        }
        else {
          this.assign_module_data[index][module_name] = 'false';

        }
        console.log(this.assign_module_data);

        this.serve.fetchData(this.assign_module_data[index],"User/assign_module_user_update").subscribe(response=>
          {
            console.log(response);
            this.userDetail();
          });

        }

      }
