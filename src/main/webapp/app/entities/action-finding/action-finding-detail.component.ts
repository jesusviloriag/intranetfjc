import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';
import { IActionFinding } from 'app/shared/model/action-finding.model';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
  selector: 'jhi-action-finding-detail',
  templateUrl: './action-finding-detail.component.html',
  styles: ['.mainContent { margin-top: 90px;margin-bottom: 20px;}']
})
export class ActionFindingDetailComponent implements OnInit {
  actionFinding: IActionFinding;
  isSaving: boolean;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute, public languageService: JhiLanguageService) {}

  ngOnInit() {
    this.isSaving = true;
    this.activatedRoute.data.subscribe(({ actionFinding }) => {
      this.actionFinding = actionFinding;
      this.isSaving = false;
    });
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
