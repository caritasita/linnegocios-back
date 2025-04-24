import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ColumnasTabla} from '../../features/catalogos/pais/pais.component';
import {DomSanitizer} from '@angular/platform-browser';

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
    MatPaginatorModule
  ],
  templateUrl: './tabla-generica.component.html',
  styleUrl: './tabla-generica.component.scss'
})
export class TablaGenericaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: ColumnasTabla[] = [];
  @Input() actions: { name: string, icon:string, callback: (item: any) => void }[] = [];

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
    console.log('this.dataSource');
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  protected readonly Number = Number;
}
