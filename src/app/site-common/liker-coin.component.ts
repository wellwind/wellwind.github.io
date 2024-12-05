import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  input,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PlatformService } from 'src/app/site-common/platform.service';

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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikerCoinComponent implements OnInit, OnDestroy {
  private domSanitizer = inject(DomSanitizer);
  private platformService = inject(PlatformService);

  readonly likerId = input('');

  protected likerCoinSrc = signal<SafeResourceUrl>(
    this.domSanitizer.bypassSecurityTrustResourceUrl(''),
  );

  private subscription = new Subscription();

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
