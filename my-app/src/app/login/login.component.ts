import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { lib } from 'crypto-js';


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
    var loginStatus = "";

    const headers = {'content-type': 'application/json'}

    const checkCredentials = this.serverConnection.post<any>('http://localhost:6060/loginCheck', {userEmail: emailGet}, {'headers':headers})
    checkCredentials.subscribe(response => {
      document.getElementById("debugStatus")!.innerHTML = JSON.stringify(response.status)
      switch(response.status){
        case 'User exists':
          this.verifyLogin(response.randomSalt)
          break
        default:
          document.getElementById("debugStatus")!.innerHTML = "Could not find a user with the given email"
      }
    })
  }

  verifyLogin(serverSalt: string){
    const headers = {'content-type': 'application/json'}

    var serverSalt = "";
    var pureHashedPassword = SHA256((<HTMLInputElement>document.getElementById("passwordInput")).value)

    var clientGeneratedSalt = lib.WordArray.random(5)
    var hashedPost = { hashedPassword: SHA256(pureHashedPassword+serverSalt+clientGeneratedSalt), clientSalt: clientGeneratedSalt}

    const req = this.serverConnection.post<any>('http://localhost:6060/loginVerify', hashedPost, {'headers':headers});
    req.subscribe(response => {
      switch (response.status){
        case 'Login successful':
          this.router.navigate(['main-component'])
          break
        case 'User does not exist':
          document.getElementById("debugStatus")!.innerHTML = "Could not find a user with the given email"
          break
        case 'Password incorrect':
          document.getElementById("debugStatus")!.innerHTML = "Wrong password"
          break
        default:
          document.getElementById("debugStatus")!.innerHTML = "False login credentials"
      }
    });
  }
}
