# White Label Migration Pipeline Prompt

Use este prompt como Task Prompt avançado para orientar um agente a migrar esta aplicação para um produto white label de vitrine para lojas com venda principalmente via Instagram e WhatsApp.

## Como usar

- Use este arquivo junto com [system-prompt.md](system-prompt.md).
- O system prompt define o comportamento permanente do agente.
- Este arquivo define a missão, o plano de execução e os guardrails específicos desta migração.
- Se quiser controlar melhor o risco, execute por ondas em vez de pedir a migração inteira de uma vez.

---

## Prompt

Sua missão é conduzir uma migração completa, incremental e disciplinada desta aplicação para um produto white label de vitrine de produtos, pensado para lojas com alto giro, ticket relativamente baixo e operação comercial concentrada em Instagram e WhatsApp.

Você não deve tratar esta tarefa como mera renomeação de entidades. Seu objetivo é transformar a aplicação em uma base de produto white label sustentável, configurável com baixo custo, fácil de vender, fácil de operar e com alto reaproveitamento entre clientes.

## Objetivo de negócio

Transformar a aplicação atual em um produto white label de vitrine para lojas, onde a personalização por cliente seja mínima, rápida e barata, sem depender de desenvolvimento customizado por tenant.

O sistema final deve priorizar:

- alto reaproveitamento de código
- baixo custo de implantação por loja
- configuração simples e objetiva
- forte aderência a catálogo de produtos
- integração comercial por links e CTAs para Instagram e WhatsApp
- branding configurável sem alterar componentes compartilhados
- ótima relação custo-benefício operacional e técnica

## Premissas obrigatórias do produto

O white label deve funcionar com configuração mínima por loja. Os itens abaixo devem ser facilmente configuráveis por contrato, JSON, provider, environment, CMS simples ou adapter equivalente, sem espalhar condicionais pelo código:

- logo
- nome da marca
- cores principais e secundárias
- tipografia ou tokens de tipografia quando aplicável
- favicon e assets institucionais
- títulos institucionais
- descrições institucionais
- slogan ou tagline
- imagens de banner e destaques
- imagens dos produtos
- títulos dos produtos
- descrições dos produtos
- preços
- preços promocionais quando aplicável
- links de produto
- links para Instagram
- links para WhatsApp
- links de checkout ou catálogo externo quando aplicável
- labels de CTA
- informações de contato
- textos de empty state, not found e shell da aplicação

Evite qualquer solução que aumente o custo por loja sem retorno claro. Não crie arquitetura excessivamente complexa para suportar cenários improváveis. Modele o produto para ser altamente configurável, mas com simplicidade operacional.

## Restrições técnicas obrigatórias

- Angular v21
- Angular Material 21
- standalone components
- TypeScript estrito
- Angular Signals API como principal abordagem de estado local
- ChangeDetectionStrategy.OnPush por padrão
- Clean Architecture
- SOLID aplicado com pragmatismo
- Clean Code
- white label obrigatório
- componentes compartilhados com Storybook obrigatório
- testes unitários e de integração obrigatórios para regras e fluxos relevantes
- performance e observabilidade devem ser consideradas desde a modelagem

## Problema a resolver

A aplicação atual carrega traços de um domínio antigo orientado a receitas e precisa ser migrada para um domínio de catálogo comercial. A migração já começou com mudanças de nomenclatura e organização em torno de product, mas ainda há inconsistências de domínio, rotas, copy, branding, contrato de dados, navegação e componentes compartilhados.

Você deve conduzir a migração completa, atacando a raiz do problema e não apenas a superfície visual.

## Resultado esperado

Ao final, a aplicação deve se comportar como uma vitrine de produtos white label pronta para ser adaptada rapidamente para novas lojas com mínima configuração, sem refactors estruturais adicionais.

---

## Contrato de execução do agente

Siga estas regras obrigatórias durante toda a execução.

### Regras anti-alucinação

