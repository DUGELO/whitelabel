# Storefront Runtime Config

Este documento registra o fluxo publico de configuracao da loja apos a correcao critica da Phase 5.

## Fonte de verdade

O storefront publico tenta carregar primeiro:

```txt
tenants/{tenantId}/settings/main
```

Depois mapeia esse documento para `StorefrontConfig` e hidrata `StorefrontConfigService.config`.

`STOREFRONT_CONFIG` continua existindo como fallback local para:

- ambiente sem Firestore
- settings ausente
- permissao/erro de rede
- campos incompletos do tenant configurado como fallback local

Para qualquer `tenantId` diferente do fallback local, o mapper nao reaproveita logo,
favicon, imagem de erro, WhatsApp, Instagram, URL publica, overrides de cor,
tipografia ou variants do tenant local. Campos ausentes ficam vazios, usam apenas
defaults de preset da plataforma ou recebem defaults genericos para evitar vazamento
de marca entre lojas.

## Fluxo de inicializacao

```txt
app initializer
  -> StorefrontRuntimeConfigService.loadConfig()
  -> Firestore settings/main + tenant legado
  -> mapRuntimeStorefrontConfig()
  -> StorefrontConfigService.applyRuntimeConfig()
  -> initializeBranding()
  -> ThemeEngineService.initializeTheme()
```

## Resolucao de tenantId

Hoje o tenant publico e resolvido assim:

1. query param `?tenantId=...`, util para QA e desenvolvimento
2. fallback `STOREFRONT_CONFIG.tenantId`

Para producao multi-tenant real, o proximo passo e resolver por dominio ou slug publico.

## Campos publicos

O mapper aceita apenas campos conhecidos de:

- `brand`
- `theme`
- `content`
- `contactChannels`
- `navigationLinks`
- `socialLinks`
- `catalog`
- `primaryContactChannel`

Campos desconhecidos, `customCss`, tokens livres e variants invalidos sao ignorados no runtime.

O admin tambem salva um payload canonico em `settings/main`; saves futuros substituem o documento controlado em vez de preservar campos antigos por merge.

O contrato de tema agora diferencia preset herdado de override:

- `theme.preset` define a base visual
- `theme.colors` e opcional e so deve existir quando ha personalizacao explicita
- cores iguais ao preset selecionado devem ser omitidas
- cores legadas do documento `tenants/{tenantId}` so entram no runtime quando `settings/main` ainda nao assumiu o tema
- o admin atual edita apenas `theme.variants.productCard`, porque e o variant com efeito visual implementado no storefront

WhatsApp pode ser digitado como telefone no admin, mas o valor publico persistido continua normalizado como:

```txt
https://wa.me/5598984655819
```

## Revisao Staff Phase 5

O review da Phase 5 reforcou que `settings/main` deve ser completo o suficiente
para a vitrine publica. O runtime nao deve mascarar uma loja incompleta com assets
e canais comerciais de outro tenant.

As rules recomendadas agora validam:

- paths de logo/favicon/imagem de erro como URL http(s) ou asset local controlado
- contrato interno de `content`
- contrato interno de `navigationLinks`
- todos os itens de `contactChannels` permitidos
- todos os itens de `products.images` permitidos
- URLs de imagens de produto como http(s)

## Firebase rules

`settings/main` precisa ter leitura publica segura para a vitrine carregar sem login.

Depois de alterar `firestore.rules`, e necessario fazer deploy/validacao no Firebase:

```bash
firebase deploy --only firestore:rules
```

Neste ambiente a Firebase CLI nao esta disponivel, entao essa etapa precisa ser executada pelo dev com acesso ao projeto.
