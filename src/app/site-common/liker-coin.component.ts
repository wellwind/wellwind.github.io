import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
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

  @Input() likerId = '';
  @Input() refreshObservable!: Observable<any>;

  protected likerCoinSrc = signal<SafeResourceUrl>(
    this.domSanitizer.bypassSecurityTrustResourceUrl('')
  );

  private subscription = new Subscription();

  ngOnInit(): void {
    if (this.platformService.isServer) {
      this.likerCoinSrc.set(
        this.domSanitizer.bypassSecurityTrustResourceUrl('')
      );
      return;
    }
    this.subscription.add(
      this.refreshObservable.subscribe(() => {
        const likerCoinBase =
          'https://button.like.co/in/embed/wellwind/button?referrer=';
        const url = encodeURIComponent(
          location.href.split('?')[0].split('#')[0]
        );
        this.likerCoinSrc.set(
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            `${likerCoinBase}${url}`
          )
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
