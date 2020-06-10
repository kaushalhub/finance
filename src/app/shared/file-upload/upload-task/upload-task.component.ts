import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import * as firebase from 'firebase';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;
  @Input() selectedUser: User;

  @Output() fileUploaded = new EventEmitter<any>();

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;

  downloadURL: string;

  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) { 
    this.usersCollection = this.firestore.collection<User>('users');
  }

  ngOnInit(): void {
    this.startUpload();
  }

  startUpload() {
    const path = `documents/${this.selectedUser.id}/${new Date().getTime()}_${this.file.name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, this.file);

    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        const userRef = firebase.firestore().collection('users').doc(this.selectedUser.id);
        const transaction = firebase.firestore().runTransaction((t) => {
          return t.get(userRef).then((doc) => {
            // doc doesn't exist; can't update
            if (!doc.exists) return;
            // update the documents array after getting it from Firestore.
            const newDocsArray = [...doc.data().documents];
            newDocsArray.push({
              name: this.file.name,
              downloadURL: this.downloadURL
            });
            t.set(userRef, { documents: newDocsArray }, { merge: true });
          });
        })
        .then(() => {
          this.fileUploaded.emit({
            name: this.file.name,
            downloadURL: this.downloadURL
          });
        })
        .catch((e) => {
          console.log(e)
        });
      })
    )
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
