# Intel — Sustainability Through the Ages (Localized)

Coursework build, Web Development Project 3. A responsive, interactive timeline
of Intel's sustainability milestones, **localized into four languages** — English,
Spanish, Japanese and Arabic — including full right-to-left support.

The timeline itself is Project 2. This repo adds the localization layer on top of
it, plus a Bootstrap three-column commitments section, modals, and an accessible
newsletter form. The interesting work is not the translation; it is everything the translation
breaks.

---

## Localization

### The four languages, and why these four

Each one was chosen to break something different. Four languages that all read
left-to-right in Latin script would have been four copies of the same problem.

| | Why it's here |
|---|---|
| **English** `en` | The source. Every key is written here first. |
| **Spanish** `es` | Runs roughly **20% longer** than English. Tests whether the layout survives text expansion — buttons, card titles, the nav. |
| **Japanese** `ja` | **No spaces between words.** Needs its own font stack and its own line-breaking rules, or it wraps in the wrong places. |
| **Arabic** `ar` | **Right-to-left.** The only one that required changing code rather than adding strings. |

⚠️ The translations are machine-assisted and have **not** been reviewed by a
native speaker. In production that review is not optional — it is the difference
between a localized product and a product that looks localized. Calling that out
is more honest than pretending otherwise.

### How it's wired

Three files, and the split matters:

| File | Job |
|---|---|
| `i18n.js` | **Data only.** Four dictionaries, ~35 keys each. No logic. |
| `localize.js` | **The engine.** Applies keys, swaps `lang`/`dir`, formats numbers, persists the choice. |
| `index.html` | **Marked up, not duplicated.** 24 `data-i18n`, 8 `data-i18n-alt`, 1 `data-i18n-aria-label`, 10 `data-year`. |

There is **one** HTML file, not four. Every string is an attribute pointing at a
key, so adding a fifth language means adding a dictionary and nothing else.

Keys were verified rather than trusted: **33 used in HTML, 35 defined, 0 missing**
across all four dictionaries.

### `lang` and `dir` are two different things

Both go on `<html>`, and they do unrelated jobs:

- **`lang`** tells a screen reader which voice to use, and the browser which
  hyphenation and line-breaking rules apply. Get it wrong and Arabic gets read
  aloud in an English voice.
- **`dir`** flips the layout. It is set from a small list — `ar`, `he`, `fa`, `ur`
  — not inferred from the language tag.

The `<select>` also sets `option.lang` per option, and every language is written
**in its own name** — 日本語, not "Japanese". Someone who cannot read the current
language still has to be able to find theirs.

### Detecting the language

```js
saved language  →  navigator.languages  →  English
```

The middle step matches on the **base tag**, so `es-MX`, `es-419` and `es-ES` all
resolve to `es`. Matching on the full tag would leave most Spanish speakers on the
English page. The choice is then stored in `localStorage`, wrapped in `try/catch`
because private browsing throws on write.

### Numbers are not universal

Years run through `Intl.NumberFormat(lang, { useGrouping: false })`, so 1968
renders as **١٩٦٨** in Arabic. `useGrouping: false` matters — without it a
four-digit year picks up a thousands separator and 1968 becomes "1,968".

---

## The real work: RTL broke the progress rail

`script.js` contains **zero user-facing strings**. It still needed eight patches,
because it was built entirely on *physical* direction — `scrollLeft`,
`dot.style.left`, `fade-left`, `fade-right`, `linear-gradient(to right)`,
`scroll-padding-left`.

An RTL language does not just need translated text. It needs the interaction
rebuilt.

### ⚠️ `scrollLeft` goes negative

This is the one that breaks everything downstream. In an RTL container, scroll
position starts at **0 at the right edge** and goes **negative** as you move
through the content.

```js
// before — returns 0 to -1 in RTL. Dot pins at 0%, both edge fades die.
return track.scrollLeft / scrollable;

// after
return Math.abs(track.scrollLeft) / scrollable;
```

That single sign error killed the dot, the fill, and both fades simultaneously —
and none of it was visible in English.

### The other seven

| What | Fix |
|---|---|
| `dot.style.left` | → `dot.style.insetInlineStart` |
| Card-position ratio | Measured from `railBox.right` in RTL, `railBox.left` in LTR |
| Edge fades | `Math.abs()` on scroll position before comparing |
| Click-to-jump | Distance measured from the right edge; target negated |
| Arrow keys | **Follow the script, not the keycap.** Right arrow moves *forward*, which is leftward in Arabic. `Home`/`End` flip too. |
| Direction check | `document.documentElement.dir` read **live**, never cached — the user can switch mid-session |
| Language change | `document.addEventListener('languagechange', schedule)` re-measures on the next frame |

### CSS: logical properties, and the two places they don't help

