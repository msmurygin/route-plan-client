import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationURL } from 'src/environments/navigation';
import { AuthService } from './auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm= this.formBuilder.group({
    username: '',
    pwd: ''
  });


  username: string;
  pwd: string;
  errorMessage = 'Ошибка входа в систему';
  successMessage: string;
  invalidLogin = false;
  loginSuccess = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthService,
              private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
  }

  handleLogin(): void {
    this.authenticationService.authenticationService(this.loginForm.controls['username'].value, this.loginForm.controls['pwd'].value).subscribe((result) => {
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.successMessage = 'Login Successful.';
      this.router.navigate([NavigationURL.PLAN_ROUTE.name]);
    }, () => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });
  }

}
