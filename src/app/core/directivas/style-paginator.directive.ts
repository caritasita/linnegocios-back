import {
  AfterViewInit,
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input, OnChanges, SimpleChanges, OnInit
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatButton} from '@angular/material/button';

interface PageObject {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Directive({
  standalone: true,
  selector: '[appStylePaginator]'
})
export class StylePaginatorDirective implements OnInit, AfterViewInit, OnChanges {
  private pageGapTxt = '...';
  private rangeStart: number = 0;
  private rangeEnd: number = 0;
  private buttons: MatButton[] = [];
  private curPageObj: PageObject = {
    length: 0,
    pageIndex: 0,
    pageSize: 0,
    previousPageIndex: 0
  };

  @Input()
  get showTotalPages(): number {
    return this.showTotalPagesPrivate;
  }

  set showTotalPages(value: number) {
    this.showTotalPagesPrivate = value % 2 === 0 ? value + 1 : value;
  }

  private showTotalPagesPrivate = 4;

  @Input() totalRecords: number = 0;

  get inc(): number {
    return this.showTotalPagesPrivate % 2 === 0
      ? this.showTotalPagesPrivate / 2
      : (this.showTotalPagesPrivate - 1) / 2;
  }

  get numOfPages(): number {
    return this.matPag.getNumberOfPages();
  }

  get lastPageIndex(): number {
    return this.matPag.getNumberOfPages() - 1;
  }

  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private vr: ViewContainerRef,
    private ren: Renderer2
  ) {
    /*to rerender buttons on items per page change and first, last, next and prior buttons*/
    this.matPag.page.subscribe((e: PageObject) => {
      if (
        this.curPageObj.pageSize !== e.pageSize &&
        this.curPageObj.pageIndex !== 0
      ) {
        e.pageIndex = 0;
        this.rangeStart = 0;
        this.rangeEnd = this.showTotalPagesPrivate - 1;
      }
      this.curPageObj = e;
      this.initPageRange();
    });

  }

  ngOnInit(): void {

  }

