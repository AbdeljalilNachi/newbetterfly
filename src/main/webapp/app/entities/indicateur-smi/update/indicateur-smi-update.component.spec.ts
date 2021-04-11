jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IndicateurSMIService } from '../service/indicateur-smi.service';
import { IIndicateurSMI, IndicateurSMI } from '../indicateur-smi.model';
import { IProcessusSMI } from 'app/entities/processus-smi/processus-smi.model';
import { ProcessusSMIService } from 'app/entities/processus-smi/service/processus-smi.service';

import { IndicateurSMIUpdateComponent } from './indicateur-smi-update.component';

describe('Component Tests', () => {
  describe('IndicateurSMI Management Update Component', () => {
    let comp: IndicateurSMIUpdateComponent;
    let fixture: ComponentFixture<IndicateurSMIUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let indicateurSMIService: IndicateurSMIService;
    let processusSMIService: ProcessusSMIService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [IndicateurSMIUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(IndicateurSMIUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IndicateurSMIUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      indicateurSMIService = TestBed.inject(IndicateurSMIService);
      processusSMIService = TestBed.inject(ProcessusSMIService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ProcessusSMI query and add missing value', () => {
        const indicateurSMI: IIndicateurSMI = { id: 456 };
        const processus: IProcessusSMI = { id: 16544 };
        indicateurSMI.processus = processus;

        const processusSMICollection: IProcessusSMI[] = [{ id: 15891 }];
        spyOn(processusSMIService, 'query').and.returnValue(of(new HttpResponse({ body: processusSMICollection })));
        const additionalProcessusSMIS = [processus];
        const expectedCollection: IProcessusSMI[] = [...additionalProcessusSMIS, ...processusSMICollection];
        spyOn(processusSMIService, 'addProcessusSMIToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ indicateurSMI });
        comp.ngOnInit();

        expect(processusSMIService.query).toHaveBeenCalled();
        expect(processusSMIService.addProcessusSMIToCollectionIfMissing).toHaveBeenCalledWith(
          processusSMICollection,
          ...additionalProcessusSMIS
        );
        expect(comp.processusSMISSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const indicateurSMI: IIndicateurSMI = { id: 456 };
        const processus: IProcessusSMI = { id: 68904 };
        indicateurSMI.processus = processus;

        activatedRoute.data = of({ indicateurSMI });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(indicateurSMI));
        expect(comp.processusSMISSharedCollection).toContain(processus);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const indicateurSMI = { id: 123 };
        spyOn(indicateurSMIService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ indicateurSMI });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: indicateurSMI }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(indicateurSMIService.update).toHaveBeenCalledWith(indicateurSMI);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const indicateurSMI = new IndicateurSMI();
        spyOn(indicateurSMIService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ indicateurSMI });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: indicateurSMI }));
        saveSubject.complete();

        // THEN
        expect(indicateurSMIService.create).toHaveBeenCalledWith(indicateurSMI);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const indicateurSMI = { id: 123 };
        spyOn(indicateurSMIService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ indicateurSMI });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(indicateurSMIService.update).toHaveBeenCalledWith(indicateurSMI);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProcessusSMIById', () => {
        it('Should return tracked ProcessusSMI primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProcessusSMIById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
