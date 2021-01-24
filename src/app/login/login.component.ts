import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: string;
  pass : string;
  constructor(private userService : UserService) { }

  ngOnInit(): void {
  }

  onLogin(){
    console.log(this.login + " "+ this.pass)
    this.userService.logIn(this.login, this.pass)
  }

}