  private buildPageNumbers() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      'div.mat-mdc-paginator-range-actions'
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-next'
    );
    const prevButtonCount = this.buttons.length;

    // remove buttons before creating new ones
    if (this.buttons.length > 0) {
      this.buttons.forEach(button => {
        this.ren.removeChild(actionContainer, button);
      });
      /*Empty state array*/
      this.buttons.length = 0;
    }

    /*initialize next page and last page buttons*/
    if (this.buttons.length === 0 && this.vr.element.nativeElement.childNodes[0].childNodes[0].childNodes[2].childNodes) {
      const nodeArray = this.vr.element.nativeElement.childNodes[0].childNodes[0].childNodes[2].childNodes;
      setTimeout(() => {
        for (let i = 0; i < nodeArray.length; i++) {
          if (nodeArray[i].nodeName === 'BUTTON') {
            this.ren.setStyle(nodeArray[i], 'margin', '.5%');
            this.ren.setStyle(nodeArray[i], 'padding', '0 !important');
            this.ren.setStyle(nodeArray[i], 'display', 'flex');
            this.ren.setStyle(nodeArray[i], 'justify-content', 'center');
            this.ren.setStyle(nodeArray[i], 'align-items', 'center');
            this.ren.setStyle(nodeArray[i], 'font-size', '14px');

            if (nodeArray[i].innerHTML.length > 100 && nodeArray[i].disabled) {

            } else if ( nodeArray[i].innerHTML.length > 100 && !nodeArray[i].disabled) {
            } else if (nodeArray[i].disabled) {
              this.ren.setStyle(nodeArray[i], 'background-color', '#d6d6d6');
            } else if (nodeArray[i].disabled) {
              this.ren.setStyle(nodeArray[i], 'background-color', 'lightgray');

            }
          }
        }
      });
    }

    for (let i = 0; i < this.numOfPages; i++) {
      if (i >= this.rangeStart && i <= this.rangeEnd) {
        this.ren.insertBefore(
          actionContainer,
          this.createButton(i, this.matPag.pageIndex),
          nextPageNode
        );
      }

      if (i === this.rangeEnd) {
        this.ren.insertBefore(
          actionContainer,
          this.createButton(this.pageGapTxt, this.rangeEnd),
          nextPageNode
        );
      }
    }
  }

  private createButton(i: any, pageIndex: number): any {
    const linkBtn: MatButton = this.ren.createElement('button');
    this.ren.setStyle(linkBtn, 'color', '#1e1e1e'); // Texto blanco por defecto
    this.ren.setStyle(linkBtn, 'margin', '.5%');
    this.ren.setStyle(linkBtn, 'padding', '0 !important');
    this.ren.setStyle(linkBtn, 'width', '40px');
    this.ren.setStyle(linkBtn, 'height', '35px');
    this.ren.setStyle(linkBtn, 'display', 'flex');
    this.ren.setStyle(linkBtn, 'justify-content', 'center');
    this.ren.setStyle(linkBtn, 'align-items', 'center');
    this.ren.setStyle(linkBtn, 'background-color', 'white'); // Azul claro
    this.ren.setStyle(linkBtn, 'font-size', '14px'); // Aumentar tamaño de fuente
    this.ren.setStyle(linkBtn, 'border-radius', '50%'); // Bordes redondeados
    this.ren.setStyle(linkBtn, 'border', '1px solid #acacac'); // Borde azul oscuro
    this.ren.setStyle(linkBtn, 'font-weight', '500');
    this.ren.setStyle(linkBtn, 'transition', 'background-color 0.3s, transform 0.3s'); // Transición suave
    this.ren.setStyle(linkBtn, 'cursor', 'pointer'); // Cambiar cursor al pasar
    // this.ren.setStyle(linkBtn, 'box-shadow', '0 2px 5px rgba(0, 0, 0, 0.2)'); // Sombra sutil

    const pagingTxt = isNaN(i) ? this.pageGapTxt : +(i + 1);
    const text = this.ren.createText(pagingTxt + '');

    // this.ren.addClass(linkBtn, 'mat-custom-page');

    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        // this.ren.setStyle(linkBtn, 'background-color', 'lightgray'); // Azul claro
        this.ren.setStyle(linkBtn, 'color', '#56565a'); // Cambiar color del texto a azul para el botón seleccionado
        break;
      case this.pageGapTxt:
        let newIndex = this.curPageObj.pageIndex + this.showTotalPagesPrivate;

        if (newIndex >= this.numOfPages) {
          newIndex = this.lastPageIndex;
        }

        if (pageIndex !== this.lastPageIndex) {
          this.ren.listen(linkBtn, 'click', () => {
            console.log('working: ', pageIndex);
            this.switchPage(newIndex);
          });
        }

        if (pageIndex === this.lastPageIndex) {
          this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
          this.ren.setStyle(linkBtn, 'color', '#56565a');
        }
        break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.switchPage(i);
        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    /* Add button to private array for state */
    this.buttons.push(linkBtn);
    return linkBtn;
  }

  /*calculates the button range based on class input parameters and based on current page index value. Used to render new buttons after event.*/
  private initPageRange(): void {
    const middleIndex = (this.rangeStart + this.rangeEnd) / 2;

    this.rangeStart = this.calcRangeStart(middleIndex);
    this.rangeEnd = this.calcRangeEnd(middleIndex);

    this.buildPageNumbers();
  }

  /*Helper function To calculate start of button range*/
  private calcRangeStart(middleIndex: number): number {
    switch (true) {
      case this.curPageObj.pageIndex === 0 && this.rangeStart !== 0:
        return 0;
      case this.curPageObj.pageIndex > this.rangeEnd:
        return this.curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex - this.inc * 2
          : this.curPageObj.pageIndex - this.inc;
      case this.curPageObj.pageIndex > this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex > middleIndex &&
      this.rangeEnd < this.lastPageIndex:
        return this.rangeStart + 1;
      case this.curPageObj.pageIndex < this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex < middleIndex &&
      this.rangeStart > 0:
        return this.rangeStart - 1;
      default:
        return this.rangeStart;
    }
  }

  /*Helpter function to calculate end of button range*/
  private calcRangeEnd(middleIndex: number): number {
    switch (true) {
      case this.curPageObj.pageIndex === 0 &&
      this.rangeEnd !== this.showTotalPagesPrivate:
        return this.showTotalPagesPrivate - 1;
      case this.curPageObj.pageIndex > this.rangeEnd:
        return this.curPageObj.pageIndex + this.inc > this.lastPageIndex
          ? this.lastPageIndex
          : this.curPageObj.pageIndex + 1;
      case this.curPageObj.pageIndex > this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex > middleIndex &&
      this.rangeEnd < this.lastPageIndex:
        return this.rangeEnd + 1;
      case this.curPageObj.pageIndex < this.curPageObj.previousPageIndex &&
      this.curPageObj.pageIndex < middleIndex &&
      this.rangeStart >= 0 &&
      this.rangeEnd > this.showTotalPagesPrivate - 1:
        return this.rangeEnd - 1;
      default:
        return this.rangeEnd;
    }
  }

  /*Helper function to switch page on non first, last, next and previous buttons only.*/
  private switchPage(i: number): void {
    const previousPageIndex = this.matPag.pageIndex;
    this.matPag.pageIndex = i;
    this.matPag['_emitPageEvent'](previousPageIndex);
    this.initPageRange();
  }

  /*Initialize default state after view init*/
  public ngAfterViewInit() {
    this.rangeStart = 0;
    this.rangeEnd = this.showTotalPagesPrivate - 1;
    console.log('TOTALES');
    console.table(this.matPag.length);
    this.initPageRange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['totalRecords'] && !changes?.['totalRecords'].isFirstChange()) {
      this.initPageRange();
    }
  }
}
