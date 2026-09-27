import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const page = await readFile(new URL('../src/pages/PortfolioReadinessPage.jsx', import.meta.url), 'utf8')
const styles = await readFile(new URL('../src/pages/PortfolioReadinessPage.css', import.meta.url), 'utf8')

assert.match(page, /public\/portfolio-readiness\/interpretation/)
assert.match(page, /pollForManusAnalysis/)
assert.match(page, /analysisStatus/)
assert.match(page, /Preparing your deeper reflection/)
assert.match(page, /buildImmediateInsight/)
assert.match(page, /answerPattern/)
assert.match(page, /What your answers suggest/)
assert.match(page, /Answer-specific reflection/)
assert.match(page, /practical reflection based on your self-reported answers/)
assert.match(styles, /\.readiness-interpretation/)
assert.match(styles, /\.readiness-discussion-prompt/)
assert.doesNotMatch(page, /mailto:/i)
assert.doesNotMatch(page, /hello@biglittlebusiness\.com/i)

console.log('Portfolio readiness interpretation display smoke tests passed.')