- Não invente arquivos, rotas, contratos, APIs, endpoints, componentes, stories, testes ou integrações que não tenham sido verificados no workspace, a menos que você esteja explicitamente propondo e implementando uma nova estrutura alvo.
- Quando algo for um fato observado no código, trate como fato verificado.
- Quando algo for uma proposta de destino, identifique claramente como proposta arquitetural ou mudança nova.
- Se faltar contexto crítico para implementar com segurança, primeiro inspecione a base. Só faça perguntas ao usuário se a ambiguidade impedir decisão segura.
- Não assuma que a simples ausência de erro de compilação significa que a migração está correta.

### Regras de controle de escopo

- Trabalhe por ondas.
- Tenha no máximo uma onda em andamento por vez.
- Não misture refactor estrutural, remodelagem de domínio e polimento visual no mesmo passo se isso reduzir verificabilidade.
- Preserve mudanças do usuário e não reverta alterações não relacionadas.
- Evite reformatar áreas não relacionadas.

### Regras de verificabilidade

- Antes de editar, inspecione a área afetada.
- Após cada onda, valide consistência local com testes, build, lint ou análise equivalente disponível.
- Se você criar uma arquitetura de transição, explicite o que é temporário e o que é estado alvo.
- Sempre que preservar compatibilidade temporária, registre o motivo e o plano de remoção.

### Regras de qualidade do resultado

- Prefira mudanças pequenas, testáveis e com motivo claro.
- Não espalhe branding em componentes compartilhados.
- Não espalhe comportamento por tenant em condicionais pela UI.
- Não mantenha semântica legada apenas por conveniência se ela comprometer o domínio final.

---

## Pipeline obrigatório

Execute a tarefa sem pular etapas.

### Fase 1. Entendimento do problema

Antes de alterar qualquer código:

- reescreva internamente o problema em termos de negócio, arquitetura e produto
- diferencie claramente o que já foi melhorado do que ainda está semanticamente preso ao domínio antigo
- identifique riscos de regressão funcional, risco de overengineering e risco de falso white label
- considere que este produto precisa ter implantação barata, manutenção previsível e customização mínima por cliente

### Fase 2. Auditoria do estado atual

Faça uma leitura criteriosa da base e mapeie, no mínimo:

- rotas
- entidades e tipos
- serviços e facades
- componentes de shell
- componentes compartilhados
- tokens de tema
- assets e branding hardcoded
- cópias institucionais e mensagens de UI
- componentes de busca e listagem
- página de detalhe
- not found e empty states
- stories e testes existentes
- pontos de acoplamento ao domínio antigo

Classifique os achados em:

- inconsistência de navegação
- inconsistência de nomenclatura
- inconsistência de contrato
- inconsistência de branding
- inconsistência de UX comercial
- dívida técnica que impede white label real

### Fase 3. Definição da arquitetura alvo

Antes de implementar, modele explicitamente a arquitetura alvo.

Separe claramente:

- domínio
- aplicação
- infraestrutura
- apresentação
- configuração white label
- mapeamento DTO -> domínio -> view model
- observabilidade

Defina um modelo de catálogo comercial orientado a produto, não a receita.

O domínio alvo deve contemplar, quando fizer sentido para o produto:

- Product
- ProductMedia
- ProductPrice
- ProductAvailability
- ProductCategory
- ProductTag
- CatalogSection
- BrandConfig
- ContactChannel
- CtaConfig
- StorefrontConfig

Se algum nome diferente for melhor, use-o, desde que a semântica fique clara.

### Fase 4. Estratégia de white label enxuto

A estratégia de white label deve priorizar custo-benefício.

Modele o sistema para suportar rapidamente múltiplas lojas com configuração mínima. Prefira:

- configuração centralizada por contrato
- design tokens e CSS variables
- providers ou adapters de configuração
- mapeadores explícitos
- poucas superfícies de customização, mas muito bem definidas

Evite:

- condicionais de tenant espalhadas em componentes
- forks por cliente
- assets hardcoded em componentes compartilhados
- copy hardcoded com branding fixo
- configurações excessivas que aumentem custo operacional

Defina uma superfície mínima e suficiente de configuração. No mínimo, proponha e implemente uma estrutura onde seja trivial configurar:

- identidade visual da loja
- conteúdo institucional da shell
- catálogo de produtos
- preços e labels comerciais
- canais de contato e compra
- banners e seções da home
- CTAs principais

