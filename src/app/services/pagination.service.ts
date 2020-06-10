import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MinUser } from '../models/min-user.model';
import { take } from 'rxjs/operators';

interface QueryConfig {
  path: string, //  path to collection
  field: string, // field to orderBy
  limit: number, // limit per query
  reverse: boolean, // reverse order?
  prepend: boolean // prepend to source?
}

@Injectable({
  providedIn: 'root'
})

export class PaginationService {
  private query: QueryConfig = {
    path: 'users', //  path to collection
    field: 'type', // field to orderBy
    limit: 10, // limit per query
    reverse: false, // reverse order?
    prepend: false // prepend to source?
  };

  initial = 0;
  final = 0;

  constructor(
    public firestore: AngularFirestore
  ) { }

  makeInterval(stepCompleted: number) {
    if (stepCompleted === 5) {
      this.initial = 4;
      this.final = 6;
    }
    if (stepCompleted < 5 && stepCompleted > 1) {
      this.initial = 1;
      this.final = 5;
    }
    if (stepCompleted === 1) {
      this.initial = 0;
      this.final = 2;
    }
  }

  async init(stepCompleted: number, limit=this.query.limit) {
    this.makeInterval(stepCompleted);
    let UsersReturn: MinUser[] = [];
    await this.firestore
      .collection(this.query.path, ref =>
        ref
          .where('stepCompleted', '>', this.initial)
          .where('stepCompleted', '<', this.final)
          .orderBy('stepCompleted', this.query.reverse ? 'asc' : 'desc')
          .limit(limit))
      .get()
      .pipe(take(1))
      .toPromise()
      .then(
        usersReceived => {
          usersReceived.forEach(
            user => {
              let minimum: MinUser = {
                id: '',
                firstName: '',
                lastName: '',
                policyId: '',
                approvedAt: '',
                email: '',
                startDate: '',
                createdAt: '',
                dateOfBirth: '',
                zip: '',
                state: '',
                coverageAmount: 0,
              };
              minimum.firstName = user.data().firstName;
              minimum.lastName = user.data().lastName;
              minimum.policyId = user.data().policyId;
              minimum.approvedAt = user.data().approvedAt;
              minimum.email = user.data().profile.email;
              minimum.dateOfBirth = user.data().profile.dateOfBirth;
              minimum.zip = user.data().profile.zip;
              minimum.state = user.data().profile.state;
              minimum.coverageAmount = user.data().coverageAmount;
              minimum.startDate = user.data().startDate;
              minimum.createdAt = user.data().createdAt;
              minimum.id = user.id;
              UsersReturn.push(minimum);
            });
        });
    return UsersReturn;
  }

  // // Retrieves additional data from firestore
  async more(stepCompleted: number, cursor: number) {
    this.makeInterval(stepCompleted);
    let UsersReturn: MinUser[] = [];
    await this.firestore
      .collection(this.query.path, ref =>
        ref
          .where('stepCompleted', '>', this.initial)
          .where('stepCompleted', '<', this.final)
          .orderBy('stepCompleted', this.query.reverse ? 'asc' : 'desc')
          .limit(cursor * this.query.limit))
      .get()
      .pipe(take(1))
      .toPromise()
      .then(
        usersReceived => {
          let index = 0;
          usersReceived.forEach(
            user => {
              if (index > ((cursor - 1) * this.query.limit) - 1) {
                let minimum: MinUser = {
                  id: '',
                  firstName: '',
                  lastName: '',
                  policyId: '',
                  approvedAt: '',
                  email: '',
                  startDate: '',
                  createdAt: '',
                  dateOfBirth: '',
                  zip: '',
                  state: '',
                  coverageAmount: 0,
                };
                minimum.firstName = user.data().firstName;
                minimum.lastName = user.data().lastName;
                minimum.policyId = user.data().policyId;
                minimum.approvedAt = user.data().approvedAt;
                minimum.email = user.data().profile.email;
                minimum.dateOfBirth = user.data().profile.dateOfBirth;
                minimum.zip = user.data().profile.zip;
                minimum.state = user.data().profile.state;
                minimum.coverageAmount = user.data().coverageAmount;
                minimum.startDate = user.data().startDate;
                minimum.createdAt = user.data().createdAt;
                minimum.id = user.id;
                UsersReturn.push(minimum);
              }
              index += 1;
            });
        });
    return UsersReturn;
  }

}