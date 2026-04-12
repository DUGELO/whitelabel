import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
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

}
