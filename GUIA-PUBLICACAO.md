# Guia: publicar o site e mantê-lo sem depender de ninguém

Este guia tem duas partes: **(A) colocar no ar**, que se faz uma vez (cerca de 40 minutos), e
**(B) editar no dia a dia**, que qualquer pessoa da equipe faz pelo navegador, em `seu-site/admin`,
sem instalar nada e sem o computador de ninguém ligado.

## Como funciona (em 30 segundos)

```
 Equipe edita em  /admin  ──►  GitHub (guarda o site e todo o histórico)  ──►  Netlify (gera e hospeda)  ──►  site no ar
```

- **GitHub** guarda os arquivos do site. É a "cópia mestra": se um computador for perdido, nada se perde.
- **Netlify** hospeda e publica o site de novo sozinha, ~1 minuto depois de cada alteração. Plano gratuito basta.
- **Painel `/admin`** é um formulário (em português) para editar textos, membros, notícias, agenda, edições da
  revista e fotos. Cada "Publicar" vira uma alteração registrada no GitHub, com autor e data, e pode ser desfeita.

> **Importante:** crie todas as contas (GitHub, Netlify, domínio) com um **e-mail do Instituto**, não com e-mail pessoal.
> Assim o acesso não depende de uma pessoa específica. Convide pelo menos duas pessoas como administradoras.

---

## A. Colocar no ar (uma vez)

### A1. GitHub: guardar o site

