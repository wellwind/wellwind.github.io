import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscription, ReplaySubject } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-liker-coin',
  templateUrl: './liker-coin.component.html',
  styleUrls: ['./liker-coin.component.scss']
})
export class LikerCoinComponent implements OnInit, OnDestroy {
  @Input() likerId = '';
  @Input() refreshObservable!: Observable<any>;

  likerCoinSrc$ = new ReplaySubject<SafeResourceUrl>();

  private subscription = new Subscription();

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.subscription.add(this.refreshObservable.subscribe(() => {
      const likerCoinBase = 'https://button.like.co/in/embed/wellwind/button?referrer=';
      const url = encodeURIComponent(location.href.split("?")[0].split("#")[0]);
      this.likerCoinSrc$.next(this.domSanitizer.bypassSecurityTrustResourceUrl(`${likerCoinBase}${url}`));
    }));
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

}
