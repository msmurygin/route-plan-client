import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControllerURL } from 'src/environments/controllers';
import { RestService } from '../rest-service.service';

export interface IClaimsSkuDetailBody{
  claimsNumber: string;
  sku         : string;
}
export interface IClaimsSkuDetailDataSource{
  id : number;
  sku: string;
  descr: string;
  loca: string;
  qty: number;
  tdQty: number;
  result: string;
  tdStatus: string;
  tdDate: Date;
  auditor: string;
  reason: string;
}

@Component({
  selector: 'sku-claims-detail',
  templateUrl: './sku-claims-detail.component.html',
  styleUrls: ['./sku-claims-detail.component.css']
})
export class SkuClaimsDetailComponent implements OnInit {
  loading                : boolean  = false;
  totalRecords           : number;
  claimsNumber           : string;
  sku                    : string;
  skuClaimsDetailDS      : IClaimsSkuDetailDataSource[] = [];

  constructor(private route : ActivatedRoute, private service : RestService, ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      if (params){
        this.claimsNumber =  params['claimsNumber'];
        this.sku          =  params['sku'];

        this.loadData();
      }
    });
  }

  loadData(){
    this.loading = true;
    let body : IClaimsSkuDetailBody = this.createBody();
    this.service.post<IClaimsSkuDetailBody[]>(ControllerURL.CLAIMS_SKU_DETAIL_SERVICE_URL, body).subscribe(data =>{
      if (data){
        console.log(data);
        this.skuClaimsDetailDS = data['claimsSkuDetail'];
        this.totalRecords = this.skuClaimsDetailDS.length;
      }
      this.loading = false;
    });
  }
  createBody(): IClaimsSkuDetailBody {
    let body : IClaimsSkuDetailBody = {
      claimsNumber : this.claimsNumber,
      sku : this.sku
    }
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
}
