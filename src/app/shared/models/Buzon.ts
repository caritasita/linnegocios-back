
import { Negocio } from './negocio';
import {User} from './User';
import {Tendero} from './Tendero';
import {Cajero} from './cajero';

export class Buzon {
    id!: number;
    anonimo!: boolean;
    estatus!: string;
    fecha!: Date;
    mensaje!: string;
    negocio!: Negocio | any;
    tipoBuzon!: string;
    usuarioPDV!: User | Tendero | Cajero | any;
}
