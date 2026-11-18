import React, { useEffect, useMemo, useRef } from 'react'
import htmlRaw from '../assets/settings_enterprise_configuration_security_1/code.html?raw'
import { extractBodyInner, prepareStitchHtml, stitchClickHandler } from './stitchUtils'
import { loadSettings, saveSettings, type SettingsValues } from '../services/settingsService'

/**
 * The settings page holds configuration UI, not records. Any fabricated
 * identifiers from the design mock (cluster ids, demo hash, sample email
 * chips) are neutralized here so only operator-chosen values render.
 */
const neutralize = (html: string): string =>
  html
    .replace('Enterprise Cluster A-1', 'Workspace Cluster')
    .replace('>2024.10.4-EE</span>', '>&mdash;</span>')
    .replace('ENFORCED (SYNCED)', 'ENFORCED (DEFAULT)')
    .replace(
      /e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855/,
      'Pending first telemetry sync'
    )
    .replace('value="Vanguard FieldOps Global Corporation"', '')
    .replace('across all 1,480 active field terminals', 'across all enrolled field terminals')
    .replace('Over-the-air sync initiated across 1,480 terminals.', 'Over-the-air sync initiated.')
    .replace(
      'System policies last saved today at 09:14 AM by <strong>sarah.jenkins</strong>',
      'System policies not saved yet in this workspace'
    )
    /* Remove the demo briefing-recipient chips by their literal addresses. */
    .replace(/<span class="inline-flex items-center gap-1 px-2\.5 py-1 rounded-md[^>]*>\s*sarah\.jenkins@vanguard\.io[\s\S]*?<\/span>/g, '')
    .replace(/<span class="inline-flex items-center gap-1 px-2\.5 py-1 rounded-md[^>]*>\s*ops-leads@vanguard\.io[\s\S]*?<\/span>/g, '')
    .replace(/<span class="inline-flex items-center gap-1 px-2\.5 py-1 rounded-md[^>]*>\s*compliance-audit@vanguard\.io[\s\S]*?<\/span>/g, '')

/** Escape operator text before it re-enters the stitched markup. */
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/* ------------------------------------------------------------------ */
/* Control tagging — data-* attributes only, never visual markup.      */
/* ------------------------------------------------------------------ */

/**
 * Append `attrs` after the first literal `needle`. When the needle ends
 * with `>` the attribute is inserted before it, so it stays inside the tag.
 */
const tagOnce = (html: string, needle: string, attrs: string): string => {
  if (!html.includes(needle)) return html
  const replacement = needle.endsWith('>') ? `${needle.slice(0, -1)}${attrs}>` : `${needle}${attrs}`
  return html.replace(needle, replacement)
}

/** Append `attrs` after every literal `needle` occurrence. */
const tagAll = (html: string, needle: string, attrs: string): string =>
  html.split(needle).join(`${needle}${attrs}`)

/**
 * Append `attrs[i]` after the i-th occurrence of `needle`. Returns the
 * input unchanged when the occurrence count does not match the keys, so
 * a reworked asset can never silently mis-tag a control.
 */
const tagOccurrences = (html: string, needle: string, attrs: string[]): string => {
  const parts = html.split(needle)
  if (parts.length - 1 !== attrs.length) return html
  let out = ''
  for (let i = 0; i < parts.length; i += 1) {
    out += parts[i]
    if (i < parts.length - 1) out += `${needle}${attrs[i]}`
  }
  return out
}

/**
 * Adds the identifiers the Settings page relies on:
 * - `data-setting` on every persisted field (form value collection)
 * - `data-action` on every wired button (click delegation)
 * - `data-role-name` / `data-recipient` on list rows and chips
 * - `data-live` on text nodes updated by actions
 */
const tagControls = (html: string): string => {
  let out = html

  /* Persisted form fields (document order for the grouped controls). */
  out = tagOccurrences(out, '<select', [
    ' data-setting="timezone"',
    ' data-setting="dateFormat"',
    ' data-setting="language"',
    ' data-setting="autoClockout"',
    ' data-setting="sessionTimeout"'
  ])
  out = tagOccurrences(out, '<input checked="" class="sr-only peer" type="checkbox"', [
    ' data-setting="overtimePreAuth"',
    ' data-setting="antiSpoofing"',
    ' data-setting="clockInAlerts"',
    ' data-setting="breachSms"'
  ])
  out = tagOnce(out, 'id="org-name"', ' data-setting="orgName"')
  out = tagOnce(out, 'id="shift-start"', ' data-setting="shiftStart"')
  out = tagOnce(out, 'type="time" value="17:00"', ' data-setting="shiftEnd"')
  out = tagOnce(out, 'id="grace-period"', ' data-setting="gracePeriod"')
  out = tagOnce(out, 'id="gps-accuracy-slider"', ' data-setting="gpsAccuracy"')
  out = tagOnce(out, 'id="geofence-radius"', ' data-setting="geofenceRadius"')

  /* Composite collections: logo image, RBAC table body, recipient chips. */
  out = tagOnce(out, '<img class="w-full h-full object-cover"', ' data-setting="logo"')
  out = tagOnce(
    out,
    '<tbody class="divide-y divide-surface-container/50 font-body-md text-body-md text-on-surface">',
    ' data-setting="roles"'
  )
  out = tagOnce(
    out,
    '<div class="flex flex-wrap gap-2 p-2 rounded-lg bg-surface-container-lowest shadow-sm items-center">',
    ' data-setting="recipients"'
  )

  /* Role names are the value of each RBAC row. */
  out = tagAll(
    out,
    '<span class="font-label-md text-label-md font-semibold text-on-surface"',
    ' data-role-name=""'
  )

  /* Wired buttons. "Configure Keys" is intentionally not tagged — the
     asset ships no key panel, so there is no honest surface to open. */
  out = tagOnce(
    out,
    'class="absolute inset-0 bg-inverse-surface/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-on-primary transition-opacity gap-1"',
    ' data-action="upload-logo"'
  )
  out = tagOnce(
    out,
    'class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-colors"',
    ' data-action="upload-logo"'
  )
  out = tagOnce(
    out,
    'class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"',
    ' data-action="restore-logo"'
  )
  out = tagOnce(
    out,
    'class="h-11 px-4 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"',
    ' data-action="recalculate"'
  )
  out = tagOnce(
    out,
    'class="px-3.5 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1.5"',
    ' data-action="create-role"'
  )
  out = tagAll(out, 'title="Edit Permissions"', ' data-action="edit-role"')
  out = tagAll(out, '<button class="hover:text-error text-outline"', ' data-action="remove-recipient"')
  out = tagOnce(out, 'id="save-btn"', ' data-action="save"')
  out = tagOnce(
    out,
    'class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"',
    ' data-action="reset-defaults"'
  )
  out = tagOnce(
    out,
    'class="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors"',
    ' data-action="cancel"'
  )

  /* Recipient chips carry their address so add/remove round-trips. */
  out = out.replace(
    /<span class="inline-flex items-center gap-1 px-2\.5 py-1 rounded-md bg-surface-container text-on-surface font-numeric-mono text-label-sm">([\s\S]*?)</g,
    (_match, body: string) => {
      const email = body.trim()
      if (!email) return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-numeric-mono text-label-sm">${body}<`
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-numeric-mono text-label-sm" data-recipient="${escapeHtml(email)}">${body}<`
    }
  )

  /* Live text nodes rewritten by actions. */
  out = tagOnce(out, '<span class="font-numeric-mono font-semibold text-on-surface">', ' data-live="coverage"')
  out = tagOnce(
    out,
    'class="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline"',
    ' data-live="save-status"'
  )

  return out
}

/* ------------------------------------------------------------------ */
/* Templates derived at module load from the tagged asset HTML.        */
/* ------------------------------------------------------------------ */

const PREPARED = prepareStitchHtml(extractBodyInner(htmlRaw))
const TAGGED = tagControls(PREPARED)

const CHIP_TEMPLATE = ((): string => {
  const match = TAGGED.match(
    /<span class="inline-flex items-center gap-1 px-2\.5 py-1 rounded-md bg-surface-container text-on-surface font-numeric-mono text-label-sm"[\s\S]*?<\/button>\s*<\/span>/
  )
  if (!match) return ''
  const email = match[0].match(/data-recipient="([^"]+)"/)?.[1]
  if (!email) return ''
  return match[0].split(email).join('__EMAIL__')
})()

const ROLE_TEMPLATE = ((): string => {
  const tbodyStart = TAGGED.indexOf('<tbody')
  const tbodyEnd = TAGGED.indexOf('</tbody>', tbodyStart)
  if (tbodyStart === -1 || tbodyEnd === -1) return ''
  const row = TAGGED.slice(tbodyStart, tbodyEnd).match(/<tr[\s\S]*?<\/tr>/)?.[0] ?? ''
  if (!row) return ''
  return row
    .replace('>Super Administrator<', '>__ROLE_NAME__<')
    .replace('Root authority, system-wide overrides', 'Custom operator-defined role')
    .replace('>4 active<', '>0 active<')
    .replace('Full Control &amp; Overwrite', 'Custom Scope')
    .replace('Unrestricted Export + Cryptographic Audit', 'Operator-defined policy')
})()

const INNER = neutralize(TAGGED)

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const MAX_LOGO_BYTES = 500 * 1024
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SQ_KM_TO_ACRES = 247.105
const DEFAULT_TOAST_TITLE = 'Configuration Published'
const DEFAULT_TOAST_MESSAGE = 'Over-the-air sync initiated.'

const formatClock = (date: Date): string =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

let toastTimer: ReturnType<typeof setTimeout> | null = null

/** Mirror the asset's triggerSaveNotification() with an honest message. */
const showToast = (root: HTMLElement, title: string, message: string): void => {
  const toast = root.querySelector<HTMLElement>('#save-toast')
  if (!toast) return
  const titleEl = toast.querySelector<HTMLElement>('.font-label-md')
  const messageEl = toast.querySelector<HTMLElement>('.font-body-sm')
  if (titleEl) titleEl.textContent = title
  if (messageEl) messageEl.textContent = message
  toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none')
  toast.classList.add('translate-y-0', 'opacity-100')
  if (toastTimer !== null) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none')
    toast.classList.remove('translate-y-0', 'opacity-100')
    toastTimer = null
  }, 3800)
}

