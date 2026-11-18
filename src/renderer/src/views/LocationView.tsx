import React, { useEffect, useMemo, useRef, useState } from 'react'
import htmlRaw from '../assets/locations_office_geofence_management_1/code.html?raw'
import { extractBodyInner, prepareStitchHtml, stitchClickHandler } from './stitchUtils'
import {
  fetchSites,
  fetchSitesDetailed,
  fetchWorkforceKpi,
  summarizeSites,
  formatTelemetryStamp,
  telemetryDetail,
  createSite,
  updateSite,
  parseCoordinate,
  formatCoordinate,
  type SiteRecord,
  type SiteStatus,
  type WorkforceKpi,
  emptyWorkforceKpi
} from '../services/sitesService'

/* ------------------------------------------------------------------ */
/* Row templates — derived at module load from the pre-cut asset HTML. */
/* ------------------------------------------------------------------ */

interface RowTemplates {
  active: string
  inactive: string
}

const ACTIVE_BADGE = `<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-inverse-surface">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-tertiary-fixed"></span>
</span>
<span class="font-label-sm text-label-sm text-on-tertiary-container tracking-wide font-medium">Active</span>
</div>`

const plainBadge = (label: string): string =>
  `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
<span class="w-2 h-2 rounded-full bg-outline"></span> ${label} </span>`

const EMPTY_ROW =
  `<tr><td colspan="7" class="py-10 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">` +
  `No office locations configured yet. Add your first site to start monitoring geofence telemetry.` +
  `</td></tr>`

/** Shown when sites exist but the current search/filters match none of them. */
const NO_MATCH_ROW =
  `<tr><td colspan="7" class="py-10 px-space-md text-center font-body-sm text-body-sm text-on-surface-variant">` +
  `No locations match the current search or filters. Clear them to see every site.` +
  `</td></tr>`

