import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IClosures } from 'app/shared/model/closures.model';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-closures-detail',
  templateUrl: './closures-detail.component.html',
  styles: ['.mainContent { margin-top: 90px; margin-bottom: 40px; width: 100%}']
})
export class ClosuresDetailComponent implements OnInit {
  closures: IClosures;
  dpte: any;
  isLoading = false;

  constructor(protected activatedRoute: ActivatedRoute, private dpteService: DepartamentService) {}

  ngOnInit() {
    this.isLoading = true;
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    this.activatedRoute.data.subscribe(({ closures }) => {
      this.closures = closures;
      this.isLoading = false;
    });
  }

  previousState() {
    window.history.back();
  }

  private getDepartament(idDept: any) {
    const name = this.dpte.find(({ id }) => id === Number(idDept));
    if (name === undefined) {
      return 'No valido';
    } else {
      return name.nameDepartament;
    }
  }
}
