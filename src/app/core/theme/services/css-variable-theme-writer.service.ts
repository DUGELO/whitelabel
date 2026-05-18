import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { ResolvedTheme } from '../models/theme-runtime.types';
import { buildThemeCssVariables } from '../tokens/theme-css-vars';

@Injectable({
  providedIn: 'root',
})
export class CssVariableThemeWriterService {
  private readonly document = inject(DOCUMENT);
  private readonly appliedVariableNames = new Set<string>();

  applyTheme(theme: ResolvedTheme): void {
    const root = this.document.documentElement;

    if (!root) {
      return;
    }

    const style = root.style;
    const cssVariables = buildThemeCssVariables(theme);

    root.dataset['themePreset'] = theme.preset.id;

    for (const name of this.appliedVariableNames) {
      if (!(name in cssVariables)) {
        style.removeProperty(name);
        this.appliedVariableNames.delete(name);
      }
    }

    for (const [name, value] of Object.entries(cssVariables)) {
      if (isWritableCssVariableValue(value)) {
        style.setProperty(name, value);
        this.appliedVariableNames.add(name);
      } else {
        style.removeProperty(name);
        this.appliedVariableNames.delete(name);
      }
    }
  }
}

function isWritableCssVariableValue(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
