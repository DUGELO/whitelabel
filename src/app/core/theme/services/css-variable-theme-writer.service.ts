import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { ResolvedTheme } from '../models/theme-runtime.types';
import { buildThemeCssVariables } from '../tokens/theme-css-vars';

@Injectable({
  providedIn: 'root',
})
export class CssVariableThemeWriterService {
  private readonly document = inject(DOCUMENT);

  applyTheme(theme: ResolvedTheme): void {
    const root = this.document.documentElement;
    const style = root.style;

    root.dataset['themePreset'] = theme.preset.id;

    for (const [name, value] of Object.entries(buildThemeCssVariables(theme))) {
      style.setProperty(name, value);
    }
  }
}
