import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent{
  title = 'my-app';

  constructor(
    private serverConnection: HttpClient,
    private router: Router
  ){}


  signUp(){
    var emailGet = (<HTMLInputElement>document.getElementById("emailInput")).value;
    var passwordGet = (<HTMLInputElement>document.getElementById("passwordInput")).value;

    // ENCRYPT DATA
    const headers = {'content-type': 'application/json'}
    const bodyPost = {userEmail: emailGet, userPassword: passwordGet};

    const req = this.serverConnection.post('http://localhost:6060/signUp', bodyPost, {'headers':headers});
    req.subscribe(data => {});
  }

  login(){
    var emailGet = (<HTMLInputElement>document.getElementById("emailInput")).value;
    var passwordGet = (<HTMLInputElement>document.getElementById("passwordInput")).value;

    // ENCRYPT DATA
    const headers = {'content-type': 'application/json'}
    const bodyPost = {userEmail: emailGet, userPassword: passwordGet};

    const req = this.serverConnection.post<any>('http://localhost:6060/login', bodyPost, {'headers':headers});
    req.subscribe(response => {
      if (response.status == "User found"){
        this.router.navigate(['main-component'])
      }
    });
  }
}
