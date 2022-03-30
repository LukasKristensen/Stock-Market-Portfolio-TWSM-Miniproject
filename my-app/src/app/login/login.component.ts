import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// To-do: Pass data back to main display component

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent {
  title = 'my-app';

  constructor(
    private serverConnection: HttpClient
  ){}



  ngOnInit(): void {
    document.querySelector(".margineSignup")?.addEventListener("click", function(){

    })
  }

  test = document.querySelector('test');


  loginUser(){
    var emailUser = document.querySelector("#emailInput");
    var passwordUser = document.querySelector("passwordInput");

    console.log("Email:",emailUser,"Password:",passwordUser);

    this.serverConnection.get<any>("http://localhost:6060/login?"+emailUser).subscribe(
      response => {
      }
    )}
}
