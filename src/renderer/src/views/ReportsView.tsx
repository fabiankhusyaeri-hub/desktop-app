import React, { useEffect, useMemo, useRef, useState } from 'react'
import htmlRaw from '../assets/reports_attendance_analytics_workforce_performance/code.html?raw'
import { extractBodyInner, prepareStitchHtml, stitchClickHandler } from './stitchUtils'
import {
  fetchReportData,
  rangeLabelFor,
  filterLogBase,
  applyLogTab,
  countLogTabs,
  uniqueDepartments,
  createEmptyReportData,
  REPORT_RANGES,
  type ReportData,
  type LogRow,
  type DailyBreak,
  type DeptRank,
  type ReportRange,
  type LogTab,
  type LogFilters
} from '../services/reportService'
import { downloadCsv, downloadXls, type ExportRow } from '../services/exportService'

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 5

const PRESET_LABELS: Record<ReportRange, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  'q3-2024': 'Q3 2024'
}

const TAB_LABELS: Record<LogTab, string> = {
  all: 'All Records',
  flagged: 'Flagged Overtime',
  geofence: 'Geofence Mismatch'
}

/* Class strings below are copied verbatim from the asset markup so the
   active/inactive state swap never introduces a new visual style. */
const PRESET_ACTIVE_CLS =
  'px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md shadow-sm'
const PRESET_IDLE_CLS =
  'px-3 py-1.5 rounded-lg text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors'
const TAB_ACTIVE_CLS =
  'px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm transition-all'
const TAB_IDLE_CLS =
  'px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all'

const PAGINATION_BLOCK_RE =
  /<div class="flex items-center gap-1 self-center sm:self-auto">[\s\S]*?<button class="p-2 rounded-lg bg-surface-container text-outline hover:text-on-surface transition-colors" type="button">\s*<span class="material-symbols-outlined text-base leading-none">chevron_right<\/span>\s*<\/button>\s*<\/div>/

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Fill every token occurrence (split/join, no ES2021 dependency). */
const fill = (text: string, tokens: Array<[string, string]>): string => {
  let out = text
  for (const [needle, value] of tokens) out = out.split(needle).join(value)
  return out
}

const fmtDelta = (delta: number): string => (delta >= 0 ? `+${delta}` : `${delta}`)

const escapeAttr = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

/**
 * Insert attributes into the opening tag that precedes a unique text marker.
 * Used to attach `data-action` handlers without rewriting any class.
 */
const addAttrsBeforeTag = (
  html: string,
  tagName: string,
  marker: string,
  attrs: string
): string => {
  const at = html.indexOf(marker)
  if (at === -1) return html
  const open = html.lastIndexOf(`<${tagName}`, at)
  if (open === -1) return html
  const end = html.indexOf('>', open)
  if (end === -1) return html
  return html.slice(0, end) + attrs + html.slice(end)
}

const isReportRange = (value: string | undefined): value is ReportRange =>
  value === 'today' || value === 'week' || value === 'month' || value === 'q3-2024'

const isLogTab = (value: string | undefined): value is LogTab =>
  value === 'all' || value === 'flagged' || value === 'geofence'

/* ------------------------------------------------------------------ */
/* Trend chart geometry (viewBox 700x220, y: 180 → 30 equals 0 → 100%) */
/* ------------------------------------------------------------------ */

const CHART_X = [0, 233.3, 466.7, 700]
const yFor = (pctValue: number): string => (180 - Math.max(0, Math.min(100, pctValue)) * 1.5).toFixed(1)

const linePath = (values: number[]): string =>
  values
    .map((value, i) => `${i === 0 ? 'M' : 'L'}${CHART_X[i]},${yFor(value)}`)
    .join(' ')

const areaPath = (values: number[]): string => `${linePath(values)} L700,180 L0,180 Z`

/* ------------------------------------------------------------------ */
/* Attendance log status pills (classes copied from the asset rows).   */
/* ------------------------------------------------------------------ */

interface StatusStyle {
  pillCls: string
  dotCls: string
  label: string
  icon: string
  iconCls: string
  hrsCls: string
  inDot: string
}

