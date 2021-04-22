import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IIndicateurSMI, IndicateurSMI } from '../indicateur-smi.model';
import { IndicateurSMIService } from '../service/indicateur-smi.service';
import { IProcessusSMI } from 'app/entities-own/processus-smi/processus-smi.model';
import { ProcessusSMIService } from 'app/entities-own/processus-smi/service/processus-smi.service';

@Component({
  selector: 'jhi-indicateur-smi-update',
  templateUrl: './indicateur-smi-update.component.html',
})
export class IndicateurSMIUpdateComponent implements OnInit {
  isSaving = false;

  processusSMISSharedCollection: IProcessusSMI[] = [];

  editForm = this.fb.group({
    id: [],
    dateIdentification: [],
    indicateur: [],
    formuleCalcul: [],
    cible: [],
    seuilTolerance: [],
    unite: [],
    periodicite: [],
    responsableCalcul: [],
    observations: [],
    vigueur: [],
    processus: [],
  });

  constructor(
    protected indicateurSMIService: IndicateurSMIService,
    protected processusSMIService: ProcessusSMIService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ indicateurSMI }) => {
      this.updateForm(indicateurSMI);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const indicateurSMI = this.createFromForm();
    if (indicateurSMI.id !== undefined) {
      this.subscribeToSaveResponse(this.indicateurSMIService.update(indicateurSMI));
    } else {
      this.subscribeToSaveResponse(this.indicateurSMIService.create(indicateurSMI));
    }
  }

  trackProcessusSMIById(index: number, item: IProcessusSMI): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIndicateurSMI>>): void {
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

  protected updateForm(indicateurSMI: IIndicateurSMI): void {
    this.editForm.patchValue({
      id: indicateurSMI.id,
      dateIdentification: indicateurSMI.dateIdentification,
      indicateur: indicateurSMI.indicateur,
      formuleCalcul: indicateurSMI.formuleCalcul,
      cible: indicateurSMI.cible,
      seuilTolerance: indicateurSMI.seuilTolerance,
      unite: indicateurSMI.unite,
      periodicite: indicateurSMI.periodicite,
      responsableCalcul: indicateurSMI.responsableCalcul,
      observations: indicateurSMI.observations,
      vigueur: indicateurSMI.vigueur,
      processus: indicateurSMI.processus,
    });

    this.processusSMISSharedCollection = this.processusSMIService.addProcessusSMIToCollectionIfMissing(
      this.processusSMISSharedCollection,
      indicateurSMI.processus
    );
  }

  protected loadRelationshipsOptions(): void {
    this.processusSMIService
      .query()
      .pipe(map((res: HttpResponse<IProcessusSMI[]>) => res.body ?? []))
      .pipe(
        map((processusSMIS: IProcessusSMI[]) =>
          this.processusSMIService.addProcessusSMIToCollectionIfMissing(processusSMIS, this.editForm.get('processus')!.value)
        )
      )
      .subscribe((processusSMIS: IProcessusSMI[]) => (this.processusSMISSharedCollection = processusSMIS));
  }

  protected createFromForm(): IIndicateurSMI {
    return {
      ...new IndicateurSMI(),
      id: this.editForm.get(['id'])!.value,
      dateIdentification: this.editForm.get(['dateIdentification'])!.value,
      indicateur: this.editForm.get(['indicateur'])!.value,
      formuleCalcul: this.editForm.get(['formuleCalcul'])!.value,
      cible: this.editForm.get(['cible'])!.value,
      seuilTolerance: this.editForm.get(['seuilTolerance'])!.value,
      unite: this.editForm.get(['unite'])!.value,
      periodicite: this.editForm.get(['periodicite'])!.value,
      responsableCalcul: this.editForm.get(['responsableCalcul'])!.value,
      observations: this.editForm.get(['observations'])!.value,
      vigueur: this.editForm.get(['vigueur'])!.value,
      processus: this.editForm.get(['processus'])!.value,
    };
  }
}
