import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { UserInDepartmentUpdateComponent } from 'app/entities/user-in-department/user-in-department-update.component';
import { UserInDepartmentService } from 'app/entities/user-in-department/user-in-department.service';
import { UserInDepartment } from 'app/shared/model/user-in-department.model';

describe('Component Tests', () => {
  describe('UserInDepartment Management Update Component', () => {
    let comp: UserInDepartmentUpdateComponent;
    let fixture: ComponentFixture<UserInDepartmentUpdateComponent>;
    let service: UserInDepartmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [UserInDepartmentUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(UserInDepartmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserInDepartmentUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserInDepartmentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new UserInDepartment(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new UserInDepartment();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
