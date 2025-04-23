export interface Permission {
  id: number;
  clave: string;
  controlador: string;
  httpMethod: HttpMethod;
  relacionado: boolean;
}

interface HttpMethod {
  enumType: string;
  name: string;
}
