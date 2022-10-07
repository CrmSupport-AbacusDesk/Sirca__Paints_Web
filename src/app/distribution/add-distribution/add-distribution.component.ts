import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { PearlService } from 'src/app/pearl.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Observable} from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-add-distribution',
    templateUrl: './add-distribution.component.html',
    animations: [slideToTop()]
})
export class AddDistributionComponent implements OnInit {
    state_list:any=[];
    countryList :any=[];
    district_list:any=[];
    city_list:any=[];
    pinCode_list:any=[];
    data:any={};
    contact_person={};
    asmList:any=[];
    assignUserList=[];
    assignUserId=[];
    dr_type:any;
    brand_list:any=[];
    
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    searchMoviesCtrl = new FormControl();
    
    filter_data: any;
    isLoading = false;
    errorMsg: string;
    login_user : any;
    login_id : any;
    
    constructor(public serve:PearlService,public rout:Router,public route:ActivatedRoute, private http: HttpClient) {
        this.route.params.subscribe( params => {
            console.log(params);
            this.dr_type = params.type;
            console.log(this.dr_type);
            
        });
        
        this.login_user = JSON.parse(sessionStorage.getItem('login'));
        
        this.login_id = parseInt(this.login_user['data']['id']);
        // this.getStateList();
        this.salesUserLIst();
        this.getCountryList();
        this.getStateList();
        this.getBrandList();
        
    }
    
    ngOnInit() {
        this.searchMoviesCtrl.valueChanges
        .pipe(
            debounceTime(500),
            tap(() => {
                this.errorMsg = "";
                this.filter_data = [];
                this.isLoading = true;
                console.log("DD");
                
            }),
            switchMap(value => this.http.post(this.serve.dbUrl+"cp_suggestive/get_result",{'value':value })
            .pipe(finalize(() => {
                this.isLoading = false
            }),)))
            .subscribe(data => {
                console.log(data);
                
                if (data['res'] == undefined) {
                    this.errorMsg = data['Error'];
                    this.filter_data = [];
                } else {
                    this.errorMsg = "";
                    this.filter_data = data['res'];
                }
                
                console.log(this.filter_data);
            });
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
            this.salesUserLIst();
            // key = '';
        }
        
        submit:any=true;
        
        submitDetail()
        {
            this.data.brand= this.brand;
            this.data.company_name = this.searchMoviesCtrl.value;
            console.log(this.data);
            this.data.sales_executive = this.ass_user;this.data
            console.log(this.data);
            if(this.submit && !this.exist)
            {
                this.serve.fetchData({"data":this.data,'type':this.dr_type,'created_by':this.login_id},"Distributors/distributors_add")
                .subscribe((result=>{
                    console.log(result['distributors_add']['last_id']);
                    console.log(this.dr_type);
                    if(this.dr_type==1){
                        this.rout.navigate(['/distribution-detail/'+result['distributors_add']['last_id']]);
                    }
                    if(this.dr_type==3){
                        this.rout.navigate(['/dealer']);
                    }
                    if(this.dr_type==7){
                        this.rout.navigate(['/direct-dealer']);
                    }
                }));
                this.submit = false;
            }
            
        }
        MobileNumber(event: any) 
        {
            console.log(event);
            
            const pattern = /[0-9\+\-\ ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) 
            {event.preventDefault(); }
        }
        
        exist:boolean=false;
        check_number()
        {
            console.log(this.data.mobile.length);
            if(this.data.mobile.length == 10)
            {
                this.serve.fetchData({"mobile":this.data.mobile},"Distributors/check_dr")
                .subscribe((result=>{
                    console.log(result);
                    if(result['exists'])
                    {
                        this.exist = true;
                    }
                    else
                    {
                        this.exist = false;
                    }
                }))
            }
        }
        
        tmp_drlist:any=[];
        
        salesUserLIst()
        {
            console.log("hello");
            this.serve.fetchData({'state':0},"User/active_sales_user_list").subscribe((result=>{
                console.log(result);
                this.asmList=result['sales_user_list'];
                
                this.tmp_userList = this.asmList;
            }))
        }
        tmp_userList:any=[];
        
        search:any={};
        tmpsearch:any={};
        getItemsList(search)
        {
            console.log(search);
            
            this.asmList=[];
            for(var i=0;i<this.tmp_userList.length; i++)
            {
                search=search.toLowerCase();
                this.tmpsearch=this.tmp_userList[i]['name'].toLowerCase();
                if(this.tmpsearch.includes(search))
                {
                    this.asmList.push(this.tmp_userList[i]);
                }     
            }    
            console.log(this.asmList);
            
        }
        assign_to_distributor(id,index,e)
        {
            
            if(e.checked)
            {
                this.assignUserId.push(id);
                console.log(this.assignUserId);
                this.assignUserList.push(this.asmList[index]);
                console.log(this.assignUserList);
            }
            else
            {
                console.log(this.asmList);
                console.log(index);
                var index_val = index;
                for( var j=0;j<this.assignUserId.length;j++)
                {
                    if(this.asmList[index].id==this.assignUserId[j])
                    {
                        this.assignUserId.splice(j,1);
                        this.removeUser(j);
                    }
                }
                console.log(this.assignUserId);
            }
        }
        
        removeUser(index)
        {
            this.assignUserList.splice(index,1);
            // this.assignUserId.splice(index,1);
        }
        
        getCountryList()
        {
            console.log("addUser");
            this.serve.fetchData(0,"User/country_list").subscribe((response=>{
                console.log(response);  
                this.countryList=response['query']['country_name'];
                console.log(this.countryList);
            }));
            
        }
        
        getStateList()
        {
            console.log("addUser");
            this.serve.fetchData(0,"User/state_user_list").subscribe((response=>{
                console.log(response);  
                this.state_list=response['query']['state_name'];
                console.log(this.state_list);
            }));
            
        }
        getDistrict()
        {
            console.log(this.data.state);
            this.serve.fetchData(this.data.state,"User/district_user_list").subscribe((response=>{
                // console.log(response);
                this.district_list=response['query']['district_name'];
                console.log(this.district_list);
                
            }));
            
        }
        
        getCityList()
        {
            console.log(this.data.district);
            let value={"state":this.data.state,"district":this.data.district}
            this.serve.fetchData(value,"User/city_user_list").subscribe((response=>{
                console.log(response);
                this.city_list=response['query']['city'];
                console.log(this.city_list);
                
            }));
        }
        
        getPinCodeList()
        {
            console.log(this.data.state,this.data.city,this.data.district);
            let value={"state":this.data.state,"district":this.data.district,"city":this.data.city}
            this.serve.fetchData(value,"User/pincode_user_list").subscribe((response=>{
                console.log(response);
                this.pinCode_list=response['query']['pincode'];
                console.log(this.pinCode_list);
                
            }));
        }
        rsm:any=[];
        ass_user:any=[];
        user_assign_check(value,index,event){
            console.log(value,index,event);
            
            {
                if(event.checked)
                {
                    this.rsm.push(value);
                    console.log(this.rsm);
                    
                }
                else
                {
                    for( var j=0;j<this.asmList.length;j++)
                    {
                        if(this.asmList[index]['id']==this.rsm[j])
                        {
                            this.rsm.splice(j,1);
                        }
                    }
                    console.log(this.rsm);
                }
                this.ass_user =  this.rsm
                
            }
            
        }
        getBrandList()
        {
            this.serve.fetchData(0,"/Product/product_brand_list/").subscribe((result)=>{
                console.log(result);
                this.brand_list=result;
                // this.product_brand=this.brand_list;
            });
        }
        brand:any=[];
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
    }
    