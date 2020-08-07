import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinding } from 'app/shared/model/finding.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IActionFinding } from 'app/shared/model/action-finding.model';
import { IClosures } from 'app/shared/model/closures.model';
import { ClosuresService } from '../closures/closures.service';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { FindingService } from './finding.service';
import { ActionFindingService } from '../action-finding/action-finding.service';
import { FindingDeleteDialogComponent } from './finding-delete-dialog.component';
import { healthRoute } from 'app/admin/health/health.route';
import { JhiLanguageService } from 'ng-jhipster';
import { UserInDepartmentService } from 'app/entities/user-in-department/user-in-department.service';

@Component({
  selector: 'jhi-finding',
  templateUrl: './finding-records.component.html',
  styleUrls: ['./finding-records.component.scss']
})
export class FindingRecordsComponent implements OnInit, OnDestroy {
  findings: IFinding[];
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
  infoLoad = false;
  countItems = 0;
  actionFindings: any;
  closureData = [];
  closureRoute = [];
  sort: string;
  order: string;
  closureDate: boolean;
  dateStart: any;
  dateEnd: any;
  actionNumber = [];
  percent = [];
  warning = false;
  userDpte: any;

  getsAction: boolean;
  getsClosures: boolean;
  constructor(
    protected findingService: FindingService,
    protected actionService: ActionFindingService,
    protected closureService: ClosuresService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    public languageService: JhiLanguageService,
    protected modalService: NgbModal,
    private userDepartmentService: UserInDepartmentService
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
    // eslint-disable-next-line no-console
    console.log(this.closureData);
  }

  changeOrder(event) {
    let order = '';
    let sort = '';
    this.closureData = [];
    this.actionNumber = [];
    this.percent = [];
    const paramsList = {
      startDate: this.dateStart,
      limitDate: this.dateEnd,
      closureDate: this.closureDate,
      sort: this.sort,
      order: this.order,
      page: this.page - 1,
      userDpte: this.userDpte
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
      case 'idUp':
        order = 'ASC';
        sort = 'id';
        break;
      case 'idDown':
        order = 'DESC';
        sort = 'id';
        break;
      case 'authorUp':
        order = 'ASC';
        sort = 'creatorId';
        break;
      case 'authorDown':
        order = 'DESC';
        sort = 'creatorId';
        break;
      case 'typeUp':
        order = 'ASC';
        sort = 'typeFinding';
        break;
      case 'typeDown':
        order = 'DESC';
        sort = 'typeFinding';
        break;
      case 'codUp':
        order = 'ASC';
        sort = 'codFinding';
        break;
      case 'codDown':
        order = 'DESC';
        sort = 'codFinding';
        break;
      case 'dateStartUp':
        order = 'ASC';
        sort = 'dateStart';
        break;
      case 'dateStartDown':
        order = 'DESC';
        sort = 'dateStart';
        break;
      case 'dateEndUp':
        order = 'ASC';
        sort = 'dateEnd';
        break;
      case 'dateEndDown':
        order = 'DESC';
        sort = 'dateEnd';
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
        sort = 'dateClosure';
        break;
      case 'statusDown':
        order = 'DESC';
        sort = 'dateClosure';
        break;
    }

    this.order = order;
    this.sort = sort;
    paramsList.order = order;
    paramsList.sort = sort;
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.infoLoad = false;
    this.findingService
      .findByQueryFinding(paramsList)
      .subscribe((res: HttpResponse<IFinding[]>) => this.paginateFindings(res.body, res.headers));
  }

  getParams(e, id) {
    this.warning = false;
    this.closureData = [];
    this.actionNumber = [];
    this.percent = [];
    const params = {
      startDate: this.dateStart,
      limitDate: this.dateEnd,
      closureDate: this.closureDate,
      sort: this.sort,
      order: this.order,
      page: this.page - 1,
      userDpte: this.userDpte
    };

    if (id === 'status') {
      e = e === 'true' ? true : e === 'false' ? false : null;
      this.closureDate = e;
      params.closureDate = this.closureDate;
    }

    if (id === 'dateEnd') {
      this.dateEnd = e;
      params.limitDate = this.dateEnd;
    }

    if (id === 'dateStart') {
      this.dateStart = e;
      params.startDate = this.dateStart;
    }
    // eslint-disable-next-line no-console
    console.log(params);
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.infoLoad = false;
    this.findingService
      .findByQueryFinding(params)
      .subscribe((res: HttpResponse<IFinding[]>) => this.paginateFindings(res.body, res.headers));
  }

