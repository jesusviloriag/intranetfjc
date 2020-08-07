import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { ActionFindingService } from 'app/entities/action-finding/action-finding.service';
import { IActionFinding, ActionFinding } from 'app/shared/model/action-finding.model';

describe('Service Tests', () => {
  describe('ActionFinding Service', () => {
    let injector: TestBed;
    let service: ActionFindingService;
    let httpMock: HttpTestingController;
    let elemDefault: IActionFinding;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(ActionFindingService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ActionFinding(
        0,
        'AAAAAAA',
        currentDate,
        currentDate,
        currentDate,
        'AAAAAAA',
        'AAAAAAA',
        0,
        'image/png',
        'AAAAAAA',
        'AAAAAAA'
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateStartAction: currentDate.format(DATE_FORMAT),
            dateCommit: currentDate.format(DATE_FORMAT),
            dateRealCommit: currentDate.format(DATE_FORMAT)
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

      it('should create a ActionFinding', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateStartAction: currentDate.format(DATE_FORMAT),
            dateCommit: currentDate.format(DATE_FORMAT),
            dateRealCommit: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateStartAction: currentDate,
            dateCommit: currentDate,
            dateRealCommit: currentDate
          },
          returnedFromService
        );
        service
          .create(new ActionFinding(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a ActionFinding', () => {
        const returnedFromService = Object.assign(
          {
            descAction: 'BBBBBB',
            dateStartAction: currentDate.format(DATE_FORMAT),
            dateCommit: currentDate.format(DATE_FORMAT),
            dateRealCommit: currentDate.format(DATE_FORMAT),
            descHow: 'BBBBBB',
            involved: 'BBBBBB',
            status: 1,
            evidenceDoc: 'BBBBBB',
            observation: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateStartAction: currentDate,
            dateCommit: currentDate,
            dateRealCommit: currentDate
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

      it('should return a list of ActionFinding', () => {
        const returnedFromService = Object.assign(
          {
            descAction: 'BBBBBB',
            dateStartAction: currentDate.format(DATE_FORMAT),
            dateCommit: currentDate.format(DATE_FORMAT),
            dateRealCommit: currentDate.format(DATE_FORMAT),
            descHow: 'BBBBBB',
            involved: 'BBBBBB',
            status: 1,
            evidenceDoc: 'BBBBBB',
            observation: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateStartAction: currentDate,
            dateCommit: currentDate,
            dateRealCommit: currentDate
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

      it('should delete a ActionFinding', () => {
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
