import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveUserDto } from './active-users-dto';
import { RestService } from '../rest-service.service';
import { ControllerURL } from 'src/environments/controllers';



@Component({
  selector: 'active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent {

  mulinetImage: string = "/assets/images/activeusers/mulinet.png";
  forkLiftImage: string = "/assets/images/activeusers/richtrak.png";
  radioDevicesImage : string = "/assets/images/activeusers/user_rf.png"; 
  activeUsers : ActiveUserDto;
  

  constructor(service : RestService) {
    service.get<ActiveUserDto>(ControllerURL.ACTIVE_USERS_URL).subscribe( data => this.activeUsers = {
      mulinet : (data as any).mulinet,
      forkLift : (data as any).forkLift,
      radioDevices : (data as any).radioDevices
    });
  }

}
