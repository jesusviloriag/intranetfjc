import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IFinding } from 'app/shared/model/finding.model';
import { JhiLanguageService } from 'ng-jhipster';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-finding-detail',
  templateUrl: './finding-detail.component.html',
  styles: ['.mainContent { margin-top: 90px;margin-bottom:20px;}']
})
export class FindingDetailComponent implements OnInit {
  finding: IFinding;
  departament: any;
  findingDept: Number;
  isSaving: boolean;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    public languageService: JhiLanguageService,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.isSaving = true;
    this.activatedRoute.data.subscribe(({ finding }) => {
      this.finding = finding;
      this.findingDept = Number(this.finding.deptInvol);
    });

    this.dpteService
      .findAll('all')
      .subscribe((res: HttpResponse<IFinding[]>) => (this.departament = res.body.find(({ id }) => id === this.findingDept)));

    this.isSaving = false;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }
}