### Fase 5. Plano de migração incremental

Monte e execute um plano em ondas, com segurança de evolução.

As ondas devem cobrir, no mínimo:

1. saneamento semântico e de rotas
2. saneamento de branding hardcoded
3. remodelagem do contrato de dados para catálogo comercial
4. introdução da configuração white label centralizada
5. refatoração da shell e dos componentes compartilhados
6. adaptação da home, busca, cards e detalhe para vitrine comercial
7. adequação dos estados vazios, not found e mensagens institucionais
8. testes, Storybook e documentação
9. observabilidade e eventos de funil comercial

Cada onda deve ser implementável e verificável isoladamente.

Para cada onda, você deve explicitar:

- objetivo da onda
- arquivos ou áreas impactadas
- risco principal
- critério de verificação ao final da onda

### Fase 6. Implementação obrigatória

Implemente com foco em raiz do problema.

#### 6.1 Domínio e contratos

- remova ou aposente a semântica residual de recipe quando ela não fizer mais sentido
- substitua contratos culinários por contratos comerciais de catálogo
- preserve compatibilidade apenas quando houver real necessidade de transição controlada
- não mantenha nomes legados apenas por conveniência se isso degradar a clareza do produto

#### 6.2 Rotas e navegação

- garanta coerência total entre rotas declaradas e links usados pelos componentes
- elimine links residuais para domínios antigos
- assegure que componentes compartilhados naveguem de forma previsível

#### 6.3 Shell e branding

- remova branding hardcoded da aplicação
- centralize nome da marca, logo, tagline, textos de shell e links institucionais
- preserve acessibilidade em logo, labels e navegação

#### 6.4 Home e vitrine

- transforme a home em vitrine comercial configurável
- permita banners, seções de destaque, produtos populares, coleções ou chamadas promocionais por configuração
- garanta que o layout seja útil para lojas simples, sem obrigar modelagens complexas por cliente

#### 6.5 Cards e componentes compartilhados

- transforme cards compartilhados em componentes neutros de catálogo
- remova semântica residual de receita nos componentes compartilhados
- inclua stories cobrindo variantes relevantes de branding, preço, CTA, loading, empty e fallback de imagem

#### 6.6 Detalhe de produto

- adapte a página de detalhe para comportamento comercial
- o foco deve ser apresentação do produto e conversão, não instruções culinárias
- contemple imagens, preço, descrição, disponibilidade, CTA principal, CTA secundário, tags e produtos relacionados quando fizer sentido
- se algum campo antigo não fizer mais sentido, remova ou substitua por equivalente comercial

#### 6.7 Busca e filtros

- revise a busca para catálogo comercial
- filtros devem refletir atributos comerciais relevantes, não atributos culinários legados
- preserve performance de listas e custo de renderização

#### 6.8 Estados de erro e vazio

- reescreva empty state, not found e mensagens institucionais com linguagem neutra e comercial
- nenhuma mensagem residual de recipe, kitchen, cooking ou branding fixo deve permanecer se não fizer parte da configuração

#### 6.9 Observabilidade

Implemente ou prepare pontos de observabilidade para:

- clique em produto
- clique em CTA principal
- clique em WhatsApp
- clique em Instagram
- busca sem resultado
- abandono de fluxo
- erro de carregamento de catálogo
- contexto de tenant ou brand sem vazar dados sensíveis

### Fase 7. Testes obrigatórios

Adicione ou atualize testes cobrindo, no mínimo:

- contrato e mapeamento do domínio de produto
- configuração white label
- navegação dos cards e páginas de detalhe
- rendering da shell com branding configurável
- CTAs comerciais
- estados empty, not found e error
- filtros e busca
- regressões de rotas

Não escreva testes frágeis acoplados a detalhes internos irrelevantes.

### Fase 8. Storybook obrigatório

Para cada componente compartilhado relevante, entregue stories cobrindo:

- default
- preço regular
- preço promocional
- sem imagem
- com branding alternativo
- loading
- empty
- CTA primário e secundário

Inclua interaction tests quando o comportamento for importante.

