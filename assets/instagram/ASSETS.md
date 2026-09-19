# Manifesto dos ativos do Instagram

Data da coleta: 6 de setembro de 2026.

## Publicação `DW1kXWEkYEa`

Fonte: <https://www.instagram.com/p/DW1kXWEkYEa/>

| Uso sugerido | Original | Dimensões | WebP aprovado | Original | WebP | Redução |
|---|---|---:|---|---:|---:|---:|
| Hero desktop / abertura | `originais/DW1kXWEkYEa_2026-04-07_16-22-52_UTC_1.jpg` | 1170 × 1560 | `webp/priscilla-castao-ensaio-01.webp` | 143.302 B | 78.174 B | 45,4% |
| Hero mobile / transição | `originais/DW1kXWEkYEa_2026-04-07_16-22-52_UTC_2.jpg` | 1170 × 1560 | `webp/priscilla-castao-ensaio-02.webp` | 161.140 B | 95.286 B | 40,9% |
| Sobre / autoridade humana | `originais/DW1kXWEkYEa_2026-04-07_16-22-52_UTC_3.jpg` | 1170 × 1560 | `webp/priscilla-castao-ensaio-03.webp` | 151.658 B | 84.416 B | 44,3% |

Os arquivos `.txt` e `.json.xz` ao lado dos originais preservam legenda e metadados fornecidos pelo Instaloader.

## Publicação `DJxh-HRu21yEMWmeg31HRckKDKDxPU8-dQ7Tk40`

Fonte: <https://www.instagram.com/p/DJxh-HRu21yEMWmeg31HRckKDKDxPU8-dQ7Tk40/>

| Uso sugerido | Original | Dimensões | WebP aprovado | Original | WebP | Redução |
|---|---|---:|---|---:|---:|---:|
| Capa para prova em movimento | `originais/DJxh-HRu21yEMWmeg31HRckKDKDxPU8-dQ7Tk40_2025-05-17_23-58-02_UTC.jpg` | 720 × 1280 | `webp/priscilla-castao-forro-roots-capa.webp` | 95.287 B | 43.424 B | 54,4% |

A publicação pertence ao perfil `fernando_n_o`, e não ao perfil da Priscilla. Antes de usar o vídeo completo, é necessário confirmar autorização e a forma de crédito. A capa solicitada está preservada para composição e prototipação.

## Decisão de compressão

Os JPEGs do Instagram já chegam bastante comprimidos. A otimização automática do Squoosh guiada por Butteraugli gerou WebPs maiores que os originais nesses arquivos. Por isso, foram comparadas saídas WebP com qualidade 78, 82 e 86, além dos alvos automáticos.

A configuração aprovada foi WebP `quality: 82`, `method: 6`, `pass: 10`, `autofilter: 1` e conversão YUV nítida, sem redimensionamento. A inspeção visual foi feita em todas as quatro imagens finais. Ela preservou pele, tecido e contornos, com redução de 40,9% a 54,4%.

Arquivos de comparação foram mantidos em `DW1kXWEkYEa/webp/_diagnosticos/`. Eles não devem entrar no bundle de produção.

## Ferramentas

- Instaloader 4.15.3, instalado de forma editável em `.venv` a partir de `tools/instaloader`.
- Squoosh CLI 0.7.3 em `tools/squoosh-cli`, executado com Node 16 isolado. A CLI legada não funciona corretamente com o Node 24 presente no sistema.

Novos ativos devem seguir a mesma convenção: uma pasta por shortcode, `originais/` imutável, `webp/` para arquivos de entrega e nomes sem dependência da data do Instagram.
