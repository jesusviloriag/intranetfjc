import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { ClosuresDetailComponent } from 'app/entities/closures/closures-detail.component';
import { Closures } from 'app/shared/model/closures.model';

describe('Component Tests', () => {
  describe('Closures Management Detail Component', () => {
    let comp: ClosuresDetailComponent;
    let fixture: ComponentFixture<ClosuresDetailComponent>;
    const route = ({ data: of({ closures: new Closures(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [ClosuresDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ClosuresDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ClosuresDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.closures).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
