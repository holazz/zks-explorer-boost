import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'
import {
  MAINNET_API_URL,
  MAINNET_EXPLORER_URL,
  TESTNET_API_URL,
  TESTNET_EXPLORER_URL,
} from './constant'

export default defineManifest({
  manifest_version: 3,
  name: pkg.displayName ?? pkg.name,
  version: pkg.version,
  description: pkg.description,
  homepage_url: 'https://github.com/holazz/zks-explorer-boost',
  permissions: ['webRequest'],
  host_permissions: [
    `${MAINNET_EXPLORER_URL}/address/*`,
    `${MAINNET_API_URL}/*`,
    `${TESTNET_EXPLORER_URL}/address/*`,
    `${TESTNET_API_URL}/*`,
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
      matches: [
        `${MAINNET_EXPLORER_URL}/address/*`,
        `${TESTNET_EXPLORER_URL}/address/*`,
      ],
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
