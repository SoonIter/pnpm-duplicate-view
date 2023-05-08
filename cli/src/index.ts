import { duplicateView } from '@sooniter/pnpm-duplicate-view';
import { cyan } from 'picocolors';

async function main() {
  const args = process.argv.slice(2);
  const pkgs = args.filter(i => !i.startsWith('-'));

  const m = await duplicateView(pkgs);

  const duplicateDeps: [string, string[]][] = Object.entries(m)
    .map(([depName, depObj]) => {
      const versions = Object.keys(depObj);
      if (versions.length > 1) {
        return [depName, versions] as [string, string[]];
      }
      else {
        return null as unknown as [string, string[]];
      }
    })
    .filter(Boolean);
  if (args.includes('--json')) {
    console.log(JSON.stringify(duplicateDeps));
    return;
  }
  duplicateDeps.forEach(([name, versions]) => {
    console.log(cyan(name));
    console.log(versions.map(i => `  ${i}`).join('\n'));
  });
}
main();
