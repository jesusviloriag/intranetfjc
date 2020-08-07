import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IActionFinding } from 'app/shared/model/action-finding.model';
import { Location } from '@angular/common';
import { ActionFindingService } from 'app/entities/action-finding/action-finding.service';
import { IFinding } from 'app/shared/model/finding.model';
import { IClosures } from 'app/shared/model/closures.model';

import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ClosuresService } from '../closures/closures.service';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
  selector: 'jhi-finding-view',
  animations: [
    trigger('rotatedState', [
      state('false', style({ transform: 'rotate(0)' })),
      state('true', style({ transform: 'rotate(90deg)' })),
      transition('true => false', animate('250ms ease-out')),
      transition('false => true', animate('250ms ease-in'))
    ]),
    trigger('slideAnimation', [
      transition(':enter', [style({ height: 0, opacity: 1 }), animate('0.3s ease-out', style({ height: '*', opacity: 1 }))]),
      transition(':leave', [style({ height: '*', opacity: 1 }), animate('0.3s ease-in', style({ height: 0, opacity: 0 }))])
    ])
  ],
  templateUrl: './finding-view.component.html',
  styleUrls: ['./finding-view.component.scss']
})
export class FindingViewComponent implements OnInit {
  dpte: any;
  finding: IFinding;
  actionFindings: any;
  actionSaved = 0;
  closure: IClosures;
  infoLoad = false;
  findingDept: any;
  closureDept: any;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    protected actionFindingService: ActionFindingService,
    protected closureService: ClosuresService,
    private languageService: JhiLanguageService,
    private location: Location,
    private dpteService: DepartamentService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ finding }) => {
      this.finding = finding;
      this.finding.codFinding = `${this.finding.codFinding}${this.finding.id}`;
      if (this.finding.dateClosure !== null) {
        this.closureService.findByIdFinding(this.finding.id).subscribe((res: HttpResponse<IClosures>) => this.getClosure(res.body));
      }
      this.actionFindingService.findByRel(finding.id).subscribe((res: HttpResponse<IActionFinding[]>) => this.getActionFindings(res.body));
      this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
        this.dpte = res.body;
        this.findingDept = this.getDepartament(this.finding.deptInvol);
      });
    });
  }

  getDepartament(idDept: any) {
    return this.dpte.find(({ id }) => id === Number(idDept));
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }

  navigateBack() {
    this.location.back();
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

  protected getActionFindings(data: IActionFinding[]) {
    this.actionFindings = data;
    for (let i = 0; i < this.actionFindings.length; i++) {
      // eslint-disable-next-line no-console
      console.log(this.actionFindings[i]);
      this.actionFindings[i].isOpen = false;
      this.actionSaved++;
    }
    this.infoLoad = true;
  }

  protected getClosure(data: IClosures) {
    this.closure = data[0];
    // eslint-disable-next-line no-console
    console.log(this.closure);
    if (this.closure.actionClosed === 'Si') {
      this.closure.actionClosed = this.getLabel('Yes', 'Si');
    }

    this.closureDept = this.getDepartament(this.closure.dept);
    // eslint-disable-next-line no-console
    console.log(this.closureDept);
  }

  showAction(i: number, currentStatus: boolean) {
    this.actionFindings[i].isOpen = !currentStatus;

    for (let index = 0; index < this.actionFindings.length; index++) {
      if (index !== i) {
        this.actionFindings[index].isOpen = false;
      }
    }
  }
}
