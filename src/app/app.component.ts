import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { EmployeeListDragDrop } from 'src/Modals/EmployeeList';
  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularDragAndDropOnTable';

  
  constructor() { }
  classValues = '';
  isAnyCellClicked = false;
  firstRow = 0;
  lastRow = 0;
  firstCell = 0;
  lastCell = 0;
  cloneFirstRow = 0;
  clonefirstCell = 0;
  isOpen = false;
  shiftClass = 'cell';
  draggedClass = 'clickedClass';
  @ViewChild('tableContainer', { static: false }) tableBody: ElementRef;

  EmployeeList: EmployeeListDragDrop[] = [];
  empUpdateDivisOpen: boolean;
  randomDate() {
    const start = new Date();
    const end = new Date(new Date().setDate(new Date().getDate() + 500));
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getDate();
  }

  ngOnInit() {
    this.isOpen = true;
    for (let i = 0; i < 10; i++) {
      this.EmployeeList.push({
        EmpId: 'Row ' + i,
        Name: 'vijay sahu',
        Days: []
      });
    }

    this.EmployeeList.forEach(item => {
      for(var i=0;i < 8; i++) { 
        item.Days[i] = this.randomDate()
      }
    });
    localStorage.setItem('isAnyCellClicked', '0');
    window.addEventListener('mouseup', this.MouseUpEvent, true); // third parameter
    window.addEventListener('scroll', this.scroll, true); // third parameter
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableBody.nativeElement.addEventListener('mouseover', this.MouseHover, true);
      this.tableBody.nativeElement.addEventListener('mousedown', this.MouseDownEvent, true);
      this.tableBody.nativeElement.addEventListener('mouseup', this.MouseUpEvent, true); // third parameter
    }, 1000);
  }

  scroll = (event): void => {
    if (event.target.localName === 'tbody') {
      this.empUpdateDivisOpen = false;
    }
  }
  
  MouseHover = (event): void => {
    if (localStorage.getItem('isAnyCellClicked') === '1') {
      // TR/Row hovering on row level
      let row1 = localStorage.getItem('row1');
      let row2 = localStorage.getItem('row2');
      let draggedRow = event.target.closest('tr').rowIndex;
      draggedRow = draggedRow - 1;
      if (draggedRow > parseInt(row2, 0)) {
        row2 = draggedRow;
      } else if (draggedRow < parseInt(row2, 0)) {
        row1 = draggedRow;
      }// TR/Row hovering
      // TD/Cell hovering on col level

      let cell1 = (localStorage.getItem('cell1'));
      let cell2 = (localStorage.getItem('cell2'));
      
      const draggedCol = event.target.closest('td').cellIndex;

      if (draggedCol > cell2) {
        cell2 = draggedCol;
      } else if (draggedCol < cell2) {
        cell2 = cell1;
        cell1 = draggedCol;
        this.ResetCol(event);
      } // TD/Cell hovering
      
      this.RemoveDraggedCss();
      this.AddingDraggedClassOnCells(row1, row2, cell1, cell2);

    }
  }

  
  // It will call everytime user hovering over the tbody cells.
  // Highlight all the rows and cells based on 4 properties.
  AddingDraggedClassOnCells = (row1: any, row2: any, cell1: any, cell2: any): void => {
    this.lastRow = row2;
    this.lastCell = cell2;
    this.firstRow = row1;
    this.firstCell = cell1;
    // console.log('(R1:' + row1 + ', R2:' + row2 + ')-(C1:' + cell1 + ', C2:' + cell2 + ')');
    for (let i = row1; i <= row2; i++) {
      const dd = this.tableBody.nativeElement.rows[i] as HTMLTableCellElement;
      for (let j = cell1; j <= cell2; j++) {
        dd.children[j].classList.add(this.draggedClass);
      }
    }
  }
  
  RemoveDraggedCss() {
    const e1 = this.tableBody.nativeElement.querySelectorAll('tbody tr td ').forEach(element => {
      element.classList.remove(this.draggedClass);
      element.firstElementChild.classList.remove(this.draggedClass);
    });
  }
  ResetCol(event) {
    event.target.classList.remove(this.draggedClass);
  }
  
  ngOnDestroy() {

    window.removeEventListener('scroll', this.scroll, true);
    window.removeEventListener('mouseover', this.MouseHover, true);
    window.removeEventListener('mousedown', this.MouseDownEvent, true);
    window.removeEventListener('mouseup', this.MouseUpEvent, true);


    this.ResetTable();
  }

  MouseOutEvent() {
    console.log('MouseOutEvent trigger');
  }

  
  // Drag will start once you cliced on td of tbody
  MouseUpEvent = (event): void => {
    localStorage.setItem('isAnyCellClicked', '0');
    let shiftDetails = -1;
    
    // note: Each employee having total 7 days records only, means [0-6] index value.
    // this.clonefirstCell = this.clonefirstCell;
    if (this.firstRow === this.lastRow && this.firstCell === this.lastCell) { } 
    else {
      // const empBulkChanges: EmployeeRosterRequestModel[] = [];
      shiftDetails = this.EmployeeList[this.cloneFirstRow].Days[this.clonefirstCell - 2];
      for (let row = this.firstRow; row <= this.lastRow; row++) {
    
        for (let col = this.firstCell; col <= this.lastCell; col++) {
          this.EmployeeList[row].Days[col - 2] = shiftDetails
        }
      }
    
    }
    this.ResetTable();
    this.cloneFirstRow = this.clonefirstCell = 0;
    shiftDetails = 0 ;
  }

  MouseDownEvent = (event): void => {
    if (event.target.parentElement.closest('tr') !== null) {
      let firstRow = event.target.parentElement.closest('tr').rowIndex;
      firstRow = firstRow - 1;
      const lastRow = this.cloneFirstRow = firstRow;
      console.log('cloneFirstRow' + this.cloneFirstRow);
      const firstCell = event.target.closest('td').cellIndex;
      event.target.closest('td').classList.add(this.draggedClass);
      const lastCell = this.clonefirstCell = firstCell;
      
      console.log('------------------------------------------------------------');
      console.log('R1:' + firstRow, 'R2:' + lastRow);
      console.log('C1:' + firstCell, 'C2:' + lastCell);
      localStorage.setItem('row1', firstRow.toString());
      localStorage.setItem('row2', lastRow.toString());
      localStorage.setItem('cell1', firstCell.toString());
      localStorage.setItem('cell2', lastCell.toString());
      localStorage.setItem('isAnyCellClicked', '1');
      // }
    }
  }
  


  AddColorsOnRowAndTD = (row1, row2, cell1, cell2): void => {
    // if (this.tableBody.nativeElement.rows[this.lastRow]) {}
    console.log('(R1:' + row1 + ', R2:' + row2 + ')-(C1:' + cell1 + ', C2:' + cell2 + ')');
    for (let i = row1; i <= row2; i++) {
      const dd = this.tableBody.nativeElement.rows[i] as HTMLTableCellElement;
      for (let j = cell1; j <= cell2; j++) {
        dd.children[j].classList.add('clickedClass');
      }
    }
  }



  resetRow(rowId) {
    const row = this.tableBody.nativeElement.querySelectorAll('tr')[rowId];
    for (let j = this.firstCell; j <= this.lastCell; j++) {
      console.log('cell: ' + j);
      if (row.cells[j].firstElementChild.classList.contains('clickedClass')) {
        console.log(row.cells[j].firstElementChild);
        row.cells[j].firstElementChild.classList = []; //.remove('clickedClass');
        console.log(row.cells[j].firstElementChild);
      }
    }
  }


  ResetTableCellClass() {
    const totalRows = this.tableBody.nativeElement.rows.length - 1;
    const totalCells = this.tableBody.nativeElement.rows[0].cells.length - 1;

    for (let i = 0; i <= totalRows; i++) {
      for (let j = 0; j <= totalCells; j++) {
        if (this.tableBody.nativeElement.rows[i].cells[j].childNodes[0].className === 'clickedClass') {
          this.tableBody.nativeElement.children[i].cells[j].childNodes[0].className =
            this.tableBody.nativeElement.children[i].cells[j].childNodes[0].className.toString().replace('clickedClass', '');
        }
      }
    }
  }

  ResetTable() {
    this.lastRow = 0;
    this.lastCell = 0;
    this.firstRow = 0;
    this.firstCell = 0;
    localStorage.setItem('isAnyCellClicked', '0');

    const e1 = this.tableBody.nativeElement.querySelectorAll('tbody tr td ').forEach(element => {
      element.classList.remove('clickedClass');
      element.firstElementChild.classList.remove('clickedClass');
    });
    console.log('------------------------------------------------------------');
  }

  ResetAllCellOnly() {
    const e1 = this.tableBody.nativeElement.querySelectorAll('tbody tr td ').forEach(element => {
      element.classList.remove('clickedClass');
      element.firstElementChild.classList.remove('clickedClass');
    });
    console.log('-----------------ResetAllCellOnly---------------------------');
  }
  
  focusTD(rowNum, cellNum) {
    this.tableBody.nativeElement.rows[rowNum].cells[cellNum].focus();
  }

  removeItem(item: any, list: Array<any>) {
    const index = list.map(function (e) {
      return e.name;
    }).indexOf(item.name);
    list.splice(index, 1);
  }
}
