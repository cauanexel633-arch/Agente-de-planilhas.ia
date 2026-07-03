# Agente de Planilhas IA

Projeto completo conforme roteiro do Cauã.

## O que já está pronto
- Login Google via Supabase (pede Sheets + Drive)
- Geração automática de código único (nome sem acento + 6 caracteres)
- Home animada com Sidebar, foto do Google, código e botão sair
- Rotas: /[codigo]/e-res/, /e-resai/, /r/, /res
- Códigos de função #@, 0@, 00@, 1@, 11@ etc implementados no handler
- Lógicas 1#,2#,3#,4# do roteiro

## Passo a passo para finalizar (5 minutos)

1. **Supabase**
   - Acesse https://mbqiwestqcbsheqlzudb.supabase.co
   - SQL Editor > cole o conteúdo de sql/schema.sql > Run
   - Authentication > Providers > Google > ative e cole seu GOOGLE_CLIENT_ID e SECRET

2. **Google Cloud**
   - console.cloud.google.com > Criar projeto
   - APIs > ative Google Sheets API e Drive API
   - Credenciais > OAuth 2.0 > Web Application
   - Authorized redirect: https://mbqiwestqcbsheqlzudb.supabase.co/auth/v1/callback
   - Copie Client ID e Secret

3. **Vercel**
   - Importe este repositório no GitHub
   - Vercel > New Project > selecione repo
   - Environment Variables: cole tudo do .env.example (já com suas chaves Supabase)
   - Deploy

4. **Teste**
   - Acesse https://agente-de-planilhas-ia.vercel.app
   - Faça login, copie o link de teste da home
   - Cole no Meta AI: "você executará esse link de teste, e me retornará o que tiver no site, [link]"

## Estrutura de links
- Teste: /CODIGO/e-res/teste
- Pergunta IA: /CODIGO/e-resai/#@
- Resposta valor: /CODIGO/e-resai/<agua>
- Alterar: /CODIGO/e-resai/11@ depois /CODIGO/e-resai/<F,3>

Pronto para produção.
