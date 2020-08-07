import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageHelper } from 'app/core/language/language.helper';
import { User } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IDepartament, Departament } from 'app/shared/model/departament.model';
import { DepartamentService } from 'app/entities/departament/departament.service';
import { IUserInDepartment, UserInDepartment } from 'app/shared/model/user-in-department.model';
import { UserInDepartmentService } from 'app/entities/user-in-department/user-in-department.service';
import { Observable } from 'rxjs';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared/constants/error.constants';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  doNotMatch: string;
  user: User;
  error: string;
  errorEmailExists: string;
  errorUserExists: string;
  success: boolean;
  modalRef: NgbModalRef;
  isSaving: boolean;
  languages: any[];
  authorities: any[];
  userCreated: any;
  dpte: any;
  departament: any;
  departamentSelected: any;

  registeredUser: any;

  registerForm = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern('^[_.@A-Za-z0-9-]*$')]],
    firstName: [undefined, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    authorities: ['', Validators.required],
    language: ['', Validators.required],
    activated: [false],
    departament: ['', Validators.required]
  });

  constructor(
    private userService: UserService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private languageHelper: JhiLanguageHelper,
    private fb: FormBuilder,
    private departamentService: DepartamentService,
    protected userDepartmentService: UserInDepartmentService
  ) {}

  ngOnInit() {
    this.departamentService.findAll('all').subscribe((res: HttpResponse<IDepartament[]>) => {
      this.dpte = res.body;
    });
    this.isSaving = false;
    this.success = false;
    this.languages = this.languageHelper.getAll();
    this.authorities = [];
    this.userService.authorities().subscribe(authorities => {
      this.authorities = authorities;
    });
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
  }

  register() {
    let registerUser = {};
    const login = this.registerForm.get(['login']).value;
    const firstName = this.registerForm.get(['firstName']).value;
    const lastName = this.registerForm.get(['lastName']).value;
    const email = this.registerForm.get(['email']).value;
    const password = this.registerForm.get(['password']).value;
    const authorities = this.registerForm.get(['authorities']).value;
    const langKey = this.registerForm.get('language').value;
    const activated = this.registerForm.get(['activated']).value;

    if (password !== this.registerForm.get(['confirmPassword']).value) {
      this.doNotMatch = 'ERROR';
    } else {
      if (authorities[0] === 'ROLE_ADMIN') {
        authorities.push('ROLE_USER');
      }
      registerUser = { ...registerUser, login, firstName, lastName, email, activated, langKey, authorities };
      this.departamentSelected = this.getDepartament(this.registerForm.get(['departament']).value);

      this.user = registerUser;
      this.doNotMatch = null;
      this.error = null;
      this.errorUserExists = null;
      this.errorEmailExists = null;
      this.isSaving = true;
      this.userService.create(this.user).subscribe(() => this.onSaveSuccessUser(), res => this.processError(res));
    }
  }

  private onSaveSuccessUser() {
    this.userService
      .query({
        page: 0,
        size: 5,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<User[]>) => this.onSuccess(res.body), (res: HttpResponse<any>) => this.onError(res.body));
  }

  private onSuccess(data) {
    const lastUser = data;
    // eslint-disable-next-line no-console
    console.log(lastUser);
    this.user = lastUser[0];
    const registerDepartament = this.createFromForm();

    this.subscribeToSaveResponse(this.userDepartmentService.create(registerDepartament));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserInDepartment>>) {
    result.subscribe(() => this.onSaveSuccessDept(), res => this.processError(res));
  }

  private onError(error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  private createFromForm(): IUserInDepartment {
    return {
      ...new UserInDepartment(),
      id: null,
      departament: this.getDepartament(this.registerForm.get(['departament']).value),
      user: this.user
    };
  }

  private getDepartament(idDept: any) {
    return this.dpte.find(({ id }) => id === Number(idDept));
  }

  private onSaveSuccessDept() {
    this.isSaving = false;
    window.history.back();
  }

  sort() {
    const result = ['id,desc'];
    return result;
  }

  private processError(response: HttpErrorResponse) {
    // eslint-disable-next-line no-console
    console.log(response);
    this.isSaving = false;
    this.success = null;
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = 'ERROR';
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = 'ERROR';
    } else {
      this.error = 'ERROR';
    }
  }
}
