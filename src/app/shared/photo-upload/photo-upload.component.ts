import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UploadImageService } from 'src/app/services/upload-image.service';

@Component({
  selector: 'photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnChanges {
  @Input() user: User;
  @Input() uploadPhoto: boolean;
  @Output() eventOutput = new EventEmitter<any>();
  isHovering: boolean;
  imageUpload: any;
  loading = false;
  variableOfImage = '../../../assets/images/image-icon.svg';

  constructor(
    private imageService: UploadImageService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    for (let change in changes) {
      if (changes.hasOwnProperty(change)) {
        switch (change) {
          case 'uploadPhoto': {
            this.handleUpload(this.uploadPhoto);
          }
        }
      }
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(image: FileList) {
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.user.profile.image = event.target.result;
      this.variableOfImage = this.user.profile.image;
    }
    reader.readAsDataURL(image[0]);
    this.imageUpload = image[0];
    this.photoEvent('imageOn', true);
  }

  async uploadImage() {
    if (this.imageUpload) {
      this.loading = true;
      await this.imageService.uploadImage(this.imageUpload, this.user.id, this.user.profile)
      this.imageUpload = null;
      this.loading = false;
      this.photoEvent('finishedLoading', false);
    }
  }

  handleUpload(uploadImageNow) {
    if (uploadImageNow) {
      this.uploadImage();
    }
  }

  photoEvent(classToEmmit: string, variableToEmmit: boolean) {
    this.eventOutput.emit({ class: classToEmmit, variable: variableToEmmit, newImageUrl: this.variableOfImage });
  }

}
