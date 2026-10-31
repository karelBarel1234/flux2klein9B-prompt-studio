const $ = (id) => document.getElementById(id);
const idea = $("idea"), output = $("output"), outputPanel = $("outputPanel");
const HISTORY_KEY = "flux-prompt-studio-history-v1";

idea.addEventListener("input", () => $("charCount").textContent = `${idea.value.length} znaků`);
$("generate").addEventListener("click", generate);
$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    $("copy").textContent = "✓ Zkopírováno";
    setTimeout(() => $("copy").textContent = "▢  Copy prompt", 1500);
  } catch { output.select(); document.execCommand("copy"); }
});
$("clearHistory").addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY); renderHistory();
});

const dictionary = [
  [/mladá žena/gi,"young woman"],[/žena/gi,"woman"],[/muž/gi,"man"],[/dívka/gi,"girl"],[/chlapec/gi,"boy"],
  [/pes/gi,"dog"],[/kočka/gi,"cat"],[/kůň/gi,"horse"],[/pták/gi,"bird"],[/auto/gi,"car"],
  [/červeném kabátě/gi,"red coat"],[/červený kabát/gi,"red coat"],[/modré šaty/gi,"blue dress"],
  [/stojí/gi,"stands"],[/sedí/gi,"sits"],[/běží/gi,"runs"],[/kráčí/gi,"walks"],[/drží/gi,"holds"],
  [/na ulici/gi,"on a street"],[/v ulici/gi,"on a street"],[/v lese/gi,"in a forest"],[/na pláži/gi,"on a beach"],
  [/u okna/gi,"by a window"],[/v dešti/gi,"in the rain"],[/deštivé/gi,"rainy"],[/noční/gi,"nighttime"],
  [/slunečné/gi,"sunlit"],[/mlhavé/gi,"foggy"],[/staré/gi,"old"],[/moderní/gi,"modern"],
  [/tokia/gi,"Tokyo"],[/prahy/gi,"Prague"],[/paříže/gi,"Paris"],[/město/gi,"city"],[/ulici/gi,"street"],
  [/světlo/gi,"light"],[/zlaté hodiny/gi,"golden-hour"],[/detailní/gi,"detailed"],[/fotografie/gi,"photograph"]
];

function translateBasic(text) {
  let result = text.trim();
  for (const [pattern, replacement] of dictionary) result = result.replace(pattern, replacement);
  return result;
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function wordCount(s) { return s.trim().split(/\s+/).filter(Boolean).length; }
function fitWords(text, min=40, max=80) {
  let words = text.trim().split(/\s+/);
  if (words.length > max) words = words.slice(0,max);
  // Keep additions generic and grounded in visual composition, not new scene objects.
  const additions = [
    "The composition keeps the subject clearly readable within the frame.",
    "Natural textures and carefully controlled tonal contrast give the image a coherent visual presence.",
    "The overall treatment feels like a carefully composed contemporary editorial photograph."
  ];
  let i=0;
  while(words.length < min && i<additions.length) {
    words.push(...additions[i++].split(/\s+/));
  }
  return words.slice(0,max).join(" ");
}
function createPrompt(raw) {
  const source = raw.trim();
  const edit = /replace|change|replace|nahraď|vyměň|změň|uprav fotku|uprav fotografii/i.test(source);
  let translated = translateBasic(source).replace(/\s+/g," ").replace(/[.!?]+$/,"");
  if (edit) {
    const english = translated.replace(/^(please\s*)?/i,"");
    return fitWords(`Replace the specified element with the requested alternative, keep everything else unchanged. ${cap(english)}. Preserve the original framing, perspective, lighting and photographic details so the edit blends naturally into the existing image.`,40,80);
  }
  let scene = cap(translated);
  return fitWords(`${scene}. The subject is clearly defined within the composition, with a natural and believable pose and carefully observed details. The surrounding environment supports the main scene without distracting from it. Soft, directional cinematic lighting creates depth and realistic tonal transitions. Shot at eye level with a balanced medium-wide camera composition, using a refined photorealistic editorial photography style.`,40,80);
}
function generate() {
  const value = idea.value.trim();
  if (!value) { $("statusText").textContent = "Nejdřív napiš stručné zadání."; return; }
  $("generate").disabled = true;
  $("generate").querySelector("span").textContent = "Připravuji prompt…";
  setTimeout(() => {
    const prompt = createPrompt(value);
    output.value = prompt;
    outputPanel.classList.remove("hidden");
    $("wordCount").textContent = `${wordCount(prompt)} slov`;
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    history.unshift(prompt);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0,30)));
    $("statusText").textContent = "Prompt vytvořen – základní offline režim";
    renderHistory();
    $("generate").disabled = false;
    $("generate").querySelector("span").textContent = "Generate Prompt";
  }, 120);
}
function renderHistory() {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  const list = $("historyList"); list.innerHTML = "";
  if (!history.length) { list.innerHTML = '<p class="empty">Zatím žádné prompty.</p>'; return; }
  history.forEach(item => {
    const button = document.createElement("button");
    button.className = "historyItem"; button.textContent = item;
    button.addEventListener("click", () => {
      output.value = item; outputPanel.classList.remove("hidden");
      $("wordCount").textContent = `${wordCount(item)} slov`;
      window.scrollTo({top: outputPanel.offsetTop - 20, behavior:"smooth"});
    });
    list.appendChild(button);
  });
}
renderHistory();
