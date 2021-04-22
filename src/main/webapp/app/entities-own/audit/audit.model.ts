import * as dayjs from 'dayjs';
import { IProcessusSMI } from 'app/entities-own/processus-smi/processus-smi.model';
import { TypeAudit } from 'app/entities-own/enumerations/type-audit.model';
import { Standard } from 'app/entities-own/enumerations/standard.model';
import { StatutAudit } from 'app/entities-own/enumerations/statut-audit.model';

export interface IAudit {
  id?: number;
  dateAudit?: dayjs.Dayjs | null;
  typeAudit?: TypeAudit | null;
  auditeur?: string | null;
  standard?: Standard | null;
  iD?: string | null;
  statut?: StatutAudit | null;
  conclusion?: string | null;
  procs?: IProcessusSMI[] | null;
}

export class Audit implements IAudit {
  constructor(
    public id?: number,
    public dateAudit?: dayjs.Dayjs | null,
    public typeAudit?: TypeAudit | null,
    public auditeur?: string | null,
    public standard?: Standard | null,
    public iD?: string | null,
    public statut?: StatutAudit | null,
    public conclusion?: string | null,
    public procs?: IProcessusSMI[] | null
  ) {}
}

export function getAuditIdentifier(audit: IAudit): number | undefined {
  return audit.id;
}