  consulta() {
    window.scroll(0, 0);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.infoLoad = false;
    this.findingService
      .findByQueryFinding({
        startDate: this.dateStart,
        limitDate: this.dateEnd,
        closureDate: this.closureDate,
        sort: this.sort,
        order: this.order,
        page: this.page - 1,
        userDpte: this.userDpte
      })
      .subscribe((res: HttpResponse<IFinding[]>) => this.paginateFindings(res.body, res.headers));
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.userDepartmentService.findByActualUser().subscribe(res => {
      this.userDpte = res.body[0].departament;
      // eslint-disable-next-line no-console
      console.log(this.userDpte);
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      this.closureData = [];
      this.actionNumber = [];
      this.percent = [];
      this.dateStart = '';
      this.dateEnd = '';
      this.closureDate = null;
      this.sort = 'id';
      this.order = 'ASC';
      this.page = 1;
      this.loadAll();
      this.registerChangeInFindings();
    });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInFindings() {
    this.eventSubscriber = this.eventManager.subscribe('findingListModification', () => this.loadAll());
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
    this.findingService
      .findByQueryFinding({
        startDate: this.dateStart,
        limitDate: this.dateEnd,
        closureDate: this.closureDate,
        sort: this.sort,
        order: this.order,
        page: this.page - 1,
        userDpte: this.userDpte
      })
      .subscribe((res: HttpResponse<IFinding[]>) => this.paginateFindings(res.body, res.headers));
  }

  protected paginateFindings(data: IFinding[], headers: HttpHeaders) {
    this.warning = false;
    this.getsAction = false;
    this.getsClosures = false;
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.countItems = this.totalItems;
    // eslint-disable-next-line no-console
    console.log(data);
    if (data.length === 0) {
      this.warning = true;
      this.getsAction = true;
      this.getsClosures = true;
      this.validateLoad();
      return;
    } else {
      this.findings = data;
      this.getActions(this.findings);
      this.getStatusClosures(this.findings);
    }
  }

  protected getActions(data: IFinding[]) {
    const total = data.length;
    this.recursiveSearchActions(data, total - 1, 0);
  }

  protected getStatusClosures(data: IFinding[]) {
    const total = data.length;
    this.recursiveSearchClosures(data, total - 1, 0);
  }

  protected recursiveSearchClosures(data, total, index) {
    this.closureService
      .findByIdFinding(data[index].id)
      .subscribe((res: HttpResponse<IClosures>) => this.getClosure(data, total, index, res.body));
  }

  protected recursiveSearchActions(data, total, index) {
    this.actionService
      .findByRel(data[index].id)
      .subscribe((res: HttpResponse<IActionFinding[]>) => this.getAction(data, total, index, res.body));
  }

  protected getClosure(data, total, index, result) {
    // eslint-disable-next-line no-console
    console.log(result);
    if (result.length > 0) {
      this.closureData[this.closureData.length] = result[0].effectiveness;
      this.closureRoute[this.closureRoute.length] = result[0].id;
    } else {
      this.closureData[this.closureData.length] = 'Abierto';
      this.closureRoute[this.closureRoute.length] = 0;
    }
    index++;
    if (index > total) {
      this.getsClosures = true;
      this.validateLoad();
      return 0;
    } else {
      this.recursiveSearchClosures(data, total, index);
    }
  }

  protected getAction(data, total, index, result) {
    const percent = this.getPercentActions(result);
    this.actionNumber[this.actionNumber.length] = result.length;
    this.percent[this.percent.length] = percent;
    data[index].evidence = result.length;
    data[index].methodology = percent;
    index++;
    if (index > total) {
      this.getsAction = true;
      this.validateLoad();
      return 0;
    } else {
      this.recursiveSearchActions(data, total, index);
    }
  }

  protected getPercentActions(result: any) {
    const totalActionState = result.length;
    let actionState = 0;
    result.forEach(element => {
      element.status === 0 ? actionState++ : '';
    });
    return Math.round((actionState * 100) / totalActionState) + '%';
  }

  validateLoad() {
    if (this.getAction && this.getsClosures) {
      this.infoLoad = true;
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      sort: this.sort,
      order: this.order,
      startDate: this.dateStart === '' ? '' : this.dateStart.format('DD/MM/YYYY'),
      limitDate: this.dateEnd === '' ? '' : this.dateEnd.format('DD/MM/YYYY'),
      closureDate: this.closureDate,
      userDpte: this.userDpte
    };

    this.closureData = [];
    this.actionNumber = [];
    this.percent = [];

    this.router.navigate(['/finding/records'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort,
        order: this.order,
        startDate: this.dateStart === '' ? '' : this.dateStart.format('DD/MM/YYYY'),
        limitDate: this.dateEnd === '' ? '' : this.dateEnd.format('DD/MM/YYYY'),
        closureDate: this.closureDate === null ? 'null' : this.closureDate,
        userDpte: this.userDpte
      }
    });
    this.loadAll();
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }
}
