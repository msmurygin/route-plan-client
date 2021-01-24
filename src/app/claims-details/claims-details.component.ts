import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControllerURL } from 'src/environments/controllers';
import { NavigationURL } from 'src/environments/navigation';
import { IClaims, ISkuClaims } from '../claims/claims.component';
import { RestService } from '../rest-service.service';
import { IClaimsSkuDetailBody } from '../sku-claims-detail/sku-claims-detail.component';

const head = [['ID', 'Country', 'Index', 'Capital']]

export interface IClaimsDetailBody{
  claimsNumber: string;
}

export interface IClaimsDetailResponse{
  serialKey : number;
  externOrderKey: string;
  sku: string;
  descr: string;
  qtyPicked: number;
  qtyFact: number;
  sumPrice: number;
  viewClaims: string;
  commentIn: string;
  whoseFault: string;
  reason: string;
  response: string;
  guiltyPick: string;
  guiltyStoreKeeper: string;
  guiltyController: string;
  auditor: string;
  mayChange: string;
}

@Component({
  selector: 'app-claims-details',
  templateUrl: './claims-details.component.html',
  styleUrls: ['./claims-details.component.css']
})
export class ClaimsDetailsComponent implements OnInit {
  claimsNumber           : string;
  addDate                : Date;
  dateOfArrival          : Date;
  client                 : string;
  totalRecords           : number;
  claimsDetailDataSource : IClaimsDetailResponse    [] = [];
  loading                : boolean  = false;
  NAVIGATION             : any      = NavigationURL;

  constructor(private route : ActivatedRoute, private service : RestService, private router : Router ) { }
  
  

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      if (params){
        this.claimsNumber =  params['claimsNumber'];
        this.addDate      =  params['addDate'];
        this.dateOfArrival=  params['dateOfArrival'];
        this.client       =  params['client'];

        this.loadClaimsDetailData();
      }
    });
  }


  loadClaimsDetailData(){
    this.loading = true;
    let body : IClaimsDetailBody = this.createBody();
    this.service.post<IClaimsDetailBody[]>(ControllerURL.CLAIMS_DETAIL_SERVICE_URL, body).subscribe(data =>{
      if (data){
        this.claimsDetailDataSource = data['claimsDetails'];
        this.totalRecords = this.claimsDetailDataSource.length;
      }
      this.loading = false;
    });
  }
  createBody(): any{
    let body : IClaimsDetailBody = {
        claimsNumber : this.claimsNumber 
    }
    console.log(body)
    return body;
  }


  print() {
    window.print();
  }

  createTask() {
    this.loading = true;
    let body : IClaimsSkuDetailBody = this.createBody();
    this.service.post<IClaimsSkuDetailBody[]>(ControllerURL.CREATE_INV_TASK_SERVICE_URL, body).subscribe(data =>{
      console.log(data);
      this.loading = false;
    });
  }

  getData(): void {
    this.router.navigate([NavigationURL.CLAIMS_DETAIL_BY_SKU.url], {queryParams: {claimsNumber: this.claimsNumber } })
  }

  sendToHost(): void{
    this.loading = true;
    let body : IClaimsSkuDetailBody = this.createBody();
    this.service.post<IClaimsSkuDetailBody[]>(ControllerURL.SEND_TO_HOST_SERVICE_URL, body).subscribe(data =>{
      console.log(data);
      this.loading = false;
    });
  }
}
