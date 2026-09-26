import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/components/MembershipPricing.jsx', import.meta.url), 'utf8')
const checkout = await readFile(new URL('../src/pages/Settings/PaymentCheckoutPage.jsx', import.meta.url), 'utf8')

for (const file of [source, checkout]) {
  assert.match(file, /const validPrice = \(value\)/)
  assert.match(file, /Number\.isFinite\(price\) && price > 0/)
}
assert.match(source, /liveAnnualPrice \|\| \(liveMonthlyPrice \? liveMonthlyPrice \* 10 : plan\.annualPrice\)/)
assert.match(source, /liveMonthlyPrice \|\| plan\.monthlyPrice/)
assert.match(checkout, /annualPrice \|\| \(monthlyPrice \? monthlyPrice \* 10 : 0\)/)

const validPrice = (value) => {
  const price = Number(value)
  return Number.isFinite(price) && price > 0 ? price : null
}
const renderAnnual = ({ liveMonthly, liveAnnual, fallbackAnnual }) => (
  validPrice(liveAnnual) || (validPrice(liveMonthly) ? validPrice(liveMonthly) * 10 : fallbackAnnual)
)
const renderMonthly = ({ liveMonthly, fallbackMonthly }) => validPrice(liveMonthly) || fallbackMonthly

assert.equal(renderAnnual({ liveMonthly: 275, liveAnnual: 2750, fallbackAnnual: 2750 }), 2750)
assert.equal(renderAnnual({ liveMonthly: 275, liveAnnual: 0, fallbackAnnual: 2750 }), 2750)
assert.equal(renderAnnual({ liveMonthly: undefined, liveAnnual: 0, fallbackAnnual: 2750 }), 2750)
assert.equal(renderMonthly({ liveMonthly: 0, fallbackMonthly: 275 }), 275)

console.log('Pricing display smoke tests passed: incomplete live plan values cannot render as $0.')
