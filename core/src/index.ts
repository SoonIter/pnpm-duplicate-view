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

export async function duplicateView(pkgs: string[]) {
  const x = await buildDependenciesHierarchy(pkgs, {
    depth: 1000,
    lockfileDir: process.cwd(),
  });
  pkgs.forEach(pkgA => x[pkgA].dependencies?.forEach(node => walker(node)));
  return m;
}
