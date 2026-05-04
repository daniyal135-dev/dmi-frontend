# Theme notes

Sirf tab edit karo jab explicitly bola ho — ya nayi theme save karni ho.

---

## Live theme (abhi — **Clinic white + red**)

Clean **off-white / white** surfaces, **slate** text, **red** primary (`#dc2626` / hover `#b91c1c`). Subtle **rose/red radial** wash + faint **neutral grid** on the page shell (`.cyber-bg-layer`).

| Token | Value |
|--------|--------|
| `--app-bg` | `#f6f7f9` |
| `--app-bg-mid` | `#eef0f4` |
| `--app-surface` | `#ffffff` |
| `--app-text` | `#0f172a` |
| `--app-muted` | `#64748b` |
| `--app-accent` | `#dc2626` |
| `--app-accent-hover` | `#b91c1c` |
| `--app-accent-soft` | `rgba(220, 38, 38, 0.12)` |

**Implementation:** colours + mesh + hover utilities sab `app/globals.css` (`:root`, `.cyber-bg-layer`, `.interactive-tile`, `.btn-*`, …). Landing panels `app/page.tsx` (`interactive-tile`, borders `black/[0.07]`, white cards).

Baqi routes (`dashboard`, `upload`, …) abhi **andar ke sections purane slate UI** rakhte ho sakti hain — outer shell light mesh ke saath align hai jahan gradient wrapper swap ho chuka hai.

---

## Archived — dark SOC + red (Feb 2026 snapshot)

Near-black base with glass borders and `#ef4444` accent (before switching to white shell).

| Token | Value |
|--------|--------|
| `--app-bg` | `#0a0a0f` |
| `--app-bg-mid` | `#12121a` |
| `--app-surface` | `#16161f` |
| `--app-text` | `#fafafa` |
| `--app-accent` | `#ef4444` |
| `--app-accent-hover` | `#f87171` |

Mesh: faint white grid + soft red radial glow; `.interactive-tile` hover red bloom on dark panels.

---

## Older experiments (reference only)

### Cyan neon SOC

| `--app-accent` | `#06b6d4` |

### Warm stone + amber

| `--app-bg` `#0c0a09` | `--app-accent` `#d97706` |

### Soft violet

| `--app-bg` `#0c0c11` | `--app-accent` `#9588ff` |

---

*Preset CSS files use nahi ho rahe — sirf `globals.css` + yeh log.*
