import { Component, computed, effect, inject, input, output, signal } from '@angular/core';

import {
  StorefrontThemeConfig,
  StorefrontThemeColorOverrides,
  TypographyPresetId,
} from '../../../core/theme/models/theme-config.types';
import {
  ProductCardVariantId,
  ThemePresetId,
} from '../../../core/theme/models/theme-preset.types';
import { THEME_PRESETS, THEME_PRESETS_BY_ID } from '../../../core/theme/presets';
import {
  StorefrontContentConfig,
  StorefrontNavigationLink,
} from '../../../core/storefront/storefront-config';
import {
  AdminSettingsReadResult,
  AdminStorefrontSettingsDocument,
  AdminTenantId,
} from '../models/admin-firestore.models';
import { AdminFirestoreService } from '../services/admin-firestore.service';
import { normalizeWhatsappUrl } from '../../../core/storefront/storefront-runtime-config.mapper';

type PrimaryContactChannelFormValue = '' | 'whatsapp' | 'instagram';
type ThemeColorField = 'brandPrimary' | 'brandPrimaryStrong' | 'brandSecondary' | 'accent';

interface AdminSettingsFormState {
  brandName: string;
  slug: string;
  logoPath: string;
  faviconPath: string;
  tagline: string;
  description: string;
  notFoundImagePath: string;
  instagramUrl: string;
  whatsappUrl: string;
  primaryContactChannel: PrimaryContactChannelFormValue;
  themePreset: ThemePresetId;
  typographyPreset: TypographyPresetId;
  brandPrimary: string;
  brandPrimaryStrong: string;
  brandSecondary: string;
  accent: string;
  customColors: boolean;
  productCardVariant: ProductCardVariantId;
  currencyCode: string;
  defaultWhatsAppMessage: string;
}

interface AdminSettingsPreview {
  brandName: string;
  brandInitials: string;
  slug: string;
  tagline: string;
  description: string;
  logoPreviewUrl: string | null;
  themePresetLabel: string;
  typographyPresetLabel: string;
  primaryContactLabel: string;
  whatsappUrl: string;
  instagramUrl: string;
  currencyCode: string;
  defaultWhatsAppMessage: string;
  productCardVariantLabel: string;
  colorModeLabel: string;
  colors: Array<{ label: string; value: string; sourceLabel: string }>;
  media: Array<{ label: string; value: string }>;
  advanced: Array<{ label: string; value: string }>;
  variants: Array<{ label: string; value: string }>;
}

