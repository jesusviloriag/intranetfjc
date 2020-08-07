import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { ClosuresUpdateComponent } from 'app/entities/closures/closures-update.component';
import { ClosuresService } from 'app/entities/closures/closures.service';
import { Closures } from 'app/shared/model/closures.model';

describe('Component Tests', () => {
  describe('Closures Management Update Component', () => {
    let comp: ClosuresUpdateComponent;
    let fixture: ComponentFixture<ClosuresUpdateComponent>;
    let service: ClosuresService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [ClosuresUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ClosuresUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClosuresUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ClosuresService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Closures(123);
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
        const entity = new Closures();
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
