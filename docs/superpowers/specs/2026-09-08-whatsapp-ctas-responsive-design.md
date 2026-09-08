# Ajustes dos CTAs de WhatsApp

## Objetivo

Refinar a hierarquia dos CTAs e disponibilizar uma ação flutuante no desktop sem alterar o comportamento mobile existente.

## Design aprovado

- O CTA do cabeçalho passa de `Conversar` para `AGENDAR`.
- O CTA da aula em dupla deixa de usar o efeito luminoso; o CTA individual mantém o efeito.
- O componente fixo existente continua aparecendo apenas depois que o CTA principal do hero sai da viewport e desaparece quando o CTA final entra na viewport.
- No mobile, o componente mantém texto de apoio e o rótulo atual.
- A partir de 768 px, o componente aparece como um botão isolado no canto inferior direito com o rótulo `AGENDAR AULA`.
- O link desktop reutiliza telefone, mensagem, rastreamento, foco e lógica de visibilidade do CTA mobile.

## Validação

- Testes de componente verificam os rótulos, a ausência de brilho no formato em dupla e a variante textual responsiva do CTA fixo.
- A suíte completa, tipagem, lint e build devem passar.
- A página deve ser conferida em viewport desktop e mobile sem sobreposição indevida.
