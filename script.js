/* ============================================================
   Intel — Sustainability Through the Ages
   Scroll progress for the horizontal timeline.
   ============================================================ */

(function () {
  'use strict';

  const track = document.querySelector('.track');
  const rail  = document.querySelector('.tl-progress');
  const fill  = document.querySelector('.tl-progress__fill');
  const dot   = document.querySelector('.tl-progress__dot');
  const root  = document.documentElement;

  // If any piece is missing, do nothing. A half-wired progress bar is worse
  // than none, and a null here would throw and take the rest of the file down.
  if (!track || !rail || !fill || !dot) return;

  const cards = Array.prototype.slice.call(document.querySelectorAll('.tl-card'));

  /* ⚠️ Which card is "active" is DERIVED from geometry, not remembered from a
     mouseenter event.

     That was the bug. mouseenter and mouseleave fire when the POINTER moves --
     not when the element moves under a pointer that is holding still. So
     scrolling slid cards past a stationary cursor without firing either event,
     and the dot went on pointing at the card the mouse had originally entered,
     following it off the end of the rail while a different card sat under the
     cursor.

     Storing the last pointer position and asking "which card is under this X
     right now" is correct at every moment, because it is recomputed rather than
     remembered. Scroll, resize and pointer movement all land in the same place
     and none of them can disagree. */
  /* ⚠️ Direction is read LIVE, never cached.

     The language switcher can flip the page at any moment, so a value captured
     at load would be stale the first time someone picks Arabic -- and stale in
     the worst way, because every measurement below would still be correct for
     the direction the page no longer has. */
  const isRTL = () => document.documentElement.dir === 'rtl';

  let pointerX = null;      // last known pointer position, viewport coords
  let focusedCard = null;   // keyboard overrides the pointer
  let dragging = false;     // the rail is being dragged

  /**
   * How far along the timeline we are, 0 to 1, or null if nothing can scroll.
   *
   * scrollWidth is the full content width; clientWidth is how much is visible.
   * The difference is the only distance that can actually be scrolled --
   * dividing by scrollWidth is the classic version of this bug and stops the
   * dot short of the end by exactly one screen.
   */
  function progress() {
    const scrollable = track.scrollWidth - track.clientWidth;
    if (scrollable <= 1) return null;
    /* ⚠️ Math.abs, and this is the single most important line in the RTL work.

       In a right-to-left container scrollLeft is 0 at the START -- which is the
       RIGHT edge -- and goes NEGATIVE as you scroll. So the raw value produced
       a ratio between 0 and -1, the dot pinned itself at 0% and never moved,
       and both edge fades stayed off. Normalising to a distance-from-start
       makes every calculation below direction-agnostic. */
    return Math.abs(track.scrollLeft) / scrollable;
  }

  /** Put the dot (and the fill behind it) at a 0–1 position along the rail. */
  function place(ratio) {
    const percent = (Math.max(0, Math.min(1, ratio)) * 100).toFixed(2) + '%';
    /* inset-inline-start, not left. The browser resolves it to left or right
       from the dir attribute, so one line covers both directions -- and the
       matching transition in styles.css names the same property. */
    dot.style.insetInlineStart = percent;
    fill.style.width = percent;
  }

  /**
   * Where a card sits on the rail.
   *
   * Measured in VIEWPORT coordinates. getBoundingClientRect already accounts
   * for the scroll, so converting through scrollLeft would apply it twice.
   * Because it is live, this stays correct while the track scrolls underneath
   * -- which is why scrolling no longer has to cancel pointing.
   */
  function ratioForCard(card) {
    const cardBox = card.getBoundingClientRect();
    const railBox = rail.getBoundingClientRect();
    if (railBox.width === 0) return 0;
    const centre = cardBox.left + cardBox.width / 2;
    /* Measured from the INLINE start, which is the rail's right edge in RTL.
       Using railBox.left in both directions put the first card at ratio 1 and
       the last at 0 -- the dot ran backwards, smoothly and convincingly. */
    return isRTL()
      ? (railBox.right - centre) / railBox.width
      : (centre - railBox.left) / railBox.width;
  }

  /**
   * The card the dot should point at, or null to report scroll position.
   *
   * NEAREST CENTRE rather than "the card containing X". Strict containment
   * leaves the pointer in the gap between two cards belonging to neither, so
   * the dot dropped back to scroll position and re-lit on every gap crossed --
   * a flicker on the way between every pair of cards.
   */
  function activeCard() {
    /* Nothing points at a card mid-drag. The pointer is on the RAIL, but
       pointerX still holds wherever it last was over the track -- so without
       this the dot would jump to a stale card instead of following the finger
       that is dragging it. */
    if (dragging) return null;
    if (focusedCard) return focusedCard;
    if (pointerX === null || cards.length === 0) return null;

    let best = null;
    let bestDistance = Infinity;
    for (let i = 0; i < cards.length; i += 1) {
      const box = cards[i].getBoundingClientRect();
      const distance = Math.abs((box.left + box.width / 2) - pointerX);
      if (distance < bestDistance) { bestDistance = distance; best = cards[i]; }
    }
    return best;
  }

  /* The single place either mode is drawn. Both used to write to the same
     elements from different functions; now there is one writer and one rule
     for which value it uses. */
  function render() {
    const p = progress();

    // Nothing to scroll -- on a phone, or a very wide screen. The rail hides
    // and the native scrollbar comes back with it, so the timeline always has
    // exactly one scroll affordance: never two, and never none.
    if (p === null) {
      rail.classList.remove('is-active');
      root.classList.remove('has-rail');
      track.classList.remove('fade-left', 'fade-right');
      return;
    }

    rail.classList.add('is-active');
    root.classList.add('has-rail');

    /* Fade an edge only when there is content past it. A fade at the left while
       already scrolled to the start is fading nothing, and reads as a smudge on
       the first card rather than as depth.

       The 1px tolerances are not superstition: scrollLeft is fractional on a
       trackpad and on a zoomed page, so it lands at 0.4 or at max - 0.6 and a
       strict comparison never fires. */
    const max = track.scrollWidth - track.clientWidth;
    /* Same normalisation as progress(): `pos` is distance travelled from the
       start, never a signed offset. The class names still read left/right, but
       they now mean inline-start and inline-end -- styles.css flips the mask
       under [dir="rtl"] so the fade lands on the correct physical edge. */
    const pos = Math.abs(track.scrollLeft);
    track.classList.toggle('fade-left', pos > 1);
    track.classList.toggle('fade-right', pos < max - 1);

    const card = activeCard();

    /* The CARD is marked too, not just the dot.

       CSS :hover has the same weakness as mouseenter -- browsers re-evaluate it
       lazily after a scroll, so a card sliding under a stationary cursor often
       does not light up until the mouse is nudged. The reveal looked
       intermittent for exactly the reason the dot did.

       `.is-active` is applied from the same geometry that moves the dot, so the
       two can never disagree about which card is being looked at. The :hover
       rules stay in the stylesheet, so the reveal still works with no JS at
       all -- this makes it consistent, it does not make it possible. */
    cards.forEach(function (c) { c.classList.toggle('is-active', c === card); });

    if (card) {
      dot.classList.add('is-pointing');
      place(ratioForCard(card));
    } else {
      dot.classList.remove('is-pointing');
      place(p);
      rail.setAttribute('aria-valuenow', Math.round(p * 100));
    }
  }

  /* Scroll fires far more often than the screen repaints, so the work batches
     into one frame. Every listener goes through this -- an unbatched render()
     anywhere else silently undoes the batching for the whole file. */
  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      render();
    });
  }

  // `passive: true` promises this never calls preventDefault, so the browser
  // can scroll without waiting to find out.
  track.addEventListener('scroll', schedule, { passive: true });

  // Resizing changes scrollWidth and clientWidth both, including across the
  // 768px breakpoint where the track stops scrolling sideways altogether.
  window.addEventListener('resize', schedule);

  /* ---- Pointing at a hovered card ---------------------------------------- */

  /* On the TRACK, not on each card. One listener that records where the pointer
     is, rather than sixteen that try to remember which card it was last inside.
     Scrolling then resolves to the right card for free, because the answer is
     recomputed from the new positions. */
  track.addEventListener('mousemove', function (event) {
    pointerX = event.clientX;
    schedule();
  }, { passive: true });

  track.addEventListener('mouseleave', function () {
    pointerX = null;
    schedule();
  });

  // The cards are focusable, so the same feedback has to reach the keyboard --
  // without this, tabbing the timeline moves the reveal but leaves the dot
  // behind. Focus outranks the pointer: the last deliberate action wins.
  cards.forEach(function (card) {
    card.addEventListener('focus', function () { focusedCard = card; render(); });
    card.addEventListener('blur', function () { focusedCard = null; render(); });
  });

  /* ---- The rail as a control --------------------------------------------- */

  /* ⚠️ DRAG, which the page has been promising and did not do.

     The hint under the timeline reads "scroll or drag the bar", and the rail
     listened for `click` and `keydown` only. A control that states an ability
     it does not have is the same defect as a button with no handler -- worse
     here, because the label is the only reason anyone would try.

     Pointer Events rather than mouse events, so one implementation covers
     mouse, touch and pen instead of three. */
  function scrollToPointer(clientX, behavior) {
    const box = rail.getBoundingClientRect();
    if (box.width === 0) return;
    const rtl = isRTL();
    const raw = rtl ? (box.right - clientX) : (clientX - box.left);
    const ratio = Math.max(0, Math.min(1, raw / box.width));
    const scrollable = track.scrollWidth - track.clientWidth;
    /* The target is negated in RTL for the same reason progress() takes an
       absolute value: scrollTo still speaks in signed offsets even though the
       ratio above does not. Without the sign the bar jumped to the far end on
       the first press and refused to come back. */
    const target = ratio * scrollable;
    track.scrollTo({ left: rtl ? -target : target, behavior: behavior });
  }

  rail.addEventListener('pointerdown', function (event) {
    if (track.scrollWidth - track.clientWidth <= 1) return;
    dragging = true;
    rail.classList.add('is-dragging');
    /* ⚠️ Snap is suspended for the duration. scroll-snap-type: x proximity
       pulls every programmatic scroll toward the nearest card, so each
       scrollTo issued mid-drag was being yanked back to a snap point and the
       bar could not be steered anywhere between them. */
    track.classList.add('is-dragging');

    /* Capture routes every later move and the release to the rail even when
       the pointer leaves it -- which it will, because dragging along a 6px bar
       means going above and below it constantly. Without capture the drag ends
       the moment the cursor strays. */
    rail.setPointerCapture(event.pointerId);

    /* ⚠️ 'auto', NOT 'smooth'.

       A smooth scroll is an animation that runs to its own target. Starting one
       here and then issuing 'auto' scrolls on every pointermove meant the two
       fought: the animation kept pulling toward wherever the pointer first
       landed while the drag tried to steer somewhere else. The bar barely
       moved, which is exactly what "you can't drag it" looks like. */
    scrollToPointer(event.clientX, 'auto');

    /* ⚠️ NO rail.focus() here, and it was a mistake to add one.

       Focusing it programmatically made Chrome treat the focus as
       keyboard-initiated, so :focus-visible matched and a 3px ring wrapped the
       whole rail the moment you grabbed it -- and stayed there after you let
       go. The convenience was arrow keys working straight after a drag; the
       cost was a large blue pill around the control on every single press.

       Nothing is lost. The rail is still tabbable, and arrow keys still work
       when it is focused by keyboard -- which is the case the ring exists for.
       No scrollbar focuses itself when you drag it either. */
    render();
  });

  rail.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    // 'auto', not 'smooth': a drag must track the finger 1:1. Smooth queues an
    // animation per move event and the bar swims behind the pointer.
    scrollToPointer(event.clientX, 'auto');
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove('is-dragging');
    track.classList.remove('is-dragging');
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    render();
  }
  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);

  /* Arrow keys, because the markup says role="slider" and tabindex="0".

     A slider that can be focused but not operated announces an ability it does
     not have -- the same defect as a button with no handler, except a screen
     reader has already told the user it works. */
  rail.addEventListener('keydown', function (event) {
    const step = track.clientWidth * 0.9;   // most of a screen, keeping context
    let delta = 0;

    /* ⚠️ Arrow keys follow the SCRIPT, not the keycap.

       In Arabic the timeline advances leftwards, so ArrowLeft has to move
       forward. Hard-coding right-means-forward is the accessibility bug that
       survives every visual QA pass, because the layout looks perfect and only
       the keyboard disagrees.

       Home and End are unaffected: "start" and "end" are already logical. */
    const forward = isRTL() ? -step : step;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') delta = forward;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') delta = -forward;
    else if (event.key === 'Home') delta = isRTL() ? track.scrollWidth : -track.scrollWidth;
    else if (event.key === 'End') delta = isRTL() ? -track.scrollWidth : track.scrollWidth;
    else return;                            // not ours — let the browser have it

    event.preventDefault();
    track.scrollBy({ left: delta, behavior: 'smooth' });
  });

  /* ⚠️ Re-measure after a language change, and do it on the NEXT frame.

     Switching language changes three things this file measures: the direction,
     the text, and the font. New copy reflows the cards, so scrollWidth is
     different -- and the handler fires before the browser has laid any of it
     out, so reading immediately returns the OLD geometry. schedule() already
     defers to requestAnimationFrame, which is exactly the wait needed. */
  document.addEventListener('languagechange', schedule);

  // A late font or stylesheet can change the track's measurements after the
  // first paint.
  window.addEventListener('load', render);

  render();
})();