### Fase 9. Performance e manutenção

Ao implementar, considere explicitamente:

- custo de renderização de listas
- uso de track em loops
- evitar recomputação desnecessária
- baixo acoplamento entre configuração e UI
- estrutura fácil de evoluir sem reabrir o domínio antigo

### Fase 10. Revisão crítica final

Antes de concluir:

- revise como code reviewer sênior
- identifique resquícios de recipe ou branding fixo
- procure regressões de rota
- procure componentes compartilhados ainda acoplados ao domínio antigo
- procure configurações excessivas que aumentem o custo por cliente
- confirme se a base final é de fato white label e não apenas renomeada

---

## Diretrizes de modelagem do produto white label

Modele a solução para que novas lojas possam ser ativadas com uma configuração mínima e previsível.

### Configuração mínima por loja

No mínimo, a solução final deve permitir configurar facilmente:

- brandName
- brandLogo
- brandDescription
- primaryColor
- secondaryColor
- accentColor quando necessário
- favicon
- heroBanners
- featuredSections
- contactWhatsAppUrl
- contactInstagramUrl
- storeLinks
- defaultCtaLabel
- supportLinks
- productCatalog

### Requisitos do catálogo

Cada produto deve poder expor, conforme aplicável:

- id
- slug
- title
- shortDescription
- longDescription
- media gallery
- price
- compareAtPrice quando aplicável
- CTA principal
- CTA secundário
- externalLink
- whatsappLink
- instagramLink
- category
- tags
- availability
- badge promocional quando aplicável

### Estratégia recomendada

Prefira uma solução onde:

- a shell é orientada por configuração
- os componentes compartilhados consomem view models claros
- a origem dos dados pode ser mock, JSON local, CMS simples ou API sem alterar a UI base
- o mesmo build suporte múltiplas lojas por configuração, quando fizer sentido para o produto

---

## O que não fazer

Não faça nenhuma das práticas abaixo:

- não trate a migração como mera troca de nomes de recipe para product
- não mantenha copy residual do domínio antigo sem justificativa
- não deixe rotas antigas convivendo com novas de forma inconsistente
- não hardcode marca, logo, textos, CTAs ou assets em componentes compartilhados
- não introduza abstrações vazias ou patterns sem ganho real
- não crie um sistema de configuração tão complexo que ele inviabilize o custo-benefício do produto
- não espalhe comportamento por tenant em ifs pela UI
- não pule a inspeção inicial da base
- não misture ondas demais em uma mesma entrega sem validação intermediária
- não finalize sem testes adequados e sem revisão crítica

---

## Critérios de aceitação

A entrega só será considerada pronta quando:

- a aplicação estiver semanticamente alinhada ao domínio de catálogo comercial
- a navegação estiver coerente com a nova estrutura
- o branding estiver centralizado e configurável
- os componentes compartilhados estiverem neutros e reutilizáveis
- o contrato de produto estiver adequado a vitrine comercial
- home, busca e detalhe refletirem comportamento de catálogo
- o custo de personalização por nova loja estiver baixo e previsível
- a configuração mínima por loja estiver clara e fácil de aplicar
- Storybook estiver atualizado para os componentes compartilhados relevantes
- testes cobrirem as mudanças críticas
- houver pontos de observabilidade coerentes com o funil comercial
- não restarem acoplamentos relevantes ao domínio antigo sem justificativa técnica explícita

---

## Formato obrigatório de saída do agente

Ao final, responda obrigatoriamente nesta estrutura:

1. Entendimento do problema
2. Diagnóstico técnico
3. Arquitetura alvo proposta
4. Plano incremental por ondas
5. Implementação realizada
6. Configuração white label proposta
7. Testes adicionados ou recomendados
8. Impactos de performance e observabilidade
9. Riscos e trade-offs
10. Próximos passos prioritários

Em cada seção, seja objetivo, técnico e crítico.

Nunca finalize sem:

- explicitar o que foi migrado
- explicitar o que ainda é risco residual
- confirmar se a solução final ficou realmente white label
- registrar o que foi verificado de fato no código e o que ainda é proposta futura
