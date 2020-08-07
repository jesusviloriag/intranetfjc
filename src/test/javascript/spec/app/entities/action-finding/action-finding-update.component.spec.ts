import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { ActionFindingUpdateComponent } from 'app/entities/action-finding/action-finding-update.component';
import { ActionFindingService } from 'app/entities/action-finding/action-finding.service';
import { ActionFinding } from 'app/shared/model/action-finding.model';

describe('Component Tests', () => {
  describe('ActionFinding Management Update Component', () => {
    let comp: ActionFindingUpdateComponent;
    let fixture: ComponentFixture<ActionFindingUpdateComponent>;
    let service: ActionFindingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [ActionFindingUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ActionFindingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActionFindingUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActionFindingService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ActionFinding(123);
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
        const entity = new ActionFinding();
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
