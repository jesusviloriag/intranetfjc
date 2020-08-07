import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { DocModificationService } from 'app/entities/doc-modification/doc-modification.service';
import { IDocModification, DocModification } from 'app/shared/model/doc-modification.model';

describe('Service Tests', () => {
  describe('DocModification Service', () => {
    let injector: TestBed;
    let service: DocModificationService;
    let httpMock: HttpTestingController;
    let elemDefault: IDocModification;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(DocModificationService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new DocModification(0, currentDate, 'AAAAAAA', 'AAAAAAA', 'image/png', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateMod: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a DocModification', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateMod: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateMod: currentDate
          },
          returnedFromService
        );
        service
          .create(new DocModification(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a DocModification', () => {
        const returnedFromService = Object.assign(
          {
            dateMod: currentDate.format(DATE_FORMAT),
            commit: 'BBBBBB',
            version: 'BBBBBB',
            doc: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateMod: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of DocModification', () => {
        const returnedFromService = Object.assign(
          {
            dateMod: currentDate.format(DATE_FORMAT),
            commit: 'BBBBBB',
            version: 'BBBBBB',
            doc: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateMod: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a DocModification', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
