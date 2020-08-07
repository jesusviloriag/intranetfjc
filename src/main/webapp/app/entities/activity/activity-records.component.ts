import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivity } from 'app/shared/model/activity.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ActivityService } from './activity.service';

import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-activity-records',
  templateUrl: './activity-records.component.html',
  styleUrls: ['./activity-records.component.scss']
})
export class ActivityRecordsComponent implements OnInit, OnDestroy {
  activities: IActivity[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  warning = false;
  activityDept: any;

  sort: string;
  order: string;
  status: string;
  dateStart: any;
  dateEnd: any;
  infoLoad: boolean;
  dpte: any;

  constructor(
    protected activityService: ActivityService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private dpteService: DepartamentService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
  }

  loadAll() {
    this.consulta();
  }

  consulta() {
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.infoLoad = false;

    this.activityService
      .findByFilter({
        startDate: this.dateStart,
        limitDate: this.dateEnd,
        status: this.status,
        sort: this.sort,
        order: this.order,
        page: this.page - 1
      })
      .subscribe((res: HttpResponse<IActivity[]>) => this.paginateActivities(res.body, res.headers));
  }

  getParams(e, id) {
    const params = {
      startDate: this.dateStart,
      limitDate: this.dateEnd,
      status: this.status,
      sort: this.sort,
      order: this.order,
      page: this.page - 1
    };

    if (id === 'status') {
      this.status = e;
      params.status = this.status;
    }

    if (id === 'dateEnd') {
      this.dateEnd = e;
      params.limitDate = this.dateEnd;
    }

    if (id === 'dateStart') {
      this.dateStart = e;
      params.startDate = this.dateStart;
    }

    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.infoLoad = false;

    this.activityService.findByFilter(params).subscribe((res: HttpResponse<IActivity[]>) => this.paginateActivities(res.body, res.headers));
  }

  clearInput(id) {
    const input = document.getElementById(id) as HTMLInputElement;
    if (id === 'sinceDate') {
      this.dateStart = '';
    } else if (id === 'untilDate') {
      this.dateEnd = '';
    }
    input.value = null;

    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.infoLoad = false;

    this.activityService
      .findByFilter({
        startDate: this.dateStart,
        limitDate: this.dateEnd,
        status: this.status,
        sort: this.sort,
        order: this.order,
        page: this.page - 1
      })
      .subscribe((res: HttpResponse<IActivity[]>) => this.paginateActivities(res.body, res.headers));
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  ngOnInit() {
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.dateStart = '';
    this.dateEnd = '';
    this.status = '0';
    this.sort = 'id';
    this.order = 'ASC';
    this.page = 1;
    this.loadAll();
    this.registerChangeInActivities();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInActivities() {
    this.eventSubscriber = this.eventManager.subscribe('activityListModification', () => this.loadAll());
  }

  protected paginateActivities(data: IActivity[], headers: HttpHeaders) {
    this.warning = false;
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    if (data.length === 0) {
      this.warning = true;
      this.infoLoad = true;
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
      return;
    } else {
      this.activities = data;
      this.infoLoad = true;
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }

  changeOrder(event) {
    let order = '';
    let sort = '';
    const paramsList = {
      startDate: this.dateStart,
      limitDate: this.dateEnd,
      status: this.status,
      sort: this.sort,
      order: this.order,
      page: this.page - 1
    };

    const arrowsUp = document.getElementsByClassName('up') as HTMLCollectionOf<HTMLElement>;
    const arrowsDown = document.getElementsByClassName('down') as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < arrowsUp.length; i++) {
      arrowsDown[i].style.borderColor = '#000';
      arrowsUp[i].style.borderColor = '#000';
      arrowsDown[i].style.cursor = 'pointer';
      arrowsUp[i].style.cursor = 'pointer';
    }

    const arrow = document.getElementById(event.target.id);
    arrow.style.cursor = 'auto';
    arrow.style.borderColor = '#BBB';

    switch (event.target.id) {
      case 'dateStartUp':
        order = 'ASC';
        sort = 'dateStart';
        break;
      case 'dateStartDown':
        order = 'DESC';
        sort = 'dateStart';
        break;
      case 'authorUp':
        order = 'ASC';
        sort = 'creatorId';
        break;
      case 'authorDown':
        order = 'DESC';
        sort = 'creatorId';
        break;
      case 'dpteUp':
        order = 'ASC';
        sort = 'dept';
        break;
      case 'dpteDown':
        order = 'DESC';
        sort = 'dept';
        break;
      case 'codUp':
        order = 'ASC';
        sort = 'codFinding';
        break;
      case 'codDown':
        order = 'DESC';
        sort = 'codFinding';
        break;
      case 'nameUp':
        order = 'ASC';
        sort = 'nameActivity';
        break;
      case 'nameDown':
        order = 'DESC';
        sort = 'nameActivity';
        break;
      case 'dscUp':
        order = 'ASC';
        sort = 'description';
        break;
      case 'dscDown':
        order = 'DESC';
        sort = 'description';
        break;
      case 'statusUp':
        order = 'ASC';
        sort = 'status';
        break;
      case 'statusDown':
        order = 'DESC';
        sort = 'status';
        break;
    }

    this.order = order;
    this.sort = sort;
    paramsList.order = order;
    paramsList.sort = sort;

    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.infoLoad = false;
    this.activityService
      .findByFilter(paramsList)
      .subscribe((res: HttpResponse<IActivity[]>) => this.paginateActivities(res.body, res.headers));
  }

  transition() {
    this.router.navigate(['/activity/records'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort,
        order: this.order,
        startDate: this.dateStart === '' ? '' : this.dateStart.format('DD/MM/YYYY'),
        limitDate: this.dateEnd === '' ? '' : this.dateEnd.format('DD/MM/YYYY'),
        status: this.status
      }
    });
    this.loadAll();
  }

  getDpteName(idDept: any) {
    const name = this.dpte.find(({ id }) => id === Number(idDept));
    return name.nameDepartament;
  }
}
