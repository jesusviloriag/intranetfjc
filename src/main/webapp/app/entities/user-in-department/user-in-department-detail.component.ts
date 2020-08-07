import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserInDepartment } from 'app/shared/model/user-in-department.model';

@Component({
  selector: 'jhi-user-in-department-detail',
  templateUrl: './user-in-department-detail.component.html'
})
export class UserInDepartmentDetailComponent implements OnInit {
  userInDepartment: IUserInDepartment;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ userInDepartment }) => {
      this.userInDepartment = userInDepartment;
    });
  }

  previousState() {
    window.history.back();
  }
}
