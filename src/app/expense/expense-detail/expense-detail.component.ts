import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatAccordion, MatDialog, MatExpansionPanel } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { LocalStorage } from 'src/app/localstorage.service';
import { PearlService } from 'src/app/pearl.service';
import { Location } from '@angular/common'
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';


@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {
  

  @ViewChildren(MatAccordion) mySelector3: MatAccordion;
  
  
  open_accordance() {

    console.log(this.mySelector3);
    
    console.log(this.mySelector3['first']['_headers']['first']['panel']['expanded']);
    console.log(this.mySelector3['first']['_headers']['first']['panel']);
    console.log(this.mySelector3['first']['_headers']['first']);

    this.mySelector3['first']['_headers']['first']['panel']['expanded'] = open

    
  }
  
  
  expense_id: any = '';
  loader: any;
  expense_detail: any;
  
  
  
  
  
  
  
  constructor( public route: ActivatedRoute, public location: Location,public serve: PearlService, public dialog: MatDialog, public session: LocalStorage) { 
    
    
    
    
    
    
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.expense_id = params.id;
      console.log(this.expense_id);
      this.get_expense_data();
      
    });
    
  }
  
  ngOnInit() {
  }
  
  get_expense_data(){
    
    this.loader = 1;
    
    this.serve.fetchData({'expenseId': this.expense_id}, 'Expense/expense_detail').subscribe((result => {
      console.log(result);
      this.expense_detail = result['expense_detail'];
      setTimeout (() => {
        this.loader = '';
        this.open_accordance();
        
      }, 700);
    }));
    
    
  }
  
  back(): void {
    console.log("location back method calls");
    console.log(this.location);
    this.location.back()

  }
  
  change_expense_status(type){
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px', data: {
        'change_status_of' : type,
        'expense_id' : this.expense_id,
        'expense_amount' : this.expense_detail.expense_total_amount,
        'from' : 'expense_detail_page'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.get_expense_data();
    });
  }
  
  imageModel(image){
    const dialogRef = this.dialog.open( StatusModalComponent, {
      data:{
        image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      
    });
  }
  
}
