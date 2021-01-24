import { Component, Input, OnInit } from '@angular/core';
import { ControllerURL } from 'src/environments/controllers';
import { Settings, ShiftWorkTime } from '../dto/plan-route-detail-table';
import { RestService } from '../rest-service.service';
import { Output, EventEmitter } from '@angular/core';





@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  
  private _showDialog : boolean;

  @Output() dialogClosedEvent = new EventEmitter<boolean>();

  hideNotFinishedTask: boolean;
  showLastShiftNotFinishedTask: boolean;
  showNotFinishedTaskInPeriod: boolean;
  showAllNotFinishedTask: boolean;
  hidePlanedTasks: boolean;
  showNextShiftPlanedTasks: boolean;
  showPlanedTaskInPeriod: boolean;
  shiftWorkTime : ShiftWorkTime  = {}

  dayShiftBegin   : number;
  dayShiftEnd     : number;
  nightShiftBegin : number;
  nightShiftEnd   : number;


  constructor(private service : RestService) { }

  @Input() set showDialog(value: boolean) {
    console.log(" showDialog input param "+ value)
    this._showDialog = value;
    if (value ) this.ngOnInit()
  }

  get showDialog(): boolean{
    return this._showDialog;
  }


  ngOnInit(): void {
    this.getCurrentSettings();
  }




  getCurrentSettings(){
   this.service.get(ControllerURL.CONFIG_URL).subscribe(response => {
      this.hideNotFinishedTask          = response['hideNotFinishedTask'];
      this.showLastShiftNotFinishedTask = response['showLastShiftNotFinishedTask'];
      this.showNotFinishedTaskInPeriod  = response['showNotFinishedTaskInPeriod'];
      this.showAllNotFinishedTask       = response['showAllNotFinishedTask'];
      this.hidePlanedTasks              = response['hidePlanedTasks'];
      this.showNextShiftPlanedTasks     = response['showNextShiftPlanedTasks'];
      this.showPlanedTaskInPeriod       = response['showPlanedTaskInPeriod'];
      
      this.shiftWorkTime.dayShiftBegin    = {value: response['dayShiftBegin'],   isDirty: false }
      this.shiftWorkTime.dayShiftEnd      = {value: response['dayShiftEnd'],     isDirty: false }
      this.shiftWorkTime.nightShiftBegin  = {value: response['nightShiftBegin'], isDirty: false }
      this.shiftWorkTime.nightShiftEnd    = {value: response['nightShiftEnd'],   isDirty: false }
     
      this.dayShiftBegin    =  response['dayShiftBegin'];
      this.dayShiftEnd      =  response['dayShiftEnd'];
      this.nightShiftBegin  =  response['nightShiftBegin'];
      this.nightShiftEnd    =  response['nightShiftEnd'];
     
    });
  }

  saveSettings(){
    let body = this.createRequestBody()
    this.service.post<Settings>(ControllerURL.CONFIG_URL, body).subscribe(response =>{
      this.showDialog = false;
      this.dialogClosedEvent.emit(this.showDialog);
      this.getCurrentSettings();
    });

  }

  onHide(){
    console.log("onHide")
    this.cancel()
  }

  cancel(){
    console.log("cancel")
    this.showDialog = false;
    this.dialogClosedEvent.emit(false);
  }


  createRequestBody(): Settings {
    this.processSettingsParams();

    let body : Settings = {
      hideNotFinishedTask : this.hideNotFinishedTask,
      showLastShiftNotFinishedTask  :this.showLastShiftNotFinishedTask,
      showNotFinishedTaskInPeriod : this.showNotFinishedTaskInPeriod,
      showAllNotFinishedTask :this.showAllNotFinishedTask,
      hidePlanedTasks : this.hidePlanedTasks,
      showNextShiftPlanedTasks  :this.showNextShiftPlanedTasks,
      showPlanedTaskInPeriod : this.showPlanedTaskInPeriod,
    }
    body['dayShiftBegin']   = this.shiftWorkTime.dayShiftBegin.isDirty   ? this.shiftWorkTime.dayShiftBegin.value   : 9999;
    body['dayShiftEnd']     = this.shiftWorkTime.dayShiftEnd.isDirty     ? this.shiftWorkTime.dayShiftEnd.value     : 9999;
    body['nightShiftBegin'] = this.shiftWorkTime.nightShiftBegin.isDirty ? this.shiftWorkTime.nightShiftBegin.value : 9999;
    body['nightShiftEnd']   = this.shiftWorkTime.nightShiftEnd.isDirty   ? this.shiftWorkTime.nightShiftEnd.value   : 9999;
    return body;
  }

  processSettingsParams(): void {
    if (this.hideNotFinishedTask){
      this.showLastShiftNotFinishedTask = false;
      this.showNotFinishedTaskInPeriod= false;
      this.showAllNotFinishedTask= false;
    }
    if ( this.hidePlanedTasks){
      this.showNextShiftPlanedTasks = false;
      this.showPlanedTaskInPeriod = false;
    }
  }


  markDirty(paramName : string) {
    console.log("Input field: "+ paramName+ " marked dirty.")
    this.shiftWorkTime[paramName].isDirty = true;
    this.shiftWorkTime[paramName].value = this[paramName];
    console.log("Input field: "+ paramName+ " marked dirty, with value "+this[paramName] );
  }

  getValue (paramName : string): string {
    return this.shiftWorkTime[paramName] ?  this.shiftWorkTime[paramName].value : "";
  }





}
