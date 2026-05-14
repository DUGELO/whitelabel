import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from "@angular/router";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { FloatingContactCta } from '../../../shared/design-system/components/floating-contact-cta/floating-contact-cta';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, FloatingContactCta],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly router = inject(Router);
  private readonly routerEvent = toSignal(this.router.events, { initialValue: null });

  protected readonly isAdminRoute = computed(() => {
    this.routerEvent();
    return this.router.url.startsWith('/admin');
  });
}
