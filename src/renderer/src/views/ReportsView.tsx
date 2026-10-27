import React, { useEffect, useMemo, useState } from 'react'
import htmlRaw from '../assets/reports_attendance_analytics_workforce_performance/code.html?raw'
import { extractBodyInner, prepareStitchHtml, stitchClickHandler } from './stitchUtils'
import {
  fetchReportData,
  type ReportData,
  type LogRow,
  type DailyBreak,
  type DeptRank
} from '../services/reportService'

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
      /<span class="inline-flex items-center gap-1\.5 px-2\.5 py-0\.5 rounded-full bg-inverse-surface[^>]*>[\s\S]*?<\/span>\s*<\/span>/,
      '__STATUS__'
    )
    .replace('<span class="material-symbols-outlined text-sm text-secondary-container">verified</span>', '__LOC_ICON__')
    .replace('<span class="truncate">HQ Main Lobby • GPS Verified</span>', '<span class="truncate">__SITE__</span>')
}

const LOG_TEMPLATE = deriveLogTemplate()

const avatarBlock = (row: LogRow): string => {
  if (row.avatar) {
    return `<img alt="${row.name}" class="w-9 h-9 rounded-full object-cover shrink-0" src="${row.avatar}">`
  }
  return `<div class="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm shrink-0">${row.initials}</div>`
}

const buildLogRow = (row: LogRow): string => {
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
    ['__SITE__', row.siteLabel]
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
/* Whole-page builder                                                  */
/* ------------------------------------------------------------------ */

const reportsHtml = (baseInner: string, data: ReportData): string => {
  if (!baseInner) return ''
  let html = baseInner

  /* --- Toolbar --- */
  html = html.replace('Oct 1 \u2013 Oct 28, 2024', data.rangeLabel)
  html = html.replace('All Departments (5)', `All Departments (${data.deptCount})`)

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

  /* --- Trend chart module --- */
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

  /* Week axis labels */
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

  /* --- Attendance log table --- */
  {
    const tbodyStart = html.indexOf('<tbody class="divide-y-0')
    const tbodyOpenEnd = html.indexOf('>', tbodyStart)
    const tbodyEnd = html.indexOf('</tbody>', tbodyStart)
    if (tbodyStart !== -1 && tbodyOpenEnd !== -1 && tbodyEnd !== -1) {
      const rows = data.logRows.length > 0 ? data.logRows.map(buildLogRow).join('\n') : EMPTY_LOG_ROW
      html = html.slice(0, tbodyOpenEnd + 1) + rows + html.slice(tbodyEnd)
    }
  }
  html = html.replace('All Records (128)', `All Records (${data.logCounts.all})`)
  html = html.replace('Flagged Overtime (4)', `Flagged Overtime (${data.logCounts.late})`)
  html = html.replace('Geofence Mismatch (1)', `Geofence Mismatch (${data.logCounts.mismatch})`)

  /* Log table pagination — drop the page chips when everything is one page */
  html = html.replace(
    /Showing <strong class="text-on-surface">1 - 5<\/strong> of <strong class="text-on-surface">128<\/strong> total logs/,
    `Showing <strong class="text-on-surface">1 - ${Math.max(1, Math.min(data.logRows.length, 5))}</strong> of <strong class="text-on-surface">${data.logCounts.all}</strong> total logs`
  )
  if (data.logCounts.all <= 5) {
    html = html.replace(
      /<div class="flex items-center gap-1 self-center sm:self-auto">[\s\S]*?<button class="p-2 rounded-lg bg-surface-container text-outline hover:text-on-surface transition-colors" type="button">\s*<span class="material-symbols-outlined text-base leading-none">chevron_right<\/span>\s*<\/button>\s*<\/div>/,
      ''
    )
  }

  return html
}

const ReportsView: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null)
  const baseInner = useMemo(() => prepareStitchHtml(extractBodyInner(htmlRaw)), [])
  const inner = useMemo(
    () => reportsHtml(baseInner, data ?? emptyReportData()),
    [baseInner, data]
  )

  useEffect(() => {
    let subscribed = true
    void fetchReportData().then((report) => {
      if (subscribed) setData(report)
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

/** Safe placeholder while the first query is in flight. */
const emptyReportData = (): ReportData => ({
  hasData: false,
  rostered: 0,
  ratePct: 0,
  rateDelta: 0,
  presentAvg: 0,
  capPct: 0,
  activeToday: 0,
  latePct: 0,
  lateDelta: 0,
  flagged: 0,
  avgMinutes: null,
  hoursPct: 0,
  overtimeHours: 0,
  weeks: [
    { label: '—', axisLabel: 'Week 1', present: 0, ratePct: 0, latePct: 0 },
    { label: '—', axisLabel: 'Week 2', present: 0, ratePct: 0, latePct: 0 },
    { label: '—', axisLabel: 'Week 3', present: 0, ratePct: 0, latePct: 0 },
    { label: '—', axisLabel: 'Week 4', present: 0, ratePct: 0, latePct: 0 }
  ],
  daily: [],
  weeklyAvgPct: 0,
  depts: [],
  donut: { presentPct: 0, latePct: 0, absentPct: 0, leavePct: 0, total: 0 },
  deptCount: 0,
  rangeLabel: '—',
  logRows: [],
  logCounts: { all: 0, late: 0, mismatch: 0 },
  avatarChips: []
})

export default ReportsView