const STATUS_STYLES: Record<LogRow['status'], StatusStyle> = {
  present: {
    pillCls: 'bg-inverse-surface text-tertiary-fixed font-label-sm text-label-sm font-bold',
    dotCls: 'bg-tertiary-fixed animate-pulse',
    label: 'Present',
    icon: 'verified',
    iconCls: 'text-secondary-container',
    hrsCls: 'font-semibold text-primary',
    inDot: 'bg-tertiary-fixed-dim'
  },
  late: {
    pillCls: 'bg-surface-container-high text-on-secondary-container font-label-sm text-label-sm font-semibold',
    dotCls: 'bg-secondary-container',
    label: 'Late',
    icon: 'verified',
    iconCls: 'text-secondary-container',
    hrsCls: 'font-semibold text-secondary',
    inDot: 'bg-secondary-container'
  },
  leave: {
    pillCls: 'bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm',
    dotCls: 'bg-outline',
    label: 'Approved Leave',
    icon: 'verified',
    iconCls: 'text-outline',
    hrsCls: 'text-outline',
    inDot: 'bg-outline'
  },
  mismatch: {
    pillCls: 'bg-error-container text-on-error-container font-label-sm text-label-sm font-bold',
    dotCls: 'bg-error',
    label: 'Geofence Drift',
    icon: 'warning',
    iconCls: '',
    hrsCls: 'text-error',
    inDot: 'bg-error'
  }
}

const statusPill = (style: StatusStyle): string =>
  `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${style.pillCls}">\n` +
  `<span class="w-1.5 h-1.5 rounded-full ${style.dotCls}"></span>\n${style.label}\n</span>`

/* ------------------------------------------------------------------ */
/* Row templates derived at module load from the pre-cut asset HTML.   */
/* ------------------------------------------------------------------ */

const deriveLogTemplate = (): string => {
  const base = prepareStitchHtml(extractBodyInner(htmlRaw))
  const tbodyStart = base.indexOf('<tbody class="divide-y-0')
  const tbodyEnd = base.indexOf('</tbody>', tbodyStart)
  if (tbodyStart === -1 || tbodyEnd === -1) return ''
  const firstRow = base.slice(tbodyStart, tbodyEnd).match(/<tr[\s\S]*?<\/tr>/g)?.[0] ?? ''

  return firstRow
    .replace(/<img alt="Marcus Vance"[^>]*>/, '__AVATAR__')
    .replace('Marcus Vance', '__NAME__')
    .replace('m.vance@vanguardops.io', '__EMAIL__')
    .replace('>EMP-8821</td>', '>__EID__</td>')
    .replace('>Field Logistics</span>', '>__DEPT__</span>')
    .replace('>Oct 28, 2024</span>', '>__DATE__</span>')
    .replace('Shift Alpha (08:00)', '__SHIFT__')
    .replace(/font-numeric-mono text-label-sm font-semibold text-on-surface">08:02 AM</,
      'font-numeric-mono text-label-sm font-semibold text-on-surface">__CHECKIN__<')
    .replace('>17:05 PM</span>', '>__CHECKOUT__</span>')
    .replace(/bg-tertiary-fixed-dim/, '__CI_DOT__')
    .replace(/font-numeric-mono text-label-sm font-semibold text-primary">\s*8h 48m\s*</,
      'font-numeric-mono text-label-sm __HRS_CLS__"> __HRS__ <')
    .replace(
      /<span class="inline-flex items-center gap-1\.5 px-2\.5 py-0\.5 rounded-full bg-inverse-surface[^>]*>[\s\S]*?<\/span>(?=\s*<\/td>)/,
      '__STATUS__'
    )
    .replace('<span class="material-symbols-outlined text-sm text-secondary-container">verified</span>', '__LOC_ICON__')
    .replace('<span class="truncate">HQ Main Lobby • GPS Verified</span>', '<span class="truncate">__SITE__</span>')
    .replace('title="Telemetry Log" type="button"', 'title="Telemetry Log" data-action="row-radar" data-idx="__IDX__" type="button"')
    .replace('title="Audit Slip" type="button"', 'title="Audit Slip" data-action="row-audit" data-idx="__IDX__" type="button"')
}

const LOG_TEMPLATE = deriveLogTemplate()

const avatarBlock = (row: LogRow): string => {
  if (row.avatar) {
    return `<img alt="${row.name}" class="w-9 h-9 rounded-full object-cover shrink-0" src="${row.avatar}">`
  }
  return `<div class="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm shrink-0">${row.initials}</div>`
}

const buildLogRow = (row: LogRow, index: number): string => {
  const style = STATUS_STYLES[row.status]
  return fill(LOG_TEMPLATE, [
    ['__AVATAR__', avatarBlock(row)],
    ['__NAME__', row.name],
    ['__EMAIL__', row.email],
    ['__EID__', row.empId],
    ['__DEPT__', row.department],
    ['__DATE__', row.dateLabel],
    ['__SHIFT__', row.shiftLabel],
    ['__CHECKIN__', row.checkInLabel],
    ['__CHECKOUT__', row.checkOutLabel],
    ['__HRS__', row.hoursLabel],
    ['__HRS_CLS__', style.hrsCls],
    ['__CI_DOT__', style.inDot],
    ['__STATUS__', statusPill(style)],
    ['__LOC_ICON__', `<span class="material-symbols-outlined text-sm ${style.iconCls || 'text-error'}">${style.icon}</span>`],
    ['__SITE__', row.siteLabel],
    ['__IDX__', String(index)]
  ])
}

