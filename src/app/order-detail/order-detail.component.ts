import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { ControllerURL } from 'src/environments/controllers';
import { NavigationURL } from 'src/environments/navigation';
import { OrderDetailTable } from '../dto/plan-route-detail-table';
import { RestService } from '../rest-service.service';

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  loading               : boolean = false;
  orderDetailDataSource : OrderDetailTable[]
  title                 : string = "";
  navi                  = NavigationURL;
  constructor(private route : ActivatedRoute,   private service : RestService,) { }
  
  
  ngOnDestroy(): void {}
  ngOnInit(): void {
    let externalOrderKey2    : string;
    let orderKey             : string;
    this.route.queryParams.subscribe(params =>{
      if (params){
        orderKey                 =  params['orderKey'];
        externalOrderKey2        =  params['externalOrderKey2'];
        this.processQueryParamsAndLoadTableData(params);
      }
    });
  }

  /**
 * Обработка входящих параметров запроса
 * цепочка выозова loadDataFromRestService
 * @param params 
 */
  processQueryParamsAndLoadTableData(params: Params){
    if (params){
      if (params['orderKey']) {
        this.loading = true;
        this.loadDataFromRestService(params['orderKey']);
        this.loading = false;  
      }
    }
  }

  /**
   * Загружаем данные таблицы с api
   * @param externalLoadId - параметр для передачи рест сервису
   */
  loadDataFromRestService(orderKey: string): void{
    this.loading = true;
    this.service.get<OrderDetailTable>(ControllerURL.ORDER_DETAIL_URL + "?orderKey=" + orderKey).subscribe(response =>{
      this.loading = false; 
      this.orderDetailDataSource = response['orderDetail'];
      this.title = "Детали заказа на отгрузку " + orderKey
    });
  }


}
