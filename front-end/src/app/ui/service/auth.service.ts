import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {User} from '../../models/user.model'
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService 
{
  public user:firebase.User=null;
  private usr:User;
  endpoint = "http://127.0.0.1";
  port = 8080;
  constructor(public auth:AngularFireAuth, public router: Router, private httpClient:HttpClient ) { }
  public async login()
  {
    try{
      let provider = new firebase.auth.GoogleAuthProvider();
      await this.auth.signInWithPopup(provider);
      this.user=await this.auth.currentUser;
      await this.httpClient.post(this.endpoint+this.port+'/v1/User/Post', {
        id: this.user.uid,
        type: "",
        lastTime: new Date().getDate(),
        name: this.user.displayName,
        email: this.user.email,
        avatarURL: this.user.photoURL,
        videos: [],
        likes : [],
        dislikes: []
      }).toPromise();
      this.router.navigate(["/home"]);
  
    }catch(err){
        console.error(err)
    }
  }
  public async logout (){
    await this.auth.signOut;
    this.user = null;
  }
  
  
}
