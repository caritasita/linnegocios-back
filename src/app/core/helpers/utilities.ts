
// import * as firebase from 'firebase';
import {User} from '../../shared/models/User';
import {Cliente} from '../../shared/models/cliente';

/* Generales */
export function getCompleteName({
  nombre = '',
  apeidoPaterno = '',
  apeidoMaterno = '',
}: User | Cliente): string {
  return `${nombre} ${apeidoPaterno} ${apeidoMaterno}`.trim();
}

/**
 * Devuelve un objeto con los valores no vacíos del objeto pasado
 * como parámetro.
 * Ejemplo: obj = {monto: 10, folio: null}; return = {monto: 10}.
 * @param obj Objeto desde el cuál se obtendrán valores no vacíos.
 */
export function removeEmptyValues(obj: any = {}): any {
  const nonEmptyObject: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] || obj[key] === false) {
      nonEmptyObject[key] = obj[key];
    }
  });
  return nonEmptyObject;
}

/* Permisos */
export function hasPermission(permission: string): boolean {
  const permissionKeysList: string[] = getPermissionKeys();
  return permissionKeysList.includes(permission);
}

export function isViewBlocked(controller: string): boolean {
  const viewBlockedList: string[] = getViewBlocked();
  return viewBlockedList.includes(controller);
}

export function hasSomePermission(permissionEvaluate: string[] = []): boolean {
  const permissionKeysList: string[] = getPermissionKeys();
  return permissionEvaluate.some((permissionKey: string) =>
    permissionKeysList.includes(permissionKey),
  );
}

export function hasAllPermission(permissions: string[] = []): boolean {
  return permissions.every((p) => hasPermission(p));
}

function getPermissionKeys(): string[] {
  const permissionStorage = sessionStorage.getItem('permissions');
  if (!permissionStorage) {
    return [];
  }
  return JSON.parse(permissionStorage);
}

function getViewBlocked(): string[] {
  const viewBlockedStorage = sessionStorage.getItem('viewBlocked');
  if (!viewBlockedStorage) {
    return [];
  }
  return JSON.parse(viewBlockedStorage);
}

export function getUserId(): number {
  const item = localStorage.getItem('user_info');
  if (!item) {
    return 0;
  }
  const userInfo = JSON.parse(atob(item));
  return userInfo ? userInfo.id : 0;
}

export function getDiacriticInsensitiveRegex(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }
  return text
    .toLowerCase()
    .replace(new RegExp(/a|á/, 'g'), '[a,á]')
    .replace(new RegExp(/e|é/, 'g'), '[e,é]')
    .replace(new RegExp(/i|í/, 'g'), '[i,í]')
    .replace(new RegExp(/o|ó/, 'g'), '[o,ó]')
    .replace(new RegExp(/u|ú|ü/, 'g'), '[u,ú,ü]');
}

export function formatTimeDigit(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export const CONCAT_DELETE_STRING_SIZE = 28;

export function patchValueIfDeleted(object: any, propertyName: string): string | null {
  type ObjectKey = keyof typeof object;
  const propertyValue = object[propertyName as ObjectKey];
  if (object.enabled) {
    return propertyValue;
  }
  if (propertyValue.includes('_deleted_')) {
    return propertyValue.substr(CONCAT_DELETE_STRING_SIZE);
  }
  return propertyValue;
}
export enum DASHBOARD_CARD_CASES {
  TOTALES_ACTIVOS = 'TOTALES_ACTIVOS',
  LICENCIAS_A_VENCER = 'LICENCIAS_A_VENCER',
  LICENCIAS_A_VENCER_HOY = 'LICENCIAS_A_VENCER_HOY',
  LICENCIAS_VENCIDAS = 'LICENCIAS_VENCIDAS',
  SIN_LINNTAE = 'SIN_LINNTAE',
}

export interface ImageType {
  nombre: string;
  url: string;
}

// export function getTime(timestamp: firebase.firestore.Timestamp): string {
//   const date: Date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
//   const hours: string = String(date.getHours()).padStart(2, '0');
//   const minutes: string = String(date.getMinutes()).padStart(2, '0');
//   return hours + ':' + minutes;
// }
