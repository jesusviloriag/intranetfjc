import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IFinding } from 'app/shared/model/finding.model';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { FindingService } from './finding.service';
import { FindingDeleteDialogComponent } from './finding-delete-dialog.component';
import { JhiLanguageService } from 'ng-jhipster';
import { IClosures } from 'app/shared/model/closures.model';
import { ClosuresService } from '../closures/closures.service';

@Component({
  selector: 'jhi-finding',
  templateUrl: './finding.component.html',
  styles: ['../../content/css/index.css']
})
export class FindingComponent implements OnInit, OnDestroy {
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
  isSaving: boolean;
  closureData = [];
  closureRoute = [];
  dpte: any;

  constructor(
    protected findingService: FindingService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    public languageService: JhiLanguageService,
    protected closureService: ClosuresService,
    private dpteService: DepartamentService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll() {
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    this.isSaving = true;
    this.closureData = [];
    if (this.currentSearch) {
      this.findingService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IFinding[]>) => this.paginateFindings(res.body, res.headers));
      return;
    }
    this.findingService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IFinding[]>) => this.paginateFindings(res.body, res.headers));
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/finding'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.router.navigate([
      '/finding',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.router.navigate([
      '/finding',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInFindings();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IFinding) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInFindings() {
    this.eventSubscriber = this.eventManager.subscribe('findingListModification', () => this.loadAll());
  }

  delete(finding: IFinding) {
    const modalRef = this.modalService.open(FindingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.finding = finding;
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateFindings(data: IFinding[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.findings = data;

    if (data.length !== 0) {
      this.getStatusClosures(this.findings);
    }
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
    // eslint-disable-next-line no-console
    console.log(this.closureData);
    if (index > total) {
      return 0;
    } else {
      this.recursiveSearchClosures(data, total, index);
    }
    this.isSaving = false;
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }

  getDpteName(idDpte) {
    if (this.dpte !== undefined) {
      const name = this.dpte.find(({ id }) => id === Number(idDpte));
      return name.nameDepartament;
    }
  }
}
