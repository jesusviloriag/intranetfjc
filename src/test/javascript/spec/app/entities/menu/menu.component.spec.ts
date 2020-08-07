import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data } from '@angular/router';

import { FjcintranetTestModule } from '../../../test.module';
import { MenuComponent } from 'app/entities/menu/menu.component';
import { MenuService } from 'app/entities/menu/menu.service';
import { Menu } from 'app/shared/model/menu.model';

describe('Component Tests', () => {
  describe('Menu Management Component', () => {
    let comp: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;
    let service: MenuService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FjcintranetTestModule],
        declarations: [MenuComponent]
      })
        .overrideTemplate(MenuComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MenuComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MenuService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Menu(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.menus[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
