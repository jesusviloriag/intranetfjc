import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { DepartamentUpdateComponent } from 'app/entities/departament/departament-update.component';
import { DepartamentService } from 'app/entities/departament/departament.service';
import { Departament } from 'app/shared/model/departament.model';

describe('Component Tests', () => {
  describe('Departament Management Update Component', () => {
    let comp: DepartamentUpdateComponent;
    let fixture: ComponentFixture<DepartamentUpdateComponent>;
    let service: DepartamentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DepartamentUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DepartamentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DepartamentUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DepartamentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Departament(123);
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
        const entity = new Departament();
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
