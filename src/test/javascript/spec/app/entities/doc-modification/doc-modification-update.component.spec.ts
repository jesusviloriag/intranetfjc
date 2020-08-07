import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { DocModificationUpdateComponent } from 'app/entities/doc-modification/doc-modification-update.component';
import { DocModificationService } from 'app/entities/doc-modification/doc-modification.service';
import { DocModification } from 'app/shared/model/doc-modification.model';

describe('Component Tests', () => {
  describe('DocModification Management Update Component', () => {
    let comp: DocModificationUpdateComponent;
    let fixture: ComponentFixture<DocModificationUpdateComponent>;
    let service: DocModificationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DocModificationUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DocModificationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DocModificationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocModificationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DocModification(123);
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
        const entity = new DocModification();
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
