import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-departament-detail',
  templateUrl: './departament-detail.component.html'
})
export class DepartamentDetailComponent implements OnInit {
  departament: IDepartament;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ departament }) => {
      this.departament = departament;
    });
  }

  previousState() {
    window.history.back();
  }
}
