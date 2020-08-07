import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FjcintranetTestModule } from '../../../test.module';
import { DocModificationDeleteDialogComponent } from 'app/entities/doc-modification/doc-modification-delete-dialog.component';
import { DocModificationService } from 'app/entities/doc-modification/doc-modification.service';

describe('Component Tests', () => {
  describe('DocModification Management Delete Component', () => {
    let comp: DocModificationDeleteDialogComponent;
    let fixture: ComponentFixture<DocModificationDeleteDialogComponent>;
    let service: DocModificationService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DocModificationDeleteDialogComponent]
      })
        .overrideTemplate(DocModificationDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocModificationDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DocModificationService);
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
