import React, { useMemo } from 'react'
import htmlRaw from '../assets/settings_enterprise_configuration_security_1/code.html?raw'
import { extractBodyInner, prepareStitchHtml, stitchClickHandler } from './stitchUtils'

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

const SettingsView: React.FC = () => {
  const inner = useMemo(() => neutralize(prepareStitchHtml(extractBodyInner(htmlRaw))), [])
  return (
    <div
      className="w-full h-full overflow-y-auto p-6 stitch-view bg-background font-body-md text-body-md text-on-surface antialiased"
      onClick={stitchClickHandler}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  )
}

export default SettingsView
