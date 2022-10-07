import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { EditleadComponent } from 'src/app/editlead/editlead.component';
import { LocalStorage } from 'src/app/localstorage.service';
import { PearlService } from 'src/app/pearl.service';
import { slideToTop } from 'src/app/router-animation/router-animation.component';

@Component({
  selector: 'app-social-media-lead-detail',
  templateUrl: './social-media-lead-detail.component.html',
  // styleUrls: ['./social-media-lead-detail.component.scss']
  animations: [slideToTop()]
})
export class SocialMediaLeadDetailComponent implements OnInit {

  public static lead_id: any;
  assign_user: any = {};
  login_data: any;

  constructor(public session: LocalStorage, public route: ActivatedRoute, public serve: PearlService, public router: Router, public dialog: MatDialog) {

    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(this.login_data);

    this.route.params.subscribe(params => {
      console.log(params);
      this.lead_id = params.id;
      console.log(this.lead_id);


    });

    this.SocialMedialeadDetail();

    this.get_dead_reason_list();
    this.get_lead_status_list();

  }




  ngOnInit() {
  }


  lead_id: any;
  loader: any;
  lead_detail: any = [];


  SocialMedialeadDetail() {
    this.loader = 1;

    this.serve.fetchData({ 'id': this.lead_id }, 'Distributors/social_media_lead_detail').subscribe((result => {
      console.log("Api social media detail ", result);
      this.lead_detail = result['social_media_lead_detail'];
      // this.assignUserList = result['distributor_detail']['result']['assign_user'];
      // this.assignInsideUserList = result['distributor_detail']['result']['assign_inside_user'];
      // console.log(this.assignUserList);
      setTimeout(() => {
        this.loader = '';

      }, 700);
    }));
  }

  editDilog(value, type) {

    console.log('hello');

    const dialogRef = this.dialog.open(EditleadComponent, {
      width: '350px',
      data: {
        value,
        type,
        id: this.lead_id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      this.SocialMedialeadDetail();


    });
  }
  //address
  editAddress(country, state, district, city, pincode, address, type) {
    console.log(country, state, district, city, pincode, address, type);
    console.log('hello');

    const dialogRef = this.dialog.open(EditleadComponent, {
      width: '750px',
      data: {
        country,
        state,
        district,
        city,
        pincode,
        address,
        type,

        id: this.lead_id,
        comes_from: 'social_media_lead_detail'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      // this.userDetail();
      this.SocialMedialeadDetail();



    });
  }
  //modal changes aamir


  leadstatusarray: any = [];
  deadreasonarray: any = [];

  get_dead_reason_list() {
    console.log("sebse")
    this.serve.fetchData(0 , 'Distributors/social_media_lead_dead_reason_listing').subscribe((result => {
      console.log(" dead reason ", result);


      this.deadreasonarray = result['social_media_lead_dead_reason_listing'];
      console.log("array dead reason",this.deadreasonarray);
    }

  ));
  }

  get_lead_status_list() {
    console.log("leadstatus")
    this.serve.fetchData(0 , 'Distributors/social_media_lead_status_listing').subscribe((result => {
      console.log("lead status dksk", result);
      this.leadstatusarray=result['social_media_lead_status_listing'];
      console.log("lead status dksk", this.leadstatusarray);

    }

  ));
  }
    show_edit:boolean=false;
    update_status(){
      this.serve.fetchData(0,'Distributors/social_media_lead_status_update').subscribe((result=>{
        console.log("update lead  status ",result);
      }))
    }

}
