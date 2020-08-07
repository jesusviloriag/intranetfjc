import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { DocumentStateUpdateComponent } from 'app/entities/document-state/document-state-update.component';
import { DocumentStateService } from 'app/entities/document-state/document-state.service';
import { DocumentState } from 'app/shared/model/document-state.model';

describe('Component Tests', () => {
  describe('DocumentState Management Update Component', () => {
    let comp: DocumentStateUpdateComponent;
    let fixture: ComponentFixture<DocumentStateUpdateComponent>;
    let service: DocumentStateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DocumentStateUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DocumentStateUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DocumentStateUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocumentStateService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DocumentState(123);
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
        const entity = new DocumentState();
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
