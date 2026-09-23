// Packages the built app (out/) into a portable folder: release/Wordlit-win32-x64/Wordlit.exe
// No installer, like Verci: copy the folder anywhere and run Wordlit.exe.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { packager } from '@electron/packager'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

if (!existsSync(join(root, 'out', 'main', 'index.js'))) {
  console.error('out/ is missing: run "npm run build" first')
  process.exit(1)
}

const [appDir] = await packager({
  dir: root,
  out: join(root, 'release'),
  name: 'Wordlit',
  executableName: 'Wordlit',
  appVersion: pkg.version,
  platform: 'win32',
  arch: 'x64',
  asar: true,
  prune: true,
  overwrite: true,
  icon: join(root, 'resources', 'icon.ico'),
  // PowerShell cannot read files inside an asar archive, so the bridge ships beside it.
  extraResource: ['smtc-bridge.ps1', 'tray.ico', 'icon.ico'].map((f) => join(root, 'resources', f)),
  ignore: [
    // Every library is bundled into out/ by electron-vite, so nothing from node_modules ships.
    /^\/node_modules(\/|$)/,
    /^\/(src|tests|tests-live|scripts|docs|snapshots|release|resources|\.remember|\.git|\.claude)(\/|$)/,
    /^\/(electron\.vite|vitest|vitest\.live)\.config\.ts$/,
    /^\/tsconfig[^/]*\.json$/,
    /^\/\.gitignore$/
  ],
  appCopyright: 'Wordlit',
  win32metadata: {
    CompanyName: 'Wordlit',
    FileDescription: 'Wordlit',
    ProductName: 'Wordlit',
    InternalName: 'Wordlit',
    OriginalFilename: 'Wordlit.exe'
  }
})
console.log(`packaged: ${appDir}`)

// A zip of the folder is handy for moving it to another PC.
const zip = join(root, 'release', `Wordlit-${pkg.version}-win-x64.zip`)
rmSync(zip, { force: true })
const result = spawnSync(
  'powershell.exe',
  ['-NoProfile', '-NonInteractive', '-Command', `Compress-Archive -Path '${appDir}\\*' -DestinationPath '${zip}' -Force`],
  { stdio: 'inherit' }
)
if (result.status === 0) console.log(`zipped: ${zip}`)
else console.warn('zip step failed (the folder above is still complete)')