/* ---------------------------- collection --------------------------- */

const collectRoleNames = (tbody: HTMLElement): string[] =>
  Array.from(tbody.querySelectorAll('tr'))
    .map((row) => row.querySelector('[data-role-name]')?.textContent?.trim() ?? '')
    .filter((name) => name.length > 0)

const collectRecipients = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll('[data-recipient]'))
    .map((chip) => chip.getAttribute('data-recipient') ?? '')
    .filter((email) => email.length > 0)

/** Read every `data-setting` control straight from the live DOM. */
const collectSettings = (root: HTMLElement, defaultLogo: string): SettingsValues => {
  const values: SettingsValues = {}
  root.querySelectorAll<HTMLElement>('[data-setting]').forEach((el) => {
    const key = el.getAttribute('data-setting')
    if (!key) return
    if (el instanceof HTMLInputElement) {
      values[key] = el.type === 'checkbox' ? el.checked : el.value
    } else if (el instanceof HTMLSelectElement) {
      values[key] = el.value
    } else if (el instanceof HTMLTableSectionElement) {
      values[key] = JSON.stringify(collectRoleNames(el))
    } else if (el instanceof HTMLDivElement) {
      values[key] = JSON.stringify(collectRecipients(el))
    } else if (el instanceof HTMLImageElement) {
      const src = el.getAttribute('src') ?? ''
      // The untouched asset logo is stored as an empty string.
      values[key] = src === defaultLogo ? '' : src
    }
  })
  return values
}

