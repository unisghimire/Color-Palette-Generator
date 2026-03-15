/**
 * Export current palette in different formats for developers.
 */

export function formatAsCssVariables(hexList: string[], prefix = 'color'): string {
  return hexList
    .map((hex, i) => `  --${prefix}-${i + 1}: ${hex};`)
    .join('\n')
}

export function formatAsJson(hexList: string[]): string {
  return JSON.stringify(hexList, null, 2)
}

export function formatAsHexList(hexList: string[]): string {
  return hexList.join(', ')
}

export function formatAsScssVariables(hexList: string[], prefix = 'color'): string {
  return hexList
    .map((hex, i) => `$${prefix}-${i + 1}: ${hex};`)
    .join('\n')
}
