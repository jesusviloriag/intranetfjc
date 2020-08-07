import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FjcintranetTestModule } from '../../../test.module';
import { FindingDeleteDialogComponent } from 'app/entities/finding/finding-delete-dialog.component';
import { FindingService } from 'app/entities/finding/finding.service';

describe('Component Tests', () => {
  describe('Finding Management Delete Component', () => {
    let comp: FindingDeleteDialogComponent;
    let fixture: ComponentFixture<FindingDeleteDialogComponent>;
    let service: FindingService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [FindingDeleteDialogComponent]
      })
        .overrideTemplate(FindingDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FindingDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FindingService);
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
