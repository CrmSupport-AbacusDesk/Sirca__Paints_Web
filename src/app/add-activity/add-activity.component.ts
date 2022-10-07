import { Component, OnInit } from '@angular/core';
// import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';


@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent implements OnInit {

  data: any = {};
  login_user_data:any;
  disposition_types:any=[];
  disposition_names:any = [];
  showFileds:boolean= false;
  dr_id :any ='0';
  dr_type :any='0';
  created_by:any='0';
  comes_from:any='';
  loader:any;
   public selectedTime : string;

  constructor(public serve: PearlService, public rout: Router,public dialog: DialogComponent, public route:ActivatedRoute, private atp : AmazingTimePickerService) {
      this.route.params.subscribe((result)=>{
        console.log(result);
        this.dr_id = result.id;
        console.log(this.dr_id);
        this.dr_type = result.type;
        console.log(this.dr_type);
        this.comes_from = result.from;
        console.log(this.comes_from);
        
      })
 
    
   }

  
  
  ngOnInit() {
   this.login_user_data = JSON.parse(sessionStorage.getItem('st_user'))
    console.log(this.login_user_data);
   this.created_by = this.login_user_data['data'].id;
   console.log(this.created_by);
      
  }
  
  back(){
    window.history.back()
  }

  get_disposition_type(){
      this.loader =true;

    console.log("get_disposition_type method call");
    console.log(this.data.dr_network_type);
    console.log(this.data.dr_type);
    console.log(this.data.activity_type);
    this.disposition_types = [];
    this.serve.fetchData({'dr_type':this.dr_type},'Distributors/disposition_type_for_existing').subscribe((result)=>{
      console.log(result);
      this.disposition_types = result['disposition_type'];
      console.log( this.disposition_types);
      setTimeout(() => {
        this.loader=false
      }, 1000);
      
    })
    
  }
  get_disposition_type_name(){
    this.loader =true;

    console.log("get_disposition_type_name method call");
    console.log(this.data.disposition_type);
    console.log(this.data.dr_type);
    this.disposition_names = [];
    this.serve.fetchData({'disposition_type':this.data.disposition_type},'Distributors/disposition_name_for_existing').subscribe((result)=>{
      console.log(result);
       this.disposition_names = result['disposition_name'];
       console.log( this.disposition_names);
      setTimeout(() => {
        this.loader=false;
      }, 1000);

    })

  }
  show_fileds(event){
    if(event.checked){
        this.showFileds = true;
    }else{
      this.showFileds =false;
    }
  }
 

  submitDetail(){
    console.log(this.data);
    this.loader = true;
    if(this.data.followup_date !='' && this.showFileds == true){
      this.data.followup_date = moment(this.data.followup_date).format('YYYY-MM-DD');
      console.log(this.data.followup_date);
  
    }
   
    this.serve.fetchData({'data':this.data ,'dr_id':this.dr_id,'comes_from':this.comes_from, 'dr_type':this.dr_type,'created_by':this.created_by},'Distributors/add_activity').subscribe((r)=>{
      console.log(r);
      setTimeout(() => {
        this.loader = false;
      }, 1000);
      if(r['msg'] == 'success'){
        window.history.back();
        // this.rout.navigateByUrl('')
        this.dialog.success('Activity Added','Successfully');
        
      }
      
    })
    
  }
  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      console.log(time);
      this.selectedTime = time;
    });
  }
}
