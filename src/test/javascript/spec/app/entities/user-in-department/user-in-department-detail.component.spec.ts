import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { UserInDepartmentDetailComponent } from 'app/entities/user-in-department/user-in-department-detail.component';
import { UserInDepartment } from 'app/shared/model/user-in-department.model';

describe('Component Tests', () => {
  describe('UserInDepartment Management Detail Component', () => {
    let comp: UserInDepartmentDetailComponent;
    let fixture: ComponentFixture<UserInDepartmentDetailComponent>;
    const route = ({ data: of({ userInDepartment: new UserInDepartment(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [UserInDepartmentDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(UserInDepartmentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserInDepartmentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userInDepartment).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
