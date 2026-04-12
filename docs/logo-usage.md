# Catalog Flow - Guia de Uso do Logo

## Objetivo
Padronizar o uso do logo na interface para manter consistencia visual com o Design System.

## Arquivo de logo
- `public/recipe-box-logo.svg` — Asset principal usado pelo Design System.

## Caso de uso

### `recipe-box-logo.svg` (Base DS)
- Uso principal no produto.
- Header e navegacao padrao.
- Interfaces que usam as variaveis globais do design system.
- Referenciado via `StorefrontConfig.brand.logoPath`.

## Regras rapidas
- Prioridade: `recipe-box-logo.svg` para uso geral.
- Nao alterar proporcao do logo.
- Nao aplicar filtros CSS que distorcam as cores.
- Para white label, substituir o arquivo SVG e atualizar `StorefrontConfig.brand.logoPath`.

## Exemplo de aplicacao no HTML
```html
<img [src]="storefrontConfig().brand.logoPath" [alt]="storefrontConfig().brand.logoAlt" />
```

## Checklist de QA
- O logo escolhido esta adequado ao contraste do fundo.
- O logo esta nitido em desktop e mobile.
- O nome da aplicacao permanece consistente com `StorefrontConfig.brand.name`.
