import { duplicateView } from '@sooniter/pnpm-duplicate-view';

async function main() {
  const args = process.argv.slice(2);
  const pkgs = args;

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
  console.log(JSON.stringify(duplicateDeps));
}
main();
