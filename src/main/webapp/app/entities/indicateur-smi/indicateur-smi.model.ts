import * as dayjs from 'dayjs';
import { IProcessusSMI } from 'app/entities/processus-smi/processus-smi.model';

export interface IIndicateurSMI {
  id?: number;
  dateIdentification?: dayjs.Dayjs | null;
  indicateur?: string | null;
  formuleCalcul?: string | null;
  cible?: number | null;
  seuilTolerance?: number | null;
  unite?: string | null;
  periodicite?: string | null;
  responsableCalcul?: string | null;
  observations?: string | null;
  vigueur?: boolean | null;
  processus?: IProcessusSMI | null;
}

export class IndicateurSMI implements IIndicateurSMI {
  constructor(
    public id?: number,
    public dateIdentification?: dayjs.Dayjs | null,
    public indicateur?: string | null,
    public formuleCalcul?: string | null,
    public cible?: number | null,
    public seuilTolerance?: number | null,
    public unite?: string | null,
    public periodicite?: string | null,
    public responsableCalcul?: string | null,
    public observations?: string | null,
    public vigueur?: boolean | null,
    public processus?: IProcessusSMI | null
  ) {
    this.vigueur = this.vigueur ?? false;
  }
}

export function getIndicateurSMIIdentifier(indicateurSMI: IIndicateurSMI): number | undefined {
  return indicateurSMI.id;
}
