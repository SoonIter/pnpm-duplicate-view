import type { PackageNode } from '@pnpm/reviewing.dependencies-hierarchy';
import { buildDependenciesHierarchy } from '@pnpm/reviewing.dependencies-hierarchy';

const m: Record<string, Record<string, number>> = {};

function walker(x: PackageNode) {
  if (!x.dependencies) {
    return;
  }
  for (const dep of x.dependencies) {
    if (!m[dep.name]) {
      m[dep.name] = {};
    }
    if (!m[dep.name][dep.version]) {
      m[dep.name][dep.version] = 1;
    }
    else {
      m[dep.name][dep.version] += 1;
    }
    walker(dep);
  }
}

interface Options {
  devDeps: boolean
  deps: boolean
}
export async function duplicateView(pkgs: string[], options: Options) {
  const { devDeps, deps } = options ?? {};
  const x = await buildDependenciesHierarchy(pkgs, {
    depth: 50000,
    lockfileDir: process.cwd(),
  });
  if (deps) {
    pkgs.forEach(pkg => x[pkg].dependencies?.forEach(node => walker(node)));
  }
  if (devDeps) {
    pkgs.forEach(pkg =>
      x[pkg].devDependencies?.forEach(node => walker(node)),
    );
  }
  return m;
}