const EMPTY_LOG_ROW =
  `<tr><td colspan="10" class="py-10 px-4 text-center font-body-sm text-body-sm text-on-surface-variant">` +
  `No attendance records logged yet. Check-ins will appear here with GPS verification stamps.` +
  `</td></tr>`

/* ------------------------------------------------------------------ */
/* Daily bars & department ranking generation                          */
/* ------------------------------------------------------------------ */

const buildDailyRow = (day: DailyBreak): string => {
  const total = day.onTime + day.late + day.absent
  const base = Math.max(total, 1)
  const w1 = Math.round((day.onTime / base) * 100)
  const w2 = Math.round((day.late / base) * 100)
  const w3 = Math.max(0, 100 - w1 - w2)
  return (
    `<div class="flex items-center gap-3">\n` +
    `<span class="w-10 font-label-md text-label-md text-on-surface font-semibold shrink-0">${day.day}</span>\n` +
    `<div class="flex-1 h-7 rounded-lg bg-surface-container-low overflow-hidden flex">\n` +
    `<div class="h-full bg-primary flex items-center justify-start pl-2 text-on-primary font-numeric-mono text-label-sm font-bold" style="width: ${w1}%;">${day.onTime > 0 ? `${day.onTime} On-Time` : ''}</div>\n` +
    `<div class="h-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-numeric-mono text-label-sm font-bold" style="width: ${w2}%;">${day.late || ''}</div>\n` +
    `<div class="h-full bg-error flex items-center justify-center text-on-error font-numeric-mono text-label-sm" style="width: ${w3}%;">${day.absent || ''}</div>\n` +
    `</div>\n` +
    `<span class="w-12 text-right font-numeric-mono text-label-sm font-bold text-on-surface">${total > 0 ? `${Math.round((day.onTime / base) * 100)}%` : '—'}</span>\n` +
    `</div>`
  )
}

const NO_DATA_NOTE =
  `<div class="py-6 text-center font-body-sm text-body-sm text-on-surface-variant">` +
  `No attendance data yet — analytics will populate as check-ins arrive.` +
  `</div>`

const rankColor = (pctValue: number): { txt: string; bar: string } =>
  pctValue >= 95
    ? { txt: 'text-primary', bar: 'bg-primary' }
    : pctValue >= 92
    ? { txt: 'text-secondary', bar: 'bg-secondary-container' }
    : { txt: 'text-error', bar: 'bg-error' }

const buildDeptRow = (dept: DeptRank, index: number): string => {
  const color = rankColor(dept.pct)
  return (
    `<div>\n` +
    `<div class="flex items-center justify-between mb-1.5">\n` +
    `<span class="font-label-md text-label-md text-on-surface font-semibold">${index + 1}. ${dept.name}</span>\n` +
    `<span class="font-numeric-mono text-label-sm font-bold ${color.txt}">${dept.pct.toFixed(1)}%</span>\n` +
    `</div>\n` +
    `<div class="w-full h-2 rounded-full bg-surface-container-low overflow-hidden">\n` +
    `<div class="h-full ${color.bar} rounded-full transition-all duration-500" style="width: ${dept.pct}%;"></div>\n` +
    `</div>\n` +
    `</div>`
  )
}

/* ------------------------------------------------------------------ */
/* Toolbar / tab state injection                                       */
/* ------------------------------------------------------------------ */

/** Move the active pill between the four range presets. */
const applyPresetState = (html: string, active: ReportRange): string => {
  let out = html
  for (const key of REPORT_RANGES) {
    const label = PRESET_LABELS[key]
    const pattern = new RegExp(`<button class="[^"]*" type="button">${label}</button>`)
    const cls = key === active ? PRESET_ACTIVE_CLS : PRESET_IDLE_CLS
    out = out.replace(
      pattern,
      `<button class="${cls}" data-action="range" data-range="${key}" type="button">${label}</button>`
    )
  }
  return out
}

/** Rebuild the three status tabs: active pill, live counts and data attrs. */
const applyTabState = (html: string, active: LogTab, counts: Record<LogTab, number>): string => {
  let out = html
  for (const key of Object.keys(TAB_LABELS) as LogTab[]) {
    const pattern = new RegExp(`<button class="[^"]*" id="btn-tab-${key}" type="button">[^<]*</button>`)
    const cls = key === active ? TAB_ACTIVE_CLS : TAB_IDLE_CLS
    out = out.replace(
      pattern,
      `<button class="${cls}" id="btn-tab-${key}" data-action="tab" data-tab="${key}" type="button">` +
        `${TAB_LABELS[key]} (${counts[key]})</button>`
    )
  }
  return out
}