Most of it was mechanical — `left` → `inset-inline-start`,
`scroll-padding-left` → `scroll-padding-inline-start`, `margin-left` →
`margin-inline-start`. The browser handles the flip.

**Two things have no writing direction and needed explicit `[dir="rtl"]` overrides:**

```css
/* gradient angles are geometric, not logical */
[dir="rtl"] .track { mask-image: linear-gradient(to left, ...); }
[dir="rtl"] .progress__fill { background: linear-gradient(270deg, ...); }
```

`linear-gradient(90deg, ...)` means "left to right" in every language. There is no
logical equivalent, so the override is the answer.

### Typography per language

```css
:root[lang="ja"] { --font: "Intel Clear","Hiragino Sans","Yu Gothic","Noto Sans JP",...; }
:root[lang="ar"] { --font: "Intel Clear","Geeza Pro","Noto Sans Arabic","Segoe UI",...; }
:root[lang="ar"] .hero__title    { line-height: 1.25; }
:root[lang="ar"] .card__reveal p { line-height: 1.8; }
:root[lang="ja"] { line-break: strict; word-break: normal; }
```

Arabic needs **more** line-height in body text because the script has tall
ascenders and deep descenders, and **less** on the display headline because at
4rem the default leading opens a visible gap. Japanese needs `line-break: strict`
so it doesn't break before a small kana or a closing bracket.

### The switcher

A `<select>`, not a custom dropdown. It is keyboard-accessible, screen-reader
announced, and on mobile it opens the native picker — all for free. Its `<label>`
is visually hidden with `clip-path: inset(50%)` rather than `display: none`,
because `display: none` removes it from the accessibility tree and the control
loses its name.

---

## Project 3 rubric — where each point is earned

| Criterion | Pts | Where |
|---|---|---|
| **RTL adaptation** | 15 | `dir="rtl"` + Bootstrap's **RTL build swapped in** (`localize.js → applyDirection`) + logical CSS properties + 8 RTL fixes in `script.js`. Try `?lang=ar` |
| **Responsive three-column section** | 10 | `.pillars` — Bootstrap `row g-4` / `col-12 col-md-4`, Bootstrap Icons in every `<h3>`, one `.btn-intel` "Learn more" style on all three |
| **Subscription form + footer** | 10 | `.subscribe` — styled Bootstrap form, validated by `subscribe.js`; footer below it |
| **Accessibility (Lighthouse ≥ 90)** | 15 | **100** in English, **100** in Arabic, **100** on mobile (Lighthouse 12). Labels, `aria-invalid`, errors tied with `aria-describedby`, live-region confirmation, contrast fixed |
| **LevelUp — auto-detect language** | +10 | Opens in the browser's language (`navigator.languages`), and a `MutationObserver` on `<html lang>` re-applies RTL whenever the language changes by any route |
| **LevelUp — Bootstrap component** | +10 | Three **modals** behind the "Learn more" buttons — focus moves in, Esc closes, focus returns |
| Reflections (×3) | 30 | In the submission document, not the repo |

### Project 3 decisions worth explaining

**Two classes were renamed to survive Bootstrap.** The timeline used `.card` and
`.progress`, which are both Bootstrap components. Loading Bootstrap gave every
milestone a border and turned the scroll rail into a 16px grey bar. They are now
`.tl-card` and `.tl-progress`. A name collision is the most common way adding a
framework to an existing site breaks it.

**Bootstrap has two stylesheets, and the page swaps between them.** `dir="rtl"`
flips flexbox for free, but Bootstrap is full of physical `left`/`right` values —
checkbox padding, the modal close button, the validation icons. The RTL build is
the mirror image. `integrity` is set *before* `href`, or the browser checks the RTL
file against the LTR hash and refuses it.

**The language bar failed contrast before any of this started.** White text on
the light grey page, roughly 1.1:1. Lighthouse would have flagged it; it is fixed.

**Three identical "Learn more" buttons are told apart by `aria-describedby`.** Each
points at its card's heading, so a screen reader hears "Learn more, Net positive
water" instead of the same two words three times.

**The form is honest.** There is no backend, so the confirmation says the page is
a demo and nothing was sent. Email fields stay left-to-right even in Arabic,
because an address is not Arabic text.

**`?lang=ar` in the URL** opens a specific language — the only way to *share* the
Arabic version with a global team is a link.

---

## How it meets the brief (Project 2)

