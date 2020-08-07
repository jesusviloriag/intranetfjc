import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IActivity } from 'app/shared/model/activity.model';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-activity-detail',
  templateUrl: './activity-detail.component.html',
  styles: ['.mainContent { margin-top: 90px;margin-bottom: 20px; width: 100%;}']
})
export class ActivityDetailComponent implements OnInit {
  activity: IActivity;
  departament: any;
  activityDept: Number;
  isSaving: boolean;

  constructor(protected activatedRoute: ActivatedRoute, private dpteService: DepartamentService) {}

  ngOnInit() {
    this.isSaving = true;
    this.activatedRoute.data.subscribe(({ activity }) => {
      this.activity = activity;
      this.activityDept = Number(this.activity.dept);
      // eslint-disable-next-line no-console
      console.log(activity);
      this.isSaving = false;
    });

    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.departament = res.body.find(({ id }) => id === this.activityDept);
    });
  }

  previousState() {
    window.history.back();
  }
}
