import { Injectable } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PlanRouteDetailTable } from '../dto/plan-route-detail-table';
import { OrderRestService } from './Operation';

@Injectable({
  providedIn: 'root'
})
export class TableMenuContextService {
  private RELEASE_TITLE = "Выпуск";
  private RELEASE_ROUTE = "Выпустить рейс ";

  private ALLOCATE_TITLE = "Резервирование";
  private ALLOCATE_ROUTE = "Зарезервировать рейс ";

  private CLOSE_TITLE = "Закрытие";
  private CLOSE_ROUTE = "Закрыть рейс ";

  private UN_ALLOCATE_TITLE = "Разрезервирование";
  private UN_ALLOCATE_ROUTE = "Разрезервировать рейс ";

  private SHIP_TITLE = "Отгрузка";
  private SHIP_ROUTE = "отгрузить рейс ";

  private QM  = " ?";


  constructor(private confirmationService: ConfirmationService,
              private messageService : MessageService,
              private orderOperations : OrderRestService) { }

  errorMessages : Message[] = [];
    
  release(row: PlanRouteDetailTable) {
   
    this.orderCheckingRoutine(row)
    
    if (this.errorMessages.length > 0){
        this.messageService.addAll(this.errorMessages);
        this.errorMessages = [];
        return;
    }
    this.showConfirmDialog( this.RELEASE_TITLE, 
                            this.RELEASE_ROUTE + row.loadUsr2 + this.QM, 
                            () => this.orderOperations.release(row) 
                          );
 }
  
  allocate(row: PlanRouteDetailTable) {
    this.orderCheckingRoutine(row)
    if (this.errorMessages.length > 0){
        this.messageService.addAll(this.errorMessages);
        this.errorMessages = [];
        return;
    } 
    this.showConfirmDialog( this.ALLOCATE_TITLE, 
                            this.ALLOCATE_ROUTE + row.loadUsr2 + this.QM, 
                            () => this.orderOperations.allocate(row));
  }





  cancelAllocation(row: PlanRouteDetailTable){
    this.orderCheckingRoutine(row)
    if (this.errorMessages.length > 0){
        this.messageService.addAll(this.errorMessages);
        this.errorMessages = [];
        return;
    } 
    this.showConfirmDialog(this.UN_ALLOCATE_TITLE, 
                           this.UN_ALLOCATE_ROUTE + row.loadUsr2 + this.QM, 
                           () => this.orderOperations.unallocate(row));
  }



  closeRoute(row: PlanRouteDetailTable){
    this.checkIfRouteIsClosed(row)
    if (this.errorMessages.length > 0){
      this.messageService.addAll(this.errorMessages);
      this.errorMessages = [];
      return;
    }
    this.showConfirmDialog(this.CLOSE_TITLE, 
                           this.CLOSE_ROUTE + row.loadUsr2 + this.QM, 
                           () => this.orderOperations.close(row));
  }


  ship(row: PlanRouteDetailTable){
    this.checkIfRouteIsClosed(row)
    if (this.errorMessages.length > 0){
      this.messageService.addAll(this.errorMessages);
      this.errorMessages = [];
      return;
    }
    this.showConfirmDialog(this.SHIP_TITLE, 
                           this.SHIP_ROUTE + row.loadUsr2 + this.QM, 
                           () => this.orderOperations.ship(row));
  }


  pickList(row: PlanRouteDetailTable){
    this.orderOperations.picklist(row)
  }

  acceptenceAct(row: PlanRouteDetailTable){
    this.orderOperations.acceptenceact(row)
  }

  pickByPaper(row: PlanRouteDetailTable){
    this.orderOperations.pickbypaper(row)
  }

  placesWithNoMarks(row: PlanRouteDetailTable){
    this.orderOperations.placewithnomarks(row)
  }


  private orderCheckingRoutine(row: PlanRouteDetailTable): void{
    this.checkIfRouteIsClosed(row)
    this.checkIfOperationPermitted(row);
  }

  /**
   * Проверка если рейс уже закрыт
   * @param row 
   */
  checkIfRouteIsClosed (row: PlanRouteDetailTable){
    console.log( row.routeClosed );
    let routeId = row.loadUsr2;
    if ( row.routeClosed == 1){
      this.errorMessages.push({
        life: 5000, 
        closable: true, 
        severity: 'error', 
        summary: 'Ошибка', 
        detail: "Рейс "+routeId+" закрыт." 
      });
    }
  }


  /**
   * Любая операция запрещена если отобранно >=100 %
   * @param row 
   */
  checkIfOperationPermitted (row: PlanRouteDetailTable) {
    console.log( row.picked );
    if ( row.picked >= 100){
      this.errorMessages.push({
        life: 5000, 
        closable: true, 
        severity: 'error', 
        summary: 'Заблокировано', 
        detail: "Выпуск, резервирование, отмена резервирования - запрещено!" 
      });
    }
  }



  /**
   * Диалоговое окно подтверждения операции
   * @param _header 
   * @param _message 
   * @param command 
   */
  showConfirmDialog(_header: string, _message: string, command : (event?: any) => void) {
    console.log("showing confirm dialog...")
    this.confirmationService.confirm({
      message: _message,
      header: _header,
      accept: () => {
        command();
      }
  });
  }

}


