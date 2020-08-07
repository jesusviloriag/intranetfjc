import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FjcintranetTestModule } from '../../../test.module';
import { DepartamentDeleteDialogComponent } from 'app/entities/departament/departament-delete-dialog.component';
import { DepartamentService } from 'app/entities/departament/departament.service';

describe('Component Tests', () => {
  describe('Departament Management Delete Component', () => {
    let comp: DepartamentDeleteDialogComponent;
    let fixture: ComponentFixture<DepartamentDeleteDialogComponent>;
    let service: DepartamentService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DepartamentDeleteDialogComponent]
      })
        .overrideTemplate(DepartamentDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DepartamentDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DepartamentService);
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
