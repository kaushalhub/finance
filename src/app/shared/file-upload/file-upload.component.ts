import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() selectedUser: User;
  // Files
  documents: Object[] = [];
  documentsUploading: Object[] = [];
  files: File[] = [];

  isHovering: boolean;

  constructor(
    private storage: AngularFireStorage,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.documents = [...this.selectedUser.documents.map(obj => ({ 
      ...obj, 
      imgExtension: `../../../assets/images/${obj.name.split('.').pop()}.png`
    }))];
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (var i = 0; i < files.length; i++) {
      // this.files.push(files.item(i));
      const file = files.item(i);
      this.documentsUploading.push({
        file,
        name: file.name,
        imgExtension: `../../../assets/images/${file.name.split('.').pop()}.png`
      })
    }
  }

  onDelete(index) {
    this.storage.storage.refFromURL(this.documents[index]['downloadURL']).delete();
    this.documents.splice(index, 1);
    this.selectedUser.documents.splice(index, 1);
    this.userService.updateUser({...this.selectedUser}, this.selectedUser.id);
  }

  updateDocuments(file) {
    this.documents.push({
      ...file,
      imgExtension: `../../../assets/images/${file.name.split('.').pop()}.png`
    });
    const updaloadedFile = this.documentsUploading.find((f) => (f['name'] === file.name));
    const index = this.documentsUploading.indexOf(updaloadedFile);
    if (index > -1) {
      this.documentsUploading.splice(index, 1);
    }
  }
}
