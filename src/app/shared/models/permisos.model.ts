export interface PermisoModel {
  descripcion: string;
  controller: string;
  clavePermiso?: string;
  id?: number;
  imagen?: string;
  seleccionado?: boolean;
  clave?: string;
  permisos?: Array<PermisoModel>;
  isSpecial?: boolean;
}
export interface ListadoPermisosModel {
  mainOptionsMenu: Array<PermisoModel>;
  footerOptionsMenu: Array<PermisoModel>;
  headerOptions: Array<PermisoModel>;
}