const deriveTemplates = (): RowTemplates => {
  const base = prepareStitchHtml(extractBodyInner(htmlRaw))
  const tbodyStart = base.indexOf('<tbody')
  const tbodyEnd = base.indexOf('</tbody>', tbodyStart)
  if (tbodyStart === -1 || tbodyEnd === -1) return { active: '', inactive: '' }
  const rowMatches = base.slice(tbodyStart, tbodyEnd).match(/<tr[\s\S]*?<\/tr>/g) ?? []
  if (rowMatches.length < 6) return { active: '', inactive: '' }

  // Data rows are, in order: HQ-01, BR-04, BR-02, BR-03 (active) — BR-05 (inactive) — BR-06 (dormant).
  const active = rowMatches[0] ?? ''
  const inactive = rowMatches[4] ?? ''

  /* Active template substitutions (values carried by the HQ-01 row). */
  let tpl = active
    .replace('Vanguard Global HQ', '__NAME__')
    .replace('HQ-01', '__CODE__')
    // The edit button carries its own copy of the code in data-site; tokenize it
    // too, otherwise every generated row would keep the literal HQ-01 there.
    .replace('data-site="HQ-01"', 'data-site="__CODE__"')
    .replace('Primary Core', '__CAT__')
    .replace(/>corporate_fare</, '>__ICON__<')
    .replace('742 Evergreen Blvd, Metro District, CA', '__ADDR__')
    .replace('US-West-1A', '__ZONE__')
    .replace(/width: 85%;?/, 'width: __PCT__%;')
    .replace('64 Staff', '__STAFF__ Staff')
    .replace(/> 250m\s*</, '> __RADIUS__m<')
    .replace(/font-numeric-mono text-label-sm text-on-surface">Today,\s*08:30 AM</, 'font-numeric-mono text-label-sm __STAMP_CLS__">__STAMP__<')
    .replace(/Ping:\s*14ms</, '__DETAIL__<')

  // Collapse the state badge block into a token.
  tpl = tpl.replace(
    /<div class="inline-flex items-center gap-1\.5 px-2\.5 py-1 rounded-full bg-inverse-surface">[\s\S]*?font-medium">Active<\/span>\s*<\/div>/,
    '__STATE_BADGE__'
  )

  /* Inactive template substitutions (values carried by the BR-05 row). */
  let tplIn = inactive
    .replace('North Distribution Center', '__NAME__')
    .replace('BR-05', '__CODE__')
    .replace('data-site="BR-05"', 'data-site="__CODE__"')
    .replace('Maint. Offline', '__CAT__')
    .replace(/>inventory_2</, '>__ICON__<')
    .replace('800 Lake Shore Way, Chicago, IL', '__ADDR__')
    .replace('US-Central-1', '__ZONE__')
    .replace(/width: 12%;?/, 'width: __PCT__%;')
    .replace('5 Staff', '__STAFF__ Staff')
    .replace(/> 350m\s*</, '> __RADIUS__m<')
    .replace(/text-on-surface-variant">Yesterday,\s*18:00</, '__STAMP_CLS__">__STAMP__<')
    .replace(/Sensor Offline</, '__DETAIL__<')

  tplIn = tplIn.replace(
    /<span class="inline-flex items-center gap-1\.5 px-2\.5 py-1 rounded-full bg-surface-container[\s\S]*?>\s*Inactive\s*<\/span>/,
    '__STATE_BADGE__'
  )

  return { active: tpl, inactive: tplIn }
}

const TEMPLATES = deriveTemplates()

/** Fill every `__TOKEN__` occurrence (avoid depending on ES2021 String#replaceAll). */
const sub = (html: string, replacements: Array<[string, string]>): string => {
  let out = html
  for (const [needle, value] of replacements) out = out.split(needle).join(value)
  return out
}

/** Escape dynamic text before it is spliced into the stitched HTML string. */
const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Tag the three action buttons of a generated row with data-action/data-code.
 * The buttons are identified positionally inside the row's actions container
 * (the asset's own onclick handlers are stripped by prepareStitchHtml).
 */
const injectRowActions = (row: string, code: string): string => {
  const marker = '<div class="flex items-center justify-end gap-1">'
  const start = row.indexOf(marker)
  if (start === -1) return row
  const attrs = [
    ` data-action="view-site" data-code="${esc(code)}"`,
    ` data-action="edit-site" data-code="${esc(code)}"`,
    ` data-action="toggle-site" data-code="${esc(code)}"`
  ]
  let out = row.slice(0, start + marker.length)
  let idx = start + marker.length
  let found = 0
  while (found < attrs.length) {
    const btn = row.indexOf('<button', idx)
    if (btn === -1) break
    out += row.slice(idx, btn) + '<button' + attrs[found]
    idx = btn + '<button'.length
    found++
  }
  out += row.slice(idx)
  return out
}

const buildRow = (site: SiteRecord, maxStaff: number): string => {
  const isInactiveLike = site.status !== 'active'
  let row = isInactiveLike ? TEMPLATES.inactive : TEMPLATES.active
  if (!row) return ''
  const pct = maxStaff > 0 ? Math.max(0, Math.min(100, Math.round((site.staffCount / maxStaff) * 100))) : 0
  const stamp = formatTelemetryStamp(site.lastPingAt)

  const filled = sub(row, [
    ['__ICON__', esc(site.icon)],
    ['__NAME__', esc(site.name)],
    ['__CODE__', esc(site.code)],
    ['__CAT__', esc(site.category)],
    ['__ADDR__', esc(site.address)],
    ['__ZONE__', esc(site.zone)],
    ['__PCT__', String(pct)],
    ['__STAFF__', String(site.staffCount)],
    ['__RADIUS__', String(site.radiusMeters)],
    ['__STAMP__', stamp],
    ['__DETAIL__', telemetryDetail(site)],
    ['__STAMP_CLS__', site.status === 'active' ? 'text-on-surface' : 'text-on-surface-variant'],
    [
      '__STATE_BADGE__',
      site.status === 'active' ? ACTIVE_BADGE : plainBadge(site.status === 'inactive' ? 'Inactive' : 'Dormant')
    ]
  ])
  return injectRowActions(filled, site.code)
}

/* ------------------------------------------------------------------ */
/* String surgery helpers — every needle was verified against the      */
/* asset file before being used.                                       */
/* ------------------------------------------------------------------ */

const tagById = (html: string, id: string): [number, number] | null => {
  const idx = html.indexOf(`id="${id}"`)
  if (idx === -1) return null
  const start = html.lastIndexOf('<', idx)
  const end = html.indexOf('>', idx)
  if (start === -1 || end === -1) return null
  return [start, end]
}

/** Replace the whole class attribute of the element carrying `id`. */
const setTagClassById = (html: string, id: string, className: string): string => {
  const range = tagById(html, id)
  if (!range) return html
  const [start, end] = range
  const tag = html.slice(start, end + 1)
  if (!/class="[^"]*"/.test(tag)) return html
  const next = tag.replace(/class="[^"]*"/, `class="${className}"`)
  return html.slice(0, start) + next + html.slice(end + 1)
}

/** Replace the class attribute of the element whose open tag ends after `marker`. */
const setTagClassByMarker = (html: string, marker: string, className: string): string => {
  const idx = html.indexOf(marker)
  if (idx === -1) return html
  const gt = marker.indexOf('>')
  const tagEnd = gt === -1 ? html.indexOf('>', idx) : idx + gt
  const tagStart = html.lastIndexOf('<', idx)
  if (tagStart === -1 || tagEnd === -1) return html
  const tag = html.slice(tagStart, tagEnd + 1)
  if (!/class="[^"]*"/.test(tag)) return html
  const next = tag.replace(/class="[^"]*"/, `class="${className}"`)
  return html.slice(0, tagStart) + next + html.slice(tagEnd + 1)
}

/** Replace the inner text of the element carrying `id`. */
const setInnerTextById = (html: string, id: string, text: string): string => {
  const range = tagById(html, id)
  if (!range) return html
  const [, end] = range
  const closeStart = html.indexOf('</', end)
  if (closeStart === -1) return html
  return html.slice(0, end + 1) + text + html.slice(closeStart)
}

/** Set (or clear) the value attribute of the input carrying `id`. */
const setInputValueById = (html: string, id: string, value: string): string => {
  const range = tagById(html, id)
  if (!range) return html
  const [start, end] = range
  const tag = html.slice(start, end + 1)
  const escaped = esc(value)
  let next: string
  if (/\svalue="[^"]*"/.test(tag)) {
    next = tag.replace(/\svalue="[^"]*"/, ` value="${escaped}"`)
  } else if (escaped === '') {
    next = tag
  } else if (tag.endsWith('/>')) {
    next = `${tag.slice(0, -2)} value="${escaped}"/>`
  } else {
    next = `${tag.slice(0, -1)} value="${escaped}">`
  }
  return html.slice(0, start) + next + html.slice(end + 1)
}

/** Toggle the checked attribute of the checkbox carrying `id`. */
const setInputCheckedById = (html: string, id: string, checked: boolean): string => {
  const range = tagById(html, id)
  if (!range) return html
  const [start, end] = range
  let tag = html.slice(start, end + 1)
  const hasChecked = /\schecked(?:="[^"]*")?/.test(tag)
  if (checked && !hasChecked) {
    tag = tag.endsWith('/>') ? `${tag.slice(0, -2)} checked="" />` : `${tag.slice(0, -1)} checked="">`
  } else if (!checked && hasChecked) {
    tag = tag.replace(/\schecked(?:="[^"]*")?/g, '')
  }
  return html.slice(0, start) + tag + html.slice(end + 1)
}

/** Select the option with `value` inside the select carrying `id`. */
const setSelectedOption = (html: string, selectId: string, value: string): string => {
  const idx = html.indexOf(`id="${selectId}"`)
  if (idx === -1) return html
  const selStart = html.lastIndexOf('<select', idx)
  const selEnd = html.indexOf('</select>', idx)
  if (selStart === -1 || selEnd === -1) return html
  let region = html.slice(selStart, selEnd)
  region = region.replace(/\s+selected(?:="[^"]*")?/g, '')
  const optionMarker = `<option value="${value}"`
  const optIdx = region.indexOf(optionMarker)
  if (optIdx !== -1) {
    region = region.slice(0, optIdx) + `${optionMarker} selected` + region.slice(optIdx + optionMarker.length)
  }
  return html.slice(0, selStart) + region + html.slice(selEnd)
}

/** Add or remove the disabled attribute on the button containing `marker`.
 *  Matches the attribute literally so the `disabled:opacity-40` class is
 *  never mistaken for it. */
const setDisabledByMarker = (html: string, marker: string, disabled: boolean): string => {
  const idx = html.indexOf(marker)
  if (idx === -1) return html
  const gt = marker.indexOf('>')
  const tagEnd = gt === -1 ? html.indexOf('>', idx) : idx + gt
  const tagStart = html.lastIndexOf('<', idx)
  if (tagStart === -1 || tagEnd === -1) return html
  let tag = html.slice(tagStart, tagEnd + 1)
  const hasDisabled = tag.includes(' disabled=""')
  if (disabled && !hasDisabled) {
    tag = `${tag.slice(0, -1)} disabled="">`
  } else if (!disabled && hasDisabled) {
    tag = tag.replace(' disabled=""', '')
  }
  return html.slice(0, tagStart) + tag + html.slice(tagEnd + 1)
}

/** Append a class (already present elsewhere in the asset) to the tag containing `marker`. */
const appendClassByMarker = (html: string, marker: string, className: string): string => {
  const idx = html.indexOf(marker)
  if (idx === -1) return html
  const gt = marker.indexOf('>')
  const tagEnd = gt === -1 ? html.indexOf('>', idx) : idx + gt
  const tagStart = html.lastIndexOf('<', idx)
  if (tagStart === -1 || tagEnd === -1) return html
  const tag = html.slice(tagStart, tagEnd + 1)
  const match = /class="([^"]*)"/.exec(tag)
  if (!match) return html
  if (match[1].split(' ').includes(className)) return html
  const next = tag.replace(/class="([^"]*)"/, `class="$1 ${className}"`)
  return html.slice(0, tagStart) + next + html.slice(tagEnd + 1)
}

/** Remove the whole <button> whose open tag contains `marker`. */
const removeButtonByMarker = (html: string, marker: string): string => {
  const idx = html.indexOf(marker)
  if (idx === -1) return html
  const tagStart = html.lastIndexOf('<button', idx)
  const tagEnd = html.indexOf('</button>', idx)
  if (tagStart === -1 || tagEnd === -1) return html
  return html.slice(0, tagStart) + html.slice(tagEnd + '</button>'.length)
}

/** Add an attribute to the element carrying `id` (idempotent). */
const addAttrById = (html: string, id: string, attrs: string): string => {
  const range = tagById(html, id)
  if (!range) return html
  const [start, end] = range
  const tag = html.slice(start, end + 1)
  if (tag.includes(attrs)) return html
  const next = tag.endsWith('/>') ? `${tag.slice(0, -2)} ${attrs}/>` : `${tag.slice(0, -1)} ${attrs}>`
  return html.slice(0, start) + next + html.slice(end + 1)
}

/** Add an attribute to the element containing `marker` (idempotent).
 *  Markers without a `>` locate the attribute inside the open tag; the
 *  attribute is inserted just before the tag's closing `>` so the marker
 *  itself stays matchable for later passes. */
const addAttrByMarker = (html: string, marker: string, attrs: string): string => {
  const idx = html.indexOf(marker)
  if (idx === -1) return html
  const gt = marker.indexOf('>')
  const tagEnd = gt === -1 ? html.indexOf('>', idx) : idx + gt
  const tagStart = html.lastIndexOf('<', idx)
  if (tagStart === -1 || tagEnd === -1) return html
  const tag = html.slice(tagStart, tagEnd + 1)
  if (tag.includes(attrs)) return html
  const next = tag.endsWith('/>') ? `${tag.slice(0, -2)} ${attrs}/>` : `${tag.slice(0, -1)} ${attrs}>`
  return html.slice(0, tagStart) + next + html.slice(tagEnd + 1)
}

/* ------------------------------------------------------------------ */
/* Delegation hooks (data-action / data-focus) — added once to the     */
/* base string; these are data-* attributes only, no design change.     */
/* ------------------------------------------------------------------ */

const ID_ATTRS: Array<[string, string]> = [
  ['bulkSyncBtn', 'data-action="bulk-sync"'],
  ['openModalBtn', 'data-action="add-site"'],
  ['searchInput', 'data-focus="sitesearch"'],
  ['clearSearchBtn', 'data-action="clear-search"'],
  ['statusFilter', 'data-focus="filter-status"'],
  ['radiusFilter', 'data-focus="filter-radius"'],
  ['resetFiltersBtn', 'data-action="reset-filters"'],
  ['tabNormalState', 'data-action="tab-live"'],
  ['tabEmptyState', 'data-action="tab-empty"'],
  ['viewTableBtn', 'data-action="view-table"'],
  ['viewSplitBtn', 'data-action="view-split"'],
  ['closeSplitBtn', 'data-action="view-table"'],
  ['closeModalBtn', 'data-action="modal-close"'],
  ['cancelModalBtn', 'data-action="modal-close"'],
  ['saveLocationBtn', 'data-action="save-site"'],
  ['radiusRange', 'data-focus="form-radius"'],
  ['inputLocName', 'data-focus="form-name"'],
  ['inputAddress', 'data-focus="form-address"'],
  ['inputLat', 'data-focus="form-lat"'],
  ['inputLng', 'data-focus="form-lng"'],
  ['activeToggleCheckbox', 'data-focus="form-active"']
]

const MARKER_ATTRS: Array<[string, string]> = [
  // Chevrons use markers WITHOUT the trailing `>`: the attribute is injected
  // before that `>`, which would otherwise destroy the marker itself.
  ['title="Previous Page"', 'data-action="page-prev"'],
  ['title="Next Page"', 'data-action="page-next"'],
  ['>1</button>', 'data-action="page-1"'],
  ['>2</button>', 'data-action="page-2"'],
  ['>Clear Search &amp; Filters</button>', 'data-action="reset-filters"'],
  ['>+ Add New Site</button>', 'data-action="add-site"'],
  ['>100m (Compact)</button>', 'data-action="radius-preset" data-radius="100"'],
  ['>250m (Standard)</button>', 'data-action="radius-preset" data-radius="250"'],
  ['>500m (Campus / Depot)</button>', 'data-action="radius-preset" data-radius="500"']
]

/** Inject every data-action/data-focus hook used by the delegated handlers. */
const withDataAttributes = (html: string): string => {
  let out = html
  for (const [id, attrs] of ID_ATTRS) out = addAttrById(out, id, attrs)
  for (const [marker, attrs] of MARKER_ATTRS) out = addAttrByMarker(out, marker, attrs)
  // Same disabled pattern the asset already uses on the previous button.
  out = appendClassByMarker(out, 'title="Next Page"', 'disabled:opacity-40')
  return out
}

/* ------------------------------------------------------------------ */
/* Class strings — copied verbatim from the asset (or composed from    */
/* classes that already exist there) so toggles only move known state. */
/* ------------------------------------------------------------------ */

const CLS_MODAL_CLOSED =
  'fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center p-space-md hidden overflow-y-auto'
const CLS_MODAL_OPEN =
  'fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center p-space-md overflow-y-auto'
const CLS_CLEAR_SEARCH =
  'absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface hidden'
const CLS_CLEAR_SEARCH_VISIBLE =
  'absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface'
const CLS_TBODY = 'divide-y divide-surface-container-high/60 font-body-md text-body-md'
const CLS_EMPTY_BLOCK_HIDDEN =
  'hidden py-16 px-space-lg flex-col items-center justify-center text-center'
const CLS_EMPTY_BLOCK_SHOWN =
  'py-16 px-space-lg flex-col items-center justify-center text-center flex'
const CLS_SPLIT_HIDDEN = 'col-span-12 xl:col-span-4 hidden flex-col gap-space-md'
const CLS_SPLIT_SHOWN = 'col-span-12 xl:col-span-4 flex-col gap-space-md flex'
const CLS_TABLE_COL = 'col-span-12 transition-all duration-300'
const CLS_TABLE_COL_SPLIT = 'col-span-12 xl:col-span-8 transition-all duration-300'
const CLS_TAB_ACTIVE =
  'px-2.5 py-1 rounded-md bg-surface-container-lowest font-label-sm text-label-sm text-primary font-semibold shadow-xs'
const CLS_TAB_INACTIVE = 'px-2.5 py-1 rounded-md text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm'
const CLS_VIEW_ACTIVE =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-lowest text-primary shadow-xs font-label-md text-label-md'
const CLS_VIEW_INACTIVE =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md'
const CLS_TOAST_BASE =
  'fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-transform duration-300'
const CLS_CHIP_ACTIVE =
  'w-8 h-8 rounded-lg bg-primary-container text-on-primary font-numeric-mono text-label-sm font-semibold flex items-center justify-center shadow-xs'
const CLS_CHIP_INACTIVE =
  'w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container font-numeric-mono text-label-sm font-medium flex items-center justify-center transition-colors'
const CLS_PRESET_BASE =
  'px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high font-numeric-mono text-label-sm text-on-surface-variant'
/* Active preset style assembled from classes the asset already uses on its
   segmented tabs (bg-surface-container-lowest + text-primary + shadow-xs). */
const CLS_PRESET_ACTIVE =
  'px-2.5 py-1 rounded bg-surface-container-lowest font-numeric-mono text-label-sm text-primary font-semibold shadow-xs'

const PRESETS: ReadonlyArray<number> = [100, 250, 500]
const PRESET_MARKERS: Record<number, string> = {
  100: '>100m (Compact)</button>',
  250: '>250m (Standard)</button>',
  500: '>500m (Campus / Depot)</button>'
}

/* ------------------------------------------------------------------ */
/* UI state                                                            */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 6

interface ModalForm {
  name: string
  address: string
  lat: string
  lng: string
  active: boolean
}

interface ToastState {
  show: boolean
  title: string
  desc: string
  tone: 'success' | 'error'
}

interface UiState {
  search: string
  statusFilter: string
  radiusFilter: string
  stateTab: 'live' | 'empty'
  view: 'table' | 'split'
  page: number
  modalOpen: boolean
  modalMode: 'add' | 'edit' | 'view'
  modalSiteId: string | null
  form: ModalForm
  toast: ToastState
}

const EMPTY_FORM: ModalForm = { name: 'Kolam Renang Tirta Mulya', address: '', lat: '-6.8603952° S', lng: '107.525447° E', active: true }

const INITIAL_UI: UiState = {
  search: '',
  statusFilter: 'all',
  radiusFilter: 'all',
  stateTab: 'live',
  view: 'table',
  page: 1,
  modalOpen: false,
  modalMode: 'add',
  modalSiteId: null,
  form: EMPTY_FORM,
  toast: { show: false, title: '', desc: '', tone: 'success' }
}

/** Live row filter — search on name/code/address, status and radius selects. */
const filterSites = (sites: SiteRecord[], ui: UiState): SiteRecord[] => {
  const query = ui.search.trim().toLowerCase()
  return sites.filter((site) => {
    if (
      query &&
      !site.name.toLowerCase().includes(query) &&
      !site.code.toLowerCase().includes(query) &&
      !site.address.toLowerCase().includes(query)
    ) {
      return false
    }
    if (ui.statusFilter === 'active' && site.status !== 'active') return false
    // "Inactive Only" groups inactive + dormant, matching the KPI card that
    // counts both as inactive.
    if (ui.statusFilter === 'inactive' && site.status === 'active') return false
    // Bands follow the option labels in the asset (≤150 / 200–350 / ≥400).
    if (ui.radiusFilter === '150' && site.radiusMeters > 150) return false
    if (ui.radiusFilter === '250' && !(site.radiusMeters >= 200 && site.radiusMeters <= 350)) return false
    if (ui.radiusFilter === '500' && site.radiusMeters < 400) return false
    return true
  })
}

const pageCountOf = (filtered: SiteRecord[]): number =>
  Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

/* ------------------------------------------------------------------ */
/* KPI text substitution over the whole page inner.                    */
/* ------------------------------------------------------------------ */

const METRIC_SPAN = '<span class="font-numeric-metric text-numeric-metric text-on-surface">'

const locationHtml = (
  baseInner: string,
  sites: SiteRecord[],
  workforce: WorkforceKpi,
  ui: UiState,
  radius: number
): string => {
  if (!baseInner) return ''
  const stats = summarizeSites(sites)
  const pctOnline = sites.length > 0 ? Math.round((stats.active / sites.length) * 100) : 0
  let html = baseInner

  const filtered = filterSites(sites, ui)
  const pageCount = pageCountOf(filtered)
  const safePage = Math.min(Math.max(1, ui.page), pageCount)
  const startIdx = (safePage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(startIdx, startIdx + PAGE_SIZE)

  /* 1. Table rows — filtered, then paginated (6 per page). */
  const tbodyStart = html.indexOf('<tbody')
  const tbodyOpenEnd = html.indexOf('>', tbodyStart)
  const tbodyEnd = html.indexOf('</tbody>', tbodyStart)
  if (tbodyStart !== -1 && tbodyEnd !== -1) {
    const maxStaff = sites.reduce((max, s) => Math.max(max, s.staffCount), 0)
    const tbodyInner =
      filtered.length > 0
        ? pageRows.map((s) => buildRow(s, maxStaff)).join('\n')
        : sites.length > 0
          ? NO_MATCH_ROW
          : EMPTY_ROW
    html = html.slice(0, tbodyOpenEnd + 1) + tbodyInner + html.slice(tbodyEnd)
  }

  /* 2. KPI metric figures — one pass in document order:
       card1 total, card2 active, card3 secondary (inactive+dormant), card4 rostered */
  const kpiValues = [
    String(stats.total),
    String(stats.active),
    String(stats.total - stats.active),
    String(workforce.rostered)
  ]
  let kpiIndex = 0
  const metricSource = METRIC_SPAN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  html = html.replace(
    new RegExp(`${metricSource}(\\d+)</span`, 'g'),
    (_match, _digits) => `${METRIC_SPAN}${kpiValues[kpiIndex++] ?? '0'}</span`
  )

  /* 3. KPI chips */
  html = html.replace('>6 Active<', `>${stats.active} Active<`)
  html = html.replace('>2 Inactive<', `>${stats.total - stats.active} Inactive<`)
  html = html.replace('>100% ONLINE<', `>${pctOnline}% ONLINE<`)
  html = html.replace('114 On-Premises', `${workforce.onPremises} On-Premises`)
  html = html.replace('14 Field Units', `${workforce.fieldUnits} Field Units`)

  /* 4. Table status footer — reflects the active page of the filtered list */
  const rangeStart = filtered.length === 0 ? 0 : startIdx + 1
  const rangeEnd = filtered.length === 0 ? 0 : startIdx + pageRows.length
  html = html.replace('>1 \u2013 6<', `>${rangeStart} \u2013 ${rangeEnd}<`)
  html = html.replace('>8 locations<', `>${filtered.length} locations<`)
  html = html.replace('Active Nodes: 6 / 8', `Active Nodes: ${stats.active} / ${stats.total}`)

  /* 5. Hide page 2 chip when everything fits one page (previous behaviour).
        Located via the data-action hook, since the class/content regex used
        before no longer matches once delegation attributes are injected. */
  if (pageCount <= 1) {
    html = removeButtonByMarker(html, 'data-action="page-2"')
  }

  /* 6. Page chip active state (swaps between the two class variants the
        asset ships). Chip 2 is processed first while its class is unique. */
  if (safePage === 2) {
    html = html.replace(`class="${CLS_CHIP_INACTIVE}"`, `class="${CLS_CHIP_ACTIVE}"`)
  }
  if (safePage !== 1) {
    html = html.replace(`class="${CLS_CHIP_ACTIVE}"`, `class="${CLS_CHIP_INACTIVE}"`)
  }

  /* 7. Chevrons disabled on first/last page (asset's disabled pattern). */
  html = setDisabledByMarker(html, 'title="Previous Page"', safePage <= 1)
  html = setDisabledByMarker(html, 'title="Next Page"', safePage >= pageCount)

  /* 8. Filters: selected options, search value, clear button visibility. */
  html = setSelectedOption(html, 'statusFilter', ui.statusFilter)
  html = setSelectedOption(html, 'radiusFilter', ui.radiusFilter)
  html = setInputValueById(html, 'searchInput', ui.search)
  html = setTagClassById(
    html,
    'clearSearchBtn',
    ui.search.trim() ? CLS_CLEAR_SEARCH_VISIBLE : CLS_CLEAR_SEARCH
  )

  /* 9. Live Telemetry / Simulate Empty tabs. */
  const emptyMode = ui.stateTab === 'empty'
  html = setTagClassById(html, 'tabNormalState', emptyMode ? CLS_TAB_INACTIVE : CLS_TAB_ACTIVE)
  html = setTagClassById(html, 'tabEmptyState', emptyMode ? CLS_TAB_ACTIVE : CLS_TAB_INACTIVE)
  html = setTagClassById(html, 'locationsTableBody', emptyMode ? `${CLS_TBODY} hidden` : CLS_TBODY)
  html = setTagClassById(html, 'simulatedEmptyBlock', emptyMode ? CLS_EMPTY_BLOCK_SHOWN : CLS_EMPTY_BLOCK_HIDDEN)

  /* 10. Table / Map Split view. */
  const splitMode = ui.view === 'split'
  html = setTagClassById(html, 'viewTableBtn', splitMode ? CLS_VIEW_INACTIVE : CLS_VIEW_ACTIVE)
  html = setTagClassById(html, 'viewSplitBtn', splitMode ? CLS_VIEW_ACTIVE : CLS_VIEW_INACTIVE)
  html = setTagClassById(html, 'splitMapPane', splitMode ? CLS_SPLIT_SHOWN : CLS_SPLIT_HIDDEN)
  html = setTagClassById(html, 'tableContainerCol', splitMode ? CLS_TABLE_COL_SPLIT : CLS_TABLE_COL)

  /* 11. Add / Edit / View modal. */
  const editingSite = ui.modalSiteId ? sites.find((s) => s.id === ui.modalSiteId) ?? null : null
  const modalTitle =
    ui.modalMode === 'edit'
      ? `Edit Geofence perimeter [${editingSite?.code ?? '—'}]`
      : ui.modalMode === 'view'
        ? `Geofence Details [${editingSite?.code ?? '—'}]`
        : 'Add New Office Location'
  html = setTagClassById(html, 'locationModalOverlay', ui.modalOpen ? CLS_MODAL_OPEN : CLS_MODAL_CLOSED)
  html = setInnerTextById(html, 'modalTitle', esc(modalTitle))
  html = setInputValueById(html, 'inputLocName', ui.form.name)
  html = setInputValueById(html, 'inputAddress', ui.form.address)
  html = setInputValueById(html, 'inputLat', ui.form.lat)
  html = setInputValueById(html, 'inputLng', ui.form.lng)
  html = setInputValueById(html, 'radiusRange', String(radius))
  html = setInputCheckedById(html, 'activeToggleCheckbox', ui.form.active)
  html = setInnerTextById(html, 'radiusValDisplay', String(radius))
  html = setInnerTextById(html, 'modalLegendRadius', `${radius}m`)
  const latLabel = parseCoordinate(ui.form.lat)
  const lngLabel = parseCoordinate(ui.form.lng)
  html = setInnerTextById(
    html,
    'modalCoordLabel',
    esc(`Lat: ${latLabel ?? '—'}, Lng: ${lngLabel ?? '—'} (Demo)`)
  )
  for (const preset of PRESETS) {
    html = setTagClassByMarker(
      html,
      PRESET_MARKERS[preset],
      radius === preset ? CLS_PRESET_ACTIVE : CLS_PRESET_BASE
    )
  }

  /* 12. Toast (hidden state = the asset's translate-y-24). */
  html = setTagClassById(
    html,
    'toastNotification',
    ui.toast.show ? CLS_TOAST_BASE : `${CLS_TOAST_BASE} translate-y-24`
  )
  html = setInnerTextById(html, 'toastTitle', esc(ui.toast.title))
  html = setInnerTextById(html, 'toastDesc', esc(ui.toast.desc))
  html = html.replace(
    'text-xl">check_circle</span>',
    `text-xl">${ui.toast.tone === 'error' ? 'error' : 'check_circle'}</span>`
  )

  return html
}

/* ------------------------------------------------------------------ */
/* Imperative radius updates — the range slider must keep the pointer  */
/* capture during a drag, so it never triggers a re-render by itself.  */
/* ------------------------------------------------------------------ */

const applyRadiusDom = (root: HTMLElement, radiusValue: number): void => {
  const display = root.querySelector('#radiusValDisplay')
  if (display) display.textContent = String(radiusValue)
  const legend = root.querySelector('#modalLegendRadius')
  if (legend) legend.textContent = `${radiusValue}m`
  const range = root.querySelector('#radiusRange')
  if (range instanceof HTMLInputElement && range.value !== String(radiusValue)) {
    range.value = String(radiusValue)
  }
  for (const preset of PRESETS) {
    const chip = root.querySelector(`[data-radius="${preset}"]`)
    if (chip) chip.setAttribute('class', radiusValue === preset ? CLS_PRESET_ACTIVE : CLS_PRESET_BASE)
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const LocationView: React.FC = () => {
  const [sites, setSites] = useState<SiteRecord[]>([])
  const [workforce, setWorkforce] = useState<WorkforceKpi>(emptyWorkforceKpi)
  const [ui, setUi] = useState<UiState>(INITIAL_UI)
  const containerRef = useRef<HTMLDivElement | null>(null)
  /** Geofence radius of the currently edited site — lives in a ref so slider
   *  drags never rebuild the DOM (which would break the pointer capture). */
  const radiusRef = useRef(250)
  /** Last element carrying data-focus, plus its caret position, so a rebuild
   *  of the stitched HTML can restore focus/caret to where the user was. */
  const focusRef = useRef<{ key: string; start: number | null; end: number | null } | null>(null)

  const baseInner = useMemo(() => withDataAttributes(prepareStitchHtml(extractBodyInner(htmlRaw))), [])
  // radiusRef is intentionally read live (not a dep): radius changes during a
  // drag update the DOM imperatively and only a later rebuild re-reads it.
  const inner = useMemo(
    () => locationHtml(baseInner, sites, workforce, ui, radiusRef.current),
    [baseInner, sites, workforce, ui]
  )

  useEffect(() => {
    let subscribed = true
    void fetchSites().then((rows) => {
      if (subscribed) setSites(rows)
    })
    void fetchWorkforceKpi().then((kpi) => {
      if (subscribed) setWorkforce(kpi)
    })
    return () => {
      subscribed = false
    }
  }, [])

  /* Toast auto-hide after ~3 seconds. */
  useEffect(() => {
    if (!ui.toast.show) return
    const timer = setTimeout(() => {
      setUi((prev) => (prev.toast.show ? { ...prev, toast: { ...prev.toast, show: false } } : prev))
    }, 3000)
    return () => clearTimeout(timer)
  }, [ui.toast])

  /* Restore focus/caret after the stitched HTML is rebuilt. */
  useEffect(() => {
    const focus = focusRef.current
    const root = containerRef.current
    if (!focus || !root) return
    const el = root.querySelector<HTMLElement>(`[data-focus="${focus.key}"]`)
    if (!el) return
    el.focus()
    if (el instanceof HTMLInputElement && el.type === 'text') {
      if (focus.key === 'sitesearch') {
        const end = el.value.length
        el.setSelectionRange(end, end)
      } else if (focus.start !== null) {
        const start = Math.min(focus.start, el.value.length)
        const end = Math.min(focus.end ?? focus.start, el.value.length)
        el.setSelectionRange(start, end)
      } else {
        const end = el.value.length
        el.setSelectionRange(end, end)
      }
    }
  }, [inner])

  const showToast = (title: string, desc: string, tone: ToastState['tone'] = 'success'): void => {
    setUi((prev) => ({ ...prev, toast: { show: true, title, desc, tone } }))
  }

  const openAddModal = (): void => {
    radiusRef.current = 250
    setUi((prev) => ({
      ...prev,
      modalOpen: true,
      modalMode: 'add',
      modalSiteId: null,
      form: { ...EMPTY_FORM }
    }))
  }

  const openSiteModal = (code: string, mode: 'view' | 'edit'): void => {
    const site = sites.find((s) => s.code === code)
    if (!site) {
      showToast('Site Not Found', `No location with code ${code} exists on the server.`, 'error')
      return
    }
    radiusRef.current = site.radiusMeters
    setUi((prev) => ({
      ...prev,
      modalOpen: true,
      modalMode: mode,
      modalSiteId: site.id,
      form: {
        name: site.name,
        address: site.address,
        lat: formatCoordinate(site.lat, 'lat'),
        lng: formatCoordinate(site.lng, 'lng'),
        active: site.status === 'active'
      }
    }))
  }

  const runBulkSync = (): void => {
    showToast('Syncing Geofences...', 'Reloading sites and workforce metrics from the server.')
    void (async () => {
      try {
        const [siteResult, kpi] = await Promise.all([fetchSitesDetailed(), fetchWorkforceKpi()])
        setWorkforce(kpi)
        if (siteResult.error) {
          showToast('Sync Failed', siteResult.error, 'error')
          return
        }
        setSites(siteResult.sites)
        const count = siteResult.sites.length
        showToast(
          'Sync Complete',
          count === 1 ? '1 geofence site reloaded from the server.' : `${count} geofence sites reloaded from the server.`
        )
      } catch (err) {
        showToast('Sync Failed', err instanceof Error ? err.message : 'Unknown error.', 'error')
      }
    })()
  }

  const resetFilters = (): void => {
    setUi((prev) => ({
      ...prev,
      search: '',
      statusFilter: 'all',
      radiusFilter: 'all',
      stateTab: 'live',
      page: 1
    }))
    showToast('Filters Reset', `Displaying all ${sites.length} office geofence locations.`)
  }

  const toggleSiteStatus = (code: string): void => {
    const site = sites.find((s) => s.code === code)
    if (!site) {
      showToast('Site Not Found', `No location with code ${code} exists on the server.`, 'error')
      return
    }
    // active -> inactive; inactive/dormant -> active.
    const nextStatus: SiteStatus = site.status === 'active' ? 'inactive' : 'active'
    void (async () => {
      try {
        await updateSite(site.id, { status: nextStatus })
        const result = await fetchSitesDetailed()
        if (result.error) {
          showToast('Status Updated', `${site.name} is now ${nextStatus}, but reload failed: ${result.error}`)
          return
        }
        setSites(result.sites)
        showToast('Status Updated', `${site.name} is now ${nextStatus}.`)
      } catch (err) {
        showToast('Update Failed', err instanceof Error ? err.message : 'Unknown error.', 'error')
      }
    })()
  }

  const saveModal = (): void => {
    const name = ui.form.name.trim()
    if (!name) {
      showToast('Validation Error', 'Location name is required.', 'error')
      return
    }
    const rawLat = ui.form.lat.trim()
    const rawLng = ui.form.lng.trim()
    const lat = rawLat ? parseCoordinate(rawLat) : null
    const lng = rawLng ? parseCoordinate(rawLng) : null
    if (rawLat && lat === null) {
      showToast('Validation Error', 'Latitude must contain a decimal number, e.g. 37.7749.', 'error')
      return
    }
    if (rawLng && lng === null) {
      showToast('Validation Error', 'Longitude must contain a decimal number, e.g. -122.4194.', 'error')
      return
    }
    const radiusValue = radiusRef.current
    const address = ui.form.address.trim()
    const mode = ui.modalMode
    const siteId = ui.modalSiteId
    void (async () => {
      try {
        if (mode === 'add') {
          await createSite({
            name,
            address,
            lat,
            lng,
            radiusMeters: radiusValue,
            status: ui.form.active ? 'active' : 'inactive'
          })
        } else {
          const site = sites.find((s) => s.id === siteId)
          if (!site) throw new Error('This site no longer exists on the server.')
          // Keep dormant as dormant when the toggle stays off; an active site
          // saved with the toggle off becomes inactive.
          const status: SiteStatus = ui.form.active
            ? 'active'
            : site.status !== 'active'
              ? site.status
              : 'inactive'
          await updateSite(site.id, { name, address, lat, lng, radiusMeters: radiusValue, status })
        }
        const result = await fetchSitesDetailed()
        if (result.error) {
          showToast('Location Saved', `${name} was saved, but reload failed: ${result.error}`)
          setUi((prev) => ({ ...prev, modalOpen: false }))
          return
        }
        setSites(result.sites)
        setUi((prev) => ({ ...prev, modalOpen: false }))
        showToast('Location Saved', `${name} was saved to the server.`)
      } catch (err) {
        showToast('Save Failed', err instanceof Error ? err.message : 'Unknown error.', 'error')
      }
    })()
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    stitchClickHandler(e)
    const target = e.target as HTMLElement

    const focusEl = target.closest<HTMLElement>('[data-focus]')
    focusRef.current = focusEl
      ? { key: focusEl.getAttribute('data-focus') ?? '', start: null, end: null }
      : null

    const actionEl = target.closest<HTMLElement>('[data-action]')
    if (!actionEl) return
    const action = actionEl.getAttribute('data-action')
    const code = actionEl.getAttribute('data-code') ?? ''

    switch (action) {
      case 'bulk-sync':
        runBulkSync()
        break
      case 'add-site':
        openAddModal()
        break
      case 'view-site':
        openSiteModal(code, 'view')
        break
      case 'edit-site':
        openSiteModal(code, 'edit')
        break
      case 'toggle-site':
        toggleSiteStatus(code)
        break
      case 'modal-close':
        setUi((prev) => ({ ...prev, modalOpen: false }))
        break
      case 'save-site':
        saveModal()
        break
      case 'radius-preset': {
        const raw = actionEl.getAttribute('data-radius')
        if (raw !== null) {
          const value = Number(raw)
          if (Number.isFinite(value)) {
            radiusRef.current = value
            applyRadiusDom(e.currentTarget, value)
          }
        }
        break
      }
      case 'page-prev':
      case 'page-next':
      case 'page-1':
      case 'page-2': {
        const pageCount = pageCountOf(filterSites(sites, ui))
        const current = Math.min(Math.max(1, ui.page), pageCount)
        const targetPage =
          action === 'page-prev'
            ? current - 1
            : action === 'page-next'
              ? current + 1
              : action === 'page-1'
                ? 1
                : 2
        const page = Math.min(Math.max(1, targetPage), pageCount)
        setUi((prev) => ({ ...prev, page }))
        break
      }
      case 'tab-live':
        setUi((prev) => ({ ...prev, stateTab: 'live' }))
        break
      case 'tab-empty':
        setUi((prev) => ({ ...prev, stateTab: 'empty' }))
        break
      case 'view-table':
        setUi((prev) => ({ ...prev, view: 'table' }))
        break
      case 'view-split':
        setUi((prev) => ({ ...prev, view: 'split' }))
        break
      case 'clear-search':
        setUi((prev) => ({ ...prev, search: '', page: 1 }))
        break
      case 'reset-filters':
        resetFilters()
        break
      default:
        break
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>): void => {
    const target = e.target
    if (!(target instanceof HTMLInputElement)) return

    const key = target.getAttribute('data-focus')
    const isTextInput = target.type === 'text'
    focusRef.current = key
      ? {
          key,
          start: isTextInput ? target.selectionStart : null,
          end: isTextInput ? target.selectionEnd : null
        }
      : null

    switch (target.id) {
      case 'radiusRange': {
        // Drag updates: imperative only (no state change -> no DOM rebuild,
        // so the pointer capture of the slider survives).
        const value = Number(target.value)
        if (Number.isFinite(value)) {
          radiusRef.current = value
          applyRadiusDom(e.currentTarget, value)
        }
        return
      }
      case 'searchInput':
        setUi((prev) => ({ ...prev, search: target.value, page: 1 }))
        return
      case 'inputLocName':
        setUi((prev) => ({ ...prev, form: { ...prev.form, name: target.value } }))
        return
      case 'inputAddress':
        setUi((prev) => ({ ...prev, form: { ...prev.form, address: target.value } }))
        return
      case 'inputLat':
        setUi((prev) => ({ ...prev, form: { ...prev.form, lat: target.value } }))
        return
      case 'inputLng':
        setUi((prev) => ({ ...prev, form: { ...prev.form, lng: target.value } }))
        return
      default:
        return
    }
  }

  const handleChange = (e: React.FormEvent<HTMLDivElement>): void => {
    const target = e.target
    if (target instanceof HTMLSelectElement) {
      const key = target.getAttribute('data-focus')
      focusRef.current = key ? { key, start: null, end: null } : null
      if (target.id === 'statusFilter') {
        setUi((prev) => ({ ...prev, statusFilter: target.value, page: 1 }))
      } else if (target.id === 'radiusFilter') {
        setUi((prev) => ({ ...prev, radiusFilter: target.value, page: 1 }))
      }
      return
    }
    if (target instanceof HTMLInputElement && target.id === 'activeToggleCheckbox') {
      setUi((prev) => ({ ...prev, form: { ...prev.form, active: target.checked } }))
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
    const target = e.target
    const key = target instanceof Element ? target.getAttribute('data-focus') : null
    focusRef.current = key ? { key, start: null, end: null } : null
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    // The asset's `onsubmit="event.preventDefault()"` is stripped by
    // prepareStitchHtml; without this guard, pressing Enter inside the modal
    // form would trigger a native form submission and reload the app.
    if (e.key !== 'Enter') return
    const target = e.target
    if (target instanceof HTMLInputElement && target.closest('#locationForm')) {
      e.preventDefault()
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto p-6 stitch-view bg-background font-body-md text-body-md text-on-surface antialiased"
      onClick={handleClick}
      onInput={handleInput}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  )
}

export default LocationView
