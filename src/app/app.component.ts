import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ControllerURL } from 'src/environments/controllers';
import { NavigationURL } from 'src/environments/navigation';
import { RestService } from './rest-service.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  title = 'План рейсов';
  panelOpenState = false;
  uiBlocked: boolean;

  stateOptions: any[];
  isDisplayDialogShown : boolean;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  

  constructor(private service : RestService, 
              private messageService : MessageService,
              private route:  Router,
              private config: PrimeNGConfig)
              {

   this.service.getWithError(ControllerURL.VERSION_URL).subscribe(response =>{
    console.log("Beck-end version: " + response['version']);
   }, error => {
    this.uiBlocked = true;
    messageService.add({life: 20000, closable:false, severity: 'warn', summary: 'Ошибка запроса данных', detail: " Ошибка сервера приложения\n сервер не отвечает\n" +error.message })
   });

  }
  ngOnInit(): void {
      this.config.setTranslation({
        dayNames : ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayNamesShort	: ["Вкр", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
        dayNamesMin : ["В","П","В","С","Ч","П","С"],
        monthNames:	["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
        monthNamesShort	:["Янв", "Веф", "Мар", "Апр", "Май", "Инь","Иль", "Авг", "Сен", "Окт", "Ноя", "Дек"]
    });
  }
  
  someMethod() {
    this.trigger.openMenu();
  }

  displaySettingsDialog(){
    this.isDisplayDialogShown = true;
  }
  
 
  dialogClosedEvent($event){
    console.log("dialog close event "+ $event)
    this.isDisplayDialogShown = $event;
  }

  gotoClaims(){
    this.route.navigateByUrl(NavigationURL.CLAIMS.url)
  }

  gotoRoutePlan(){
    this.route.navigateByUrl(NavigationURL.HOME.url)
  }


  goBack(){
    history.back();
  }

  goForward(){
    history.forward();
  }
}
