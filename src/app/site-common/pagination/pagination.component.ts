import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatTooltipModule, RouterLink, MatIconModule]
})
export class PaginationComponent implements OnInit {
  @Input() linkBase = '/';
  @Input() currentPage = 1;
  @Input() totalPage = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
