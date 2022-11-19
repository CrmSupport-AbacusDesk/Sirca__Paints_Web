import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PearlService } from 'src/app/pearl.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogService } from 'src/app/dialog.service';
import { DialogComponent } from 'src/app/dialog.component';


@Component({
  selector: 'app-transferdata',
  templateUrl: './transferdata.component.html',
  styleUrls: ['./transferdata.component.scss']
})
export class TransferdataComponent implements OnInit {

  bill_id: any = '0';
  loader: any;
  invoice_bill_detail: any = {};
  invoice_bill_item: any = [];
  scannedData:any={};
  scannedDataArray:any=[];
  @ViewChild('barcode') barcodeElement : ElementRef;
  barcode_list:any=[];
  login_user : any;
  login_id : any;


  constructor(public route: ActivatedRoute,public serve: PearlService,public toast:ToastrManager,public dialog : DialogComponent, private router : Router) 
  { 

    this.login_user = JSON.parse(sessionStorage.getItem('login'));
        
    this.login_id = parseInt(this.login_user['data']['id']);

    this.route.params.subscribe( params => {
     this.bill_id = params.id
     this.bill_detail() ;
     
    });

  }

  ngOnInit() {
  }

  bill_detail(){
    console.log("bill_detail method calls");
      this.loader = 1;
      this.serve.fetchData({'bill_id': this.bill_id}, 'Tally_invoice_credit/tally_invoice_credit_billing_detail').subscribe((result => {
        console.log(result);

        this.invoice_bill_detail = result['invoice_bill'];
        this.invoice_bill_item = result['invoice_bill_item'];

        for (let i = 0; i < this.invoice_bill_item.length; i++) 
        {
          this.invoice_bill_item[i].barcode_list = [];
        }
        
        setTimeout (() => {
          this.loader = '';
          this.barcodeElement.nativeElement.focus();
          
        }, 700);
      }));
      
  }

  back(): void {
    console.log("location back method calls");
    // console.log(this.location);
    // this.location.back()
  }

  checkBarcode()
  {
    this.scannedDataArray.push(this.scannedData.barcode);
    console.log(this.scannedDataArray);
    

    let index_barcode = this.barcode_list.findIndex(row => row.secondary_qr_code == this.scannedData.barcode)

    if(index_barcode==-1)
    {
      this.serve.fetchData({'bill_id': this.bill_id,'barcode': this.scannedData.barcode}, "Order/checkBarcodeForDispatch").subscribe((result => {
                      
            console.log(result);

            if(result['status'] == 'Success')
            {
              console.log("product");
              
                let barcodeD = result['qrData'];
                let index = this.invoice_bill_item.findIndex(row => row.material_code == barcodeD.material_code)

                if(index !=-1 && this.invoice_bill_item[index].barcode_list.length < this.invoice_bill_item[index].sale_qty)
                {
                  this.invoice_bill_item[index].barcode_list.push(barcodeD);
                  this.barcode_list.push(barcodeD);
      
                  this.toast.successToastr('Item added to List');
                  this.barcodeElement.nativeElement.focus();

                }
                else
                {
                    console.log('More than pending qty');
                    this.dialog.error('More than pending qty');
        
                }
                 this.scannedData.barcode='';
                
            }
            else{

              console.log(result['status']);
              
                this.dialog.error(result['status']);
                this.scannedData.barcode='';
                this.barcodeElement.nativeElement.focus();

            }
      
        }));
    }
    else
    {

      this.dialog.error('This Barcode Already added in List');
      this.scannedData.barcode='';
      this.barcodeElement.nativeElement.focus();

    }
  }

  dispatchTransferItem()
  {
    console.log("dispatchTransferItem");
    

    for (let index = 0; index < this.invoice_bill_item.length; index++) 
    {
     
      if(this.invoice_bill_item[index].sale_qty> this.invoice_bill_item[index].barcode_list.length)
      {
        this.dialog.error('Scanned qty('+this.invoice_bill_item[index].barcode_list.length+') is less than Sale qty('+this.invoice_bill_item[index].sale_qty+') for item - '+this.invoice_bill_item[index].ProductName);
        return;
      }
      
    }
    this.dialog.confirm('').then((result) => {
                    
        if(result === true) 
        {
          let invoice_bill_item = this.invoice_bill_item.filter(row=> row.barcode_list.length>0)
          this.serve.fetchData({'bill_id':this.bill_id,'invoice_bill_item':invoice_bill_item,'login_id':this.login_id}, "Order/barcodeUpdation").subscribe((result => {

            console.log(result);

              if(result['status'] == 'Success'){    
                  this.dialog.success('Success', 'Items Dispatched Successfully');
                  this.router.navigate(['/invoice-billing']);              
              }
              else{
                  
                  this.dialog.error('Something Went Wrong');
              }

            }))
        }

      })
  }

}
