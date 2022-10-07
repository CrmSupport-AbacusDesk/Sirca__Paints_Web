import { Component, OnInit, Renderer2 } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from '../../pearl.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  animations: [slideToTop()]
})
export class AddProductComponent implements OnInit {
    brand_list:any=[];
    category_list:any=[];
    subCategory_list:any=[];
    data:any={};
    cat_list:any=[];
    feature:any={};
    image:any=[];
    feature_cart=[];
    product_img:any={};
    image_cart:File[]=[];
    type;
    value:any=[];
    tmp_category:any=[];
    product_brand=[];
    selectedFile=[];
    Isvalid:any;
    color_list:any=[];
    brand:any=[];
    color:any=[];
    extra_field:any=[];
    extra_field_list:any=[];
    loader:any;
    login_user : any;
    login_id : any;

  constructor(private renderer: Renderer2,public serve:PearlService,public rout:Router,public dialog:DialogComponent) {
      this.getBrandList();
      this.getCategoryList();
      this.getProductColor();
      this.getProductExtraField();
      this.getstate_price_list();

      this.login_user = JSON.parse(sessionStorage.getItem('login'));
    
      this.login_id = parseInt(this.login_user['data']['id']);
   }

   formData=new FormData();
  ngOnInit() {
  }

  active:any = {};
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
  getstate_price_list(){
    this.serve.fetchData(0,"/Product/state_price/").subscribe((result)=>{
      console.log(result);
      this.data.region=result;
      // this.product_brand=this.brand_list;
    });
  }

  status:boolean = false;
  toggleHeader() {
      this.status = !this.status;
      if(this.status) {
          this.renderer.addClass(document.body, 'nav-active');
      }
      else {
          this.renderer.removeClass(document.body, 'nav-active');
      }
  }
  getBrandList()
  {
    this.serve.fetchData(0,"/Product/product_brand_list/").subscribe((result)=>{
    console.log(result);
    this.brand_list=result;
    this.product_brand=this.brand_list;
  });
  }

  // brand;
  category;
  getCategoryList()
  {
    this.serve.fetchData(0,"Product/product_category_list").subscribe((result)=>{
    console.log(result);
    this.category_list=result['category'];
    this.tmp_category=this.category_list;
  });
  }

  getSubCategoryList()
  {
    this.category=this.data.category;
    let value={"category":this.category};
    console.log(value);
    
    this.serve.fetchData(value,"Product/product_sub_category_list").subscribe((result)=>{
    console.log(result);
    this.subCategory_list=result['sub_category'];
  });
  }

  getProductColor()
  {
    this.serve.fetchData(0,"Product/color_list").subscribe((result=>{
      console.log(result);
      this.color_list=result['color_list'];
    }))
  }

  getProductExtraField()
  {
    this.serve.fetchData(0,"Product/extra_field_list").subscribe((result=>{
        console.log(result);
        this.extra_field_list=result['extra_field_list'];
      }))
  }

 
  feature_list:any=[];

