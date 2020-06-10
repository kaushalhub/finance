import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {
    this.usersCollection = this.firestore.collection<User>('users');
  }

  async uploadImage(image: any, userId: string, userProfile: any) {
    let filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(filePath);
    await this.storage.upload(filePath, image)
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          await fileRef.getDownloadURL()
            .toPromise()
            .then(async (url) => {
              userProfile.image = url;
              this.usersCollection.doc(userId).set({ 'profile': userProfile }, { merge: true });
            })
            .catch(error => console.log(error));
        })
      )
      .toPromise()
      .then()
      .catch(error => console.log(error));
  }


}
