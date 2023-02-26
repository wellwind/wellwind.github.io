import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { PlatformService } from 'src/platform.service';
import { PushModule } from '@rx-angular/template/push';

@Component({
    selector: 'app-liker-coin',
    templateUrl: './liker-coin.component.html',
    styleUrls: ['./liker-coin.component.scss'],
    standalone: true,
    imports: [PushModule]
})
export class LikerCoinComponent implements OnInit, OnDestroy {
  @Input() likerId = '';
  @Input() refreshObservable!: Observable<any>;

  likerCoinSrc$ = new ReplaySubject<SafeResourceUrl>();

  private subscription = new Subscription();

  constructor(
    private domSanitizer: DomSanitizer,
    private platformService: PlatformService
  ) {}

  ngOnInit(): void {
    if (this.platformService.isServer) {
      this.likerCoinSrc$.next(
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
        this.likerCoinSrc$.next(
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
