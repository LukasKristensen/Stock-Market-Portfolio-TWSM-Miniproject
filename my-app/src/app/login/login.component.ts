import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';

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
    var encryptPassword = SHA256((<HTMLInputElement>document.getElementById("passwordInput")).value)

    const headers = {'content-type': 'application/json'}
    const bodyPost = {userEmail: emailGet, userPassword: encryptPassword.toString()};

    const req = this.serverConnection.post('http://localhost:6060/signUp', bodyPost, {'headers':headers});
    req.subscribe(data => {});
  }

  login(){
    var emailGet = (<HTMLInputElement>document.getElementById("emailInput")).value;
    var encryptPassword = SHA256((<HTMLInputElement>document.getElementById("passwordInput")).value)

    const headers = {'content-type': 'application/json'}
    const bodyPost = {userEmail: emailGet, userPassword: encryptPassword.toString()};

    const req = this.serverConnection.post<any>('http://localhost:6060/login', bodyPost, {'headers':headers});
    req.subscribe(response => {
      switch (response.status){
        case 'User found':
          this.router.navigate(['main-component'])
          break
        case 'User does not exist':
          document.getElementById("debugStatus")!.innerHTML = "Could not find a user with the given email"
          break
        case 'Wrong password':
          document.getElementById("debugStatus")!.innerHTML = "Wrong password"
          break
        default:
          document.getElementById("debugStatus")!.innerHTML = "False login credentials"
      }
    });
  }
}
