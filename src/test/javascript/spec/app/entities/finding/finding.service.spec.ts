import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { FindingService } from 'app/entities/finding/finding.service';
import { IFinding, Finding } from 'app/shared/model/finding.model';

describe('Service Tests', () => {
  describe('Finding Service', () => {
    let injector: TestBed;
    let service: FindingService;
    let httpMock: HttpTestingController;
    let elemDefault: IFinding;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(FindingService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Finding(
        0,
        'AAAAAAA',
        currentDate,
        currentDate,
        currentDate,
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'image/png',
        'AAAAAAA',
        'AAAAAAA',
        0,
        0,
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA'
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateStart: currentDate.format(DATE_FORMAT),
            dateEnd: currentDate.format(DATE_FORMAT),
            dateClosure: currentDate.format(DATE_FORMAT)
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

      it('should create a Finding', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateStart: currentDate.format(DATE_FORMAT),
            dateEnd: currentDate.format(DATE_FORMAT),
            dateClosure: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateStart: currentDate,
            dateEnd: currentDate,
            dateClosure: currentDate
          },
          returnedFromService
        );
        service
          .create(new Finding(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Finding', () => {
        const returnedFromService = Object.assign(
          {
            codFinding: 'BBBBBB',
            dateStart: currentDate.format(DATE_FORMAT),
            dateEnd: currentDate.format(DATE_FORMAT),
            dateClosure: currentDate.format(DATE_FORMAT),
            description: 'BBBBBB',
            evidence: 'BBBBBB',
            methodology: 'BBBBBB',
            linkDoc: 'BBBBBB',
            descHow: 'BBBBBB',
            typeFinding: 1,
            deptInvol: 1,
            identificationCause: 'BBBBBB',
            correctiveAct: 'BBBBBB',
            actionDesc: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateStart: currentDate,
            dateEnd: currentDate,
            dateClosure: currentDate
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

      it('should return a list of Finding', () => {
        const returnedFromService = Object.assign(
          {
            codFinding: 'BBBBBB',
            dateStart: currentDate.format(DATE_FORMAT),
            dateEnd: currentDate.format(DATE_FORMAT),
            dateClosure: currentDate.format(DATE_FORMAT),
            description: 'BBBBBB',
            evidence: 'BBBBBB',
            methodology: 'BBBBBB',
            linkDoc: 'BBBBBB',
            descHow: 'BBBBBB',
            typeFinding: 1,
            deptInvol: 1,
            identificationCause: 'BBBBBB',
            correctiveAct: 'BBBBBB',
            actionDesc: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateStart: currentDate,
            dateEnd: currentDate,
            dateClosure: currentDate
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

      it('should delete a Finding', () => {
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