const STORE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;
const ASSET_PATH_PATTERN = /^\/?[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;
const CONTENT_FIELDS = [
  'searchPlaceholder',
  'searchAriaLabel',
  'heroEyebrow',
  'heroCtaLabel',
  'popularSectionTitle',
  'emptyCatalogTitle',
  'emptyCatalogDescription',
  'detailTitle',
  'detailHighlightsTitle',
  'relatedSectionTitle',
  'primaryCtaLabel',
  'secondaryCtaLabel',
  'storeInfoSectionTitle',
  'footerShortcutsTitle',
  'footerSupportTitle',
  'footerCopyrightText',
  'searchButtonLabel',
  'notFoundTitle',
  'notFoundDescription',
  'notFoundBrowseLabel',
  'filtersTitle',
  'filtersResetLabel',
  'filterSearchPlaceholder',
  'priceRangeTitle',
  'priceRangeAriaLabel',
  'priceRangeCurrentPrefix',
  'pricePresetAllLabel',
  'pricePresetMidLabel',
  'pricePresetHighLabel',
  'categoriesTitle',
  'sortByLabel',
  'resultsCountSuffix',
  'sortPopularLabel',
  'sortLowestPriceLabel',
  'sortHighestRatedLabel',
  'mobileFilterButtonLabel',
  'mobileFilterApplyLabel',
  'pageNotFoundEyebrow',
  'backToHomeLabel',
  'productNotFoundEyebrow',
  'productAriaPrefix',
] satisfies Array<keyof StorefrontContentConfig>;

const TYPOGRAPHY_PRESET_OPTIONS = [
  { value: 'editorial-serif', label: 'Editorial classica' },
  { value: 'modern-sans', label: 'Moderna limpa' },
  { value: 'soft-serif', label: 'Serif delicada' },
  { value: 'cinematic-serif', label: 'Luxo cinematico' },
] satisfies Array<{ value: TypographyPresetId; label: string }>;

const PRODUCT_CARD_VARIANT_OPTIONS = [
  { value: 'editorial-minimal', label: 'Editorial limpo' },
  { value: 'quiet-luxury', label: 'Luxo discreto' },
  { value: 'soft-fashion-card', label: 'Moda suave' },
  { value: 'dark-elegance-card', label: 'Elegancia escura' },
  { value: 'boutique-clean', label: 'Boutique clara' },
] satisfies Array<{ value: ProductCardVariantId; label: string }>;

@Component({
  selector: 'app-admin-settings',
  imports: [],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.scss',
})
export class AdminSettings {
  readonly tenantId = input.required<AdminTenantId>();
  readonly settingsResult = input.required<AdminSettingsReadResult>();
  readonly canEditSettings = input.required<boolean>();
  readonly settingsSaved = output<AdminSettingsReadResult>();

  private readonly adminFirestore = inject(AdminFirestoreService);
  private lastHydratedSettings: AdminStorefrontSettingsDocument | null = null;

  protected readonly form = signal<AdminSettingsFormState>(this.createInitialFormState());
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly isReadOnly = computed(() => !this.canEditSettings());
  protected readonly sourceLabel = computed(() =>
    this.settingsResult().source === 'settings-main'
      ? 'Configuracao salva'
      : 'Configuracao inicial',
  );
  protected readonly validationIssues = computed(() => this.collectValidationIssues(this.form()));
  protected readonly settingsPreview = computed(() => this.buildSettingsPreview(this.form()));

  protected readonly themePresetOptions = THEME_PRESETS.map((preset) => ({
    value: preset.id,
    label: preset.name,
  }));
  protected readonly typographyPresetOptions = TYPOGRAPHY_PRESET_OPTIONS;
  protected readonly productCardVariantOptions = PRODUCT_CARD_VARIANT_OPTIONS;

  constructor() {
    effect(() => {
      const settings = this.settingsResult().settings;

      if (this.lastHydratedSettings === settings) {
        return;
      }

      this.lastHydratedSettings = settings;
      this.hydrateForm(settings);
    });
  }

  protected updateTextField(field: keyof AdminSettingsFormState, event: Event): void {
    const value = this.readInputValue(event);
    this.form.update((form) => ({ ...form, [field]: value }));
    this.clearFeedback();
  }

  protected updateColorField(field: ThemeColorField, event: Event): void {
    const value = this.readInputValue(event);
    this.form.update((form) => ({ ...form, [field]: value, customColors: true }));
    this.clearFeedback();
  }

  protected enableCustomColors(): void {
    this.form.update((form) => ({ ...form, customColors: true }));
    this.clearFeedback();
  }

  protected resetColorOverrides(): void {
    this.form.update((form) => ({
      ...form,
      customColors: false,
      ...this.getPresetColorValues(form.themePreset),
    }));
    this.clearFeedback();
  }

  protected updateThemePreset(event: Event): void {
    const themePreset = this.readInputValue(event) as ThemePresetId;
    const preset = THEME_PRESETS_BY_ID[themePreset];

    this.form.update((form) => ({
      ...form,
      themePreset,
      ...(!form.customColors ? this.getPresetColorValues(themePreset) : {}),
      productCardVariant: preset.variants.productCard,
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

  protected updateProductCardVariant(event: Event): void {
    const productCardVariant = this.readInputValue(event) as ProductCardVariantId;
    this.form.update((form) => ({ ...form, productCardVariant }));
    this.clearFeedback();
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    void this.saveSettings();
  }

  private async saveSettings(): Promise<void> {
    if (this.isReadOnly()) {
      this.errorMessage.set('Seu acesso atual permite apenas leitura.');
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
    const whatsappUrl = this.normalizeWhatsappInput(form.whatsappUrl);
    const preservedContent = this.sanitizeContent(currentSettings.content);
    const preservedNavigationLinks = this.sanitizeNavigationLinks(currentSettings.navigationLinks);
    const facebookUrl = this.sanitizeOptionalHttpUrl(currentSettings.socialLinks.facebookUrl);
    const youtubeUrl = this.sanitizeOptionalHttpUrl(currentSettings.socialLinks.youtubeUrl);

    return {
      brand: {
        name: form.brandName.trim(),
        slug: form.slug.trim(),
        logoPath: this.optionalTrimmedValue(form.logoPath),
        logoAlt: form.brandName.trim(),
        homeAriaLabel: `${form.brandName.trim()} home`,
        faviconPath: this.optionalTrimmedValue(form.faviconPath),
        tagline: this.optionalTrimmedValue(form.tagline),
        description: this.optionalTrimmedValue(form.description),
        notFoundImagePath: this.optionalTrimmedValue(form.notFoundImagePath),
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
        instagramUrl,
        whatsappUrl: whatsappUrl ?? '',
        ...(facebookUrl ? { facebookUrl } : {}),
        ...(youtubeUrl ? { youtubeUrl } : {}),
      },
      catalog: {
        currencyCode: form.currencyCode.trim().toUpperCase(),
        defaultWhatsAppMessage: form.defaultWhatsAppMessage.trim(),
        priceRangeMin: currentSettings.catalog.priceRangeMin,
        priceRangeMax: currentSettings.catalog.priceRangeMax,
        pricePresetMidValue: currentSettings.catalog.pricePresetMidValue,
        pricePresetHighValue: currentSettings.catalog.pricePresetHighValue,
      },
      ...(preservedContent ? { content: preservedContent } : {}),
      ...(preservedNavigationLinks ? { navigationLinks: preservedNavigationLinks } : {}),
      primaryContactChannel: form.primaryContactChannel || undefined,
      createdAt: currentSettings.createdAt,
      updatedAt: currentSettings.updatedAt,
    };
  }

  private buildThemeConfig(form: AdminSettingsFormState): StorefrontThemeConfig {
    const preset = THEME_PRESETS_BY_ID[form.themePreset];
    const colorOverrides = this.buildColorOverrides(form);
    const variantOverrides =
      form.productCardVariant !== preset.variants.productCard
        ? { productCard: form.productCardVariant }
        : undefined;

    return {
      preset: form.themePreset,
      typographyPreset: form.typographyPreset,
      ...(colorOverrides ? { colors: colorOverrides } : {}),
      ...(variantOverrides ? { variants: variantOverrides } : {}),
    };
  }

  private hydrateForm(settings: AdminStorefrontSettingsDocument): void {
    const preset = THEME_PRESETS_BY_ID[settings.theme.preset];
    const colors = settings.theme.colors ?? {};
    const customColors = this.hasMeaningfulColorOverrides(colors, settings.theme.preset);

    this.form.set({
      brandName: settings.brand.name,
      slug: settings.brand.slug,
      logoPath: settings.brand.logoPath ?? '',
      faviconPath: settings.brand.faviconPath ?? '',
      tagline: settings.brand.tagline ?? '',
      description: settings.brand.description ?? '',
      notFoundImagePath: settings.brand.notFoundImagePath ?? '',
      instagramUrl: settings.socialLinks.instagramUrl ?? '',
      whatsappUrl: this.normalizeWhatsappInput(settings.socialLinks.whatsappUrl) ?? '',
      primaryContactChannel: settings.primaryContactChannel ?? '',
      themePreset: settings.theme.preset,
      typographyPreset: settings.theme.typographyPreset ?? 'editorial-serif',
      brandPrimary: colors.brandPrimary ?? preset.tokens.color.brandPrimary,
      brandPrimaryStrong: colors.brandPrimaryStrong ?? preset.tokens.color.brandPrimaryStrong,
      brandSecondary: colors.brandSecondary ?? preset.tokens.color.brandSecondary,
      accent: colors.accent ?? preset.tokens.color.accent,
      customColors,
      productCardVariant: settings.theme.variants?.productCard ?? preset.variants.productCard,
      currencyCode: settings.catalog.currencyCode ?? 'BRL',
      defaultWhatsAppMessage: settings.catalog.defaultWhatsAppMessage ?? 'Ola! Tenho interesse em:',
    });
  }

  private validateForm(): string | null {
    return this.validationIssues()[0] ?? null;
  }

  private collectValidationIssues(form: AdminSettingsFormState): string[] {
    const issues: string[] = [];
    const brandName = form.brandName.trim();
    const slug = form.slug.trim();
    const whatsappUrl = form.whatsappUrl.trim();
    const instagramUrl = form.instagramUrl.trim();
    const currencyCode = form.currencyCode.trim().toUpperCase();
    const defaultWhatsAppMessage = form.defaultWhatsAppMessage.trim();
    const assetFields = [
      { label: 'logo', value: form.logoPath },
      { label: 'icone da aba', value: form.faviconPath },
      { label: 'imagem de produto nao encontrado', value: form.notFoundImagePath },
    ];

    if (!brandName) {
      issues.push('Informe o nome da loja.');
    }

    if (!slug) {
      issues.push('Informe o slug da loja.');
    } else if (!STORE_SLUG_PATTERN.test(slug)) {
      issues.push('Use um slug em minusculas, numeros e hifens.');
    }

    if (!whatsappUrl && !instagramUrl) {
      issues.push('Informe ao menos um canal de contato.');
    }

    if (whatsappUrl && !this.normalizeWhatsappInput(whatsappUrl)) {
      issues.push('Informe WhatsApp com DDI, exemplo: 5598984655819.');
    }

    if (instagramUrl && !this.isValidHttpUrl(instagramUrl)) {
      issues.push('Informe uma URL de Instagram valida.');
    }

    if (form.primaryContactChannel === 'whatsapp' && !whatsappUrl) {
      issues.push('Informe o WhatsApp para usar esse contato como principal.');
    }

    if (form.primaryContactChannel === 'instagram' && !instagramUrl) {
      issues.push('Informe o Instagram para usar esse contato como principal.');
    }

    for (const assetField of assetFields) {
      if (assetField.value.trim() && !this.isValidAssetPath(assetField.value.trim())) {
        issues.push(`Informe uma URL http(s) ou caminho de asset valido para ${assetField.label}.`);
      }
    }

    if (!THEME_PRESETS_BY_ID[form.themePreset]) {
      issues.push('Selecione um preset de tema valido.');
    }

    if (!this.isOptionValue(TYPOGRAPHY_PRESET_OPTIONS, form.typographyPreset)) {
      issues.push('Selecione uma tipografia valida.');
    }

    if (!this.isOptionValue(PRODUCT_CARD_VARIANT_OPTIONS, form.productCardVariant)) {
      issues.push('Selecione um card de produto valido.');
    }

    if (
      [form.brandPrimary, form.brandPrimaryStrong, form.brandSecondary, form.accent].some(
        (color) => !HEX_COLOR_PATTERN.test(color),
      )
    ) {
      issues.push('Use cores em formato hexadecimal valido.');
    }

    if (!currencyCode) {
      issues.push('Informe a moeda do catalogo.');
    } else if (!CURRENCY_CODE_PATTERN.test(currencyCode)) {
      issues.push('Use moeda com 3 letras, exemplo: BRL.');
    }

    if (!defaultWhatsAppMessage) {
      issues.push('Informe a mensagem padrao do WhatsApp.');
    }

    return issues;
  }

  private buildSettingsPreview(form: AdminSettingsFormState): AdminSettingsPreview {
    return {
      brandName: form.brandName.trim() || 'Nome pendente',
      brandInitials: this.buildBrandInitials(form.brandName),
      slug: form.slug.trim() || 'slug-pendente',
      tagline: form.tagline.trim() || 'Slogan pendente',
      description: form.description.trim() || 'Descricao pendente',
      logoPreviewUrl: this.resolvePreviewAssetUrl(form.logoPath),
      themePresetLabel: THEME_PRESETS_BY_ID[form.themePreset]?.name ?? form.themePreset,
      typographyPresetLabel: this.getOptionLabel(TYPOGRAPHY_PRESET_OPTIONS, form.typographyPreset),
      primaryContactLabel: this.resolvePrimaryContactLabel(form),
      whatsappUrl: this.normalizeWhatsappInput(form.whatsappUrl) ?? 'WhatsApp pendente',
      instagramUrl: form.instagramUrl.trim() || 'Instagram pendente',
      currencyCode: form.currencyCode.trim().toUpperCase() || 'Moeda pendente',
      defaultWhatsAppMessage: form.defaultWhatsAppMessage.trim() || 'Mensagem pendente',
      productCardVariantLabel: this.getOptionLabel(
        PRODUCT_CARD_VARIANT_OPTIONS,
        form.productCardVariant,
      ),
      colorModeLabel: form.customColors ? 'Cores personalizadas' : 'Cores do tema',
      colors: [
        {
          label: 'Principal',
          value: form.brandPrimary,
          sourceLabel: this.resolveColorSourceLabel(form, 'brandPrimary'),
        },
        {
          label: 'Principal forte',
          value: form.brandPrimaryStrong,
          sourceLabel: this.resolveColorSourceLabel(form, 'brandPrimaryStrong'),
        },
        {
          label: 'Apoio',
          value: form.brandSecondary,
          sourceLabel: this.resolveColorSourceLabel(form, 'brandSecondary'),
        },
        {
          label: 'Destaque',
          value: form.accent,
          sourceLabel: this.resolveColorSourceLabel(form, 'accent'),
        },
      ],
      media: [
        { label: 'Logo', value: form.logoPath.trim() || 'Nao configurado' },
        { label: 'Icone da aba', value: form.faviconPath.trim() || 'Nao configurado' },
        {
          label: 'Imagem de produto nao encontrado',
          value: form.notFoundImagePath.trim() || 'Nao configurada',
        },
      ],
      advanced: [
        { label: 'Endereco interno', value: form.slug.trim() || 'slug-pendente' },
        { label: 'Moeda dos precos', value: form.currencyCode.trim().toUpperCase() || 'BRL' },
        {
          label: 'Cards de produto',
          value: this.getOptionLabel(PRODUCT_CARD_VARIANT_OPTIONS, form.productCardVariant),
        },
      ],
      variants: [
        {
          label: 'Card',
          value: this.getOptionLabel(PRODUCT_CARD_VARIANT_OPTIONS, form.productCardVariant),
        },
      ],
    };
  }

  private resolveColorSourceLabel(form: AdminSettingsFormState, field: ThemeColorField): string {
    if (!form.customColors) {
      return 'Do tema';
    }

    return form[field] === this.getPresetColorValues(form.themePreset)[field]
      ? 'Do tema'
      : 'Personalizada';
  }

  private resolvePrimaryContactLabel(form: AdminSettingsFormState): string {
    if (form.primaryContactChannel === 'whatsapp') {
      return 'WhatsApp';
    }

    if (form.primaryContactChannel === 'instagram') {
      return 'Instagram';
    }

    return 'Sem preferencia';
  }

  private buildColorOverrides(
    form: AdminSettingsFormState,
  ): StorefrontThemeColorOverrides | undefined {
    if (!form.customColors) {
      return undefined;
    }

    const presetColors = this.getPresetColorValues(form.themePreset);
    const overrides = {
      ...(form.brandPrimary !== presetColors.brandPrimary
        ? { brandPrimary: form.brandPrimary }
        : {}),
      ...(form.brandPrimaryStrong !== presetColors.brandPrimaryStrong
        ? { brandPrimaryStrong: form.brandPrimaryStrong }
        : {}),
      ...(form.brandSecondary !== presetColors.brandSecondary
        ? { brandSecondary: form.brandSecondary }
        : {}),
      ...(form.accent !== presetColors.accent ? { accent: form.accent } : {}),
    };

    return Object.keys(overrides).length > 0 ? overrides : undefined;
  }

  private hasMeaningfulColorOverrides(
    colors: StorefrontThemeColorOverrides,
    themePreset: ThemePresetId,
  ): boolean {
    const presetColors = this.getPresetColorValues(themePreset);

    return (Object.keys(colors) as ThemeColorField[]).some(
      (field) => colors[field] !== undefined && colors[field] !== presetColors[field],
    );
  }

  private getPresetColorValues(themePreset: ThemePresetId): Record<ThemeColorField, string> {
    const preset = THEME_PRESETS_BY_ID[themePreset] ?? THEME_PRESETS_BY_ID['editorial-luxury'];

    return {
      brandPrimary: preset.tokens.color.brandPrimary,
      brandPrimaryStrong: preset.tokens.color.brandPrimaryStrong,
      brandSecondary: preset.tokens.color.brandSecondary,
      accent: preset.tokens.color.accent,
    };
  }

  private getOptionLabel<T extends string>(
    options: ReadonlyArray<{ value: T; label: string }>,
    value: T,
  ): string {
    return options.find((option) => option.value === value)?.label ?? value;
  }

  private isOptionValue<T extends string>(
    options: ReadonlyArray<{ value: T; label: string }>,
    value: T,
  ): boolean {
    return options.some((option) => option.value === value);
  }

  private isValidHttpUrl(value: string): boolean {
    try {
      const url = new URL(value);

      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private isValidAssetPath(value: string): boolean {
    return this.isValidHttpUrl(value) || ASSET_PATH_PATTERN.test(value);
  }

  private resolvePreviewAssetUrl(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue || !this.isValidAssetPath(trimmedValue)) {
      return null;
    }

    return this.isValidHttpUrl(trimmedValue) || trimmedValue.startsWith('/')
      ? trimmedValue
      : `/${trimmedValue}`;
  }

  private buildBrandInitials(name: string): string {
    const initials = name
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');

    return initials || 'WL';
  }

  private sanitizeOptionalHttpUrl(value: string | undefined): string | undefined {
    return value && this.isValidHttpUrl(value) ? value : undefined;
  }

  private sanitizeContent(
    content: AdminStorefrontSettingsDocument['content'],
  ): Partial<StorefrontContentConfig> | undefined {
    if (!content) {
      return undefined;
    }

    const sanitizedContent = CONTENT_FIELDS.reduce<Partial<StorefrontContentConfig>>(
      (result, field) => {
        const value = content[field];

        if (typeof value === 'string') {
          result[field] = value;
        }

        return result;
      },
      {},
    );

    return Object.keys(sanitizedContent).length > 0 ? sanitizedContent : undefined;
  }

  private sanitizeNavigationLinks(
    navigationLinks: AdminStorefrontSettingsDocument['navigationLinks'],
  ): StorefrontNavigationLink[] | undefined {
    const links = Array.isArray(navigationLinks) ? navigationLinks : [];
    const sanitizedLinks = links
      .filter((link): link is StorefrontNavigationLink => {
        const candidate = link as Partial<StorefrontNavigationLink> | null;

        return Boolean(candidate)
          && typeof candidate?.label === 'string'
          && candidate.label.trim().length > 0
          && typeof candidate.route === 'string'
          && candidate.route.startsWith('/');
      })
      .slice(0, 6)
      .map((link) => ({
        label: link.label.trim(),
        route: link.route.trim(),
      }));

    return sanitizedLinks.length > 0 ? sanitizedLinks : undefined;
  }

  private createInitialFormState(): AdminSettingsFormState {
    const preset = THEME_PRESETS_BY_ID['editorial-luxury'];

    return {
      brandName: '',
      slug: '',
      logoPath: '',
      faviconPath: '',
      tagline: '',
      description: '',
      notFoundImagePath: '',
      instagramUrl: '',
      whatsappUrl: '',
      primaryContactChannel: '',
      themePreset: preset.id,
      typographyPreset: 'editorial-serif',
      brandPrimary: preset.tokens.color.brandPrimary,
      brandPrimaryStrong: preset.tokens.color.brandPrimaryStrong,
      brandSecondary: preset.tokens.color.brandSecondary,
      accent: preset.tokens.color.accent,
      customColors: false,
      productCardVariant: preset.variants.productCard,
      currencyCode: 'BRL',
      defaultWhatsAppMessage: 'Ola! Tenho interesse em:',
    };
  }

  private optionalTrimmedValue(value: string): string | undefined {
    const trimmedValue = value.trim();

    return trimmedValue ? trimmedValue : undefined;
  }

  private normalizeWhatsappInput(value: string): string | undefined {
    return normalizeWhatsappUrl(this.optionalTrimmedValue(value));
  }

  private clearFeedback(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Nao foi possivel salvar as configuracoes agora.';
  }
}
