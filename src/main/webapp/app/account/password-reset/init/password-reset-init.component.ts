import { Component, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { EMAIL_NOT_FOUND_TYPE } from 'app/shared/constants/error.constants';
import { PasswordResetInitService } from './password-reset-init.service';

@Component({
  selector: 'jhi-password-reset-init',
  templateUrl: './password-reset-init.component.html',
  styleUrls: ['password-reset-init.scss']
})
export class PasswordResetInitComponent implements AfterViewInit {
  error: string;
  errorEmailNotExists: string;
  success: string;
  isSaving: boolean;
  resetRequestForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]]
    },
    { updateOn: 'submit' }
  );

  constructor(
    private passwordResetInitService: PasswordResetInitService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.isSaving = false;
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#email'), 'focus', []);
  }

  requestReset() {
    this.error = null;
    this.errorEmailNotExists = null;

    if (!this.resetRequestForm.get(['email']).invalid) {
      this.isSaving = true;
      this.passwordResetInitService.save(this.resetRequestForm.get(['email']).value).subscribe(
        () => {
          this.isSaving = false;
          this.success = 'OK';
          localStorage.setItem('emailRecover', this.resetRequestForm.get(['email']).value);
          this.router.navigateByUrl('/account/reset/confirm');
        },
        response => {
          this.isSaving = false;
          this.success = null;
          if (response.status === 400 && response.error.type === EMAIL_NOT_FOUND_TYPE) {
            this.errorEmailNotExists = 'ERROR';
          } else {
            this.error = 'ERROR';
          }
        }
      );
    }
  }
}
