import { Component, OnInit, Renderer2 } from '@angular/core';
import { PearlService } from '../pearl.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
// import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import { Label } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { LocalStorage } from '../localstorage.service';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  count:any=[];
  orderdata:any=[];

  today_date:any;
  primary_today_count={};
  primary_today_sum={};
  primary_yesterday_count={};
  primary_yesterday_sum={};
  primary_daybeforeyesterday_sum={};
  primary_daybeforeyesterday_count={};
  //////////////////////////////
  secondry_today_count={};
  secondry_today_sum={};
  secondry_yesterday_count={};
  secondry_yesterday_sum={};
  secondry_daybeforeyesterday_sum={};
  secondry_daybeforeyesterday_count={};

  public barChartLabels: Label = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];
  login_data:any={};
  public barChartData: ChartDataSets[] = [];
  overall_target_vs_achievemnt_data: any;
  assign_area_detail_data: any;
  total_area_detail_data: any;


  // this.order_dashboard();

  constructor(public route:ActivatedRoute,public serve:PearlService,public dialog: MatDialog ,private renderer: Renderer2,public session:LocalStorage) {
    this.count_data();
    this.order_dashboard();
    this.target_vs_achievemnt_data();
    this.add_party_code();

    this.today_date = moment(new Date()).format("MMM - Y");
  }

  ngOnInit() {
    this.session.getSession()
    .subscribe(resp=>{
      console.log(resp);
      this.login_data = resp.data;
      if(this.login_data.type == '1' && this.login_data.lead_type == 'Dr' )
      {
        this.renderer.addClass(document.body, 'chanel-patner');
      }
      else
      {
        this.renderer.removeClass(document.body, 'chanel-patner');
      }
    })

  }



  status:boolean = false;
  toggleDropdown() {
    this.status = !this.status;

    if(this.status) {
      this.renderer.addClass(event.target, 'active');
      this.renderer.removeClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(event.target, 'active');
      // this.renderer.removeClass(document.body, 'active');
    }
  }

  toggleHeader() {
    console.log(this.status);
    this.status = !this.status;
    if(!this.status) {
      this.renderer.addClass(document.body, 'nav-active');
    }
    else {
      this.renderer.removeClass(document.body, 'nav-active');
    }
  }

  status1:boolean = false;
  toggleNav() {
    this.status1 = !this.status1;
    if(this.status1) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }
  count_data(){
    console.log('test');
    this.serve.fetchData({},"Distributors/count_data").subscribe((result=>{
      console.log(result);
      this.count=result;
      console.log(this.count);

      this.primary_today_count=this.count['pri_today_count'];
      this.primary_today_sum=this.count['pri_today_sum'];
      this.primary_yesterday_count=this.count['pri_yesterday_count'];
      this.primary_yesterday_sum=this.count['pri_yesterday_sum'];
      this.primary_daybeforeyesterday_sum=this.count['pri_day_before_yesterday_sum'];
      this.primary_daybeforeyesterday_count=this.count['pri_day_before_yesterday_count'];
      /////////////////////////////////
      this.secondry_today_count=this.count['sec_today_count'];
      this.secondry_today_sum=this.count['sec_today_sum'];
      this.secondry_yesterday_count=this.count['sec_yesterday_count'];
      this.secondry_yesterday_sum=this.count['sec_yesterday_sum'];
      this.secondry_daybeforeyesterday_sum=this.count['sec_day_before_yesterday_sum'];
      this.secondry_daybeforeyesterday_count=this.count['sec_day_before_yesterday_count'];
    }))
  }
  tmp:any=[];
  user_list:any=[];
  user_filter(){
    console.log(this.count);
    for(let i=0;i<this.count['user_data'].length;i++){
      this.tmp=this.count.user_data[i]['user_type'];

      if(this.tmp.includes('MARKET') || this.tmp.includes('Market'))
      {
        this.user_list.push(this.count.user_data[i]);
      }
    }
  }
  order_data:any=[];
  order_dashboard(){
    console.log('test');
    this.serve.fetchData({},"Order/dashboard_order").subscribe((result=>{
      console.log(result);
      this.orderdata=result;
      //       console.log(this.orderdata);
      // for(let i =0;i<10;i++){
      // this.order_data.cat.i=this.orderdata.cat.i;
      // this.order_data.amount.i=this.orderdata.amount.i;
      // }
      //       console.log(this.order_data);
      this.order_data.cat=this.orderdata.cat.slice(1,2,3,4,5,6,7,8,9);
      this.order_data.amount=this.orderdata.amount.slice(1,2,3,4,5,6,7,8,9);
      console.log(this.order_data);



      this.barChartLabels = this.orderdata.cat;
      this.barChartType = 'bar';
      this.barChartLegend = true;
      // public barChartPlugins = [pluginDataLabels];

      this.barChartData = [
        { data: this.orderdata.amount, label: 'Order Value' },
        // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
      ];

    }))
  }
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };




  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40
    ];


    this.barChartData[0].data = data;
  }

  formatTime(time){
    var parts = time.split(':');
    var time_ = new Date(0, 0, 0, parts[0], parts[1], parts[2]);
    return new Date(time_ || 'h:mm a');
  }


  target_vs_achievemnt_data(){
    console.log('target_vs_achievemnt_data method calls');
    this.serve.fetchData({},"User/area_target_dashboard_data").subscribe((result=>{
      console.log(result);
      this.overall_target_vs_achievemnt_data = result['assign_all_dr_target_detail']
      this.assign_area_detail_data = result['assign_area_detail']
      this.total_area_detail_data = result['total_area_detail']

    }))
  }


  open_targt_vs_achievement_model(type : any = ''){
    console.log("open_targt_vs_achievement_model method calls");
    console.log(type);
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '1050', data:{
        'data_type' : type,
        'from' : 'dashboard'
      },
      panelClass: "mat-dialog-height-transition"

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.target_vs_achievemnt_data();
    });


  }

  add_party_code(){

    console.log('add_party_code method calls');
    this.serve.fetchData({},"Login/add_party_code").subscribe((result=>{
      console.log("add_party_code API Response : ",result);

    }))

  }



}
