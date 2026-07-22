// Lightweight line splitter — a free stand-in for GSAP's paid SplitText.
// It splits an element's text into words, measures where the browser wraps
// them (via offsetTop), then regroups each visual line into an
// overflow-hidden mask with an inner span that animations can translate.
//
// Markup produced per line:
//   <span class="line-mask"><span class="line-inner"> ...words </span></span>
//
// Returns the array of `.line-inner` elements so callers can animate them.

export interface SplitResult {
  lines: HTMLElement[];
  /** Restore the element to its original markup. */
  revert: () => void;
}

export function splitLines(el: HTMLElement): SplitResult {
  const original = el.innerHTML;

  // 1. Wrap every word (and preserve existing inline markup like <em>) in a
  //    measurable inline-block span. We walk child nodes so accent spans such
  //    as <em class="accent-serif"> survive as their own "word".
  const wordSpans: HTMLElement[] = [];

  const wrapTextNode = (text: string, parent: Node) => {
    const frag = document.createDocumentFragment();
    text.split(/(\s+)/).forEach((token) => {
      if (token.trim() === "") {
        frag.appendChild(document.createTextNode(token));
        return;
      }
      const span = document.createElement("span");
      span.textContent = token;
      span.style.display = "inline-block";
      wordSpans.push(span);
      frag.appendChild(span);
    });
    parent.replaceChild(frag, parent.firstChild!);
  };

  // Rebuild content: text nodes become word spans, element children are kept
  // whole (treated as a single measurable word).
  const source = Array.from(el.childNodes);
  el.innerHTML = "";
  source.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const holder = document.createElement("span");
      holder.appendChild(node.cloneNode());
      el.appendChild(holder);
      wrapTextNode((node.textContent || ""), holder);
      // Move produced spans up to the element level.
      while (holder.firstChild) el.appendChild(holder.firstChild);
      el.removeChild(holder);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(true) as HTMLElement;
      clone.style.display = "inline-block";
      el.appendChild(clone);
      wordSpans.push(clone);
    }
  });

  // 2. Group words into lines by their vertical offset.
  const lineGroups: HTMLElement[][] = [];
  let lastTop: number | null = null;
  wordSpans.forEach((span) => {
    const top = span.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) > 2) {
      lineGroups.push([]);
      lastTop = top;
    }
    lineGroups[lineGroups.length - 1].push(span);
  });

  // 3. Rebuild the element with masked line wrappers.
  el.innerHTML = "";
  const lines: HTMLElement[] = [];
  lineGroups.forEach((group) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    const inner = document.createElement("span");
    inner.className = "line-inner";
    group.forEach((span, i) => {
      span.style.display = "inline-block";
      inner.appendChild(span);
      if (i < group.length - 1) inner.appendChild(document.createTextNode(" "));
    });
    mask.appendChild(inner);
    el.appendChild(mask);
    lines.push(inner);
  });

  return {
    lines,
    revert: () => {
      el.innerHTML = original;
    },
  };
}