const parseStringList = (value: string | boolean): string[] => {
  if (typeof value !== 'string') return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

/* ------------------------------ apply ------------------------------ */

const applyRoleNames = (tbody: HTMLElement, names: string[]): void => {
  if (names.length === 0 || !ROLE_TEMPLATE) return
  let rows = Array.from(tbody.querySelectorAll('tr'))
  while (rows.length > names.length) {
    const last = rows[rows.length - 1]
    if (!last) break
    last.remove()
    rows = rows.slice(0, -1)
  }
  while (rows.length < names.length) {
    const html = ROLE_TEMPLATE.split('__ROLE_NAME__').join(escapeHtml(names[rows.length] ?? ''))
    tbody.insertAdjacentHTML('beforeend', html)
    const next = Array.from(tbody.querySelectorAll('tr'))
    if (next.length <= rows.length) break
    rows = next
  }
  rows.forEach((row, index) => {
    const name = names[index]
    if (name === undefined) return
    const span = row.querySelector('[data-role-name]')
    if (span) span.textContent = name
  })
}

const applyRecipients = (container: HTMLElement, emails: string[]): void => {
  container.querySelectorAll('[data-recipient]').forEach((chip) => chip.remove())
  const input = container.querySelector('#exec-emails')
  if (!input || !CHIP_TEMPLATE) return
  emails.forEach((email) => {
    input.insertAdjacentHTML('beforebegin', CHIP_TEMPLATE.split('__EMAIL__').join(escapeHtml(email)))
  })
}

/** Push a settings snapshot back into the stitched DOM. */
const applySettings = (root: HTMLElement, values: SettingsValues, defaultLogo: string): void => {
  root.querySelectorAll<HTMLElement>('[data-setting]').forEach((el) => {
    const key = el.getAttribute('data-setting')
    if (!key) return
    const value = values[key]
    if (value === undefined) return
    if (el instanceof HTMLInputElement) {
      if (el.type === 'checkbox') el.checked = value === true || value === 'true'
      else el.value = String(value)
    } else if (el instanceof HTMLSelectElement) {
      const next = String(value)
      const matched = Array.from(el.options).some((option) => option.value === next)
      if (matched) el.value = next
    } else if (el instanceof HTMLTableSectionElement) {
      applyRoleNames(el, parseStringList(value))
    } else if (el instanceof HTMLDivElement) {
      applyRecipients(el, parseStringList(value))
    } else if (el instanceof HTMLImageElement) {
      const src = typeof value === 'string' && value.length > 0 ? value : defaultLogo
      if (src) el.setAttribute('src', src)
    }
  })
}

/* ----------------------------- actions ----------------------------- */

/** Recompute the geofence coverage readout and the accuracy badge. */
const recalculateCoverage = (root: HTMLElement): void => {
  const slider = root.querySelector<HTMLInputElement>('#gps-accuracy-slider')
  const accuracy = root.querySelector<HTMLElement>('#accuracy-val')
  if (slider && accuracy) accuracy.textContent = `${slider.value}m`

  const radiusInput = root.querySelector<HTMLInputElement>('#geofence-radius')
  const coverage = root.querySelector<HTMLElement>('[data-live="coverage"]')
  const radius = Number(radiusInput?.value)
  if (!radiusInput || !coverage || !Number.isFinite(radius) || radius <= 0) {
    showToast(root, 'Recalculate', 'Enter a geofence radius greater than zero.')
    return
  }
  const areaSqKm = (Math.PI * radius * radius) / 1_000_000
  const areaLabel = areaSqKm.toFixed(3)
  const acres = (Number(areaLabel) * SQ_KM_TO_ACRES).toFixed(1)
  coverage.textContent = `~${areaLabel} km² (~${acres} acres)`
}

/** Ephemeral file picker: images only, capped for localStorage. */
const openLogoPicker = (root: HTMLElement): void => {
  const picker = document.createElement('input')
  picker.type = 'file'
  picker.accept = 'image/*'
  picker.style.display = 'none'
  picker.addEventListener('change', () => {
    const file = picker.files && picker.files[0]
    picker.remove()
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast(root, 'Upload rejected', 'Only image files can be used as the logo.')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      showToast(
        root,
        'Upload rejected',
        `The file is ${Math.round(file.size / 1024)} KB; the limit is 500 KB.`
      )
      return
    }
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const logo = root.querySelector<HTMLImageElement>('[data-setting="logo"]')
      if (logo && typeof reader.result === 'string') logo.setAttribute('src', reader.result)
    })
    reader.addEventListener('error', () => {
      showToast(root, 'Upload rejected', 'The selected file could not be read.')
    })
    reader.readAsDataURL(file)
  })
  document.body.appendChild(picker)
  picker.click()
}

