import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-confirm-recover',
  templateUrl: './confirm-recover.component.html',
  styleUrls: ['confirm-recover.component.scss']
})
export class ConfirmRecoverComponent implements OnInit {
  receiveForm = this.fb.group({
    email: [`${localStorage.getItem('emailRecover')}`]
  });

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {}

  validate() {
    this.router.navigate(['/']);
  }
}
