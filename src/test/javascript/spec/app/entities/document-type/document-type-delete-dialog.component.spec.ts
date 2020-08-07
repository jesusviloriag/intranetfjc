import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FjcintranetTestModule } from '../../../test.module';
import { DocumentTypeDeleteDialogComponent } from 'app/entities/document-type/document-type-delete-dialog.component';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';

describe('Component Tests', () => {
  describe('DocumentType Management Delete Component', () => {
    let comp: DocumentTypeDeleteDialogComponent;
    let fixture: ComponentFixture<DocumentTypeDeleteDialogComponent>;
    let service: DocumentTypeService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DocumentTypeDeleteDialogComponent]
      })
        .overrideTemplate(DocumentTypeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocumentTypeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocumentTypeService);
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
