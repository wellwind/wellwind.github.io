import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  input,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlatformService } from '@shared/infrastructure';

@Component({
  selector: 'app-liker-coin',
  template: `
    <div class="embed-responsive embed-responsive-liker-coin">
      <iframe
        loading="lazy"
        class="embed-responsive-item"
        scrolling="no"
        frameborder="0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
        style="width: 100%;"
        [src]="likerCoinSrc()"
      ></iframe>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikerCoinComponent implements OnInit {
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly platformService = inject(PlatformService);

  readonly likerId = input('');

  protected readonly likerCoinSrc = signal<SafeResourceUrl>(
    this.domSanitizer.bypassSecurityTrustResourceUrl(''),
  );

  ngOnInit(): void {
    if (this.platformService.isServer) {
      this.likerCoinSrc.set(
        this.domSanitizer.bypassSecurityTrustResourceUrl(''),
      );
      return;
    }
    const likerCoinBase =
      'https://button.like.co/in/embed/wellwind/button?referrer=';
    const url = encodeURIComponent(location.href.split('?')[0].split('#')[0]);
    this.likerCoinSrc.set(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `${likerCoinBase}${url}`,
      ),
    );
  }
}
