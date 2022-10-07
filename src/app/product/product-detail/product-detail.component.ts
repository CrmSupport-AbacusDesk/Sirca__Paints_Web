import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import {MatDialog} from '@angular/material';
import { UserEmailModalComponent } from 'src/app/user/user-email-modal/user-email-modal.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogService } from 'src/app/dialog.service';
import { ProductQrCodeModelComponent } from '../product-qr-code-model/product-qr-code-model.component';
import { ChangeSchemeStatusModelComponent } from '../change-scheme-status-model/change-scheme-status-model.component';
import * as XLSX from 'xlsx';
import { ExportexcelService } from 'src/app/service/exportexcel.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  animations: [slideToTop()]
  
})
export class ProductDetailComponent implements OnInit {
  
  productDetail:any=[];
  product_id;
  selectedFile=[];
  formData=new FormData();
  brandList:any=[];
  colorList:any=[];
  extraDetailList:any=[];
  checkBrand:any=[];
  checkcolor:any=[];
  checkDetail:any=[];
  product_state_price:any=[];
  scheme_tab_active = 'coupons';
  data:any={}

  coupon_data:any=[];
  qrCode_data:any=[];
  total_page:any='';
  count:any;
  page_limit:any=50;
  pagenumber:any='';
  start:any=0;

  active:any = {};

  loader:any;
  category="product";
  urls=new Array<string>();



  @ViewChild('table') table: ElementRef;
  
  constructor(public alert:DialogComponent, public serve:PearlService,public editdialog:DialogService,public dialog: MatDialog,public route:ActivatedRoute,public rout:Router,public toast:ToastrManager, public excelservice : ExportexcelService, public dialog1:DialogComponent) {
    this.route.params.subscribe( params => {
      console.log(params);
      this.product_id = params.id;
      console.log(this.product_id);
    });
    this.detailProduct();
    this.scheme_data('coupons');
  }
  ngOnInit() {
  }
  
  toggleterritory(key,action)
  {
    console.log(action);
    console.log(key);
    
    if(action == 'open')
    { this.active[key] = true; }
    if(action == 'close')
    { this.active[key] = false;}
    
    console.log(this.active);
  }
  
  detailProduct()
  {
    this.loader=1;
    let value={"id":this.product_id};
    console.log(this.product_id);
    this.serve.fetchData(value,"Product/product_detail").subscribe((result=>{
      console.log(result);
      this.getBrandList();
      this.getProductColor();
      this.getProductExtraField();
      this.productDetail=result['product_detail'][0];
      this.checkBrand=result['product_detail']['brand'];
      this.checkcolor=result['product_detail']['color'];
      this.checkDetail=result['product_detail']['extra_field'];
      this.product_state_price=result['product_detail']['region'];
      console.log(this.product_state_price);
      console.log(this.checkBrand,this.checkDetail,this.checkcolor);
      
      setTimeout (() => {
        this.loader='';
        
      }, 700);
    }))
    
  }
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  update_product_value(index,state_name:any,price){
    console.log(index);
    console.log(state_name);
    console.log(price);
    console.log(this.product_id);
    this.serve.fetchData({'state_name':state_name,'price':price,'product_id':this.product_id},"Product/update_region_price").subscribe((result)=>{
      console.log(result);
      if(result['msg']=='success'){
        this.toast.successToastr("sucess");
        // this.detailProduct();
        this.data={};
      }else{
        this.toast.successToastr("Something Went Wrong");
      }
    })
  }
  
  
  update_region_value(region_name,region_price){
    console.log(region_name);
    console.log(region_price);
    console.log(this.product_id);
    
    
    this.serve.fetchData({'region_price':region_price,'region_name':region_name,'product_id':this.product_id},"Product/update_region_value").subscribe((result=>{
      console.log(result);
      if(result['msg']=='success'){
        this.detailProduct();
        this.toast.successToastr("Region Price Updated !!");
      }else{
        this.toast.successToastr("Something Went Wrong");
      }
    }))
  }
  
  
  openEditDialog(value,type){
    
    console.log("openEditDialog method calls");
    
    const dialogRef = this.dialog.open(UserEmailModalComponent, {
      width: '300px',
      data:{
        value,
        type,
        product_id : this.productDetail['id'],
        category:this.category
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      this.detailProduct();
    });
  }
  insertImage(data)
  {
    this.selectedFile=[];
    let files = data.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.urls);
    console.log(data.target.files.length);
    for(var i=0; i<data.target.files.length; i++)
    {
      this.selectedFile.push(data.target.files[i]);
    }
    console.log(this.selectedFile);   
    this.Insert_Image();
  }
  
  
  Insert_Image()
  {
    this.formData=new FormData;
    for(var i=0; i<this.selectedFile.length; i++)
    {
      this.formData.append("image"+i,this.selectedFile[i],this.selectedFile[i].name);
    }
    let value={"id":this.product_id};
    console.log(this.product_id);
    this.formData.append('id',this.product_id);
    this.serve.upload_image(this.formData,"Product/add_image").subscribe((resp)=>
    {
      console.log(resp);
      if(resp)
      {
        this.alert.success("Product","Inserted");
        this.detailProduct();
        //  this.rout.navigate(['/product-list']);
      }
    });
  }
  
