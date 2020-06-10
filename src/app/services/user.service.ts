import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { MinUser } from '../models/min-user.model';
import { take } from 'rxjs/operators';
import { AdminUser } from '../models/admin-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;
  initial = 0;
  final = 0;

  constructor(
    public firestore: AngularFirestore
  ) {
    this.usersCollection = this.firestore.collection<User>('users');
  }

  async getUserByEmail(email: string) {
    let userToReturn: User = null;
    await this.firestore
      .collection('users', ref => ref.where('profile.email', '==', email))
      .get()
      .pipe(take(1))
      .toPromise()
      .then(
        usersReceived => {
          usersReceived.forEach(
            user => {
              let u = user.data() as User;
              u.id = user.id;
              userToReturn = u as User;
              return userToReturn;
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }

  async getUserAdminByEmail(email: string) {
    let userToReturn: AdminUser = null;
    await this.firestore
      .collection('users', ref => ref.where('email', '==', email))
      .get()
      .pipe(take(1))
      .toPromise()
      .then(
        usersReceived => {
          usersReceived.forEach(
            user => {
              let u = user.data() as AdminUser;
              u.id = user.id;
              userToReturn = u as AdminUser;
              return userToReturn;
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }

  async getUserByUid(uid: string) {
    let userToReturn: User;
    await this.firestore
      .collection('users', ref => ref.where('uid', '==', uid))
      .snapshotChanges()
      .pipe(take(1))
      .toPromise()
      .then(
        usersReceived => {
          usersReceived.forEach(
            user => {
              let u = user.payload.doc.data() as User;
              u.id = user.payload.doc.id;
              userToReturn = u as User;
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }

  async getUserAdminByUid(uid: string) {
    let userToReturn: AdminUser;
    await this.firestore
      .collection('users', ref => ref.where('uid', '==', uid))
      .snapshotChanges()
      .pipe(take(1))
      .toPromise()
      .then(
        usersReceived => {
          usersReceived.forEach(
            user => {
              let u = user.payload.doc.data() as AdminUser;
              u.id = user.payload.doc.id;
              userToReturn = u as AdminUser;
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }

  async getUserById(id: string) {
    let userToReturn: User;
    await this.firestore
      .doc('users/' + id)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise()
      .then(
        userReceived => {
          let u = userReceived.payload.data() as User;
          u.id = userReceived.payload.id;
          userToReturn = u as User;
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }

  async createUser(user: User) {
    delete user.id;
    let userId: string;
    await this.firestore.collection('users')
      .add(user)
      .then(
        user => {
          userId = user.id;
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userId;
  }

  async getUserImageURLById(id: string) {
    let imageURL: string;
    await this.firestore
      .doc('users/' + id)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise()
      .then(
        userReceived => {
          let u = userReceived.payload.data() as User;
          imageURL = u.profile.image;
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return imageURL;
  }

  updateUser(user: User, userId: string) {
    delete user.id;
    return this.usersCollection
      .doc(userId)
      .set(user, { merge: true });
  }

  updateUserAdmin(user: AdminUser, userId: string) {
    delete user.id;
    return this.usersCollection
      .doc(userId)
      .set(user, { merge: true });
  }

  deleteUser(userId: string) {
    return this.usersCollection
      .doc(userId)
      .delete();
  }

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

  async getUserByName(name: string, stepCompleted: number) {
    this.makeInterval(stepCompleted);
    let usersToReturn: MinUser[] = [];
    await this.firestore
      .collection('users', ref => ref
        .where('firstName', '>=', name)
        .where('firstName', '<=', name + '\uf8ff')
      )
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
              if (user.data().stepCompleted > this.initial && user.data().stepCompleted < this.final) {
                usersToReturn.push(minimum);
              }
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return usersToReturn;
  }

  async getUserByPoliza(poliza: string, stepCompleted: number) {
    this.makeInterval(stepCompleted);
    let userToReturn: MinUser = null;
    await this.firestore
      .collection('users', ref => ref
        .where('policyId', '==', poliza)
      )
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
              if (user.data().stepCompleted > this.initial && user.data().stepCompleted < this.final) {
                userToReturn = minimum;
              }
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }

  async getUserByEmailMin(email: string, stepCompleted: number) {
    this.makeInterval(stepCompleted);
    let userToReturn: MinUser = null;
    await this.firestore
      .collection('users', ref => ref
        .where('profile.email', '==', email)
      )
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
              if (user.data().stepCompleted > this.initial && user.data().stepCompleted < this.final) {
                userToReturn = minimum;
              }
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }

  async getUserByZip(zip: string, stepCompleted: number) {
    this.makeInterval(stepCompleted);
    let userToReturn: MinUser = null;
    await this.firestore
      .collection('users', ref => ref
        .where('profile.zip', '==', zip)
      )
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
              if (user.data().stepCompleted > this.initial && user.data().stepCompleted < this.final) {
                userToReturn = minimum;
              }
            });
        })
      .catch(
        error => {
          console.log('There was some error', error);
          return error;
        });
    return userToReturn;
  }
}