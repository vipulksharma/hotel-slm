// Script to import hotels into UCP business store
// Usage: node scripts/import-hotels.js

import { importHotels } from '../lib/ucp/import_hotels.js'

console.log('🚀 UCP Business Server - Hotel Import')
console.log('=====================================\n')

try {
  const result = importHotels()
  console.log('\n✨ Hotels successfully imported to UCP business store!')
  process.exit(0)
} catch (error) {
  console.error('\n❌ Error importing hotels:', error)
  process.exit(1)
}