  deleteImage(id,index)
  {
    this.alert.delete("Image").then((result)=>{
      if(result)
      {
        console.log("hello");
        console.log(id);
        let value={'id':id}
        this.serve.fetchData(value,"Product/delete_image").subscribe((result=>{
          
          console.log(result);
          this.productDetail.image_array.splice(index,1)
        }))
      }
    })
    
    
  }
  
  editCategoryDialog(type): void 
  {
    const dialogRef = this.dialog.open(UserEmailModalComponent, {
      width: '450px',
      data:{
        'from':'product_detail_page',
        type,
        data:this.productDetail
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      this.detailProduct();
      
    });
  }
  getBrandList()
  {
    this.serve.fetchData(0,"/Product/product_brand_list/").subscribe((result)=>{
      console.log(result);
      this.brandList=result;
      
      if(this.brandList)
      {
        for(let i=0;i<this.brandList.length;i++)
        {
          for(let j=0;j<this.checkBrand.length;j++)
          {
            if(this.brandList[i]['brand_name']==this.checkBrand[j]['brand_name'])
            {
              this.brandList[i].check=true;
            }
          }
          
        }
      }
      
      // this.product_brand=this.brand_list;
    });
  }
  getProductColor()
  {
    this.serve.fetchData(0,"Product/color_list").subscribe((result=>{
      console.log(result);
      this.colorList=result['color_list'];
      
      console.log(this.checkcolor[0]['color_name']);
      
      if(this.colorList)
      {
        for(let i=0;i<this.colorList.length;i++)
        {
          for(let j=0;j<this.checkcolor.length;j++)
          {
            if(this.colorList[i]['color_name']==this.checkcolor[j]['color_name'])
            {
              this.colorList[i].check=true;
            }
          }
          
        }
      }
    }))
  }
  
  getProductExtraField()
  {
    this.serve.fetchData(0,"Product/extra_field_list").subscribe((result=>{
      console.log(result);
      this.extraDetailList=result['extra_field_list'];
      if(this.extraDetailList)
      {
        for(let i=0;i<this.extraDetailList.length;i++)
        {
          for(let j=0;j<this.checkDetail.length;j++)
          {
            if(this.extraDetailList[i]['label']==this.checkDetail[j]['extra_field_name'])
            {
              this.extraDetailList[i].check=true;
            }
          }
          
        }
      }
    }))
  }
  
  product_Brand(value,index,event)
  {
    
    if(event.checked)
    {
      this.checkBrand.push({'brand_name':value});
      console.log(this.checkBrand);
      this.serve.fetchData({"id":this.product_id ,'brand':this.checkBrand},"Product/productupdate").subscribe((result=>{
        console.log(result);
        this.toast.successToastr("changes update");
        
      }))
    }
    else
    {
      for( var j=0;j<this.checkBrand.length;j++)
      {
        
        if(this.brandList[index]['brand_name']==this.checkBrand[j]['brand_name'])
        {
          this.checkBrand.splice(j,1);
          console.log(this.checkBrand);
        }
      }
      this.serve.fetchData({"id":this.product_id ,'brand':this.checkBrand},"Product/productupdate").subscribe((result=>{
        console.log(result);
        this.toast.successToastr("changes update");
        
      }))
    }
  }
  
  product_Color(value,index,event)
  {
    if(event.checked)
    {
      this.checkcolor.push({"color_name":value});
      console.log(this.checkcolor);
      this.serve.fetchData({"id":this.product_id ,'color':this.checkcolor},"Product/productupdate").subscribe((result=>{
        console.log(result);
        this.toast.successToastr("changes update");
      }))
    }
    else
    {
      
      for( var j=0;j<this.checkcolor.length;j++)
      {
        if(this.colorList[index]['color_name']==this.checkcolor[j]['color_name'])
        {
          this.checkcolor.splice(j,1);
        }
      }
      console.log(this.checkcolor);
      this.serve.fetchData({"id":this.product_id ,'color':this.checkcolor},"Product/productupdate").subscribe((result=>{
        console.log(result);
        this.toast.successToastr("changes update");
        
      }))
    }
  }
  
  product_ExtraField(value,index,event)
  {
    console.log(value);
    
    
    if(event.checked)
    {
      this.checkDetail.push({"extra_field_name":value});
      console.log(this.checkDetail);
      this.serve.fetchData({"id":this.product_id ,'extra_field':this.checkDetail},"Product/productupdate").subscribe((result=>{
        console.log(result);
        this.toast.successToastr("changes update");
        
      }))
      
    }
    else
    {
      console.log(this.extraDetailList);
      console.log(this.checkDetail[0]);
      
      for( var j=0;j<this.checkDetail.length;j++)
      {
        if(this.extraDetailList[index]['label']==this.checkDetail[j]['extra_field_name'])
        {
          this.checkDetail.splice(j,1);
        }
      }
      console.log(this.checkDetail);
      
      this.serve.fetchData({"id":this.product_id ,'extra_field':this.checkDetail},"Product/productupdate").subscribe((result=>{
        console.log(result);
        this.toast.successToastr("changes update");
        
      }))
    }
  }
  
  open_qrCode_model()
  {
    const dialogRef = this.dialog.open(ProductQrCodeModelComponent, {
      width: '700px',
      
      data:{
        product_id : this.productDetail['id'],
        product_name : this.productDetail['product_name'],
        product_code : this.productDetail['cat_no']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      this.detailProduct();
    });
  }
  
  change_scheme_status()
  {
    const dialogRef = this.dialog.open(ChangeSchemeStatusModelComponent, {
      width: '700px',
      
      data:{
        product_id : this.productDetail['id']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
      this.detailProduct();
    });
  }
  
  scheme_data(type)
  {
    this.scheme_tab_active = type;
    
    this.serve.fetchData({"id":this.product_id,'type':type,'start':this.start,'pagelimit':this.page_limit},"Product/scheme_data").subscribe(result=>{
      console.log(result);
      this.coupon_data = result['coupon_data'];
      this.count = result['count'];
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      console.log(this.pagenumber, this.total_page);
      
      // this.tmp_productList=this.productlist;
    });
  }
  
  deleteCoupons(coupon_date)
  {
    this.dialog1.delete('Coupon Data !').then(result => {
      if(result)
      {
        this.serve.fetchData({"id":this.product_id,'coupon_date':coupon_date},"Product/delete_coupon").subscribe(result=>{
          console.log(result);
          this.scheme_data('coupons');
          this.detailProduct();
        });
      } 
    });
  }
  
  ExportCouponCode(coupon_date):void 
  {
    this.serve.fetchData({"id":this.product_id,'coupon_date':coupon_date},"Product/fetch_coupons").subscribe(result=>{
      console.log(result);
      this.qrCode_data = result;
      console.log('*** QR Code Data ***');
      console.log(this.qrCode_data);
      if(this.qrCode_data)
      {
        console.log('** Export Coupon Code **');
        this.excelservice.exportAsExcelFile(this.qrCode_data,'sample',this.productDetail.cat_no);
      }
    });
  }
  

  // not use right now
  go_to(where : any = ''){
    console.log("go_to method calls");
    if(where == 'generate_secondary_coupon_code'){
      this.rout.navigate(['/generate-secondary-packing-coupon/'],{ queryParams: { 'this.product_id' : this.product_id } });
    }
    else{
      console.log("In Else");
      console.log("where = "+where);
    }
    
  }
  
}
