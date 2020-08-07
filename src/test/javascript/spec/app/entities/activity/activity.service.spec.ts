import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { ActivityService } from 'app/entities/activity/activity.service';
import { IActivity, Activity } from 'app/shared/model/activity.model';

describe('Service Tests', () => {
  describe('Activity Service', () => {
    let injector: TestBed;
    let service: ActivityService;
    let httpMock: HttpTestingController;
    let elemDefault: IActivity;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(ActivityService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Activity(0, 'AAAAAAA', currentDate, currentDate, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 0, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateStart: currentDate.format(DATE_FORMAT),
            dateLimit: currentDate.format(DATE_FORMAT),
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

      it('should create a Activity', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateStart: currentDate.format(DATE_FORMAT),
            dateLimit: currentDate.format(DATE_FORMAT),
            dateClosure: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateStart: currentDate,
            dateLimit: currentDate,
            dateClosure: currentDate
          },
          returnedFromService
        );
        service
          .create(new Activity(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Activity', () => {
        const returnedFromService = Object.assign(
          {
            nameActivity: 'BBBBBB',
            dateStart: currentDate.format(DATE_FORMAT),
            dateLimit: currentDate.format(DATE_FORMAT),
            description: 'BBBBBB',
            deliverables: 'BBBBBB',
            dept: 'BBBBBB',
            involvedActivity: 'BBBBBB',
            status: 1,
            dateClosure: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateStart: currentDate,
            dateLimit: currentDate,
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

      it('should return a list of Activity', () => {
        const returnedFromService = Object.assign(
          {
            nameActivity: 'BBBBBB',
            dateStart: currentDate.format(DATE_FORMAT),
            dateLimit: currentDate.format(DATE_FORMAT),
            description: 'BBBBBB',
            deliverables: 'BBBBBB',
            dept: 'BBBBBB',
            involvedActivity: 'BBBBBB',
            status: 1,
            dateClosure: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateStart: currentDate,
            dateLimit: currentDate,
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

      it('should delete a Activity', () => {
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
