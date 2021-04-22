jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AuditService } from '../service/audit.service';
import { IAudit, Audit } from '../audit.model';

import { AuditUpdateComponent } from './audit-update.component';

describe('Component Tests', () => {
  describe('Audit Management Update Component', () => {
    let comp: AuditUpdateComponent;
    let fixture: ComponentFixture<AuditUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let auditService: AuditService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AuditUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AuditUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AuditUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      auditService = TestBed.inject(AuditService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const audit: IAudit = { id: 456 };

        activatedRoute.data = of({ audit });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(audit));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const audit = { id: 123 };
        spyOn(auditService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ audit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: audit }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(auditService.update).toHaveBeenCalledWith(audit);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const audit = new Audit();
        spyOn(auditService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ audit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: audit }));
        saveSubject.complete();

        // THEN
        expect(auditService.create).toHaveBeenCalledWith(audit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const audit = { id: 123 };
        spyOn(auditService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ audit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(auditService.update).toHaveBeenCalledWith(audit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
