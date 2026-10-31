# FLUX Prompt Studio – PWA pro iPhone

## Důležité upozornění k této verzi

Toto je instalovatelná PWA (webová aplikace přidatelná na plochu iPhonu). Její rozhraní, historie, kopírování a základní generování fungují offline po prvním načtení a uložení do cache.

**Tato první PWA verze neobsahuje plnohodnotný jazykový model.** Používá malý vestavěný slovníček a šablonu, takže neumí spolehlivě překládat libovolnou češtinu ani chápat složité zadání. Nechci ji vydávat za skutečnou lokální AI. Pro skutečné generování na iPhonu je potřeba doplnit a otestovat model v prohlížeči (např. WebGPU/WebAssembly); podpora a paměťové limity závisí na konkrétní verzi iOS a zařízení.

## Jak ji dostat na iPhone bez Macu a bez placení

PWA musí být hostovaná přes HTTPS. Nejjednodušší bezplatné možnosti jsou GitHub Pages nebo Cloudflare Pages. Pro publikování projektu je potřeba účet u zvoleného hostingu.

### Varianta A: GitHub Pages
1. Vytvoř bezplatný účet na GitHubu.
2. Vytvoř nový veřejný repository, například `flux-prompt-studio`.
3. Nahraj obsah této složky do kořenové složky repository.
4. V repository otevři Settings → Pages.
5. V části Build and deployment vyber Deploy from a branch, větev `main`, složku `/ (root)` a ulož.
6. Počkej na zveřejnění adresy ve tvaru `https://TVUJ-UCET.github.io/flux-prompt-studio/`.

### Instalace na iPhone
1. Otevři zveřejněnou HTTPS adresu v Safari (ne v prohlížeči uvnitř jiné aplikace).
2. Klepni na tlačítko Sdílet.
3. Vyber „Přidat na plochu“.
4. Potvrď „Přidat“.
5. Spouštěj FLUX Prompt Studio novou ikonou na ploše.

### Offline
Při prvním otevření nech stránku plně načíst, ideálně na Wi‑Fi. Service worker uloží soubory aplikace do cache. Potom lze otevřít aplikaci z plochy bez připojení; samotná základní šablonová logika a historie zůstávají v zařízení.

## Obsah
- `index.html` – struktura aplikace
- `style.css` – vzhled optimalizovaný pro mobil
- `app.js` – vstup, základní šablonový převod, historie, kopírování
- `manifest.webmanifest` – metadata instalovatelné PWA
- `sw.js` – offline cache
- `assets/` – ikony

## Poznámka k pravidlům promptu
Šablona se snaží sestavit 40–80 slov a dodržet pořadí motiv, akce, prostředí, světlo, kamera a styl. Kvůli absenci LLM však nedokáže zaručit přesný význam, překlad ani pravidlo pro úpravy fotografií u libovolného vstupu.
