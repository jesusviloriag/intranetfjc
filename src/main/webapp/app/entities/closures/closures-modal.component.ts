import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jhi-modal-closures',
  templateUrl: './closures-modal.component.html',
  styleUrls: ['./closures-modal.component.scss']
})
export class ClosuresModalComponent implements OnInit {
  @Input() modalTitle: string;
  @Input() modalMsg: string;
  @Input() btnMsg: string;
  @Input() icon: string;
  @Output() closeModalVal = new EventEmitter();

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      const box = document.getElementsByClassName('modalBox') as HTMLCollectionOf<HTMLElement>;
      box[0].style.height = '100%';
    }, 0.3);
  }

  closeModal() {
    if (this.icon === 'confirm') {
      this.closeModalVal.emit(1);
    } else {
      this.closeModalVal.emit(0);
    }
  }
}
