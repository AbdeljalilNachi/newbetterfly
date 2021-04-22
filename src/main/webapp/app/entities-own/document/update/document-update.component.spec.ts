jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DocumentService } from '../service/document.service';
import { IDocument, Document } from '../document.model';
import { IProcessusSMI } from 'app/entities-own/processus-smi/processus-smi.model';
import { ProcessusSMIService } from 'app/entities-own/processus-smi/service/processus-smi.service';

import { DocumentUpdateComponent } from './document-update.component';

describe('Component Tests', () => {
  describe('Document Management Update Component', () => {
    let comp: DocumentUpdateComponent;
    let fixture: ComponentFixture<DocumentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let documentService: DocumentService;
    let processusSMIService: ProcessusSMIService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DocumentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DocumentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DocumentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      documentService = TestBed.inject(DocumentService);
      processusSMIService = TestBed.inject(ProcessusSMIService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ProcessusSMI query and add missing value', () => {
        const document: IDocument = { id: 456 };
        const processus: IProcessusSMI = { id: 36644 };
        document.processus = processus;

        const processusSMICollection: IProcessusSMI[] = [{ id: 23511 }];
        spyOn(processusSMIService, 'query').and.returnValue(of(new HttpResponse({ body: processusSMICollection })));
        const additionalProcessusSMIS = [processus];
        const expectedCollection: IProcessusSMI[] = [...additionalProcessusSMIS, ...processusSMICollection];
        spyOn(processusSMIService, 'addProcessusSMIToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ document });
        comp.ngOnInit();

        expect(processusSMIService.query).toHaveBeenCalled();
        expect(processusSMIService.addProcessusSMIToCollectionIfMissing).toHaveBeenCalledWith(
          processusSMICollection,
          ...additionalProcessusSMIS
        );
        expect(comp.processusSMISSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const document: IDocument = { id: 456 };
        const processus: IProcessusSMI = { id: 91237 };
        document.processus = processus;

        activatedRoute.data = of({ document });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(document));
        expect(comp.processusSMISSharedCollection).toContain(processus);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const document = { id: 123 };
        spyOn(documentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ document });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: document }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(documentService.update).toHaveBeenCalledWith(document);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const document = new Document();
        spyOn(documentService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ document });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: document }));
        saveSubject.complete();

        // THEN
        expect(documentService.create).toHaveBeenCalledWith(document);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const document = { id: 123 };
        spyOn(documentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ document });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(documentService.update).toHaveBeenCalledWith(document);
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
