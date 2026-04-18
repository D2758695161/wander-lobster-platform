/**
 * CLAW-CODE Instruction File Discovery
 * Walks up the directory tree finding instruction files
 * Priority: CLAW.md > CLAW.local.md > .claw/CLAW.md > .claw/instructions.md > SOUL.md > AGENTS.md
 * Deduplicates identical content using content hashing
 * Respects size budgets: 4K chars for quick, 12K chars for normal
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface InstructionFile {
  path: string;
  content: string;
  priority: number;  // Lower = higher priority
  size: number;
  hash: string;
}

export interface DiscoveryOptions {
  maxTotalChars?: number;  // default 12000
  maxFiles?: number;       // default 5
  anchorPath?: string;     // start from here, walk up
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** File names in priority order (lower index = higher priority) */
const INSTRUCTION_FILES = [
  'CLAW.md',
  'CLAW.local.md',
  '.claw/CLAW.md',
  '.claw/instructions.md',
  'SOUL.md',
  'AGENTS.md',
  'MEMORY.md',
  'IDENTITY.md',
] as const;

// ─── Discovery ───────────────────────────────────────────────────────────────

export class InstructionDiscoverer {
  /**
   * Discover instruction files from the current working directory
   */
  async discover(options?: DiscoveryOptions): Promise<InstructionFile[]> {
    return this.findFrom(process.cwd(), options);
  }

  /**
   * Find instruction files starting from anchorPath, walking up the directory tree.
   * Stops when hitting a filesystem boundary or root.
   */
  async findFrom(anchorPath: string, options?: DiscoveryOptions): Promise<InstructionFile[]> {
    const opts: Required<DiscoveryOptions> = {
      maxTotalChars: options?.maxTotalChars ?? 12000,
      maxFiles: options?.maxFiles ?? 5,
      anchorPath: options?.anchorPath ?? anchorPath,
    };

    const results: InstructionFile[] = [];
    let currentDir = path.resolve(anchorPath);

    // Walk up the directory tree
    const visited = new Set<string>();
    while (currentDir !== path.dirname(currentDir)) {
      // Prevent infinite loop on root
      if (visited.has(currentDir)) break;
      visited.add(currentDir);

      for (let i = 0; i < INSTRUCTION_FILES.length; i++) {
        const fileName = INSTRUCTION_FILES[i];
        const filePath = path.join(currentDir, fileName);

        if (fs.existsSync(filePath)) {
          try {
            const stat = fs.statSync(filePath);
            if (!stat.isFile()) continue;

            const content = fs.readFileSync(filePath, 'utf-8');
            const hash = this.hashContent(content);
            const size = Buffer.byteLength(content, 'utf-8');

            // Check if we already have a file with the same hash (dedup)
            const alreadyAdded = results.some(r => r.hash === hash);
            if (alreadyAdded) continue;

            results.push({
              path: filePath,
              content,
              priority: i,
              size,
              hash,
            });
          } catch {
            // Skip files we can't read
          }
        }
      }

      // Move to parent directory
      const parent = path.dirname(currentDir);
      if (parent === currentDir) break;
      currentDir = parent;
    }

    // Sort by priority (lower = higher priority)
    results.sort((a, b) => a.priority - b.priority);

    // Apply size budget
    const trimmed = this.applySizeBudget(results, opts.maxTotalChars);

    // Limit to maxFiles
    return trimmed.slice(0, opts.maxFiles);
  }

  /**
   * Deduplicate files that have identical content hashes.
   * Keeps the highest-priority (lowest number) entry for each unique hash.
   */
  deduplicateByHash(files: InstructionFile[]): InstructionFile[] {
    const byHash = new Map<string, InstructionFile>();

    for (const file of files) {
      const existing = byHash.get(file.hash);
      if (!existing || file.priority < existing.priority) {
        byHash.set(file.hash, file);
      }
    }

    return Array.from(byHash.values()).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Build a markdown prompt section from discovered instruction files.
   * Includes file paths as comments and respects size budgets.
   */
  buildPromptSection(files: InstructionFile[]): string {
    if (!files.length) return '';

    const sections: string[] = [
      '<!-- === CLAW INSTRUCTION FILES === -->',
      '',
    ];

    let totalChars = 0;
    const maxChars = 12000;

    for (const file of files) {
      // Check if adding this file would exceed budget
      if (totalChars + file.size > maxChars) {
        // Try to fit a truncated version
        const remaining = maxChars - totalChars;
        if (remaining > 200) {
          sections.push(`<!-- ${file.path} (truncated) -->`);
          sections.push(file.content.slice(0, remaining));
          sections.push(`<!-- ... truncated from ${file.path} -->`);
        }
        break;
      }

      sections.push(`<!-- From: ${file.path} (${file.size} bytes) -->`);
      sections.push(file.content);
      sections.push('');
      totalChars += file.size + file.path.length + 50;
    }

    sections.push('<!-- === END INSTRUCTION FILES === -->');
    return sections.join('\n');
  }

  /**
   * Build a "quick" prompt section (4K budget) for fast context injection.
   */
  buildQuickSection(files: InstructionFile[]): string {
    if (!files.length) return '';

    const sections: string[] = ['<!-- QUICK INJECT -->'];
    let totalChars = 0;
    const maxChars = 4000;

    // Only take the highest-priority file
    if (files.length > 0) {
      const top = files[0];
      const content = top.content.slice(0, maxChars - top.path.length - 30);
      sections.push(`<!-- ${top.path} -->`);
      sections.push(content);
    }

    return sections.join('\n');
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private hashContent(content: string): string {
    return crypto.createHash('sha256').update(content, 'utf-8').digest('hex').slice(0, 16);
  }

  private applySizeBudget(files: InstructionFile[], maxTotalChars: number): InstructionFile[] {
    const result: InstructionFile[] = [];
    let totalChars = 0;

    for (const file of files) {
      if (totalChars + file.size > maxTotalChars) {
        const remaining = maxTotalChars - totalChars;
        if (remaining > 100 && result.length > 0) {
          // Truncate the last file to fit
          const truncated: InstructionFile = {
            ...file,
            content: file.content.slice(0, remaining),
            size: remaining,
          };
          result.push(truncated);
        }
        break;
      }
      result.push(file);
      totalChars += file.size;
    }

    return result;
  }
}

// ─── Factory & Convenience ────────────────────────────────────────────────────

export const instructionDiscoverer = new InstructionDiscoverer();

/**
 * Quick discovery helper — finds instruction files from a given path.
 */
export async function discoverInstructions(
  anchorPath?: string,
  options?: DiscoveryOptions
): Promise<InstructionFile[]> {
  const discoverer = new InstructionDiscoverer();
  return discoverer.findFrom(anchorPath ?? process.cwd(), options);
}

/**
 * Quick build helper — get a ready-to-inject prompt section.
 */
export function buildInstructionPrompt(
  anchorPath?: string,
  options?: DiscoveryOptions
): Promise<string> {
  return discoverInstructions(anchorPath, options).then(files => {
    const discoverer = new InstructionDiscoverer();
    return discoverer.buildPromptSection(files);
  });
}
