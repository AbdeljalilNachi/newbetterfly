jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IObjectif, Objectif } from '../objectif.model';
import { ObjectifService } from '../service/objectif.service';

import { ObjectifRoutingResolveService } from './objectif-routing-resolve.service';

describe('Service Tests', () => {
  describe('Objectif routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ObjectifRoutingResolveService;
    let service: ObjectifService;
    let resultObjectif: IObjectif | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ObjectifRoutingResolveService);
      service = TestBed.inject(ObjectifService);
      resultObjectif = undefined;
    });

    describe('resolve', () => {
      it('should return IObjectif returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultObjectif = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultObjectif).toEqual({ id: 123 });
      });

      it('should return new IObjectif if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultObjectif = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultObjectif).toEqual(new Objectif());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultObjectif = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultObjectif).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
