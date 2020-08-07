import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocModification } from 'app/shared/model/doc-modification.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { DocModificationService } from './doc-modification.service';
import { DocModificationDeleteDialogComponent } from './doc-modification-delete-dialog.component';

@Component({
  selector: 'jhi-doc-modification-register',
  templateUrl: './doc-modification-register.component.html',
  styleUrls: ['./doc-modification-register.component.scss']
})
export class DocModificationRegisterComponent implements OnInit, OnDestroy {
  docModifications: IDocModification[];
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
  idDoc: any;
  nameDoc: any;

  constructor(
    protected docModificationService: DocModificationService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      // eslint-disable-next-line no-console
      console.log(data);
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
    
    this.activatedRoute.params.subscribe(data => {
      this.idDoc = data.id;
      this.nameDoc = data.title;
       // eslint-disable-next-line no-console
      console.log(this.nameDoc);
    });
  }

  loadAll() {
    if (this.currentSearch) {
      this.docModificationService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IDocModification[]>) => this.paginateDocModifications(res.body, res.headers));
      return;
    }
    // this.docModificationService
    //   .query({
    //     page: this.page - 1,
    //     size: this.itemsPerPage,
    //     sort: this.sort()
    //   })
    //   .subscribe((res: HttpResponse<IDocModification[]>) => this.paginateDocModifications(res.body, res.headers));
    this.docModificationService.findByRelDoc(this.idDoc).subscribe((res: HttpResponse<IDocModification[]>) => this.paginateDocModifications(res.body, res.headers));
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/doc-modification'], {
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
      '/doc-modification',
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
      '/doc-modification',
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
    this.registerChangeInDocModifications();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IDocModification) {
    return item.id;
  }

  registerChangeInDocModifications() {
    this.eventSubscriber = this.eventManager.subscribe('docModificationListModification', () => this.loadAll());
  }

  delete(docModification: IDocModification) {
    const modalRef = this.modalService.open(DocModificationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.docModification = docModification;
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateDocModifications(data: IDocModification[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.docModifications = data;
  }
}
