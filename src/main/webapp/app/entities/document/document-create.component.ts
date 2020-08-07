import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IDocument, Document } from 'app/shared/model/document.model';
import { DocumentService } from './document.service';
import { IDocModification, DocModification } from 'app/shared/model/doc-modification.model';
import { DocModificationService } from 'app/entities/doc-modification/doc-modification.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { JhiLanguageService } from 'ng-jhipster';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { DepartamentService } from '../departament/departament.service';
import { IDepartament } from 'app/shared/model/departament.model';
import { UserInDepartmentService } from 'app/entities/user-in-department/user-in-department.service';
import { IDocumentState } from 'app/shared/model/document-state.model';
import { DocumentStateService } from '../document-state/document-state.service';
import { IDocumentType } from 'app/shared/model/document-type.model';
import { DocumentTypeService } from '../document-type/document-type.service';

@Component({
  selector: 'jhi-document-create',
  templateUrl: './document-create.component.html',
  styleUrls: ['./document-create.component.scss']
})
export class DocumentCreateComponent implements OnInit {
  isSaving: boolean;
  step: number;
  users: IUser[];
  dateCreationDp: any;
  types: any;

  idDELTIPOJAJAJ: any;

  documentStates: any;

  modalTitle: string;
  modalMsg: string;
  modalIcon: string;
  modalbtn: string;
  showModalMsg: boolean;

  nameOfDoc: string;

  lastDoc: any;
  departament: any;
  typeDoc: any;
  editForm = this.fb.group({
    id: [],
    codDoc: ['', [Validators.required]],
    nameDoc: ['', [Validators.required]],
    storage: [null, [Validators.required]],
    dateCreation: [null],
    departament: [null],
    state: [null],
    type: [null, [Validators.required]],
    duration: [null, [Validators.required]],
    finalDisposition: [null, [Validators.required]],
    origin: [null, [Validators.required]],
    doc: [null],
    docContentType: [],
    creator: [null]
  });

