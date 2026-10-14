# Política de Segurança

## Versões suportadas

Correções de segurança são publicadas para a versão minor mais recente.

## Como reportar uma vulnerabilidade

**Não abra uma issue pública.** Use o reporte privado do GitHub: aba **Security** deste repositório → **Report a vulnerability**.

Inclua, se possível, a descrição do problema e do impacto, passos para reproduzir e as versões afetadas. Confirmamos o recebimento em até 3 dias úteis e mantemos você informado até a correção. Pedimos que a divulgação pública aguarde a publicação da versão corrigida.

## Boas práticas para quem usa o SDK

- Nunca versione chaves de API; prefira a variável de ambiente `COFFEEMAIL_API_KEY`.
- Valide toda entrega de webhook usando o corpo bruto da requisição.
- Use chaves com o menor escopo necessário.
