import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FjcintranetTestModule } from '../../../test.module';
import { ActionFindingDeleteDialogComponent } from 'app/entities/action-finding/action-finding-delete-dialog.component';
import { ActionFindingService } from 'app/entities/action-finding/action-finding.service';

describe('Component Tests', () => {
  describe('ActionFinding Management Delete Component', () => {
    let comp: ActionFindingDeleteDialogComponent;
    let fixture: ComponentFixture<ActionFindingDeleteDialogComponent>;
    let service: ActionFindingService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [ActionFindingDeleteDialogComponent]
      })
        .overrideTemplate(ActionFindingDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActionFindingDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActionFindingService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
