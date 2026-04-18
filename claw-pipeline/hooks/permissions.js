/**
 * CLAW-CODE Permission Escalation — OpenClaw Implementation
 * Tiered permission modes: ReadOnly < WorkspaceWrite < DangerFullAccess < Allow
 */

const PermissionMode = {
  READONLY: 'read-only',
  WORKSPACE_WRITE: 'workspace-write',
  DANGER_FULL_ACCESS: 'danger-full-access',
  ALLOW: 'allow'
};

// Permission level hierarchy
const LEVELS = {
  [PermissionMode.READONLY]: 0,
  [PermissionMode.WORKSPACE_WRITE]: 1,
  [PermissionMode.DANGER_FULL_ACCESS]: 2,
  [PermissionMode.ALLOW]: 3
};

// Dangerous commands per permission level
const DANGEROUS_PATTERNS = {
  [PermissionMode.READONLY]: [
    /\brsync\b/, /\bcurl\b/, /\bwget\b/, /\bnc\b/, /\bnetcat\b/,
    /\bssh\b/, /\bscp\b/, /\bftp\b/, /\bsftp\b/
  ],
  [PermissionMode.WORKSPACE_WRITE]: [
    /\bsudo\b/, /\bchmod\b.*777/, /\bchown\b.*root/,
    /\/dev\/sd/, /\bmkfs\b/, /\bdd\b.*of=\/dev/
  ],
  [PermissionMode.DANGER_FULL_ACCESS]: [
    /rm\s+-rf\s+\/(?!tmp|proc|sys|run)/,
    /\bmkfs\b/, /\bwipefs\b/, /\bdd\b.*of=\/dev\/sd/
  ]
};

let currentMode = PermissionMode.DANGER_FULL_ACCESS;

function getCurrentMode() {
  return currentMode;
}

function setCurrentMode(mode) {
  if (!LEVELS.hasOwnProperty(mode)) throw new Error('Unknown permission mode: ' + mode);
  currentMode = mode;
  return currentMode;
}

function getLevel(mode) {
  return LEVELS[mode] ?? -1;
}

function checkCommand(command, mode) {
  mode = mode || currentMode;
  const level = getLevel(mode);

  if (level >= LEVELS[PermissionMode.ALLOW]) {
    return { allowed: true, reason: 'Allow mode' };
  }

  // Check patterns up to and including current level
  const modesToCheck = Object.entries(LEVELS)
    .filter(([, v]) => v <= level)
    .map(([k]) => k);

  for (const m of modesToCheck) {
    const patterns = DANGEROUS_PATTERNS[m];
    if (!patterns) continue;
    for (const pattern of patterns) {
      if (pattern.test(command)) {
        return {
          allowed: false,
          reason: 'Command blocked by ' + m + ' policy',
          pattern: pattern.source
        };
      }
    }
  }

  return { allowed: true, reason: 'Command allowed' };
}

async function withEscalation(mode, operation) {
  const previousMode = currentMode;
  try {
    setCurrentMode(mode);
    return await operation();
  } finally {
    setCurrentMode(previousMode);
  }
}

module.exports = {
  PermissionMode,
  getCurrentMode,
  setCurrentMode,
  getLevel,
  checkCommand,
  withEscalation
};