/** Page number chips: `1 2 3 … 26`, current page highlighted. */
const pageChips = (page: number, total: number): string => {
  const wanted = [1, 2, 3, page - 1, page, page + 1, total].filter(
    (value, index, all) => value >= 1 && value <= total && all.indexOf(value) === index
  )
  const nums = wanted.sort((a, b) => a - b)
  const chips: string[] = []
  let prev = 0
  for (const num of nums) {
    if (num - prev > 1) {
      chips.push(`<span class="px-1 text-outline font-numeric-mono">...</span>`)
    }
    const cls =
      num === page
        ? 'w-8 h-8 rounded-lg bg-primary text-on-primary font-numeric-mono text-label-sm font-bold shadow-sm'
        : 'w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface font-numeric-mono text-label-sm transition-colors'
    chips.push(`<button class="${cls}" data-action="page" data-page="${num}" type="button">${num}</button>`)
    prev = num
  }
  return chips.join('\n')
}

const buildPagination = (page: number, total: number): string => {
  const navCls = 'p-2 rounded-lg bg-surface-container text-outline hover:text-on-surface disabled:opacity-40 transition-colors'
  const nextCls = 'p-2 rounded-lg bg-surface-container text-outline hover:text-on-surface transition-colors'
  return (
    `<div class="flex items-center gap-1 self-center sm:self-auto">\n` +
    `<button class="${navCls}" data-action="page-prev"${page <= 1 ? ' disabled=""' : ''} type="button">\n` +
    `<span class="material-symbols-outlined text-base leading-none">chevron_left</span>\n</button>\n` +
    pageChips(page, total) +
    `\n<button class="${nextCls}" data-action="page-next" type="button">\n` +
    `<span class="material-symbols-outlined text-base leading-none">chevron_right</span>\n</button>\n</div>`
  )
}

/** Columns written by the CSV / XLS audit exports. */
const toExportRows = (rows: LogRow[]): ExportRow[] =>
  rows.map((row) => ({
    Name: row.name,
    Email: row.email,
    'Employee ID': row.empId,
    Department: row.department,
    Date: row.dateLabel,
    Shift: row.shiftLabel,
    'Check-In': row.checkInLabel,
    'Check-Out': row.checkOutLabel,
    'Working Hours': row.hoursLabel,
    Status: STATUS_STYLES[row.status].label,
    Location: row.siteLabel
  }))

/* ------------------------------------------------------------------ */
/* Whole-page builder                                                  */
/* ------------------------------------------------------------------ */

interface ReportsUi {
  range: ReportRange
  deptLabel: string
  tab: LogTab
  search: string
  page: number
  totalPages: number
  filteredCount: number
  tabCounts: Record<LogTab, number>
  pageRows: LogRow[]
  /** True when a status tab has no matching rows → show the asset empty state. */
  showEmptyState: boolean
}

