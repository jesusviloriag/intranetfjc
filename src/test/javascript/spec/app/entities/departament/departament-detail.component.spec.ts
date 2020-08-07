import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FjcintranetTestModule } from '../../../test.module';
import { DepartamentDetailComponent } from 'app/entities/departament/departament-detail.component';
import { Departament } from 'app/shared/model/departament.model';

describe('Component Tests', () => {
  describe('Departament Management Detail Component', () => {
    let comp: DepartamentDetailComponent;
    let fixture: ComponentFixture<DepartamentDetailComponent>;
    const route = ({ data: of({ departament: new Departament(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [DepartamentDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DepartamentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DepartamentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.departament).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
