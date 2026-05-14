import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';

import {
  StorefrontThemeConfig,
  TypographyPresetId,
} from '../../../core/theme/models/theme-config.types';
import {
  CtaVariantId,
  HeroVariantId,
  ProductCardVariantId,
  ProductGridVariantId,
  StorefrontThemeVariants,
  ThemePresetId,
} from '../../../core/theme/models/theme-preset.types';
import { THEME_PRESETS, THEME_PRESETS_BY_ID } from '../../../core/theme/presets';
import {
  AdminSettingsReadResult,
  AdminStorefrontSettingsDocument,
  AdminTenantId,
} from '../models/admin-firestore.models';
import { AdminFirestoreService } from '../services/admin-firestore.service';

type PrimaryContactChannelFormValue = '' | 'whatsapp' | 'instagram';

interface AdminSettingsFormState {
  brandName: string;
  slug: string;
  instagramUrl: string;
  whatsappUrl: string;
  primaryContactChannel: PrimaryContactChannelFormValue;
  themePreset: ThemePresetId;
  typographyPreset: TypographyPresetId;
  brandPrimary: string;
  brandPrimaryStrong: string;
  brandSecondary: string;
  accent: string;
  heroVariant: HeroVariantId;
  productCardVariant: ProductCardVariantId;
  productGridVariant: ProductGridVariantId;
  ctaVariant: CtaVariantId;
}

const TYPOGRAPHY_PRESET_OPTIONS = [
  { value: 'editorial-serif', label: 'Editorial Serif' },
  { value: 'modern-sans', label: 'Modern Sans' },
  { value: 'soft-serif', label: 'Soft Serif' },
  { value: 'cinematic-serif', label: 'Cinematic Serif' },
] satisfies Array<{ value: TypographyPresetId; label: string }>;

const HERO_VARIANT_OPTIONS = [
  { value: 'immersive', label: 'Immersive' },
  { value: 'split-editorial', label: 'Split Editorial' },
  { value: 'minimal-focus', label: 'Minimal Focus' },
] satisfies Array<{ value: HeroVariantId; label: string }>;

const PRODUCT_CARD_VARIANT_OPTIONS = [
  { value: 'editorial-minimal', label: 'Editorial Minimal' },
  { value: 'quiet-luxury', label: 'Quiet Luxury' },
  { value: 'soft-fashion-card', label: 'Soft Fashion' },
  { value: 'dark-elegance-card', label: 'Dark Elegance' },
  { value: 'boutique-clean', label: 'Boutique Clean' },
] satisfies Array<{ value: ProductCardVariantId; label: string }>;

const PRODUCT_GRID_VARIANT_OPTIONS = [
  { value: 'editorial-grid', label: 'Editorial Grid' },
  { value: 'minimal-grid', label: 'Minimal Grid' },
  { value: 'boutique-grid', label: 'Boutique Grid' },
] satisfies Array<{ value: ProductGridVariantId; label: string }>;

const CTA_VARIANT_OPTIONS = [
  { value: 'solid-premium', label: 'Solid Premium' },
  { value: 'soft-outline', label: 'Soft Outline' },
  { value: 'quiet-link', label: 'Quiet Link' },
] satisfies Array<{ value: CtaVariantId; label: string }>;

@Component({
  selector: 'app-admin-settings',
  imports: [],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.scss',
})
export class AdminSettings implements OnInit {
  readonly tenantId = input.required<AdminTenantId>();
  readonly settingsResult = input.required<AdminSettingsReadResult>();
  readonly canEditSettings = input.required<boolean>();
  readonly settingsSaved = output<AdminSettingsReadResult>();

  private readonly adminFirestore = inject(AdminFirestoreService);

  protected readonly form = signal<AdminSettingsFormState>(this.createInitialFormState());
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly isReadOnly = computed(() => !this.canEditSettings());
  protected readonly sourceLabel = computed(() =>
    this.settingsResult().source === 'settings-main' ? 'settings/main' : 'tenant legado',
  );