1. Crie uma conta em <https://github.com> com o e-mail do Instituto.
2. Instale o **GitHub Desktop** (<https://desktop.github.com>) e entre com essa conta.
3. No GitHub Desktop: **File → Add local repository…** e escolha a pasta do site (`Site QUOTAPARTE`).
   - Se pedir para "criar um repositório", aceite. Os arquivos grandes e desnecessários já estão excluídos (`.gitignore`).
4. Escreva "Site inicial" na caixa de resumo e clique em **Commit to main**.
5. Clique em **Publish repository**. Dê um nome (por exemplo `site-instituto`) e **marque "Keep this code private"**.
   Anote o nome completo, no formato `dono/repositorio`.

### A2. Netlify: hospedar

1. Crie uma conta em <https://app.netlify.com> escolhendo **entrar com GitHub**.
2. **Add new site → Import an existing project → GitHub** e escolha o repositório. A Netlify já lê o `netlify.toml`;
   não mude nada e clique em **Deploy**. Em 2–3 minutos o site abre num endereço do tipo `nome-aleatorio.netlify.app`.
3. Em **Site configuration → General → Change site name**, escolha um nome (por exemplo `institutosocieta`).
4. Em **Site configuration → Environment variables → Add a variable**: `VITE_SITE_URL` = o endereço final do site,
   sem barra no fim (por exemplo `https://institutosocieta.com.br`). Depois, **Deploys → Trigger deploy**.
   (Serve para o mapa do site para o Google e para a pré-visualização em redes sociais.)

### A3. Domínio próprio

1. Registre o domínio em <https://registro.br> (um `.com.br` custa cerca de R$ 40 por ano). O Registro.br pede CPF ou CNPJ:
   prefira o CNPJ do Instituto, se houver; do contrário, o de um diretor (dá para transferir depois).
2. Na Netlify: **Domain management → Add a domain** e digite o domínio. Ela mostra dois jeitos de ligar; o mais simples é
   **usar a Netlify DNS**: ela fornece 4 endereços de servidor (`dns1.p0x.nsone.net` etc.). No Registro.br, em
   **DNS → Alterar servidores DNS**, cole esses 4 endereços.
3. Espere de alguns minutos a algumas horas. O certificado HTTPS (cadeado) é emitido automaticamente.

### A4. Ligar o painel de edição (`/admin`)

O painel precisa de duas coisas: dizer onde está o repositório e autorizar o login pelo GitHub.

1. **Autorização do login** (uma vez):
   - No GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
     - Application name: `Painel Instituto Società`
     - Homepage URL: o endereço do site (por exemplo `https://institutosocieta.netlify.app`)
     - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Clique em **Register application**, depois em **Generate a new client secret**. Guarde o *Client ID* e o *Client secret*.
   - Na Netlify: **Site configuration → Access & security → OAuth → Install provider → GitHub**, e cole o Client ID e o Client secret.
2. **Dizer onde está o repositório:** abra o arquivo `public/admin/config.yml` e troque:
   - `repo: SEU-USUARIO/SEU-REPOSITORIO` pelo `dono/repositorio` anotado no passo A1;
   - descomente e preencha `site_domain:` com o endereço Netlify (por exemplo `institutosocieta.netlify.app`);
   - `site_url: https://SEU-DOMINIO` pelo endereço final do site.

   Faça isso editando o arquivo direto no site do GitHub (ícone de lápis → **Commit changes**). Em ~1 minuto o site republica.
3. **Dar acesso a quem vai editar:** no GitHub, no repositório: **Settings → Collaborators → Add people**, com a conta de cada pessoa
   (cada uma precisa de uma conta gratuita no GitHub). Permissão **Write**.
4. Teste: abra `https://seu-site/admin/`, clique em **Login with GitHub**, autorize, e o painel abre.

---

## B. Editar no dia a dia

Acesse `https://seu-site/admin/` e entre com o GitHub. O menu à esquerda tem quatro grupos:

| Grupo | O que edita |
|---|---|
| **Atividades** | Notícias e agenda · Encontros Horizontais e séries do YouTube · Células regionais · Linha do tempo |
| **Pessoas** | Quadro de membros · Diretoria e cards de trajetória · Distinções |
| **Revista QuotaParte** | Edições e trabalhos · Núcleos em produção · Núcleos do ciclo concluído · Diário · Avisos |
| **Páginas e contato** | Contato e redes · Seja Membro (edital, formulário, perguntas) · Depoimentos · Avisos da Home · Parceiros |

**Para alterar algo:** abra o item pelo menu (não pela barra de endereço), clique na entrada, edite, e clique em
**Publicar → Publicar agora**. Em 1–2 minutos a alteração está no site.

**Para adicionar** (uma notícia, um membro, uma edição): use o botão **Adicionar …** no alto da lista.

**Para fotos:** no campo de imagem, clique em **Escolher imagem → Enviar** e selecione o arquivo.
- Use nomes **sem espaço e sem acento** (por exemplo `maria-silva.png`).
- Retratos de pessoas: formato 4:5 (retrato). Notícias: de preferência até 2 MB.
- O site cria sozinho as versões leves (WebP); não é preciso converter.

### Rotina mensal
- Na agenda, retire as notícias com mais de 30 dias (os Encontros Horizontais continuam em "Encontros Horizontais e YouTube").
- Em "Quadro de membros", passe de transitório a efetivo quem for promovido.

### Dicas importantes
- **Prêmio Unità:** no card da pessoa (Pessoas → Diretoria e cards), escreva o item de distinção começando por
  "Prêmio Unità": ele aparece em destaque no card.
- **Endereço (slug)** de notícias e trabalhos: minúsculas, sem acento, com hífens, e nunca repetido.
- **Campos em branco** somem do site (por exemplo, um link em branco oculta o botão).
- **Desfazer:** cada "Publicar" é um registro no GitHub (aba *Commits*). Dá para voltar a qualquer versão anterior.
- **Dois editores ao mesmo tempo no mesmo item:** quem publicar por último vence; combine entre si.

---

## C. O que o painel não faz

O painel cobre **conteúdo**. Mudanças de **layout, design ou funcionalidade** (novas seções, novas páginas) exigem editar o
código. O código está no GitHub e usa tecnologias comuns (Vue 3 + Vite); qualquer desenvolvedor front-end consegue
manter. Para rodar em um computador:

```bash
npm install          # uma vez
npm run dev          # abre o site em http://localhost:5173
npm run cms          # (outro terminal) permite editar pelo painel local em /admin/index.html sem login
npm run validar-painel   # confere se o painel cobre todos os campos do conteúdo
```

Onde está cada coisa:
- `src/content/*.json`: todo o conteúdo editável (é o que o painel grava).
- `src/data/*.js`: leem o conteúdo e entregam às páginas (normalmente não precisam de edição).
- `public/admin/config.yml`: define o formulário do painel (campos, rótulos, pastas de imagem).
- `netlify.toml`: instruções de publicação.

## D. Pendências conhecidas (do conteúdo)

- **Newsletter:** o campo "Formulário da newsletter" (Páginas e contato → Contato) está vazio; enquanto isso o botão não envia o e-mail a lugar nenhum.
  Basta criar um formulário (Google Forms, por exemplo) e colar o link ali.
- **Política de Privacidade:** o texto é um rascunho e precisa de revisão jurídica antes de valer.
- **Membros sem núcleo, sem LinkedIn ou sem foto:** preencha em Pessoas → Quadro de membros.
