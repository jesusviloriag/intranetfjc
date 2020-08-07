/* eslint-disable */

import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { IActivity } from 'app/shared/model/activity.model';
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarView } from 'angular-calendar';
import { ActivityService } from './activity.service';
import { HttpHeaders,HttpResponse } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { JhiLanguageService } from 'ng-jhipster';



@Component({
  selector: 'jhi-activity-book',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-book.component.html',
  styleUrls: ['./activity-book.component.scss']
})
export class ActivityBookComponent implements OnInit {

  activities: IActivity[];
  listEvent: any;
  locale: any = this.languageService.currentLang;
  dayClicked: any;
  dateDayClicked: any;
  events$: CalendarEvent[];


///////////////////////////////////////////////////
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();

  constructor(
    protected activityService: ActivityService,
    public languageService: JhiLanguageService,
    public translate: TranslateService
    ) {}

  ngOnInit() {
    this.activityService.findAll().subscribe((res: HttpResponse<IActivity[]>) => this.getActivities(res.body,res.headers));
     this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
       this.setlanguageCalendar();
       if(this.dayClicked != undefined) this.setDateActivityHeader();
       this.refresh.next();
    });
  }

  getActivities(data: IActivity[], headers: HttpHeaders) {
    this.activities = data;
    this.events$= this.activities.map(activity => {
      const event = {
        'start': new Date(),
        'end': new Date(),
        'title':'',
        'id': 1,
        'involved': ''
      };
      event.start = startOfDay(activity.dateStart.toDate());
      event.end = startOfDay(activity.dateLimit.toDate());
      event.title = activity.nameActivity;
      event.id = activity.id;
      event.involved = activity.involvedActivity;
      return event;
    })

    this.refresh.next();
  }

  showEvents($event: any){
    this.dayClicked = $event;
    this.setDateActivityHeader();
    this.listEvent = $event.events;
  }

  previousState() {
    window.history.back();
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  setlanguageCalendar(){
   this.locale = this.languageService.currentLang;
  }

  setDateActivityHeader(){
    if(this.locale == 'es'){
     return  this.dateDayClicked = format(this.dayClicked.date, "iiii, d 'de' MMMM 'del' yyyy", {locale: es});  
    }else{
      return this.dateDayClicked = format(this.dayClicked.date, " iiii, MMMM d, yyyy", {locale: enUS});
    }
  }

}
