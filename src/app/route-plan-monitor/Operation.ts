import { Inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { ControllerURL } from "src/environments/controllers";
import { PlanRouteDetailTable } from "../dto/plan-route-detail-table";
import { RestService } from "../rest-service.service";

@Injectable({
    providedIn: 'root'
})
export class OrderRestService{


    constructor(private rest : RestService, private messageService : MessageService){}

    release(body: any){
        console.log("Запуск волны");
        this.doPOST(ControllerURL.RELEASE_URL, body);
    }


    allocate(body : any){
        console.log("Резервирование заказов");
        this.doPOST(ControllerURL.ALLOCATE_URL, body);
    }


    close(_url: string, body: any){
        console.log("Закрытие заказов");
        this.doPOST(_url, body);
    }

    unallocate(body: any){
        console.log("Отмена резервирования");
        this.doPOST(ControllerURL.UNALLOCATE_ORDER_URL, body);
    }

    ship(body: any){
        console.log("Отгрузка");
        this.doPOST(ControllerURL.SHIP_ORDER_URL, body);
    }

    doPOST(url: string, body : any): void {
        this.rest.postWithError(url, body).subscribe(response => {
            if (response && response['header']){
                this.messageService.add({life: 10000, closable: true, severity: 'success', summary: response['header'], detail: response['message']});
            }
        }, error =>{
            this.messageService.add({life: 10000, closable: true, severity: 'error', summary: "Ошибка", detail: error.error.message});
        })
    }




    picklist(row: PlanRouteDetailTable){
        console.log("Комплектовочная ведомость ");
        let reportName = row.loadUsr2 == row.externalloadid ? "rep_LoadPrintCB.rptdesign" : "rep_LoadPrint.rptdesign";
        let params = "?reportName="+ reportName
            params += "&format="   + "html"
            params += "&paramName="+ "LoadId" 
        this.openReport(ControllerURL.REPORT_SERVICE_URL + params, row);
    }


    acceptenceact(row: PlanRouteDetailTable){
        console.log("Акт приема/передач ");
        let reportName = "AktPPCloadid.rptdesign";
        let params = "?reportName="+ reportName
            params += "&format="   + "pdf"
            params += "&paramName="+ "TripID" 
        this.openReport(ControllerURL.REPORT_SERVICE_URL + params, row);
    }

    pickbypaper(row: PlanRouteDetailTable){
        console.log("Сборка по бумаге");
        let reportName = "rep_SelectionSheet.rptdesign";
        let params = "?reportName="+ reportName
            params += "&format="   + "pdf"
            params += "&paramName="+ "ID" 
        this.openReport(ControllerURL.REPORT_SERVICE_URL + params, row);
    }

    placewithnomarks(row: PlanRouteDetailTable){
        console.log("Места без отметки");
        let reportName = "rep_place_without.rptdesign";
        let params = "?reportName="+ reportName
            params += "&format="   + "html"
            params += "&paramName="+ "loadid" 
        this.openReport(ControllerURL.REPORT_SERVICE_URL + params, row);
    }


    openReport(url: string, row : PlanRouteDetailTable): void {
        let result : string;
        this.rest.post(url, {loadUsr2: row.loadUsr2, externalLoadId: row.externalloadid }).subscribe(response => {
            if (response && response['url']){
                window.open(response['url']);
            }
        })
    }


  
}