import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// To-do: Pass data back to main display component
export class userData {
  constructor(
    public userName: string,
    public Portfolio: string[],
  ){}
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  title = 'my-app';

  uData = [{userName: "", Portfolio: ""}];

  constructor(
    private serverConnection: HttpClient
  ){}


  ngOnInit(): void {
    var signUpBtn = document.querySelector("#margineSignup");
    signUpBtn?.addEventListener('click', this.loadServerData);
  }



  loadServerData(){
    var signUpBtn = document.querySelector("#margineSignup");
    signUpBtn!.innerHTML = "Server request";
    this.serverConnection.get<any>("http://localhost:6060/requestData?test").subscribe(
      response => {
        console.log("Data:",response);
        this.uData = response;
      }
    )}

}
