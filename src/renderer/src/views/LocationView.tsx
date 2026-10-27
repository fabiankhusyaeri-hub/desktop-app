import React, { useEffect, useMemo, useState } from 'react'
import htmlRaw from '../assets/locations_office_geofence_management_1/code.html?raw'
import { extractBodyInner, prepareStitchHtml, stitchClickHandler } from './stitchUtils'
import {
  fetchSites,
  fetchWorkforceKpi,
  summarizeSites,
  formatTelemetryStamp,
  telemetryDetail,
  type SiteRecord,
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

const buildRow = (site: SiteRecord, maxStaff: number): string => {
  const isInactiveLike = site.status !== 'active'
  let row = isInactiveLike ? TEMPLATES.inactive : TEMPLATES.active
  if (!row) return ''
  const pct = maxStaff > 0 ? Math.max(0, Math.min(100, Math.round((site.staffCount / maxStaff) * 100))) : 0
  const stamp = formatTelemetryStamp(site.lastPingAt)

  return sub(row, [
    ['__ICON__', site.icon],
    ['__NAME__', site.name],
    ['__CODE__', site.code],
    ['__CAT__', site.category],
    ['__ADDR__', site.address],
    ['__ZONE__', site.zone],
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
}

/* ------------------------------------------------------------------ */
/* KPI text substitution over the whole page inner.                    */
/* ------------------------------------------------------------------ */

const METRIC_SPAN = '<span class="font-numeric-metric text-numeric-metric text-on-surface">'

const locationHtml = (baseInner: string, sites: SiteRecord[], workforce: WorkforceKpi): string => {
  if (!baseInner) return ''
  const stats = summarizeSites(sites)
  const pctOnline = sites.length > 0 ? Math.round((stats.active / sites.length) * 100) : 0
  let html = baseInner

  /* 1. Table rows */
  const tbodyStart = html.indexOf('<tbody')
  const tbodyOpenEnd = html.indexOf('>', tbodyStart)
  const tbodyEnd = html.indexOf('</tbody>', tbodyStart)
  if (tbodyStart !== -1 && tbodyEnd !== -1) {
    const maxStaff = sites.reduce((max, s) => Math.max(max, s.staffCount), 0)
    const tbodyInner = sites.length > 0 ? sites.map((s) => buildRow(s, maxStaff)).join('\n') : EMPTY_ROW
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

  /* 4. Table status footer */
  const displayed = Math.min(sites.length, 6)
  const rangeLabel = displayed > 0 ? `1 \u2013 ${displayed}` : '0'
  html = html.replace('>1 \u2013 6<', `>${rangeLabel}<`)
  html = html.replace('>8 locations<', `>${sites.length} locations<`)
  html = html.replace('Active Nodes: 6 / 8', `Active Nodes: ${stats.active} / ${stats.total}`)

  /* 5. Hide page 2 chip when everything fits one page */
  if (sites.length <= 6) {
    html = html.replace(
      /<button class="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container[^"]*">2<\/button>/,
      ''
    )
  }

  return html
}

const LocationView: React.FC = () => {
  const [sites, setSites] = useState<SiteRecord[]>([])
  const [workforce, setWorkforce] = useState<WorkforceKpi>(emptyWorkforceKpi)
  const baseInner = useMemo(() => prepareStitchHtml(extractBodyInner(htmlRaw)), [])
  const inner = useMemo(() => locationHtml(baseInner, sites, workforce), [baseInner, sites, workforce])

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

  return (
    <div
      className="w-full h-full overflow-y-auto p-6 stitch-view bg-background font-body-md text-body-md text-on-surface antialiased"
      onClick={stitchClickHandler}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  )
}

export default LocationView