const createCustomRole = (root: HTMLElement): void => {
  const entered = window.prompt('Role name for the new custom role')
  if (entered === null) return
  const name = entered.trim()
  if (!name) {
    showToast(root, 'Role not created', 'Enter a name for the role.')
    return
  }
  const tbody = root.querySelector('tbody')
  if (!tbody || !ROLE_TEMPLATE) return
  tbody.insertAdjacentHTML('beforeend', ROLE_TEMPLATE.split('__ROLE_NAME__').join(escapeHtml(name)))
}

const editRoleName = (actionEl: HTMLElement): void => {
  const row = actionEl.closest('tr')
  const span = row?.querySelector('[data-role-name]')
  if (!span) return
  const current = span.textContent?.trim() ?? ''
  const entered = window.prompt('Role name', current)
  if (entered === null) return
  const name = entered.trim()
  if (!name || name === current) return
  span.textContent = name
}

const saveConfiguration = (
  root: HTMLElement,
  defaultLogo: string,
  toastDefaults: { title: string; message: string }
): void => {
  const values = collectSettings(root, defaultLogo)
  if (!saveSettings(values)) {
    showToast(root, 'Save failed', 'The browser rejected the settings write; nothing was stored.')
    return
  }
  const status = root.querySelector<HTMLElement>('[data-live="save-status"]')
  if (status) status.textContent = `System policies saved at ${formatClock(new Date())}`
  showToast(root, toastDefaults.title, toastDefaults.message)
}

