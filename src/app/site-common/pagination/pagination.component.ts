import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() linkBase = '/';
  @Input() currentPage = 1;
  @Input() totalPage = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
