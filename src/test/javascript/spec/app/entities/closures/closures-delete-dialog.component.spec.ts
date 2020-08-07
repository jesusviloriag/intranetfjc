import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FjcintranetTestModule } from '../../../test.module';
import { ClosuresDeleteDialogComponent } from 'app/entities/closures/closures-delete-dialog.component';
import { ClosuresService } from 'app/entities/closures/closures.service';

describe('Component Tests', () => {
  describe('Closures Management Delete Component', () => {
    let comp: ClosuresDeleteDialogComponent;
    let fixture: ComponentFixture<ClosuresDeleteDialogComponent>;
    let service: ClosuresService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [ClosuresDeleteDialogComponent]
      })
        .overrideTemplate(ClosuresDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ClosuresDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ClosuresService);
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
