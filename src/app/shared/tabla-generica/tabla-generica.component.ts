import {
  AfterViewInit,
  Component,
  EventEmitter, Injectable,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActionsTabla, ColumnasTabla} from '../../features/catalogos/pais/pais.component';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSelectModule} from '@angular/material/select';
import {StylePaginatorDirective} from '../../core/directivas/style-paginator.directive';
import {MatTooltipModule} from '@angular/material/tooltip';


@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Registros por página';
  override nextPageLabel = 'Siguiente página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
  // Puedes agregar más personalizaciones si lo necesitas

  // Opcional: Puedes personalizar el texto de los rangos también
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // Si el rango está fuera de los límites
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

@Component({
  selector: 'app-tabla-generica',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    StylePaginatorDirective,
    MatTooltipModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl } // Proveer la clase personalizada
  ],
  templateUrl: './tabla-generica.component.html',
  styleUrl: './tabla-generica.component.scss',
})
export class TablaGenericaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: ColumnasTabla[] = [];
  @Input() actions: ActionsTabla[] = [];

  @Input() totalRecords: number = 0;
  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter();

  @ViewChild(MatTable) matTable!: MatTable<any>;

  displayedColumns!: string[];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageIndex = 0;

  constructor(private sanitizer: DomSanitizer) {
  }
  ngOnInit() {
    const columnsAux = this.columns.map(c => c.clave);
    this.displayedColumns = [...columnsAux, 'actions'];
    this.dataSource = new MatTableDataSource(this.data);
    console.log('DATA EN TABLA');
    console.table(this.dataSource);
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].previousValue) {
      this.dataSource.data = this.data; // Actualiza la dataSource cuando cambian los datos
      this.matTable.renderRows(); // Renderiza las filas de la tabla
    }
  }

  handlePageChange($event: any): void {
    const page = $event.pageIndex + 1;
    const max = $event.pageSize;
    const offset = max * $event.pageIndex;
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.pageChange.emit({ offset, max, page, pageSize: $event.pageSize });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  sanitizeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  isHtml(content: string): boolean {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(content);
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }
}

