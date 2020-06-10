import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from "@angular/fire/auth";
import { FirebaseApp } from '@angular/fire';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public router: Router,
    public firebaseAuth: AngularFireAuth,
    public firebase: FirebaseApp,
    public userService: UserService
  ) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        // if (user.emailVerified) {
        localStorage.setItem('user', JSON.stringify(user.uid));
        // } else {
        //   this.signOut();
        // }
      } else {
        this.signOut();
      }
    });
  }

  // Sign Up with email and password
  async signUp(email: string, password: string, callback) {
    let solvedUid: string;
    await this.firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(
        response => {
          solvedUid = response.user.uid;
        })
      .catch(
        error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            callback('The password is too weak.');
          } else {
            callback(errorMessage);
          }
          console.log(error);
        });
    return solvedUid as string;
  }

  // Sign In with email and password
  async signIn(email: string, password: string, callback) {
    await this.firebase.auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        // if (!response.user.emailVerified) {
        //   callback('Your account havent been verified');
        // } else {
        localStorage.setItem('user', JSON.stringify(response.user.uid));
        this.router.navigate(['/dashboard']);
        // }
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          callback('Please verify your email and password are correct');
        } else {
          callback(errorMessage);
        }
        console.log(error);
      });
  }

  // Sign Out and erase the data on the server
  async signOut() {
    await this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }

  // Send email verification to activate the account
  async sendEmailVerification(callback) {
    await this.firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        callback('We have sent a you a verification email');
      })
      .catch(function (error) {
        console.log(error);
        callback('Error occured');
      });
  }

  // Reset Password
  async sendEmailResetPassword(email: string, callback) {
    await this.firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        callback('We have sent a you an email with a link to reset your password');
      })
      .catch(function (error) {
        console.log(error);
        callback('Error occured');
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
}