  protected readonly themePresetOptions = THEME_PRESETS.map((preset) => ({
    value: preset.id,
    label: preset.name,
  }));
  protected readonly typographyPresetOptions = TYPOGRAPHY_PRESET_OPTIONS;
  protected readonly heroVariantOptions = HERO_VARIANT_OPTIONS;
  protected readonly productCardVariantOptions = PRODUCT_CARD_VARIANT_OPTIONS;
  protected readonly productGridVariantOptions = PRODUCT_GRID_VARIANT_OPTIONS;
  protected readonly ctaVariantOptions = CTA_VARIANT_OPTIONS;

  ngOnInit(): void {
    this.hydrateForm(this.settingsResult().settings);
  }

  protected updateTextField(field: keyof AdminSettingsFormState, event: Event): void {
    const value = this.readInputValue(event);
    this.form.update((form) => ({ ...form, [field]: value }));
    this.clearFeedback();
  }

  protected updateThemePreset(event: Event): void {
    const themePreset = this.readInputValue(event) as ThemePresetId;
    const preset = THEME_PRESETS_BY_ID[themePreset];

    this.form.update((form) => ({
      ...form,
      themePreset,
      heroVariant: preset.variants.hero,
      productCardVariant: preset.variants.productCard,
      productGridVariant: preset.variants.productGrid,
      ctaVariant: preset.variants.cta,
    }));
    this.clearFeedback();
  }

  protected updateTypographyPreset(event: Event): void {
    const typographyPreset = this.readInputValue(event) as TypographyPresetId;
    this.form.update((form) => ({ ...form, typographyPreset }));
    this.clearFeedback();
  }

  protected updatePrimaryContactChannel(event: Event): void {
    const primaryContactChannel = this.readInputValue(event) as PrimaryContactChannelFormValue;
    this.form.update((form) => ({ ...form, primaryContactChannel }));
    this.clearFeedback();
  }

  protected updateHeroVariant(event: Event): void {
    const heroVariant = this.readInputValue(event) as HeroVariantId;
    this.form.update((form) => ({ ...form, heroVariant }));
    this.clearFeedback();
  }

  protected updateProductCardVariant(event: Event): void {
    const productCardVariant = this.readInputValue(event) as ProductCardVariantId;
    this.form.update((form) => ({ ...form, productCardVariant }));
    this.clearFeedback();
  }

  protected updateProductGridVariant(event: Event): void {
    const productGridVariant = this.readInputValue(event) as ProductGridVariantId;
    this.form.update((form) => ({ ...form, productGridVariant }));
    this.clearFeedback();
  }

  protected updateCtaVariant(event: Event): void {
    const ctaVariant = this.readInputValue(event) as CtaVariantId;
    this.form.update((form) => ({ ...form, ctaVariant }));
    this.clearFeedback();
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    void this.saveSettings();
  }

  private async saveSettings(): Promise<void> {
    if (this.isReadOnly()) {
      this.errorMessage.set('Seu role atual permite apenas leitura.');
      return;
    }

    const validationMessage = this.validateForm();

    if (validationMessage) {
      this.errorMessage.set(validationMessage);
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const savedSettings = await this.adminFirestore.saveStorefrontSettings(
        this.tenantId(),
        this.buildSettingsPayload(),
      );

      this.hydrateForm(savedSettings.settings);
      this.settingsSaved.emit(savedSettings);
      this.successMessage.set('Configuracoes salvas.');
    } catch (error) {
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.isSaving.set(false);
    }
  }

  private buildSettingsPayload(): AdminStorefrontSettingsDocument {
    const currentSettings = this.settingsResult().settings;
    const form = this.form();
    const instagramUrl = form.instagramUrl.trim();
    const whatsappUrl = form.whatsappUrl.trim();

    return {
      ...currentSettings,
      brand: {
        ...currentSettings.brand,
        name: form.brandName.trim(),
        slug: form.slug.trim(),
        logoAlt: currentSettings.brand.logoAlt || form.brandName.trim(),
        homeAriaLabel: currentSettings.brand.homeAriaLabel || `${form.brandName.trim()} home`,
      },
      theme: this.buildThemeConfig(form),
      contactChannels: [
        whatsappUrl
          ? {
              type: 'whatsapp' as const,
              label: 'Atendimento no WhatsApp',
              url: whatsappUrl,
            }
          : null,
        instagramUrl
          ? {
              type: 'instagram' as const,
              label: 'Instagram da loja',
              url: instagramUrl,
            }
          : null,
      ].filter((channel): channel is NonNullable<typeof channel> => Boolean(channel)),
      socialLinks: {
        ...currentSettings.socialLinks,
        instagramUrl,
        whatsappUrl,
      },
      catalog: {
        ...currentSettings.catalog,
        currencyCode: currentSettings.catalog.currencyCode ?? 'BRL',
      },
      primaryContactChannel: form.primaryContactChannel || undefined,
    };
  }

