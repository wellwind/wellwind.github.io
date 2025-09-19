import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { findMainContentContainer, scrollTo } from '../../utils';

@Component({
  selector: 'app-blog-layout',
  template: `
    <div class="break-words p-4" #container>
      <router-outlet></router-outlet>

      <button
        role="button"
        aria-label="回到最上面"
        mat-fab
        color="default"
        class="!fixed bottom-[32px] right-[32px]"
        (click)="goTop(container)"
        matTooltip="回到最上面"
      >
        <mat-icon>keyboard_double_arrow_up</mat-icon>
      </button>
    </div>
  `,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatTooltipModule],
})
export class BlogLayoutComponent {
  goTop(contentElement: HTMLElement) {
    if (contentElement) {
      const containerElement = findMainContentContainer(contentElement);
      if (containerElement) {
        scrollTo(0, containerElement);
      }
    }
  }
}
