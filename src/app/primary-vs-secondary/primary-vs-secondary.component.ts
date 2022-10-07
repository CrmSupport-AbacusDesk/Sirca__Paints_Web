import { Component, OnInit } from '@angular/core';
import { PearlService } from '../pearl.service';
import * as moment from 'moment';
import { SecOrdReportModelComponent } from '../sec-ord-report-model/sec-ord-report-model.component';
import { MatDialog } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-primary-vs-secondary',
  templateUrl: './primary-vs-secondary.component.html',
  styleUrls: ['./primary-vs-secondary.component.scss']
})
export class PrimaryVsSecondaryComponent implements OnInit {
  
  data:any={};
  channel_partner_list:any=[];
  product_data:any=[];
  loader:any;
  category_list:any=[];
  data_not_found:any = false;
  user_data:any=[];
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  action:any;
  skelton:any={}
  constructor(public service:PearlService) 
  { 
    this.skelton = new Array(10);
    this.get_sales_user_list();
    this.get_product_category_list();
    this.getStateList();
    this.getDistrict();
    this.getCityList();
  }
  
  ngOnInit() 
  {
    this.user_list();
    // this.submit();
  }
  
  getStateList()
  {
    console.log("addUser");
    
    this.service.fetchData(this.data,"User/state_user_list").subscribe((response=>{
      console.log(response);  
      this.state_list=response['query']['state_name'];
      console.log(this.state_list);
    }));
    
  }
  getDistrict()
  {
    console.log(this.data.state);
    this.service.fetchData(this.data.state,"User/district_user_list").subscribe((response=>{
      // console.log(response);
      this.district_list=response['query']['district_name'];
      console.log(this.district_list);
      
    }));
    
  }
  getCityList()
  {
    let value = {"state": this.data.state,"district":this.data.district}
    this.service.fetchData(value,"User/city_user_list").subscribe((response=>{
      console.log(response);
      this.city_list=response['query']['city'];
      console.log(this.city_list);
    }));
  }
  user_list()
  {
    this.service.fetchData({'state':0},"User/sales_user_list").subscribe((result:any)=>
    {
      console.log(result);
      this.user_data = result['sales_user_list'];
      console.log(this.user_data);
      
    });
  }
  get_sales_user_list()
  {
    this.service.fetchData('',"Attendance/sales_user_data").subscribe(resp=>
      {
        console.log(resp);
        this.channel_partner_list = resp;
      });
    }
    
    get_product_category_list()
    {
      this.service.fetchData('',"product/get_product_category_list").subscribe(resp=>
        {
          console.log(resp);
          this.category_list = resp;
        });
      }
      
      submit(action: any = '')
      {
        
        this.loader = true;
        
        if (action == "refresh") {
          this.data = {};
          this.product_data = [];
          
        }
        this.loader = '1';
        if(this.data.start_date && this.data.end_date)
        {
          this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
          this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
        }
        console.log(this.data);
        
        this.service.fetchData(this.data,"Travel/discount_wise").subscribe(resp=>
          {
            console.log(resp);
            this.product_data = resp;
            console.log(this.product_data);
            
            
            if(this.product_data.length == 0)
            {
              this.data_not_found = true;
              this.loader = false;
              
            }else
            {
              this.data_not_found = false;
              this.loader = false;
              
            }
            
            // for(var i=0; i<this.product_data.length; i++)
            // {
            //   this.product_data[i]['total_amount'] = parseInt(this.product_data[i]['total_amount']); 
            // }
            this.loader = '';
            this.loader = false;
            
            
          });
        }



        refresh(){
          this.data={};
          this.product_data=[];
        }
        
        excel_data:any=[];
        // exportAsXLSX():void 
        // {
        //   this.loader = '1';
        //   this.excel_data = [];
        //   for(let i=0;i<this.product_data.length;i++)
        //   {
        //     this.excel_data.push({'Product Code':this.product_data[i].cat_no, 'Category':this.product_data[i].category,'Total Qty':this.product_data[i].total_qty,'Amount':this.product_data[i].total_amount});
        //   }
        //   console.log(this.excel_data);
        //   this.service.exportAsExcelFile(this.excel_data,'Product-Category-report');
        //   this.loader = '';
        // }


        exportAsXLSX():void
       {
         this.loader = '1';
         this.excel_data = [];
         for(let i=0;i<this.product_data.length;i++)
         {
           this.excel_data.push({
             'Company name':this.product_data[i].company_name, 
             'City':this.product_data[i].city, 
           'UPVC BALL VALVE':this.product_data[i].UPVCBallValve,
           'PROJECT ANGLE VALVE - INDIAN ':this.product_data[i].ProjectAngleValveIndian,
           'PRESSURE PUMP':this.product_data[i].PressurePump,
           'PROJECT ANGLE VALVE - IMPORTED':this.product_data[i].ProjectAngleValveImported,
           'PVC TAPS':this.product_data[i].PVCTaps,
           'CONTROL VALVE':this.product_data[i].ControlValve,
           'MIXER BENDS & CRUTCH':this.product_data[i].MixerBendsCrutch,
           'SSFaucet':this.product_data[i].SSFaucet,
           'BALL VALVE & CHECK VALVE':this.product_data[i].BallValveCheckValve,
           'FAUCETS':this.product_data[i].Faucets,
           'DIVERTER CONCEALED BODY':this.product_data[i].DiverterConcealedBody,
           'FLUSH VALVE':this.product_data[i].FlushValve,
           'SENSOR FAUCETS':this.product_data[i].SensorFaucets,
           'HEALTH FAUCET':this.product_data[i].HealthFaucet,
           'SANITARYWARE':this.product_data[i].Sanitaryware,
           'FAUCET PARTS':this.product_data[i].FaucetParts,
           'SPECIALLY PURPOSE TAPS':this.product_data[i].SpeciallyPurposeTaps,
           'SHOWERS':this.product_data[i].Showers,
           'ACCESSORIES':this.product_data[i].Accessories});
         }
         console.log(this.excel_data);
           this.service.exportAsExcelFile(this.excel_data,'Product-Category-report');
           this.loader = '';

      }

    }
      