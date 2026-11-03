// Temporary exception for GHSA-gcqx-w48m-w2h4, with no upstream fix as of
// 2026-10-30. deepmerge is used only by the build-time Rollup node resolver,
// which calls it on its own static defaults, not on user input. Continue to
// reject every other advisory, any new dependency path, or higher severity.
// Read npm audit JSON from stdin. The package script pipes it in, avoiding a
// nested process spawn that can fail with EPERM on restricted Windows shells.
const auditOutput = await new Promise((resolve, reject) => {
  let output = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { output += chunk; });
  process.stdin.on('end', () => resolve(output));
  process.stdin.on('error', reject);
});
let report;
try { report = JSON.parse(auditOutput); } catch { console.error('Invalid npm audit response:', auditOutput); process.exit(1); }
if (report.error || !report.vulnerabilities) { console.error('npm audit did not return a vulnerability report.'); process.exit(1); }
const allowed = {
  deepmerge: { via: ['https://github.com/advisories/GHSA-gcqx-w48m-w2h4'], node: 'node_modules/deepmerge' },
  '@rollup/plugin-node-resolve': { via: ['deepmerge'], node: 'node_modules/@rollup/plugin-node-resolve' },
  'workbox-build': { via: ['@rollup/plugin-node-resolve'], node: 'node_modules/workbox-build' },
  'vite-plugin-pwa': { via: ['workbox-build'], node: 'node_modules/vite-plugin-pwa' },
};
const issues = Object.entries(report.vulnerabilities);
const unexpected = issues.filter(([name, issue]) => {
  const expected = allowed[name];
  return !expected || issue.severity !== 'low' || issue.nodes.length !== 1 || issue.nodes[0] !== expected.node ||
    issue.via.length !== expected.via.length || issue.via.some(v => !expected.via.includes(typeof v === 'string' ? v : v.url));
});
if (unexpected.length || (issues.length && Date.now() >= Date.parse('2027-01-01T00:00:00Z'))) {
  console.error(auditOutput);
  console.error('Security audit failed: unexpected vulnerability or expired exception.');
  process.exit(1);
}
console.log(issues.length ? 'Only the documented build-only GHSA-gcqx-w48m-w2h4 exception remains (expires 2027-01-01).' : 'No vulnerabilities found.');