  dpte: any;
  nextId: any;
  informationUser: any = {};
  account$: Observable<Account>;
  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected documentService: DocumentService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private accountService: AccountService,
    protected docModificationService: DocModificationService,
    public languageService: JhiLanguageService,
    private dpteService: DepartamentService,
    private userDepartmentService: UserInDepartmentService,
    protected documentStateService: DocumentStateService,
    protected documentTypeService: DocumentTypeService
  ) {}

  ngOnInit() {
    this.showModalMsg = false;
    this.step = 1;
    this.isSaving = false;
    this.dpteService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    this.userDepartmentService.findByActualUser().subscribe(res => {
      this.departament = res.body[0].departament;
      // eslint-disable-next-line no-console
      console.log(this.departament);
      this.generateCode();
    });
    this.userService
      .query()
      .subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body), (res: HttpErrorResponse) => this.onError(res.message));

    this.account$ = this.accountService.identity();
    this.accountService.identity().subscribe(account => {
      this.updateUser(account);
    });

    this.documentService
      .query({
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IDocument[]>) => {
        if (res.body[0] !== undefined) {
          this.nextId = res.body[0].id + 1;
          // eslint-disable-next-line no-console
          console.log(this.nextId);
        } else {
          this.nextId = 1;
        }

        this.generateCode();
      });

    this.documentStateService
      .query({
        page: 0,
        size: 1000,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IDocumentState[]>) => this.paginateDocumentStates(res.body));

    this.documentTypeService
      .query({
        page: 0,
        size: 1000,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IDocumentType[]>) => this.paginateDocumentTypes(res.body));
  }

  protected paginateDocumentStates(data: IDocumentState[]) {
    this.documentStates = data;
    // eslint-disable-next-line no-console
    console.log(data);
  }

  protected paginateDocumentTypes(data: IDocumentType[]) {
    this.types = data;
    // eslint-disable-next-line no-console
    console.log(data);
  }

  previousState() {
    window.history.back();
  }

  nextStep(step) {
    // eslint-disable-next-line no-console
    console.log(this.departament);
    window.scroll(0, 0);
    if (step === 2) {
      this.typeDoc = document.getElementById('kindDoc');
      this.typeDoc = this.types.find(({ id }) => id === Number(this.typeDoc.value));
      this.idDELTIPOJAJAJ = this.typeDoc.id;
      this.typeDoc = this.typeDoc.name;
      // eslint-disable-next-line no-console
      console.log(this.typeDoc);
      if (
        this.editForm.get('nameDoc').valid &&
        this.editForm.get('codDoc').valid &&
        this.editForm.get('duration').valid &&
        this.editForm.get('finalDisposition').valid &&
        this.editForm.get('storage').valid &&
        this.typeDoc !== 'null' &&
        this.editForm.get('type').valid &&
        this.editForm.get('origin').valid
      ) {
        this.step = step;
      } else {
        this.modalTitle = `${this.getLabel('Empty Fields', 'Campos Vacíos')}`;
        this.modalMsg = `${this.getLabel('All fields are required', 'Todos los campos son requeridos')}`;
        this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
        this.modalIcon = 'warning';
        this.showModalMsg = true;
        return 0;
      }
    } else if (step === 3) {
      if (this.editForm.get('doc').value !== null) {
        this.step = step;
      } else {
        this.modalTitle = `${this.getLabel('Empty Field', 'Campo Vacío')}`;
        this.modalMsg = `${this.getLabel('Document is required', 'El documento es requerido')}`;
        this.modalbtn = `${this.getLabel('Accept', 'Aceptar')}`;
        this.modalIcon = 'warning';
        this.showModalMsg = true;
        return 0;
      }
    }
  }

  getDoc(type: string, name: string) {
    this.isSaving = true;
    const data = {
      title: this.editForm.get('nameDoc').value,
      codDoc: this.editForm.get('codDoc').value,
      creation: moment(),
      rev: 1,
      nameDoc: name,
      typeDoc: type
    };
    if (type === 'word') {
      this.nameOfDoc = 'template.docx';
      this.documentService
        .createDocument(data)
        .subscribe((res: HttpResponse<any>) => this.createdDocument(res), (res: HttpResponse<any>) => this.createdDocument(res));
    } else {
      this.nameOfDoc = 'template.xlsx';
      this.documentService
        .createDocument(data)
        .subscribe((res: HttpResponse<any>) => this.createdDocument(res), (res: HttpResponse<any>) => this.createdDocument(res));
    }
  }

  createdDocument(data: any) {
    const base64 = ''; // …
    const link = document.createElement('a');
    link.href = `data:${data.body[1]};base64,${data.body[0]}`;
    link.download = this.nameOfDoc;
    link.click();
    this.isSaving = false;
  }

  save(howSave: number) {
    // 0 = GUARDADO, 1 == REVISION
    this.isSaving = true;
    const GRACIASVILORIA = 'Jhipster? si gracias';

    this.editForm.patchValue({
      state: this.documentStates.find(({ id }) => id === Number(howSave))
    });

    const document = this.createFromForm();
    // eslint-disable-next-line no-console
    console.log(document);
    this.subscribeToSaveResponse(this.documentService.create(document));
  }

  private createFromForm(): IDocument {
    return {
      ...new Document(),
      id: null,
      codDoc: this.editForm.get(['codDoc']).value,
      nameDoc: this.editForm.get(['nameDoc']).value,
      storage: this.editForm.get(['storage']).value,
      dateCreation: moment(),
      departament: this.departament,
      state: this.editForm.get(['state']).value,
      type: this.types.find(({ id }) => id === Number(this.idDELTIPOJAJAJ)),
      duration: this.editForm.get(['duration']).value,
      finalDisposition: this.editForm.get(['finalDisposition']).value,
      origin: this.editForm.get(['origin']).value,
      docContentType: this.editForm.get(['docContentType']).value,
      doc: this.editForm.get(['doc']).value,
      creator: this.informationUser
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file: File = event.target.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            // eslint-disable-next-line no-console
            console.log(base64Data);
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      // eslint-disable-next-line no-console
      () => console.log('blob added'), // success
      this.onError
    );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocument>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.documentService
      .query({
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IDocument[]>) => this.paginateDocuments(res.body));
  }

  sort() {
    const result = ['id,' + 'desc'];
    result.push('id');
    return result;
  }

  protected paginateDocuments(data: IDocument[]) {
    this.lastDoc = data[0];
    // eslint-disable-next-line no-console
    console.log(this.lastDoc);
    const modification = this.createFromDoc(this.lastDoc);
    this.subscribeToSaveResponseDoc(this.docModificationService.create(modification));
  }

  protected subscribeToSaveResponseDoc(result: Observable<HttpResponse<IDocModification>>) {
    result.subscribe(() => this.onSaveSuccessDoc(), () => this.onSaveError());
  }

  protected onSaveSuccessDoc() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  private createFromDoc(IDoc) {
    return {
      ...new DocModification(),
      id: null,
      dateMod: moment(),
      commit: 'Creación del documento',
      version: '1.0',
      docContentType: this.editForm.get(['docContentType']).value,
      doc: this.editForm.get(['doc']).value,
      author: this.informationUser,
      docMod: IDoc
    };
  }

  closeModal(e) {
    this.modalTitle = '';
    this.modalMsg = '';
    this.modalbtn = '';
    this.modalIcon = '';
    this.showModalMsg = false;
    // eslint-disable-next-line no-console
    console.log(e);
  }

  private getLabel(english, spanish) {
    return this.languageService.currentLang === 'en' ? english : spanish;
  }

  updateUser(account: Account): void {
    this.informationUser = account;
  }

  generateCode() {
    let cod = '';
    if (this.editForm.get('type').value !== null && this.editForm.get('type').value !== '') {
      switch (this.editForm.get('type').value) {
        case '0':
          cod += 'PO-';
          break;
        case '1':
          cod += 'FO-';
          break;
        case '2':
          cod += 'IN-';
          break;
        case '3':
          cod += 'DO-';
          break;
      }
    }

    if (this.departament !== undefined) {
      cod += `${this.departament.shortDsc}-`;
    }

    if (this.nextId !== undefined) {
      cod += `${this.nextId}`;
    }

    this.editForm.patchValue({
      codDoc: cod
    });
  }
}
