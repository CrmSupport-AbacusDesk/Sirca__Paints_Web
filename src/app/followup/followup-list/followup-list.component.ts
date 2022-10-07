import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import * as moment from 'moment/moment';

import { MatDialog } from '@angular/material';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';


@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html',
  // styleUrls: ['./followup-list.component.scss'],
  animations: [slideToTop()]

})
export class FollowupListComponent implements OnInit {

  followup_list:any=[];
  value:any=[];
  search:any={};
  tmp_follow_list:any=[];
  skelton: any = {};
  loader: any ;
  data_not_found: any = false;
  active_tab:any = 'pending';
  login_user_data:any;
  user_type : any ;
  user_id : any ;



  constructor(public serve:PearlService,public dialog:MatDialog){
    this.skelton = new Array(10);

    this.login_user_data = JSON.parse(sessionStorage.getItem('st_user'))
    console.log("User Data" , this.login_user_data);

    console.log('User Type : ',this.login_user_data['data']['user_type']);

    this.user_type = this.login_user_data['data']['user_type'];

    this.user_id = this.login_user_data['data']['id'];

    console.log("Logged In User Id: ",this.user_id);

    this.followUpList('pending');
  }

  ngOnInit() {



    // ,'user_type':this.login_user_data['data']['user_type'] ,'user_id':this.login_user_data['data']['id']

  }

  followUpList(action:any='')
  {

    let status = ''
    if(action == "refresh")
    {
      this.search = {};
      this.followup_list = [];
      this.active_tab = 'pending';
      status = 'Pending';

    }
    else if(action == "pending"){
      status = 'Pending';
    }
    else if(action == "upcoming"){
      status = 'Upcoming';
    }
    else if(action == "done"){
      status = 'Done';
    }

    console.log("In Function User Type: " , this.user_type);
    console.log("In Function User id: " , this.user_id);


    this.loader =true;
    this.serve.fetchData({'search':this.search,'status':status ,'user_type':this.user_type ,'user_id':this.user_id },"Distributors/follow_up_list").subscribe((result=>{
      console.log(result);
      this.followup_list=result['followup_list'];
      console.log(this.followup_list);
      setTimeout (() => {
        this.loader= false;

      }, 700);

      if(this.followup_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;

      }

    }))
  }

  con_date(date){
    this.search.followup_date = moment(date).format('YYYY-MM-DD');
    console.log(this.search.followup_date);
    this.followUpList(this.active_tab);

  }
  openDialog(id,status){
   const dialogRef = this.dialog.open(StatusModalComponent,{
      width:'400px',
      data:{
        'id':id,
        'status':status,
        "from":"update_status_of_follow_up"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.followUpList();
    });
  }
}