const reportsHtml = (baseInner: string, data: ReportData, ui: ReportsUi): string => {
  if (!baseInner) return ''
  let html = baseInner

  /* --- Toolbar: preset pills, range label, calendar & department --- */
  html = applyPresetState(html, ui.range)
  html = html.replace('Oct 1 \u2013 Oct 28, 2024', rangeLabelFor(ui.range))
  html = addAttrsBeforeTag(html, 'button', '>calendar_today</span>', ' data-action="range-cycle"')
  html = html.replace('All Departments (5)', ui.deptLabel)
  html = addAttrsBeforeTag(html, 'button', '>corporate_fare</span>', ' data-action="dept-cycle"')

  /* --- Export suite --- */
  html = addAttrsBeforeTag(html, 'button', '>picture_as_pdf</span>', ' data-action="print"')
  html = addAttrsBeforeTag(html, 'button', '>table_view</span>', ' data-action="csv"')
  html = addAttrsBeforeTag(html, 'button', '>Export XLSX Audit</span>', ' data-action="xlsx"')

  /* --- KPI 1: attendance rate --- */
  html = html.replace(
    'stroke-dasharray="94.6, 100"',
    `stroke-dasharray="${data.ratePct}, 100"`
  )
  html = html.replace('>94.6%</span>', `>${data.ratePct}%</span>`)
  if (data.rateDelta >= 0) {
    html = html.replace('arrow_upward</span> +2.1%', `arrow_upward</span> ${fmtDelta(data.rateDelta)}%`)
  } else {
    html = html.replace('arrow_upward</span> +2.1%', `arrow_downward</span> ${fmtDelta(data.rateDelta)}%`)
  }

  /* --- KPI 2: present employees avg --- */
  html = html.replace(
    '<span class="font-numeric-metric text-numeric-metric text-on-surface">121<span',
    `<span class="font-numeric-metric text-numeric-metric text-on-surface">${Math.round(data.presentAvg)}<span`
  )
  html = html.replace('>/128</span>', `>/${data.rostered}</span>`)
  html = html.replace('>94.5% Cap</span>', `>${data.capPct}% Cap</span>`)
  html = html.replace('Active today: 124 checked in', `Active today: ${data.activeToday} checked in`)
  if (data.avatarChips.length > 0) {
    let chipIndex = 0
    html = html.replace(/<img alt="User \d"[^>]*>/g, () => {
      const chip = data.avatarChips[chipIndex]
      chipIndex += 1
      if (!chip) return ''
      return `<img alt="${chip.name}" class="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest object-cover" src="${chip.avatar}">`
    })
  } else {
    html = html.replace(/<img alt="User \d"[^>]*>/g, '')
  }

  /* --- KPI 3: late rate --- */
  html = html.replace('>4.8%</span>', `>${data.latePct}%</span>`)
  if (data.lateDelta >= 0) {
    html = html.replace('arrow_downward</span> -1.4%', `arrow_upward</span> ${fmtDelta(data.lateDelta)}%`)
  } else {
    html = html.replace('arrow_downward</span> -1.4%', `arrow_downward</span> ${fmtDelta(data.lateDelta)}%`)
  }
  html = html.replace('Flagged incidents: 6', `Flagged incidents: ${data.flagged}`)

  /* --- KPI 4: working hours --- */
  const hoursLabel =
    data.avgMinutes != null
      ? `${Math.floor(data.avgMinutes / 60)}h ${String(data.avgMinutes % 60).padStart(2, '0')}m`
      : '—'
  html = html.replace('>8h 14m</span>', `>${hoursLabel}</span>`)
  html = html.replace('Overtime logged: 34h total', `Overtime logged: ${data.overtimeHours}h total`)
  html = html.replace(/>\s*102\.8%\s*</, `> ${data.hoursPct}% <`)

  /* --- Trend chart module (fixed four-week window, per its caption) --- */
  html = html.replace('during October', 'during the last 4 weeks')
  const presentSeries = data.weeks.map((week) => week.ratePct)
  const lateSeries = data.weeks.map((week) => week.latePct)
  /* Approved-leave share is a flat level across the window. */
  const leaveSeries = presentSeries.map(() => data.donut.leavePct)
  const emptySeries = presentSeries.map(() => 0)
  const useSeries = data.hasData ? presentSeries : emptySeries
  const useLate = data.hasData ? lateSeries : emptySeries
  const useLeave = data.hasData ? leaveSeries : emptySeries

  html = html.replace(
    /d="M0,75[\s\S]*?"/,
    `d="${useSeries.length > 1 ? areaPath(useSeries) : ''}"`
  )
  html = html.replace(
    /d="M0,75[\s\S]*?" fill="none" stroke="#152de4"/,
    `d="${useSeries.length > 1 ? linePath(useSeries) : ''}" fill="none" stroke="#152de4"`
  )
  html = html.replace(
    /d="M0,150[\s\S]*?"/,
    `d="${data.hasData ? areaPath(useLate) : ''}"`
  )
  html = html.replace(
    /d="M0,150[\s\S]*?" fill="none" stroke="#3ca9ff"/,
    `d="${data.hasData ? linePath(useLate) : ''}" fill="none" stroke="#3ca9ff"`
  )
  html = html.replace(
    /d="M0,172[\s\S]*?"/,
    `d="${data.hasData ? linePath(useLeave) : ''}"`
  )

  /* Week axis labels — always derived from real dates, never the asset dummy. */
  const axisLabels = ['Week 1 (Oct 1 - Oct 7)', 'Week 2 (Oct 8 - Oct 14)', 'Week 3 (Oct 15 - Oct 21)', 'Week 4 (Oct 22 - Oct 28)']
  axisLabels.forEach((label, i) => {
    const replacement = data.weeks[i]?.axisLabel ?? label
    html = html.replace(`>${label}<`, `>${replacement}<`)
  })

  /* Data point circles + floating badge: only when there is data */
  const newest = data.weeks[data.weeks.length - 1]
  if (data.hasData && newest) {
    const y = 180 - Math.min(100, Math.max(0, newest.ratePct)) * 1.5
    html = html.replace('<circle cx="460" cy="40"', `<circle cx="690" cy="${y}"`)
    html = html.replace('<circle cx="460" cy="158"', `<circle cx="690" cy="${y + 18}"`)
    html = html.replace('left-[64%] top-[14%]', `left-[88%] top-[${Math.round((y / 220) * 100)}%]`)
    html = html.replace('>Oct 21 (Wk 4)<', `>${newest.label}<`)
    html = html.replace(/124 Present • 96\.8%/, `${newest.present} Present • ${newest.ratePct}%`)
  } else {
    html = html.replace('<circle cx="460" cy="40"', '<circle cx="-40" cy="-40"')
    html = html.replace('<circle cx="460" cy="158"', '<circle cx="-40" cy="-40"')
    html = html.replace('left-[64%] top-[14%]', 'left-[-999px]')
    /* The badge is off-screen, but never leave a fabricated date visible. */
    html = html.replace('>Oct 21 (Wk 4)<', '>—<')
    html = html.replace(/124 Present • 96\.8%/, '—')
  }

  /* --- Donut module --- */
  const C = 282.74
  const br = data.donut
  const brTotal = br.presentPct + br.latePct + br.absentPct + br.leavePct
  const seg = (value: number): number => (brTotal > 0 ? (value / brTotal) * C : 0)
  const s1 = seg(br.presentPct)
  const s2 = seg(br.latePct)
  const s3 = seg(br.absentPct)
  const s4 = seg(br.leavePct)
  const num = (value: number): string => value.toFixed(2)
  html = html.replace('stroke-dasharray="229.58 282.74" stroke-dashoffset="0"', `stroke-dasharray="${num(s1)} ${C}" stroke-dashoffset="0"`)
  html = html.replace('stroke-dasharray="26.57 282.74" stroke-dashoffset="-229.58"', `stroke-dasharray="${num(s2)} ${C}" stroke-dashoffset="${num(-s1)}"`)
  html = html.replace('stroke-dasharray="14.70 282.74" stroke-dashoffset="-256.15"', `stroke-dasharray="${num(s3)} ${C}" stroke-dashoffset="${num(-(s1 + s2))}"`)
  html = html.replace('stroke-dasharray="11.87 282.74" stroke-dashoffset="-270.85"', `stroke-dasharray="${num(s4)} ${C}" stroke-dashoffset="${num(-(s1 + s2 + s3))}"`)
  html = html.replace('leading-none">128</span>', `leading-none">${br.total}</span>`)
  html = html.replace('>81.2%</span>', `>${br.presentPct}%</span>`)
  html = html.replace('>9.4%</span>', `>${br.latePct}%</span>`)
  html = html.replace('>5.2%</span>', `>${br.absentPct}%</span>`)
  html = html.replace('>4.2%</span>', `>${br.leavePct}%</span>`)

  /* --- Daily breakdown module --- */
  html = html.replace('Weekly Avg: 93.8%', data.hasData ? `Weekly Avg: ${data.weeklyAvgPct}%` : 'Weekly Avg: —%')
  {
    const barsStart = html.indexOf('<div class="flex flex-col gap-3 py-3">')
    const barsEnd = barsStart === -1 ? -1 : html.indexOf('<div class="flex items-center justify-end gap-4 pt-2', barsStart)
    if (barsStart !== -1 && barsEnd !== -1) {
      const generated = data.hasData && data.daily.length > 0
        ? data.daily.map(buildDailyRow).join('\n')
        : NO_DATA_NOTE
      html = html.slice(0, barsStart) + generated + html.slice(barsEnd)
    }
  }

  /* --- Department ranking module --- */
  {
    const rankStart = html.indexOf('<div class="flex flex-col gap-3 py-2">')
    const rankEnd = rankStart === -1 ? -1 : html.indexOf('<div class="pt-2 flex items-center justify-between text-outline', rankStart)
    if (rankStart !== -1 && rankEnd !== -1) {
      const generated = data.hasData && data.depts.length > 0
        ? data.depts.map(buildDeptRow).join('\n')
        : NO_DATA_NOTE
      html = html.slice(0, rankStart) + generated + html.slice(rankEnd)
    }
  }
  html = html.replace(
    'Top Performer: Field Logistics (+3.4% YoY)',
    data.depts.length > 0 ? `Top Performer: ${data.depts[0].name}` : 'Top Performer: —'
  )
  html = addAttrsBeforeTag(html, 'button', 'View Escalations', ' data-action="escalations"')

  /* --- Attendance log: search box, tabs, rows, empty state, pagination --- */
  html = addAttrsBeforeTag(
    html,
    'input',
    'placeholder="Filter by employee, ID, or zone..."',
    ` data-focus="logsearch" value="${escapeAttr(ui.search)}"`
  )
  html = applyTabState(html, ui.tab, ui.tabCounts)
  {
    const tbodyStart = html.indexOf('<tbody class="divide-y-0')
    const tbodyOpenEnd = html.indexOf('>', tbodyStart)
    const tbodyEnd = html.indexOf('</tbody>', tbodyStart)
    if (tbodyStart !== -1 && tbodyOpenEnd !== -1 && tbodyEnd !== -1) {
      const rows =
        ui.pageRows.length > 0
          ? ui.pageRows
              .map((row, i) => buildLogRow(row, (ui.page - 1) * PAGE_SIZE + i))
              .join('\n')
          : EMPTY_LOG_ROW
      html = html.slice(0, tbodyOpenEnd + 1) + rows + html.slice(tbodyEnd)
    }
  }

  if (ui.showEmptyState) {
    html = html.replace(
      '<div class="w-full overflow-x-auto" id="table-view">',
      '<div class="hidden w-full overflow-x-auto" id="table-view">'
    )
    html = html.replace(
      '<div class="hidden flex-col items-center justify-center py-16 text-center" id="empty-state-view">',
      '<div class="flex flex-col items-center justify-center py-16 text-center" id="empty-state-view">'
    )
  }
  html = addAttrsBeforeTag(html, 'button', 'Reset Telemetry Filters', ' data-action="reset-filters"')

  /* Log table pagination footer */
  const from = ui.filteredCount === 0 ? 0 : (ui.page - 1) * PAGE_SIZE + 1
  const to = Math.min(ui.page * PAGE_SIZE, ui.filteredCount)
  html = html.replace(
    'Showing <strong class="text-on-surface">1 - 5</strong> of <strong class="text-on-surface">128</strong> total logs',
    `Showing <strong class="text-on-surface">${from} - ${to}</strong> of <strong class="text-on-surface">${ui.filteredCount}</strong> total logs`
  )
  html = html.replace(
    PAGINATION_BLOCK_RE,
    ui.totalPages > 1 ? buildPagination(ui.page, ui.totalPages) : ''
  )

  return html
}

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

