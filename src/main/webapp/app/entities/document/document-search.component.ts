import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocument } from 'app/shared/model/document.model';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { DocumentService } from './document.service';
import { DocumentDeleteDialogComponent } from './document-delete-dialog.component';
import { DocModificationService } from '../doc-modification/doc-modification.service';
import { IDocModification } from 'app/shared/model/doc-modification.model';
import { IDocumentState } from 'app/shared/model/document-state.model';
import { DocumentStateService } from '../document-state/document-state.service';
import { UserInDepartmentService } from 'app/entities/user-in-department/user-in-department.service';

@Component({
  selector: 'jhi-document-search',
  templateUrl: './document-search.component.html',
  styleUrls: ['./document-search.component.scss']
})
export class DocumentSearchComponent implements OnInit, OnDestroy {
  documents: IDocument[];
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
  warning: boolean;

  sort: string;
  order: string;
  dateLimit: string;
  state: any;
  docMod = [];

  statuses: any;

  userDpte: any;
  constructor(
    protected documentStateService: DocumentStateService,
    protected documentService: DocumentService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected docModificationService: DocModificationService,
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

  changeOrder(event) {
    let order = '';
    let sort = '';
    const paramsList = {
      state: this.state,
      dateLimit: this.dateLimit,
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
      case 'dateCreateUp':
        order = 'ASC';
        sort = 'dateCreation';
        break;
      case 'dateCreateDown':
        order = 'DESC';
        sort = 'dateCreation';
        break;
      case 'authorUp':
        order = 'ASC';
        sort = 'creatorId';
        break;
      case 'authorDown':
        order = 'DESC';
        sort = 'creatorId';
        break;
      case 'codeUp':
        order = 'ASC';
        sort = 'codDoc';
        break;
      case 'codeDown':
        order = 'DESC';
        sort = 'codDoc';
        break;
      case 'nameUp':
        order = 'ASC';
        sort = 'nameDoc';
        break;
      case 'nameDown':
        order = 'DESC';
        sort = 'nameDoc';
        break;
      case 'statusUp':
        order = 'ASC';
        sort = 'state';
        break;
      case 'statusDown':
        order = 'DESC';
        sort = 'state';
        break;
    }

    this.order = order;
    this.sort = sort;
    paramsList.order = order;
    paramsList.sort = sort;

    // eslint-disable-next-line no-console
    console.log(paramsList);

    this.isSaving = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.documentService
      .findByQueryDoc(paramsList)
      .subscribe((res: HttpResponse<IDocument[]>) => this.paginateDocuments(res.body, res.headers));
  }

  loadAll() {
    this.consulta();
  }

  consulta() {
    this.isSaving = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.documentService
      .findByQueryDoc({
        state: this.state,
        dateLimit: this.dateLimit,
        sort: this.sort,
        order: this.order,
        page: this.page - 1,
        userDpte: this.userDpte
      })
      .subscribe((res: HttpResponse<IDocument[]>) => this.paginateDocuments(res.body, res.headers));
  }

  getParams(e, id) {
    this.warning = false;
    const params = {
      state: this.state,
      dateLimit: this.dateLimit,
      sort: this.sort,
      order: this.order,
      page: this.page - 1,
      userDpte: this.userDpte
    };

    if (id === 'status') {
      this.state = e;
      // eslint-disable-next-line no-console
      console.log(e);
      params.state = this.state;
    }

    if (id === 'Date') {
      this.dateLimit = e;
      // eslint-disable-next-line no-console
      console.log(e);
      params.dateLimit = this.dateLimit;
    }
    // eslint-disable-next-line no-console
    console.log(params);
    this.isSaving = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.documentService
      .findByQueryDoc(params)
      .subscribe((res: HttpResponse<IDocument[]>) => this.paginateDocuments(res.body, res.headers));
  }

  clearInput(id) {
    const input = document.getElementById(id) as HTMLInputElement;
    if (id === 'Date') {
      this.dateLimit = '';
    }
    input.value = null;

    this.isSaving = true;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.documentService
      .findByQueryDoc({
        state: this.state,
        dateLimit: this.dateLimit,
        sort: this.sort,
        order: this.order,
        page: this.page - 1,
        userDpte: this.userDpte
      })
      .subscribe((res: HttpResponse<IDocument[]>) => this.paginateDocuments(res.body, res.headers));
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/document/search'], {
      queryParams: {
        state: this.state,
        dateLimit: this.dateLimit,
        sort: this.sort,
        order: this.order,
        page: this.page - 1,
        userDpte: this.userDpte
      }
    });
    this.loadAll();
  }

  ngOnInit() {
    //MARICO NO ENTIENDO POR QUE NO SE PUEDE LLEVAR EL STATE CON NUMEROS CUANDO HASTA EN EL BANCO DE VENEZUELAA MARICO EL BANCO DE VENEZUELA SE LLEVAN CON NUMERO SI EL BANCO QUE MANEJA TODA VENEZUELA EXACTO
    this.userDepartmentService.findByActualUser().subscribe(res => {
      this.userDpte = res.body[0].departament;
      // eslint-disable-next-line no-console
      console.log(this.userDpte);
      this.state = 0;
      this.dateLimit = '';
      this.sort = 'id';
      this.order = 'ASC';
      this.page = 1;
      this.loadAll();
      this.registerChangeInDocuments();

      this.documentStateService
        .query({
          page: 0,
          size: 1000,
          sort: this.orderxd()
        })
        .subscribe((ress: HttpResponse<IDocumentState[]>) => this.paginateDocumentStates(ress.body));
    });
  }

  orderxd() {
    const result = ['id,' + 'desc'];
    result.push('id');
    return result;
  }

  protected paginateDocumentStates(data: IDocumentState[]) {
    this.statuses = data;
    // eslint-disable-next-line no-console
    console.log(data);
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInDocuments() {
    this.eventSubscriber = this.eventManager.subscribe('documentListModification', () => this.loadAll());
  }

  protected paginateDocuments(data: IDocument[], headers: HttpHeaders) {
    this.warning = false;
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.documents = data;
    const total = data.length - 1;
    // eslint-disable-next-line no-console
    console.log(data);
    if (data.length === 0) {
      this.isSaving = false;
      this.warning = true;
    } else {
      this.docMod = [];
      this.recursiveSearchMod(data, total, 0);
    }
  }

  protected recursiveSearchMod(data, total, index) {
    this.docModificationService
      .findLastByRel(data[index].id)
      .subscribe((res: HttpResponse<IDocModification[]>) => this.getLastMod(data, total, index, res.body));
  }

  protected getLastMod(data, total, index, res) {
    this.docMod.push(res);
    index++;
    if (!(index > total)) {
      this.recursiveSearchMod(data, total, index);
    } else {
      this.isSaving = false;
      // eslint-disable-next-line no-console
      console.log(this.docMod);
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
  }
}