  private buildThemeConfig(form: AdminSettingsFormState): StorefrontThemeConfig {
    return {
      preset: form.themePreset,
      typographyPreset: form.typographyPreset,
      colors: {
        brandPrimary: form.brandPrimary,
        brandPrimaryStrong: form.brandPrimaryStrong,
        brandSecondary: form.brandSecondary,
        accent: form.accent,
      },
      variants: {
        hero: form.heroVariant,
        productCard: form.productCardVariant,
        productGrid: form.productGridVariant,
        cta: form.ctaVariant,
      },
    };
  }

  private hydrateForm(settings: AdminStorefrontSettingsDocument): void {
    const preset = THEME_PRESETS_BY_ID[settings.theme.preset];
    const colors = settings.theme.colors ?? {};
    const variants: StorefrontThemeVariants = {
      hero: settings.theme.variants?.hero ?? preset.variants.hero,
      productCard: settings.theme.variants?.productCard ?? preset.variants.productCard,
      productGrid: settings.theme.variants?.productGrid ?? preset.variants.productGrid,
      cta: settings.theme.variants?.cta ?? preset.variants.cta,
    };

    this.form.set({
      brandName: settings.brand.name,
      slug: settings.brand.slug,
      instagramUrl: settings.socialLinks.instagramUrl ?? '',
      whatsappUrl: settings.socialLinks.whatsappUrl ?? '',
      primaryContactChannel: settings.primaryContactChannel ?? '',
      themePreset: settings.theme.preset,
      typographyPreset: settings.theme.typographyPreset ?? 'editorial-serif',
      brandPrimary: colors.brandPrimary ?? preset.tokens.color.brandPrimary,
      brandPrimaryStrong: colors.brandPrimaryStrong ?? preset.tokens.color.brandPrimaryStrong,
      brandSecondary: colors.brandSecondary ?? preset.tokens.color.brandSecondary,
      accent: colors.accent ?? preset.tokens.color.accent,
      heroVariant: variants.hero,
      productCardVariant: variants.productCard,
      productGridVariant: variants.productGrid,
      ctaVariant: variants.cta,
    });
  }

  private validateForm(): string | null {
    const form = this.form();

    if (!form.brandName.trim()) {
      return 'Informe o nome da loja.';
    }

    if (!form.slug.trim()) {
      return 'Informe o slug da loja.';
    }

    if (form.primaryContactChannel === 'whatsapp' && !form.whatsappUrl.trim()) {
      return 'Informe o WhatsApp para usar esse contato como principal.';
    }

    if (form.primaryContactChannel === 'instagram' && !form.instagramUrl.trim()) {
      return 'Informe o Instagram para usar esse contato como principal.';
    }

    return null;
  }

  private createInitialFormState(): AdminSettingsFormState {
    const preset = THEME_PRESETS_BY_ID['editorial-luxury'];

    return {
      brandName: '',
      slug: '',
      instagramUrl: '',
      whatsappUrl: '',
      primaryContactChannel: '',
      themePreset: preset.id,
      typographyPreset: 'editorial-serif',
      brandPrimary: preset.tokens.color.brandPrimary,
      brandPrimaryStrong: preset.tokens.color.brandPrimaryStrong,
      brandSecondary: preset.tokens.color.brandSecondary,
      accent: preset.tokens.color.accent,
      heroVariant: preset.variants.hero,
      productCardVariant: preset.variants.productCard,
      productGridVariant: preset.variants.productGrid,
      ctaVariant: preset.variants.cta,
    };
  }

  private clearFeedback(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Nao foi possivel salvar as configuracoes agora.';
  }
}
