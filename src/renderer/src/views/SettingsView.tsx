import React, { useEffect, useMemo } from 'react'
import htmlRaw from '../assets/settings_enterprise_configuration_security_1/code.html?raw'

const extractMainInner = (html: string): string => {
  const start = html.indexOf('<main')
  const end = html.indexOf('</main>')
  if (start === -1 || end === -1) return html
  const openEnd = html.indexOf('>', start)
  return html.slice(openEnd + 1, end)
}

const extractHeadStyles = (html: string): string => {
  const start = html.indexOf('<head>')
  const end = html.indexOf('</head>')
  if (start === -1 || end === -1) return ''
  return html.slice(start + 6, end)
}

const SettingsView: React.FC = () => {
  const inner = useMemo(() => extractMainInner(htmlRaw), [])
  const headStyles = useMemo(() => extractHeadStyles(htmlRaw), [])

  useEffect(() => {
    const container = document.createElement('div')
    container.innerHTML = headStyles
    const nodes: Node[] = []
    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'LINK' || node.nodeName === 'STYLE') {
        const clone = node.cloneNode(true) as HTMLElement
        document.head.appendChild(clone)
        nodes.push(clone)
      }
    })
    return () => {
      nodes.forEach((n) => n.parentNode?.removeChild(n))
    }
  }, [headStyles])

  return <div dangerouslySetInnerHTML={{ __html: inner }} />
}

export default SettingsView