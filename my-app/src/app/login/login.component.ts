import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { lib } from 'crypto-js';


// Future Implementation: Check if username is valid by checking if characters match email

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

    var regexMail = new RegExp('[a-z0-9]+@[a-z]+[.]+[a-z0-9]')

    if (!regexMail.test(emailGet)){
      document.getElementById("debugStatus")!.innerHTML = "Invalid email input"
      document.getElementById("feedbackStatus")!.innerHTML = ""
      return
    }

    else if (((<HTMLInputElement>document.getElementById("passwordInput")).value.length) == 0){
      document.getElementById("debugStatus")!.innerHTML = "Input a password"
      document.getElementById("feedbackStatus")!.innerHTML = ""
      return
    }

    const headers = {'content-type': 'application/json'}
    const bodyPost = {userEmail: emailGet, userPassword: encryptPassword.toString()};

    const req = this.serverConnection.post<any>('http://localhost:6060/signUp', bodyPost, {'headers':headers});
    req.subscribe(response => {
      switch (response.status){
        case 'Created account':
          document.getElementById("debugStatus")!.innerHTML = " "
          document.getElementById("feedbackStatus")!.innerHTML = "Account created!"
          break;
        default:
          document.getElementById("debugStatus")!.innerHTML = "Email already linked to an existing account"
          document.getElementById("feedbackStatus")!.innerHTML = " "
      }
    });
  }

  login(){
    var emailGet = (<HTMLInputElement>document.getElementById("emailInput")).value;

    const headers = {'content-type': 'application/json'}

    const checkCredentials = this.serverConnection.post<any>('http://localhost:6060/loginCheck', {userEmail: emailGet}, {'headers':headers})
    checkCredentials.subscribe(response => {
      switch(response.status){
        case 'User exists':
          this.verifyLogin(response.randomSalt)
          break
        default:
          document.getElementById("debugStatus")!.innerHTML = "Could not find a user with the given email"
          document.getElementById("feedbackStatus")!.innerHTML = " "
      }
    })
  }

  verifyLogin(serverSalt: string){
    const headers = {'content-type': 'application/json'}

    var emailGet = (<HTMLInputElement>document.getElementById("emailInput")).value;
    var pureHashedPassword = SHA256((<HTMLInputElement>document.getElementById("passwordInput")).value)

    var clientGeneratedSalt = lib.WordArray.random(5).toString()
    var hashedPost = {userEmail:emailGet, hashedPassword: SHA256(pureHashedPassword+serverSalt+clientGeneratedSalt).toString(), clientSalt: clientGeneratedSalt}

    const req = this.serverConnection.post<any>('http://localhost:6060/loginVerify', hashedPost, {'headers':headers});
    req.subscribe(response => {
      switch (response.status){
        case 'Login successful':
          localStorage.setItem('email', emailGet)
          this.router.navigate(['main-component'])
          break
        case 'User does not exist':
          document.getElementById("debugStatus")!.innerHTML = "Could not find a user with the given email"
          document.getElementById("feedbackStatus")!.innerHTML = " "
          break
        case 'Password incorrect':
          document.getElementById("debugStatus")!.innerHTML = "Wrong password"
          document.getElementById("feedbackStatus")!.innerHTML = " "
          break
        default:
          document.getElementById("debugStatus")!.innerHTML = "False login credentials"
          document.getElementById("feedbackStatus")!.innerHTML = " "
      }
    });
  }

  guest(){
      localStorage.setItem("email","guest")
      this.router.navigate(['main-component'])
  }
}