/* ------------------------------------------------------------------ */
/* View                                                                */
/* ------------------------------------------------------------------ */

const SettingsView: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const defaultsRef = useRef<SettingsValues | null>(null)
  const defaultLogoRef = useRef('')
  const toastDefaultsRef = useRef({ title: DEFAULT_TOAST_TITLE, message: DEFAULT_TOAST_MESSAGE })
  const inner = useMemo(() => INNER, [])

  useEffect(() => {
    const root = wrapperRef.current
    if (!root) return
    // StrictMode re-runs the effect; capture the pristine DOM only once.
    if (defaultsRef.current) return
    const logo = root.querySelector<HTMLImageElement>('[data-setting="logo"]')
    defaultLogoRef.current = logo?.getAttribute('src') ?? ''
    const toast = root.querySelector<HTMLElement>('#save-toast')
    toastDefaultsRef.current = {
      title: toast?.querySelector('.font-label-md')?.textContent ?? DEFAULT_TOAST_TITLE,
      message: toast?.querySelector('.font-body-sm')?.textContent ?? DEFAULT_TOAST_MESSAGE
    }
    defaultsRef.current = collectSettings(root, defaultLogoRef.current)
    const stored = loadSettings()
    if (stored) applySettings(root, stored, defaultLogoRef.current)
  }, [])

  const runAction = (root: HTMLElement, action: string, actionEl: HTMLElement): void => {
    switch (action) {
      case 'upload-logo':
        openLogoPicker(root)
        break
      case 'restore-logo': {
        const logo = root.querySelector<HTMLImageElement>('[data-setting="logo"]')
        if (logo && defaultLogoRef.current) logo.setAttribute('src', defaultLogoRef.current)
        break
      }
      case 'recalculate':
        recalculateCoverage(root)
        break
      case 'create-role':
        createCustomRole(root)
        break
      case 'edit-role':
        editRoleName(actionEl)
        break
      case 'remove-recipient': {
        const chip = actionEl.closest('[data-recipient]')
        if (chip) chip.remove()
        break
      }
      case 'reset-defaults':
        if (defaultsRef.current) applySettings(root, defaultsRef.current, defaultLogoRef.current)
        break
      case 'cancel': {
        // Last persisted snapshot, or factory defaults when never saved.
        const source = loadSettings() ?? defaultsRef.current
        if (source) applySettings(root, source, defaultLogoRef.current)
        break
      }
      case 'save':
        saveConfiguration(root, defaultLogoRef.current, toastDefaultsRef.current)
        break
      default:
        break
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const root = wrapperRef.current
    const target = e.target as HTMLElement
    const actionEl = target.closest('[data-action]') as HTMLElement | null
    if (root && actionEl) {
      const action = actionEl.getAttribute('data-action')
      if (action) runAction(root, action, actionEl)
    }
    stitchClickHandler(e)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement
    if (target.id !== 'gps-accuracy-slider') return
    const label = e.currentTarget.querySelector('#accuracy-val')
    if (label) label.textContent = `${(target as HTMLInputElement).value}m`
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== 'Enter') return
    const target = e.target as HTMLElement
    if (target.id !== 'exec-emails') return
    e.preventDefault()
    const input = target as HTMLInputElement
    const email = input.value.trim()
    if (!email) return
    const root = wrapperRef.current
    if (!root) return
    if (!EMAIL_PATTERN.test(email)) {
      showToast(root, 'Recipient not added', 'Enter a valid email address.')
      return
    }
    const container = input.parentElement
    if (!container || !CHIP_TEMPLATE) return
    const existing = collectRecipients(container)
    if (existing.includes(email)) {
      showToast(root, 'Recipient not added', 'That address is already on the list.')
      input.value = ''
      return
    }
    container.insertAdjacentHTML(
      'beforebegin',
      CHIP_TEMPLATE.split('__EMAIL__').join(escapeHtml(email))
    )
    input.value = ''
  }

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full overflow-y-auto p-6 stitch-view bg-background font-body-md text-body-md text-on-surface antialiased"
      onClick={handleClick}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  )
}

export default SettingsView
