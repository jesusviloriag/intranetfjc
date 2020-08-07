import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { DocumentStateDetailComponent } from 'app/entities/document-state/document-state-detail.component';
import { DocumentState } from 'app/shared/model/document-state.model';

describe('Component Tests', () => {
  describe('DocumentState Management Detail Component', () => {
    let comp: DocumentStateDetailComponent;
    let fixture: ComponentFixture<DocumentStateDetailComponent>;
    const route = ({ data: of({ documentState: new DocumentState(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DocumentStateDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DocumentStateDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocumentStateDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.documentState).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
