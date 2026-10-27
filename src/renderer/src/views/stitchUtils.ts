import type React from 'react'

/**
 * Extracts everything between <body> and </body>.
 * The asset files are pre-cut: shell <aside>/<header> and the
 * pl-64/pt-16 wrapper tags are already stripped, so the body
 * contains only the page content.
 */
export const extractBodyInner = (html: string): string => {
  const bodyStart = html.indexOf('<body')
  if (bodyStart === -1) return ''
  const openEnd = html.indexOf('>', bodyStart)
  const end = html.indexOf('</body>', bodyStart)
  if (end === -1 || openEnd === -1) return ''
  return html.slice(openEnd + 1, end)
}

/**
 * Neutralizes parts of the static Stitch source that cannot work when
 * injected as raw HTML inside the React document:
 * - inline <script> blocks (never executed via innerHTML)
 * - inline on* handlers that reference functions from those blocks
 * This keeps the click console clean without altering the visual design.
 */
export const prepareStitchHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(
      /\s+on(click|mouseover|mouseout|mouseenter|mouseleave|dblclick|change|submit|input|focus|blur|keydown)="[^"]*"/gi,
      ''
    )

/**
 * Click delegation for injected content. Anchors must never change the
 * location hash (the app uses HashRouter), so:
 * - "#section-..." anchors scroll smoothly to the target section
 * - dead "#" anchors are simply swallowed
 * This makes the in-page Configuration Subsystems index behave like
 * the original design instead of re-navigating the SPA.
 */
export const stitchClickHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
  const el = e.target as HTMLElement
  const anchor = el.closest('a')
  if (!anchor) return
  const href = anchor.getAttribute('href')
  if (!href || !href.startsWith('#')) {
    e.preventDefault()
    return
  }
  e.preventDefault()
  const id = href.slice(1)
  if (!id) return
  const target =
    e.currentTarget.querySelector(`#${CSS.escape(id)}`) || document.getElementById(id)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
