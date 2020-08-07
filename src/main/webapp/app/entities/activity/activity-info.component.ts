import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IActivity } from 'app/shared/model/activity.model';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-activity-info',
  templateUrl: './activity-info.component.html',
  styleUrls: ['./activity-info.component.scss']
})
export class ActivityInfoComponent implements OnInit {
  activity: IActivity;
  departament: any;
  activityDept: Number;

  constructor(protected activatedRoute: ActivatedRoute, private dpteService: DepartamentService) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ activity }) => {
      this.activity = activity;
      this.activityDept = Number(this.activity.dept);
      // eslint-disable-next-line no-console
      console.log(this.activityDept);
    });
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.departament = res.body.find(({ id }) => id === this.activityDept);
    });
  }

  previousState() {
    window.history.back();
  }
}
