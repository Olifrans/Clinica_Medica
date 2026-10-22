# 🏥 Clínica MedMais - Site Profissional (Versão Elite 2.0)

Site estático de alta performance, otimizado para conversão (CRO), acessibilidade (a11y) e em estrita conformidade com a LGPD e Google Consent Mode v2.

## 🚀 Melhorias Implementadas nesta Versão
1. **Google Consent Mode v2:** Implementação nativa de `denied` padrão, atualizado para `granted` apenas após interação do usuário (obrigatório para Ads em 2024+).
2. **Prevenção Total de CLS:** Todas as imagens possuem `width`, `height` e `aspect-ratio`. Fontes e Hero Image usam `preload`.
3. **Acessibilidade (a11y):** Navegação por teclado (`:focus-visible`), atributos ARIA dinâmicos no FAQ e Menu, e contraste de cores validado.
4. **Anti-Spam Inteligente:** Campo "Honeypot" invisível no formulário que bloqueia bots sem incomodar usuários com CAPTCHA.
5. **Animações CSS Modernas:** FAQ com transição suave de `grid-template-rows` (sem cortes de texto) e tipografia fluida com `clamp()`.

## ⚙️ Configuração de Marketing (OBRIGATÓRIO)

Antes de publicar, abra o `index.html` e substitua os placeholders:

1. **Domínio:** Substitua `https://www.clinicamedmais.com.br` nas tags `<link rel="canonical">` e Open Graph.
2. **GTM:** Substitua `GTM-XXXXXXX` pelo seu ID do Gerenciador de Tags (aparece no `<head>` e `<body>`).
3. **GA4 e Ads:** Se usar GTM, remova os scripts diretos de GA4/Ads do `<head>` e gerencie-os pelo GTM para respeitar o Consent Mode. Se usar direto, substitua `G-XXXXXXXXXX` e `AW-XXXXXXXXX`.

## ✅ Checklist de Pré-Lançamento (Lighthouse 95+)

- [ ] Substituir todos os IDs de marketing.
- [ ] Testar o formulário: Preencha o campo oculto "website_url" via DevTools. O envio deve ser bloqueado (proteção honeypot funcionando).
- [ ] Testar UTM: Acesse `index.html?utm_source=teste&utm_campaign=instagram`. Clique no WhatsApp. A mensagem deve conter a origem.
- [ ] Validar Schema.org no [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Verificar se o banner de cookies atualiza o `dataLayer` do Consent Mode ao ser aceito/rejeitado.

## 📈 Plano de Ação de Marketing Local (8 Semanas)

- **Semana 1-2:** Otimizar **Google Meu Negócio** com fotos reais da clínica no endereço R. Domingos de Morais, 230. Solicitar avaliações a pacientes fiéis.
- **Semana 3-4:** Campanha **Google Ads (Rede de Pesquisa)** com palavras-chave de intenção alta ("clínica médica vila mariana", "check-up particular sp"). Usar UTMs para rastrear conversões no site.
- **Semana 5-6:** **Meta Ads (Instagram)** com criativos de vídeo curto (Reels) mostrando a estrutura e um depoimento. Direcionar tráfego para o WhatsApp com UTM `?utm_source=instagram&utm_campaign=reels_vm`.
- **Semana 7-8:** **E-mail Marketing** para base de pacientes antigos oferecendo "Check-up Preventivo", com link rastreado para medir ROI.

## 🧪 Testes Técnicos Rápidos

1. **Simulação de UTM:** Adicione `?utm_source=google&utm_campaign=ads` à URL. Clique em qualquer botão de WhatsApp. O texto deve incluir automaticamente: `*(Origem: google / ads)*`.
2. **Persistência de Tema:** Ative o Dark Mode, feche a aba e reabra. O tema deve permanecer escuro (verifique `localStorage`).
3. **Honeypot:** No DevTools, remova a classe `honeypot` do input oculto, digite algo nele e tente enviar o formulário. O envio deve falhar silenciosamente.