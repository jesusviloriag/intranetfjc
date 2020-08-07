import { Component, OnInit } from '@angular/core';
import { IMenu } from 'app/shared/model/menu.model';

@Component({
  selector: 'jhi-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['menu.scss']
})
export class MenuComponent implements OnInit {
  menus: IMenu[];

  constructor() {}

  ngOnInit() {}
}