interface ToastState {
  icon: string
  message: string
}

const ReportsView: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null)
  const [range, setRange] = useState<ReportRange>('month')
  const [filters, setFilters] = useState<LogFilters>({ tab: 'all', dept: '', search: '' })
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<ToastState | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  /** `data-focus` key of the input that was being typed into, restored after rebuild. */
  const focusRef = useRef<string | null>(null)
  const [scrollTick, setScrollTick] = useState(0)
  const scrolledTick = useRef(0)
  const toastTimer = useRef<number | null>(null)

  const baseInner = useMemo(() => prepareStitchHtml(extractBodyInner(htmlRaw)), [])

  /* --- Derived log-table state --- */
  const rows = data?.logRows ?? []
  const deptOptions = useMemo(() => uniqueDepartments(rows), [rows])
  const baseRows = useMemo(() => filterLogBase(rows, filters), [rows, filters.dept, filters.search])
  const tabCounts = useMemo(() => countLogTabs(baseRows), [baseRows])
  const filteredRows = useMemo(() => applyLogTab(baseRows, filters.tab), [baseRows, filters.tab])
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const pageClamped = Math.min(page, totalPages)
  const pageRows = useMemo(
    () => filteredRows.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE),
    [filteredRows, pageClamped]
  )
  const showEmptyState = filters.tab !== 'all' && filteredRows.length === 0
  const deptLabel =
    filters.dept === ''
      ? `All Departments (${deptOptions.length})`
      : `${filters.dept} (${rows.filter((row) => row.department === filters.dept).length})`

  const inner = useMemo(
    () =>
      reportsHtml(baseInner, data ?? createEmptyReportData(), {
        range,
        deptLabel,
        tab: filters.tab,
        search: filters.search,
        page: pageClamped,
        totalPages,
        filteredCount: filteredRows.length,
        tabCounts,
        pageRows,
        showEmptyState
      }),
    [
      baseInner,
      data,
      range,
      deptLabel,
      filters,
      pageClamped,
      totalPages,
      filteredRows,
      tabCounts,
      pageRows,
      showEmptyState
    ]
  )

  /* --- Data loading --- */
  useEffect(() => {
    let subscribed = true
    void fetchReportData(range).then((report) => {
      if (subscribed) setData(report)
    })
    return () => {
      subscribed = false
    }
  }, [range])

  /* A department that leaves the window (range change) falls back to "All". */
  useEffect(() => {
    if (filters.dept && !deptOptions.includes(filters.dept)) {
      setFilters((current) => ({ ...current, dept: '' }))
      setPage(1)
    }
  }, [deptOptions, filters.dept])

  /* --- Search input focus survives the full innerHTML rebuild --- */
  useEffect(() => {
    const key = focusRef.current
    if (!key) return
    const el = wrapperRef.current?.querySelector<HTMLInputElement>(`[data-focus="${key}"]`)
    if (!el || document.activeElement === el) return
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [inner])

  /* --- Deferred scroll after "View Escalations" --- */
  useEffect(() => {
    if (scrollTick === scrolledTick.current) return
    scrolledTick.current = scrollTick
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const table = wrapper.querySelector<HTMLElement>('#table-view')
    const empty = wrapper.querySelector<HTMLElement>('#empty-state-view')
    const target = table && !table.classList.contains('hidden') ? table : empty
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [inner, scrollTick])

  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    },
    []
  )

  const showToast = (icon: string, message: string): void => {
    setToast({ icon, message })
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 4000)
  }

  const handleAction = (el: HTMLElement): void => {
    const action = el.dataset.action
    switch (action) {
      case 'range': {
        const key = el.dataset.range
        if (isReportRange(key)) {
          setRange(key)
          setPage(1)
        }
        break
      }
      case 'range-cycle': {
        const index = REPORT_RANGES.indexOf(range)
        const next = REPORT_RANGES[(index + 1) % REPORT_RANGES.length]
        setRange(next)
        setPage(1)
        showToast('calendar_today', `Date range preset: ${PRESET_LABELS[next]}`)
        break
      }
      case 'dept-cycle': {
        const options = ['', ...deptOptions]
        const index = options.indexOf(filters.dept)
        const next = options[(index + 1) % options.length]
        setFilters((current) => ({ ...current, dept: next }))
        setPage(1)
        showToast(
          'corporate_fare',
          next === ''
            ? `Department filter cleared — showing all ${deptOptions.length} department(s)`
            : `Department filter: ${next}`
        )
        break
      }
      case 'print':
        window.print()
        break
      case 'csv': {
        const filename = downloadCsv('geoattend-attendance-log', toExportRows(filteredRows))
        showToast('table_view', `Exported ${filteredRows.length} record(s) → ${filename}`)
        break
      }
      case 'xlsx': {
        const filename = downloadXls('geoattend-attendance-audit', toExportRows(filteredRows))
        showToast('download', `Audit workbook exported → ${filename}`)
        break
      }
      case 'escalations':
        setFilters((current) => ({ ...current, tab: 'flagged' }))
        setPage(1)
        setScrollTick((current) => current + 1)
        break
      case 'tab': {
        const key = el.dataset.tab
        if (isLogTab(key)) {
          setFilters((current) => ({ ...current, tab: key }))
          setPage(1)
        }
        break
      }
      case 'reset-filters':
        setFilters({ tab: 'all', dept: '', search: '' })
        setPage(1)
        showToast('filter_alt_off', 'Telemetry filters reset')
        break
      case 'page': {
        const target = Number(el.dataset.page)
        if (Number.isInteger(target) && target >= 1 && target <= totalPages) setPage(target)
        break
      }
      case 'page-prev':
        setPage((current) => Math.max(1, current - 1))
        break
      case 'page-next':
        setPage((current) => Math.min(totalPages, current + 1))
        break
      case 'row-radar':
      case 'row-audit': {
        const row = filteredRows[Number(el.dataset.idx)]
        if (!row) break
        setFilters((current) => ({ ...current, search: row.empId }))
        setPage(1)
        /* Keep the caret in the search box once the DOM is rebuilt. */
        focusRef.current = 'logsearch'
        if (action === 'row-radar') {
          showToast(
            'radar',
            `${row.name} (${row.empId}) — in ${row.checkInLabel}, out ${row.checkOutLabel}, ` +
              `${STATUS_STYLES[row.status].label}`
          )
        } else {
          showToast(
            'description',
            `${row.dateLabel} — ${row.department}, ${row.hoursLabel}, ${row.siteLabel}`
          )
        }
        break
      }
      default:
        break
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement
    /* Leaving the search box means the next rebuild should not steal focus back. */
    if (!(target instanceof HTMLInputElement)) focusRef.current = null
    const actionEl = target.closest<HTMLElement>('[data-action]')
    if (actionEl && wrapperRef.current?.contains(actionEl)) handleAction(actionEl)
    stitchClickHandler(e)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLInputElement | null
    if (!target || target.getAttribute('data-focus') !== 'logsearch') return
    focusRef.current = 'logsearch'
    const value = target.value
    setPage(1)
    setFilters((current) => (current.search === value ? current : { ...current, search: value }))
  }

  return (
    <>
      {toast && (
        <div className="toast-notice">
          <span className="material-symbols-outlined icon-md" style={{ color: 'var(--color-tertiary-fixed)' }}>
            {toast.icon}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
      <div
        ref={wrapperRef}
        className="w-full h-full overflow-y-auto p-6 stitch-view bg-background font-body-md text-body-md text-on-surface antialiased"
        onClick={handleClick}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    </>
  )
}

export default ReportsView
