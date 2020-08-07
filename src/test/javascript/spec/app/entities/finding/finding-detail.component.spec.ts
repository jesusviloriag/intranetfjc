import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { FindingDetailComponent } from 'app/entities/finding/finding-detail.component';
import { Finding } from 'app/shared/model/finding.model';

describe('Component Tests', () => {
  describe('Finding Management Detail Component', () => {
    let comp: FindingDetailComponent;
    let fixture: ComponentFixture<FindingDetailComponent>;
    const route = ({ data: of({ finding: new Finding(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [FindingDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(FindingDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FindingDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.finding).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
