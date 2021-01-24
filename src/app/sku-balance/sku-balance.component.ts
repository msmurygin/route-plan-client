import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ControllerURL } from 'src/environments/controllers';
import { SkuBallanceDetail, SkuBallanceHeader, SkuStock } from '../dto/plan-route-detail-table';
import { RestService } from '../rest-service.service';

@Component({
  selector: 'sku-balance',
  templateUrl: './sku-balance.component.html',
  styleUrls: ['./sku-balance.component.css']
})
export class SkuBalanceComponent implements OnInit {

  headerDatatSourceTable : SkuBallanceHeader[] = [];
  detailDatatSourceTable : SkuBallanceDetail;
  loading                : boolean             = false;

  constructor(private route : ActivatedRoute,   private service : RestService,) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      if (params){
        let sku   =  params['sku'];
        let descr =  params['descr'];
        let pack  =  params['pack'];
        this.processQueryParamsAndLoadTableData(sku);
        console.log("SKU="+sku+", descr="+ descr+", pack="+ pack)
        this.headerDatatSourceTable = [...this.headerDatatSourceTable, {
          sku: sku, 
          descr: descr, 
          packKey: pack
        }]
      }
    });
  }


  /**
 * Обработка входящих параметров запроса
 * цепочка выозова loadDataFromRestService
 * @param params 
 */
  processQueryParamsAndLoadTableData(sku: string){ 
    this.loading = true;
    this.loadDataFromRestService(sku);
    this.loading = false;  
  }


  /**
   * Загружаем данные таблицы с api
   * @param externalLoadId - параметр для передачи рест сервису
   */
  loadDataFromRestService(sku: string): void{
    this.service.get<SkuBallanceDetail>(ControllerURL.SKU_STOCK_URL + "?sku=" + sku).subscribe(response =>{
      console.log(response)
      this.detailDatatSourceTable = response
    });
    

  }


  getDetailDataSource(): SkuStock[] {
    return this.detailDatatSourceTable ? this.detailDatatSourceTable.skuStock : [] ;
  }

}