| Requirement | Where |
|---|---|
| Horizontal on large screens | `.track` is `display:flex; flex-wrap:nowrap; overflow-x:auto` |
| Stacks vertically on small screens | `@media (max-width: 768px)` flips it to `flex-direction: column` |
| Two breakpoints, not one | The hero stacks at **1024px**, the timeline at **768px** — they fail at different widths |
| Hover reveals detail | `.tl-card__reveal` is `opacity:0` → `1` on `:hover` **and `:focus-within`** |
| Intel-branded styling | Tokens at the top of `styles.css` — `#0068B5`, `#00285A`, `#00C7FD` |
| Image on every card | 8 cards, 8 images, all with real `alt` text |
| **LevelUp — scroll snap** | `scroll-snap-type: x mandatory` + `scroll-snap-align: start` |
| **LevelUp — transforms** | `translateY(-8px) scale(1.02)` + shadow lift, transitioned |
| **LevelUp — custom images** | 8 sourced photos, one per milestone |

## Two decisions worth explaining

**The reveal is not hover-only.** `:focus-within` is included, so tabbing to a
card shows the same detail a mouse gets. And on screens below 768px the detail
is shown inline instead — a touch screen has no hover, so a hover-only reveal
would hide that content permanently rather than making it interactive.

**Type scales with `clamp()` rather than a media query.** The headline is
`clamp(2rem, 6vw, 4rem)`: never smaller than 2rem, never larger than 4rem, fluid
between. One line replaces three breakpoints.

## Milestone sourcing

Every date is checked against Intel's own material, not written from memory:

| Milestone | Source |
|---|---|
| 2007 lead-free 45nm | Intel press release, 22 May 2007 |
| 2008 largest US green power purchaser | Intel press release, 28 Jan 2008 |
| 2020 RISE, 2030 goals | Intel 2030 goals announcement |
| 2040 net-zero Scope 1 & 2 | Intel press release, 2022 |
| 2050 net-zero upstream Scope 3 | Intel Climate Transition Action Plan |

⚠️ Two dates were wrong in the first version and both were found by checking
rather than by reading it back. Lead-free was dated 2008 (it was announced in
2007), and the green power milestone was dated 2012 (Intel took the top spot in
2008). The second error also put two milestones in the same year, which the
timeline had no way to show.

## Images

Three licences, and the footer names all three:

| Count | Licence | What |
|---|---|---|
| 5 | **CC0** | the sustainability photographs |
| 4 | **Unsplash License** | the hero, and the three Intel hardware shots |
| 1 | **Public domain** | the Intel wordmark, via Wikimedia Commons |

⚠️ The Intel wordmark is public domain because it sits below the threshold of
originality for copyright. **The trademark is still Intel's** — it is used here
nominatively, to refer to the company the page is about, which is why the footer
says so explicitly.

Per-image credits with photographer and source URL are in `assets/CREDITS.json`.

## The timeline itself (Project 2)

### The progress rail

`script.js` drives the scroll-progress rail under the timeline: a dot that
travels as you scroll, a fill behind it, click-to-jump, and arrow-key support.
It **replaces** the native scrollbar rather than sitting beside it.

⚠️ The scrollbar is hidden by a `.has-rail` class the script adds, not by CSS
alone. Hiding it unconditionally would mean a blocked or failed script left
scrollable content with no scrollbar *and* no rail — nothing on screen saying
it scrolls. The affordance is swapped, never removed.

It was CSS scroll-driven animation first — `scroll-timeline` plus
`timeline-scope`, no script at all. That is the more elegant answer and it works
in Chrome, Edge and Safari 26, but not Firefox, where it degrades to a rail that
never moves. A progress rail is worse broken than absent, so it moved to fifteen
lines of JavaScript that work everywhere.

The script owns **position only**. Every colour, size and transition stays in
the stylesheet.

**The one worth writing about:** which card is "active" is derived from
geometry, not remembered from a `mouseenter` event. `mouseenter` and CSS
`:hover` both fire on *pointer* movement — neither reliably updates when an
element slides under a cursor that is holding still. So scrolling past cards
left the dot pointing at the wrong one and the reveal not firing at all.
Recording the pointer position and asking *"which card is nearest it right
now"* is correct at every moment, because it is recomputed rather than
remembered.

Two more details:

- Progress is `scrollLeft / (scrollWidth - clientWidth)`. Dividing by
  `scrollWidth` is the classic version of this bug and makes the dot stop short
  of the end by exactly one screen.
- Scroll events fire far more often than the screen refreshes, so updates are
  batched into `requestAnimationFrame`. Without it the same work runs several
  times between paints, and every run but the last is overwritten before
  anything is drawn.

## Run it

Open `index.html` in a browser. No build step, no dependencies, no framework.

Script order matters:

```html
<script src="i18n.js"     defer></script>  <!-- data -->
<script src="localize.js" defer></script>  <!-- engine -->
<script src="script.js"   defer></script>  <!-- timeline -->
```

`defer` preserves execution order, so the dictionary exists before the engine
reads it, and `dir` is set before the timeline measures anything.

**To test the RTL work:** switch to العربية and scroll the timeline. The dot,
the fill, both edge fades, click-to-jump and the arrow keys should all behave
exactly as they do in English — just mirrored.
