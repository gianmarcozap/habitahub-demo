import { Unit, UnitStatus } from '../../domain/unit';

export interface IUnitPort {
  getAllUnits(): Promise<Unit[]>;
  getUnitById(id: string): Promise<Unit | undefined>;
  updateUnitStatus(id: string, status: UnitStatus): Promise<Unit>;
}
