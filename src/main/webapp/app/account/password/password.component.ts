import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { PasswordService } from './password.service';
import { LoginService } from 'app/core/login/login.service';

@Component({
  selector: 'jhi-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  doNotMatch: string;
  error: string;
  success: string;
  emptyInputs: string;
  information: any = {};
  isSaving: boolean;
  departament: any;
  account$: Observable<Account>;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
  });

  constructor(
    private loginService: LoginService,
    private passwordService: PasswordService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.isSaving = false;
  }

  ngOnInit() {
    this.account$ = this.accountService.identity();
    this.accountService.identity().subscribe(account => {
      this.updateForm(account);
    });
  }

  private onSuccess(result: any) {
    this.departament = result[0];
  }

  changePassword() {
    window.scroll(0, 0);
    const newPassword = this.passwordForm.get(['newPassword']).value;
    if (
      newPassword === '' ||
      this.passwordForm.get(['confirmPassword']).value === '' ||
      this.passwordForm.get(['currentPassword']).value === ''
    ) {
      this.emptyInputs = 'ERROR';
      this.error = null;
      this.success = null;
      this.doNotMatch = null;
    } else if (newPassword !== this.passwordForm.get(['confirmPassword']).value) {
      this.error = null;
      this.success = null;
      this.doNotMatch = 'ERROR';
      this.emptyInputs = null;
    } else {
      this.emptyInputs = null;
      this.doNotMatch = null;
      this.isSaving = true;
      this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword']).value).subscribe(
        () => {
          this.isSaving = false;
          this.error = null;
          this.success = 'OK';
        },
        () => {
          this.isSaving = false;
          this.success = null;
          this.error = 'ERROR';
        }
      );
    }
  }

  updateForm(account: Account): void {
    this.information.firstName = account.firstName;
    this.information.lastName = account.lastName;
    this.information.email = account.email;
    this.information.login = account.login;
    this.information.departament = account.departaments[0].nameDepartament;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
