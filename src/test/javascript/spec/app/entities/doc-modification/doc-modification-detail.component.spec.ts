import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { DocModificationDetailComponent } from 'app/entities/doc-modification/doc-modification-detail.component';
import { DocModification } from 'app/shared/model/doc-modification.model';

describe('Component Tests', () => {
  describe('DocModification Management Detail Component', () => {
    let comp: DocModificationDetailComponent;
    let fixture: ComponentFixture<DocModificationDetailComponent>;
    const route = ({ data: of({ docModification: new DocModification(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DocModificationDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DocModificationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocModificationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.docModification).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
