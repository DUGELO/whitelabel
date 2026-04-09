# Recipe Box - Guia de Uso dos Logos

## Objetivo
Padronizar qual variante de logo usar em cada contexto de interface para manter consistencia visual com o Design System.

## Arquivos de logo
- `public/recipe-box-logo.svg`
- `public/recipe-box-logo-default.svg`
- `public/recipe-box-logo-monochrome.svg`
- `public/recipe-box-logo-high-contrast.svg`
- `public/recipe-box-logo-inverse.svg`

## Casos de uso recomendados

### `recipe-box-logo.svg` (Base DS)
- Uso principal no produto.
- Header e navegacao padrao.
- Interfaces que usam as variaveis globais do design system.

### `recipe-box-logo-default.svg` (Default Copy)
- Copia da versao principal para testes A/B.
- Comparacoes visuais sem alterar o asset principal.
- Cenarios de validacao em QA.

### `recipe-box-logo-monochrome.svg` (Monochrome)
- Layouts com pouco contraste de cor.
- Materiais internos, documentos, areas compactas.
- Quando a interface pede neutralidade visual.

### `recipe-box-logo-high-contrast.svg` (High Contrast)
- Ambientes com alta luminosidade.
- Interfaces com exigencia forte de legibilidade.
- Projecoes, TVs, telas com reflexo ou baixa qualidade.

### `recipe-box-logo-inverse.svg` (Inverse)
- Fundo escuro.
- Hero sections dark, overlays e banners noturnos.
- Nao usar em fundo claro.

## Regras rapidas
- Prioridade: `recipe-box-logo.svg` para uso geral.
- Em fundo escuro: usar `recipe-box-logo-inverse.svg`.
- Evite trocar variante sem necessidade de contexto.
- Nao alterar proporcao do logo.
- Nao aplicar filtros CSS que distorcam as cores.

## Exemplo de aplicacao no HTML
```html
<img src="recipe-box-logo.svg" alt="Recipe Box" />
```

## Exemplo para fundo escuro
```html
<div style="background:#1f1f1f; padding:16px;">
  <img src="recipe-box-logo-inverse.svg" alt="Recipe Box" />
</div>
```

## Checklist de QA
- O logo escolhido esta adequado ao contraste do fundo.
- O logo esta nitido em desktop e mobile.
- O asset usado corresponde ao caso de uso definido acima.
- O nome da aplicacao permanece "Recipe Box".
