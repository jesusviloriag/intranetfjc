import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FjcintranetTestModule } from '../../../test.module';
import { DocumentStateDeleteDialogComponent } from 'app/entities/document-state/document-state-delete-dialog.component';
import { DocumentStateService } from 'app/entities/document-state/document-state.service';

describe('Component Tests', () => {
  describe('DocumentState Management Delete Component', () => {
    let comp: DocumentStateDeleteDialogComponent;
    let fixture: ComponentFixture<DocumentStateDeleteDialogComponent>;
    let service: DocumentStateService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DocumentStateDeleteDialogComponent]
      })
        .overrideTemplate(DocumentStateDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocumentStateDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocumentStateService);
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