  imageSrc: any={};
  urls=new Array<string>();
  insertImage(data)
  {
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
  }
 i:any=0; 
  Insert_product()
  {
console.log(this.data);

this.loader = true;



  for(let i=0;i<this.data.region.length;i++){
    for(let j=0;j<this.data.region[i].state.length;j++){
      if(!this.data.region[i].state[j].price){
        this.data.region[i].state[j].price=0;
      }
    }
  }
  for( let i=0;i<this.data.region.length;i++){
    if(this.data.region[i].price){
      for(let j=0;j<this.data.region[i].state.length;j++){
        this.data.region[i].state[j].price = this.data.region[i].price;
      console.log(this.data.region[i].price);
      console.log(this.data.region[i].state[j].price);
      }
    }
  }
  console.log(this.data);


    //  console.log(this.data);
    if(this.data.flag==true)
    {
      this.data.flag=1;
    }
    
     this.data.brand=this.brand;
     this.data.color=this.color;
     this.data.extra_field=this.extra_field;
     console.log(this.data);
     this.data.created_by = this.login_id
     
     this.loader = true;
     
     this.serve.fetchData(this.data,"Product/add_product").subscribe((result)=>{

      this.loader = false;

      console.log(result);
      let id=result['insert_product'];
      for(var i=0; i<this.selectedFile.length; i++)
      {
          this.formData.append("image"+i,this.selectedFile[i],this.selectedFile[i].name);
      }
      
      this.formData.append('id',id);

      if(this.selectedFile && this.selectedFile.length > 0) {

              this.loader = true;

              this.serve.upload_image(this.formData,"Product/add_image").subscribe((resp)=>
              {
        
                    this.loader = false;
                    
                    console.log(resp);
                    if(resp)
                    {
        
                      this.dialog.success("Product","Inserted");
                      this.rout.navigate(['/product-list']);
                    }
              });

      } else {

        this.dialog.success("Product","Inserted");
        this.rout.navigate(['/product-list']);
      }

      
     })

  }
  
    // remove_feature(index:any) 
    // {

    // console.log(index);
    
    // this.feature_cart.splice(index,1);
    
    // console.log(this.feature_cart);
    
    // }   

    product_Brand(value,index,event)
    {
      if(event.checked)
      {
        this.brand.push(value);
        console.log(this.brand);
        
      }
      else
      {
            for( var j=0;j<this.brand_list.length;j++)
            {
              if(this.brand_list[index]['brand_name']==this.brand[j])
              {
                this.brand.splice(j,1);
              }
            }
          console.log(this.brand);
      }
      
      
    }
    product_Color(value,index,event)
    {
      if(event.checked)
      {
        this.color.push(value['color_name']);
        console.log(this.color);
        
      }
      else
      {
        console.log(index);
        console.log(this.color[0]);
        
            for( var j=0;j<this.color_list.length;j++)
            {
              if(this.color_list[index]['color_name']==this.color[j])
              {
                this.color.splice(j,1);
              }
            }
          console.log(this.color);
      }
    }

    product_ExtraField(value,index,event)
    {
      if(event.checked)
      {
        this.extra_field.push(value['label']);
        console.log(this.extra_field);
        
      }
      else
      {
            for( var j=0;j<this.extra_field_list.length;j++)
            {
              if(this.extra_field_list[index]['label']==this.extra_field[j])
              {
                this.extra_field.splice(j,1);
              }
            }
          console.log(this.extra_field);
      }
    }

    delete_img(index:any)
    {
        console.log(index);
        this.urls.splice(index,1)
    }
    new_array=[];
    filter(search_word,search_array)
    {
      this.new_array=[];
      for(var i=0; i<search_array.length; i++)
      {
        if(search_array[i].toUpperCase().search(search_word) !==-1)
        {
          this.new_array.push(search_array[i]);
        }
      }
      return this.new_array;
    }

  brand_array_filter(data,array)
  {
    console.log(data);
    
    this.brand_list=this.filter(data.toUpperCase(),array);
  }
  
  category_array_filter(data,array)
  {
    this.category_list=this.filter(data.toUpperCase(),array);
  }
  sub_categoryy_array_filter(data,array)
  {
    this.subCategory_list=this.filter(data.toUpperCase(),array);
  }


  check_product_code()
  {
        console.log(this.data.cat_no);


        if(this.brand.length == 0) {

          this.dialog.error("Please Select Brand");

           return;
             
        }

        // this.loader = true;
        
        this.serve.fetchData({"cat_no":this.data.cat_no},"Product/check_product_code").subscribe((result=>{

            console.log(result);

            this.loader = false;

            if(result['check_product_code']!='Valid')
            {
                this.dialog.error("Product Code Already Exist");
            } else {

                 this.Insert_product();
            }
          
        }))
  }
}
