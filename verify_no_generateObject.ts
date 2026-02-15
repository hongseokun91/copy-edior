
import * as fs from 'fs';
import * as path from 'path';

const FORBIDDEN = [
    'generateObject',
    'streamObject',
    'experimental_generateObject'
];

const SEARCH_DIR = path.join(process.cwd(), 'src');

function scan(dir: string) {
    const files = fs.readdirSync(dir);
    let failures = 0;

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            failures += scan(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            // Check for direct calls or imports from 'ai'
            // We allow provider.ts to have it inside safeGenerateObject for local/mock but we prefer 0 in src basically
            if (file === 'provider.ts') return;

            FORBIDDEN.forEach(term => {
                if (content.includes(term)) {
                    console.error(`[FAIL] Forbidden term "${term}" found in ${fullPath}`);
                    failures++;
                }
            });
        }
    });

    return failures;
}

console.log(`[Gate] Starting verify_no_generateObject scan...`);
const totalFailures = scan(SEARCH_DIR);

if (totalFailures > 0) {
    console.error(`[Gate] FAILED: ${totalFailures} violations found.`);
    process.exit(1);
} else {
    console.log(`[Gate] PASS: No forbidden object-generation calls found in src/ folder.`);
    process.exit(0);
}
