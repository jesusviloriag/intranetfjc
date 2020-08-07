import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { FindingUpdateComponent } from 'app/entities/finding/finding-update.component';
import { FindingService } from 'app/entities/finding/finding.service';
import { Finding } from 'app/shared/model/finding.model';

describe('Component Tests', () => {
  describe('Finding Management Update Component', () => {
    let comp: FindingUpdateComponent;
    let fixture: ComponentFixture<FindingUpdateComponent>;
    let service: FindingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [FindingUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(FindingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FindingUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FindingService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Finding(123);
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
        const entity = new Finding();
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
