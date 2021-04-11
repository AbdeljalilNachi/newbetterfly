import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAudit, Audit } from '../audit.model';
import { AuditService } from '../service/audit.service';

@Component({
  selector: 'jhi-audit-update',
  templateUrl: './audit-update.component.html',
})
export class AuditUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dateAudit: [],
    typeAudit: [],
    auditeur: [],
    standard: [],
    iD: [],
    statut: [],
    conclusion: [],
  });

  constructor(protected auditService: AuditService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ audit }) => {
      this.updateForm(audit);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const audit = this.createFromForm();
    if (audit.id !== undefined) {
      this.subscribeToSaveResponse(this.auditService.update(audit));
    } else {
      this.subscribeToSaveResponse(this.auditService.create(audit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAudit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(audit: IAudit): void {
    this.editForm.patchValue({
      id: audit.id,
      dateAudit: audit.dateAudit,
      typeAudit: audit.typeAudit,
      auditeur: audit.auditeur,
      standard: audit.standard,
      iD: audit.iD,
      statut: audit.statut,
      conclusion: audit.conclusion,
    });
  }

  protected createFromForm(): IAudit {
    return {
      ...new Audit(),
      id: this.editForm.get(['id'])!.value,
      dateAudit: this.editForm.get(['dateAudit'])!.value,
      typeAudit: this.editForm.get(['typeAudit'])!.value,
      auditeur: this.editForm.get(['auditeur'])!.value,
      standard: this.editForm.get(['standard'])!.value,
      iD: this.editForm.get(['iD'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      conclusion: this.editForm.get(['conclusion'])!.value,
    };
  }
}
