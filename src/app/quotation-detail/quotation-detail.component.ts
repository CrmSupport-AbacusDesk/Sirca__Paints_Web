import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { PearlService } from '../pearl.service';
import { QuotationEmailModalComponent } from '../quotation-email-modal/quotation-email-modal.component';
import { UserEmailModalComponent } from '../user/user-email-modal/user-email-modal.component';

@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.component.html',
  styleUrls: ['./quotation-detail.component.scss']
})
export class QuotationDetailComponent implements OnInit {

    quotation_id:any='';
    loader:boolean=false;
    quotation_detail:any=[];
    quotation_summary:any=[];
  constructor(public route:ActivatedRoute, public serve:PearlService,public dialog:MatDialog ) { }

  ngOnInit() {
    console.log(this.route.params['_value']);
    this.quotation_id=this.route.params['_value'].id;
    console.log(this.quotation_id);
    this.getQuotationDetail();
  }

  back(){
    window.history.go(-1);
  }

  getQuotationDetail(){
    console.log("quotation detail api called");
    this.loader=true;
      this.serve.fetchData({'quotation_id':this.quotation_id},'Quotation/getQuotationDetail').subscribe((resp)=>{
        console.log(resp);
        this.quotation_detail=resp['QuotationDetail']['details'];
        this.quotation_summary=resp['QuotationDetail']['QuotationSummary'];

        this.quotation_detail.netBreakup=(parseInt(this.quotation_detail.grand_total)/1.18);
        this.quotation_detail.gstBreakup=(parseInt(this.quotation_detail.grand_total))-(parseInt(this.quotation_detail.netBreakup));
        this.quotation_detail.gstBreakup= this.quotation_detail.gstBreakup.toFixed(2);
        this.quotation_detail.netBreakup=this.quotation_detail.netBreakup.toFixed(2);
        console.log(this.quotation_detail);
        console.log(this.quotation_summary);
        
        setTimeout(() => {
          this.loader=false;
        }, 1000);
      })
  } 


  emailModal(data){
    let dialogRef=this.dialog.open(QuotationEmailModalComponent, {
      width:'500px',
      data:{
        'data':data
      }
    })
  }

  openPdf(id){
      this.loader=true;
      console.log(this.serve.pdf_url);
      
    this.serve.fetchData({'quotation_id':this.quotation_id},'Quotation/item_quotation_pdf').subscribe((r)=>{
      console.log(r);

      if(r['status']=='Success'){
    window.open(this.serve.pdf_url+id+'.pdf')

      }
      setTimeout(() => {
      this.loader=false;
        
      }, 1000);
    })

  }

} 
