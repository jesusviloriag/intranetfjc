/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { Chart } from 'chart.js';

import { IFinding } from 'app/shared/model/finding.model';
import { FindingService } from '../finding/finding.service';

import { IActionFinding } from 'app/shared/model/action-finding.model';
import { ActionFindingService } from './action-finding.service';

import { ClosuresService } from '../closures/closures.service';
import { IClosures } from 'app/shared/model/closures.model';
import { JhiLanguageService } from 'ng-jhipster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'jhi-action-finding-global',
  templateUrl: './action-finding-global.component.html',
  styleUrls: ['./action-finding-global.component.scss']
})
export class ActionFindingGlobalComponent implements OnInit {
  actionFindings: IActionFinding[];
  findings: IFinding[];
  closures: IClosures[];
  actionSaved: boolean;
  findingSaved: boolean;

  eventSubscriber: Subscription;
  currentSearch: string;
  routeData: any;
  pieChartFind = [];
  pieChartAct = [];

  resFindForm = this.fb.group({
    registeredActions: [0],
    processActions: [0],
    nonEficActions: [0],
    findingWait: [0],
    eficActions: [0]
  });

  resActForm = this.fb.group({
    registeredAct: [0],
    openAct: [0],
    closeAct: [0],
    neverFinished: [0]
  });

  constructor(
    protected actionFindingService: ActionFindingService,
    protected activatedRoute: ActivatedRoute,
    protected findingService: FindingService,
    protected router: Router,
    protected eventManager: JhiEventManager,
    private fb: FormBuilder,
    public languageService: JhiLanguageService,
    protected closuresService: ClosuresService,
    public translate: TranslateService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';

    this.loadAll();
    this.registerChangeInActionFindings();
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }

  loadAll() {
    this.findingService.findAll('all').subscribe((res: HttpResponse<IFinding[]>) => this.getFindings(res.body));
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.createPieAct();
      this.createPieFind();
    });
  }

  createPieFind() {
    const values = this.resFindForm.value;

    this.pieChartFind = new Chart('pieChartFind', {
      type: 'doughnut',
      data: {
        labels: [
          this.getLabel('Waiting for Verification', 'Esperando por verificación'),
          this.getLabel('In progress', 'Reportes en proceso'),
          this.getLabel('With non effective closure', 'Reportes con cierre no eficaz'),
          this.getLabel('With effective closure', 'Reportes con cierre eficaz')
        ],
        datasets: [
          {
            data: [values.findingWait, values.processActions, values.nonEficActions, values.eficActions],
            backgroundColor: ['#FFA500', '#ffd439', '#ff2727', '#6bd67f'],
            borderColor: ['#FFA500', '#ffd439', '#ff2727', '#6bd67f'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        legend: { display: false }
      }
    });

    this.actionFindingService.findAll('all').subscribe((res: HttpResponse<IActionFinding[]>) => this.getActionFindings(res.body));
  }

  registerChangeInActionFindings() {
    this.eventSubscriber = this.eventManager.subscribe('actionFindingListModification', () => this.loadAll());
  }

  protected getActionFindings(data: IFinding[]) {
    // eslint-disable-next-line no-console
    console.log(this.findings);
    this.actionFindings = data;
    // eslint-disable-next-line no-console
    console.log(this.actionFindings);
    let openActCount = 0;
    let closeActCount = 0;
    let notFinishedAct = 0;

    for (let i = 0; i < this.findings.length; i++) {
      for (let j = 0; j < this.actionFindings.length; j++) {
        if (this.actionFindings[j].actFinding.id === this.findings[i].id) {
          if (this.actionFindings[j].status === 1 && this.findings[i].dateClosure === null) {
            openActCount++;
          } else if (this.actionFindings[j].status === 1 && this.findings[i].dateClosure !== null) {
            notFinishedAct++;
          } else if (this.actionFindings[j].status === 0) {
            closeActCount++;
          }
        }
      }
    }

    this.resActForm.patchValue({
      registeredAct: this.actionFindings.length,
      openAct: openActCount,
      closeAct: closeActCount,
      neverFinished: notFinishedAct
    });

    this.createPieAct();
    this.actionSaved = true;
    this.validateGet();
  }

  createPieAct() {
    const valuesAct = this.resActForm.value;
    this.pieChartAct = new Chart('pieChartAct', {
      type: 'doughnut',
      data: {
        labels: [
          this.getLabel('Actions in progress', 'Acciones en proceso'),
          this.getLabel('Actions closed', 'Acciones cerradas'),
          this.getLabel('Not finished', 'No finalizadas')
        ],
        datasets: [
          {
            data: [valuesAct.openAct, valuesAct.closeAct, valuesAct.neverFinished],
            backgroundColor: ['#ff2727', '#6bd67f', '#ffd439'],
            borderColor: ['#ff2727', '#6bd67f', '#ffd439'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        legend: { display: false }
      }
    });
  }

  protected getFindings(data: IActionFinding[]) {
    this.findings = data;
    this.resFindForm.patchValue({
      registeredActions: this.findings.length
    });

    this.closuresService.findAll('all').subscribe((res: HttpResponse<IClosures[]>) => this.getClosures(res.body));
  }

  protected getClosures(data: IClosures[]) {
    this.closures = data;

    const processFind = this.findings.length - this.closures.length;
    let eficFind = 0;
    let nonEficFind = 0;
    let waiting = 0;
    for (let i = 0; i < this.closures.length; i++) {
      if (this.closures[i].effectiveness === 0) {
        waiting++;
      } else if (this.closures[i].effectiveness === 1) {
        eficFind++;
      } else if (this.closures[i].effectiveness === 2) {
        nonEficFind++;
      }
    }

    this.resFindForm.patchValue({
      processActions: processFind,
      nonEficActions: nonEficFind,
      eficActions: eficFind,
      findingWait: waiting
    });

    this.createPieFind();
    this.findingSaved = true;
    this.validateGet();
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }

  private validateGet() {
    if (this.actionSaved && this.findingSaved) {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }
}
