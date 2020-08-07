import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { ActionFindingDetailComponent } from 'app/entities/action-finding/action-finding-detail.component';
import { ActionFinding } from 'app/shared/model/action-finding.model';

describe('Component Tests', () => {
  describe('ActionFinding Management Detail Component', () => {
    let comp: ActionFindingDetailComponent;
    let fixture: ComponentFixture<ActionFindingDetailComponent>;
    const route = ({ data: of({ actionFinding: new ActionFinding(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [ActionFindingDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ActionFindingDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActionFindingDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.actionFinding).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
