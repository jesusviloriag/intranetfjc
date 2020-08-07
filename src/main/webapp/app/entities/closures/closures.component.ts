import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClosures } from 'app/shared/model/closures.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ClosuresService } from './closures.service';
import { ClosuresDeleteDialogComponent } from './closures-delete-dialog.component';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';

@Component({
  selector: 'jhi-closures',
  templateUrl: './closures.component.html',
  styles: ['../../content/css/index.css']
})
export class ClosuresComponent implements OnInit, OnDestroy {
  closures: IClosures[];
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
  dpte: any;
  isLoading = false;
  findingUpdated: any;

  constructor(
    protected closuresService: ClosuresService,
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
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.closuresService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IClosures[]>) => this.paginateClosures(res.body, res.headers));
      return;
    }
    this.closuresService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IClosures[]>) => this.paginateClosures(res.body, res.headers));
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/closures'], {
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
      '/closures',
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
      '/closures',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  ngOnInit() {
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    this.isLoading = true;
    this.loadAll();
    this.registerChangeInClosures();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IClosures) {
    return item.id;
  }

  registerChangeInClosures() {
    this.eventSubscriber = this.eventManager.subscribe('closuresListModification', () => this.loadAll());
  }

  delete(closures: IClosures) {
    // this.subscribeToSaveResponse(this.findingService.update(this.findingUpdated));
    const modalRef = this.modalService.open(ClosuresDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.closures = closures;
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateClosures(data: IClosures[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.closures = data;
    this.isLoading = false;
  }

  private getDepartament(idDept: any) {
    const name = this.dpte.find(({ id }) => id === Number(idDept));
    if (name === undefined) {
      return 'No valido';
    } else {
      return name.name;
    }
  }
}
