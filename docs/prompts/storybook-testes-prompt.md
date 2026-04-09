Para cada componente compartilhado criado ou alterado, gere os artefatos de qualidade obrigatórios.

Entregue:
- story principal
- stories de variantes
- state stories: default, loading, empty, disabled, error
- variações white label quando aplicável
- interaction tests no Storybook quando fizer sentido
- testes unitários
- testes de integração/componente
- documentação mínima de inputs, outputs, estados e comportamento

Regras:
- Storybook deve funcionar como contrato visual.
- Não criar story apenas ilustrativa; deve representar cenários reais.
- Testes devem validar comportamento observável.
- Se o componente usar Angular Material, usar Harnesses quando isso tornar o teste mais robusto.
- Se o componente for themable, validar tokens/temas.
- Se o componente tiver acessibilidade relevante, validar foco, label, estado disabled e navegação por teclado.

Formato da resposta:
1. stories criadas
2. testes criados
3. cenários cobertos
4. gaps remanescentes
