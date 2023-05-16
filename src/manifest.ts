import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.displayName ?? pkg.name,
  version: pkg.version,
  description: pkg.description,
  homepage_url: 'https://github.com/holazz/zks-explorer-boost',
  permissions: ['webRequest'],
  host_permissions: [
    'https://explorer.zksync.io/address/*',
    'https://zksync2-mainnet-explorer.zksync.io/*',
  ],
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  action: {
    default_icon: 'src/assets/icon.png',
  },
  content_scripts: [
    {
      all_frames: false,
      matches: ['https://explorer.zksync.io/address/*'],
      js: ['src/content/index.ts'],
      run_at: 'document_end',
    },
  ],
  icons: {
    16: 'src/assets/icon.png',
    32: 'src/assets/icon.png',
    48: 'src/assets/icon.png',
    128: 'src/assets/icon.png',
  },
})
