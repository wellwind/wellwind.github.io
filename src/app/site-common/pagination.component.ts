import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-pagination',
    template: `@if (currentPage() > 1) {
    <button
      mat-stroked-button
      class="pagination-button pagination-prev pagination-icon"
      [routerLink]="[linkBase(), currentPage() - 1]"
      matTooltip="上一頁"
    >
      <mat-icon class="!mx-0">navigate_before</mat-icon>
    </button>
    } @if (currentPage() > 1) {

    <button
      role="button"
      aria-label="第一頁"
      mat-stroked-button
      class="pagination-button pagination-first"
      [routerLink]="[linkBase(), 1]"
      matTooltip="第一頁"
    >
      1
    </button>

    } @if (currentPage() > 3) {
    <mat-icon class="more-icon">more_horiz</mat-icon>
    } @if (currentPage() > 2) {

    <button
      role="button"
      [attr.aria-label]="'第 ' + (currentPage() - 1) + ' 頁'"
      mat-stroked-button
      class="pagination-button pagination-prev"
      [routerLink]="[linkBase(), currentPage() - 1]"
      [matTooltip]="'第 ' + (currentPage() - 1) + ' 頁'"
    >
      {{ currentPage() - 1 }}
    </button>

    }

    <button
      role="button"
      [attr.aria-label]="'第 ' + currentPage() + ' 頁'"
      mat-raised-button
      color="primary"
      class="pagination-button"
      [matTooltip]="'第 ' + currentPage() + ' 頁'"
    >
      {{ currentPage() }}
    </button>

    @if (currentPage() < totalPage() - 1) {

    <button
      role="button"
      [attr.aria-label]="'第 ' + (currentPage() + 1) + ' 頁'"
      mat-stroked-button
      class="pagination-button pagination-next"
      [routerLink]="[linkBase(), currentPage() + 1]"
      [matTooltip]="'第 ' + (currentPage() + 1) + ' 頁'"
    >
      {{ currentPage() + 1 }}
    </button>

    } @if (currentPage() < totalPage() - 2) {
    <mat-icon class="more-icon">more_horiz</mat-icon>
    } @if (currentPage() < totalPage()) {

    <button
      role="button"
      aria-label="最後一頁"
      mat-stroked-button
      class="pagination-button pagination-last"
      [routerLink]="[linkBase(), totalPage()]"
      matTooltip="最後一頁"
    >
      {{ totalPage() }}
    </button>

    } @if (currentPage() < totalPage()) {
    <button
      role="button"
      aria-label="下一頁"
      mat-stroked-button
      class="pagination-button pagination-next pagination-icon"
      [routerLink]="[linkBase(), currentPage() + 1]"
      matTooltip="下一頁"
    >
      <mat-icon class="!mx-0">navigate_next</mat-icon>
    </button>
    } `,
    styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination-button {
      margin: 0 8px;
    }

    .mat-mdc-raised-button, .mat-mdc-outlined-button {
      min-width: 32px;
    }

    @media (max-width: 599.98px) {
      .pagination-button {
        margin: 0 4px !important;
      }

      .more-icon, .pagination-first, .pagination-last {
        display: none !important;
      }

      .pagination-icon {
        max-width: 64px;
      }
    }
    `,
    imports: [MatButtonModule, MatTooltipModule, RouterLink, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent  {
  readonly linkBase = input('/');
  readonly currentPage = input(1);
  readonly totalPage = input(1);
}
