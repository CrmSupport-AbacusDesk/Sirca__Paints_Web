import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { PearlService } from '../pearl.service';
import { FormControl } from '@angular/forms';
import { containsTree } from '@angular/router/src/url_tree';


@Component({
  selector: 'app-area-target-survey',
  templateUrl: './area-target-survey.component.html',
  styleUrls: ['./area-target-survey.component.scss']
})
export class AreaTargetSurveyComponent implements OnInit {
  
  survey_data:any = {
    state : [],
    district : []
    
  };
  state_list:any=[];
  district_list:any=[];
  loader:boolean=false;  
  formcontrol_state = new FormControl();
  formcontrol_district= new FormControl();
  area_target_data: any = [];
  your_target_sum : any = 0;
  current_sale_sum : any = 0;
  company_target_sum: any = 0;
  
  
  
  constructor(public dialog: DialogComponent,public serve:PearlService) { 
    this.getStateList()
    
  }
  
  ngOnInit() {
  } 
  
  getStateList(){ 
    console.log("getStateList method calls");
    this.loader=true;
    this.serve.fetchData({},"User/state_list").subscribe((response=>{
      console.log(response);  
      this.loader=false;
      this.state_list=response;
      console.log(this.state_list);
    }));
    
  }
  
  select_multiple_data(type){
    console.log("select_multiple_data method calls");
    
    if(type == 'state'){
      
      console.log(this.formcontrol_state);
      console.log(this.formcontrol_state['value']);
      this.survey_data.state = this.formcontrol_state['value'];
      this.getDistrict();
    }
    else if(type == 'district'){
      console.log(this.formcontrol_district);
      console.log(this.formcontrol_district['value']);
      this.survey_data.district = this.formcontrol_district['value'];
      
    }
    else{
      
    }
    
  }
  
  getDistrict(){
    console.log("getDistrict method calls");
    console.log(this.survey_data.state);
    this.serve.fetchData({'state':this.survey_data.state},"User/district_list").subscribe((response=>{
      this.district_list=response;
      console.log(this.district_list);
      
    }));
    
  }
  
  check_error(){
    console.log("check_error method calls");
    let error_flag = 0;
    
    if(this.survey_data.company_name == '' || this.survey_data.company_name == undefined || this.survey_data.company_name == null){
      console.log("in company_name error");
      this.dialog.error('Enter Company Name');
      error_flag++;
      return;
      
    }
    else if(this.survey_data.contact_person == '' || this.survey_data.contact_person == undefined || this.survey_data.contact_person == null){
      console.log("in contact_person error");
      this.dialog.error('Enter Contact Person');
      error_flag++;
      return;
      
    }
    else if(this.survey_data.mobile_no == '' || this.survey_data.mobile_no == undefined || this.survey_data.mobile_no == null){
      console.log("in mobile_no error");
      this.dialog.error('Enter Mobile Number');
      error_flag++;
      return;
      
    }
    else if(this.survey_data.mobile_no.length < 10){
      console.log("in mobile_no.length error");
      this.dialog.error('Enter Valid Mobile Number');
      error_flag++;
      return;
    }
    
    else if(this.survey_data.state.length == 0){
      console.log("in state error");
      this.dialog.error('Select State');
      error_flag++;
      return;
      
    }
    
    else if(this.survey_data.district.length == 0){
      console.log("in district error");
      this.dialog.error('Select District');
      error_flag++;
      return;
      
    }
    
    else if(error_flag == 0){
      this.get_area_target_data();
    }
    
    else{
      this.dialog.error('Something Went wrong, Please try again Later !');
      return;
    }
    
    
  }
  
  get_area_target_data(){
    console.log('get_area_target_data method calls');
    console.log(this.survey_data);
    this.loader=true;
    this.serve.fetchData({'district':this.survey_data.district},"User/dr_area_target_survey_before_data_save_list").subscribe((response=>{
      console.log(response);
      this.loader=false;
      this.area_target_data = response['area_target_data'];
      this.company_target_sum = response['total_company_target'];
      
    }));
    
    
    
    
  }
  
  save_area_target_data(){
    console.log('save_area_target_data method calls');
    console.log(this.survey_data);
    console.log(this.area_target_data);
    this.survey_data.area_target_data = this.area_target_data;
    this.loader=true;
    
    let primary_index = -1;
    let secondary_index = -1;
    
    
    do {
      primary_index = this.survey_data.area_target_data.findIndex(row => !row.your_target && !row.current_sale);
      (primary_index != -1 ? this.survey_data.area_target_data.splice(primary_index, 1) : '');
      
      secondary_index = this.survey_data.area_target_data.findIndex(row => row.your_target == '' && row.current_sale == '');
      (secondary_index != -1 ? this.survey_data.area_target_data.splice(secondary_index, 1) : '');
      
    } while(primary_index>=0 || secondary_index>=0);
    
    console.log(this.survey_data.area_target_data);
    
    if(this.survey_data.area_target_data.length > 0){
      this.serve.fetchData({'survey_data':this.survey_data},"User/dr_area_target_survey_data_save").subscribe((response=>{
        console.log(response);
        this.loader=false;
        response['msg'] == 'success'? window.location.reload() : '';
        response['msg'] == 'success'? this.dialog.success('Target Area Details','Save Successfully') : this.dialog.error(response['msg']);
        
      }));
    }
    
    else{
      this.dialog.error('Target Area Details Are Not Correct, Please Check !');
      this.loader=false;
      this.get_area_target_data()
    }
    
  } 
  
  calculate_sum(){
    console.log('calculate_sum method calls');
    
    this.your_target_sum = 0
    this.current_sale_sum = 0
    console.log(this.area_target_data)
    console.log(this.area_target_data.length)
    
   

    for(let index = 0;index < this.area_target_data.length; index++){
      console.log("in for")

      if(this.area_target_data[index]['your_target'] && this.area_target_data[index]['your_target'] != ''){
        // this.your_target_sum = parseInt(this.your_target_sum) + parseInt(this.area_target_data[index]['your_target']);
        this.your_target_sum = parseInt(this.your_target_sum) + parseInt(this.area_target_data[index]['your_target'].replace(/,/g, ""));

      }
      if(this.area_target_data[index]['current_sale'] && this.area_target_data[index]['current_sale'] != ''){
        // this.current_sale_sum = parseInt(this.current_sale_sum) + parseInt(this.area_target_data[index]['current_sale']);
        this.current_sale_sum = parseInt(this.current_sale_sum) + parseInt(this.area_target_data[index]['current_sale'].replace(/,/g, ""));

      }
      else{
        console.log("calculate_sum method -> for -> else");
        
      }

      console.log(this.your_target_sum);
      console.log(this.current_sale_sum);

    }
    
  }



  
  
}
