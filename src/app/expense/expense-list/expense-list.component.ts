import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LocalStorage } from 'src/app/localstorage.service';
import { PearlService } from 'src/app/pearl.service';
import { MatDialog } from '@angular/material';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';


@Component({
  selector: 'app- ',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  
  skelton: any = new Array(10);
  loader: any ;
  data_not_found: any = false;
  active_tab:any = 'Pending';
  search:any={};
  expense_list: any = [];
  expense_sum_data: any = [];
  
  assign_login_data: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  

  excel_data:any=[];
  download_expense_excel_data:any=[];

  
  constructor(public serve: PearlService,public session:LocalStorage , public dialog: MatDialog) { 

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data);
    const index = this.assign_login_data.findIndex(row => row.module_name == 'expense');
    console.log(index);
    
    this.assign_login_data[index].add == 'true' ? this.view_add = true : this.view_add = false;
    this.assign_login_data[index].edit == 'true' ? this.view_edit = true : this.view_edit = false;
    this.assign_login_data[index].delete == 'true' ? this.view_delete = true : this.view_delete = false;
     
    console.log(this.view_add);
    console.log(this.view_edit);
    console.log(this.view_delete);

    this.search = this.serve.expenseFilter;
    
    this.get_expense_list();

  }

  
  ngOnInit() {
  }

  goToDetailPage(){

    this.serve.expenseFilter = this.search;

  }
  
  get_expense_list(action:any=''){

    console.log("get_expense_list method calls");
    
    if(action == "refresh"){
      this.search = {};
      this.expense_list = [];
    }
    
    this.loader=true;
    this.serve.fetchData({'search':this.search,'status':this.active_tab},"Expense/expense_list")
    .subscribe((result=>{
      console.log(result);
      this.expense_list = result['expense_list']
      this.expense_sum_data = result['expense_sum_data']

      setTimeout (() => {
        this.loader=false;
        
      }, 700);
      if(this.expense_list.length ==0){
        this.data_not_found=true;
      }else{
        this.data_not_found=false;
      }
    }))
    
  }
  
  con_date(date){
    
    this.search.expense_date = moment(date).format('YYYY-MM-DD');
    console.log(this.search.followup_date);
    this.get_expense_list(this.active_tab);
    
  }
  

  download_excel(){
    console.log("download_excel method calls");
    this.excel_data = [];
    console.log(this.search);
    console.log(this.active_tab);
    
    this.serve.fetchData({'search':this.search,'status':this.active_tab},"Expense/expense_list_for_excel").subscribe((result=>{
        console.log(result);
        this.download_expense_excel_data = result['expense_list'];
        console.log(this.download_expense_excel_data);
        
        for(let i=0;i<this.download_expense_excel_data.length;i++){
        
            let keys_value : any = [];
            keys_value = Object.keys(this.download_expense_excel_data[i])
        
            let excel_object: any = {}
        
            for(let secondary_index=0;secondary_index<keys_value.length;secondary_index++){
                excel_object[keys_value[secondary_index]]=this.download_expense_excel_data[i][keys_value[secondary_index]]        
            }
        
            this.excel_data.push(excel_object)
        
        }
        console.log(this.excel_data);
        this.serve.exportAsExcelFile(this.excel_data,'Expense Data SHEET');
        setTimeout (() => {
        
        }, 700);
    }))
    
  }


  change_expense_status(type , expense_id , expense_total_amount :any = ''){
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px', data: {
        'change_status_of' : type,
        'expense_id' : expense_id,
        'expense_amount' : expense_total_amount,
        'from' : 'expense_list_page'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_expense_list();
    });
  }


 public onDateBetween(event,data_type):void{
      console.log(data_type);
      console.log(event.value);
      if(data_type=='date_from'){
        this.search.date_from=moment(event.value).format('YYYY-MM-DD');
      }else{
        this.search.date_to=moment(event.value).format('YYYY-MM-DD');

      }
      
 }
  
}
