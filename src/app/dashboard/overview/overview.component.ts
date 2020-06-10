import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() data: User;
  @Output() activeTabOutput = new EventEmitter<string>();

  documents: Object[] = []

  constructor() { }

  ngOnInit(): void {
    this.documents = [...this.data.documents.map(obj => ({ 
      ...obj, 
      imgExtension: `../../../assets/images/${obj.name.split('.').pop()}.png`
    }))];
  }

  setActiveTab(tab) {
    this.activeTabOutput.emit(tab);
  }


}
