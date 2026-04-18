/**
 * LSP Server Configurations
 * Pre-configured LSP server setups for common languages
 */

import { LSPClient, LSPClientOptions } from './lsp-client';

// ─── Server Configurations ────────────────────────────────────────────────────

export interface LSPServerConfig {
  /** Human-readable name */
  name: string;
  /** Language(s) served */
  languages: string[];
  /** File patterns this server handles */
  filePatterns: string[];
  /** Command to launch the server */
  command: string;
  /** Default arguments */
  args: string[];
  /** Optional environment overrides */
  env?: Record<string, string>;
  /** Installation hint for users */
  installHint?: string;
  /** Whether the server requires additional setup */
  requiresInstallation?: boolean;
}

/**
 * Pre-configured LSP servers indexed by language identifier.
 */
export const LSPServerConfigs: Record<string, LSPServerConfig> = {
  typescript: {
    name: 'TypeScript Language Server',
    languages: ['typescript', 'tsx', 'jsx'],
    filePatterns: ['*.ts', '*.tsx', '*.js', '*.jsx'],
    command: 'typescript-language-server',
    args: ['--stdio'],
    installHint: 'npm install -g typescript-language-server',
    requiresInstallation: false,
  },

  javascript: {
    name: 'JavaScript/TypeScript Server',
    languages: ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
    filePatterns: ['*.js', '*.jsx', '*.ts', '*.tsx', '*.json'],
    command: 'typescript-language-server',
    args: ['--stdio'],
    installHint: 'npm install -g typescript-language-server',
    requiresInstallation: false,
  },

  python: {
    name: 'Python Language Server (pylsp)',
    languages: ['python'],
    filePatterns: ['*.py', '*.pyi', '*.pyw'],
    command: 'pylsp',
    args: [],
    installHint: 'pip install python-lsp-server',
    requiresInstallation: false,
  },

  rust: {
    name: 'Rust Analyzer',
    languages: ['rust'],
    filePatterns: ['*.rs'],
    command: 'rust-analyzer',
    args: [],
    installHint: 'Install via rustup: rustup component add rust-analyzer',
    requiresInstallation: false,
  },

  go: {
    name: 'Go Language Server (gopls)',
    languages: ['go'],
    filePatterns: ['*.go'],
    command: 'gopls',
    args: [],
    installHint: 'Install: go install golang.org/x/tools/gopls@latest',
    requiresInstallation: false,
  },

  java: {
    name: 'Java Language Server (jdtls)',
    languages: ['java'],
    filePatterns: ['*.java'],
    command: 'jdtls',
    args: ['-configuration', '.vscode/jdtls.config', '-data', '.vscode/jdtls.workspace'],
    installHint: 'Install Eclipse JDT.LS per platform instructions',
    requiresInstallation: true,
  },

  cpp: {
    name: 'Clangd (C/C++ Language Server)',
    languages: ['c', 'cpp', 'objective-c', 'objective-cpp'],
    filePatterns: ['*.c', '*.cpp', '*.cc', '*.h', '*.hpp'],
    command: 'clangd',
    args: ['--background-index'],
    installHint: 'Install via LLVM: apt install clangd (Linux) or brew install llvm (macOS)',
    requiresInstallation: false,
  },

  c: {
    name: 'Clangd (C Language Server)',
    languages: ['c'],
    filePatterns: ['*.c', '*.h'],
    command: 'clangd',
    args: ['--background-index'],
    installHint: 'Install via LLVM: apt install clangd (Linux) or brew install llvm (macOS)',
    requiresInstallation: false,
  },

  json: {
    name: 'JSON Language Server',
    languages: ['json', 'jsonc'],
    filePatterns: ['*.json', '*.jsonc', 'package.json', 'tsconfig.json', '.eslintrc*'],
    command: 'vscode-json-languageserver',
    args: ['--stdio'],
    installHint: 'npm install -g vscode-json-languageserver',
    requiresInstallation: false,
  },

  html: {
    name: 'HTML Language Server',
    languages: ['html'],
    filePatterns: ['*.html', '*.htm'],
    command: 'vscode-html-languageserver-bin',
    args: ['--stdio'],
    installHint: 'npm install -g vscode-html-languageserver-bin',
    requiresInstallation: false,
  },

  css: {
    name: 'CSS Language Server',
    languages: ['css', 'scss', 'less'],
    filePatterns: ['*.css', '*.scss', '*.less'],
    command: 'vscode-css-languageserver-bin',
    args: ['--stdio'],
    installHint: 'npm install -g vscode-css-languageserver-bin',
    requiresInstallation: false,
  },

  yaml: {
    name: 'YAML Language Server',
    languages: ['yaml'],
    filePatterns: ['*.yaml', '*.yml'],
    command: 'yaml-language-server',
    args: ['--stdio'],
    installHint: 'npm install -g yaml-language-server',
    requiresInstallation: false,
  },

  markdown: {
    name: 'Markdown Language Server',
    languages: ['markdown'],
    filePatterns: ['*.md', '*.markdown'],
    command: 'markdown-language-server',
    args: ['--stdio'],
    installHint: 'npm install -g markdown-language-server',
    requiresInstallation: false,
  },

  vue: {
    name: 'Vue Language Server (Volar)',
    languages: ['vue'],
    filePatterns: ['*.vue'],
    command: 'vue-language-server',
    args: ['--stdio'],
    installHint: 'npm install -g @vue/language-server',
    requiresInstallation: false,
  },

  svelte: {
    name: 'Svelte Language Server',
    languages: ['svelte'],
    filePatterns: ['*.svelte'],
    command: 'svelte-language-server',
    args: ['--stdio'],
    installHint: 'npm install -g svelte-language-server',
    requiresInstallation: false,
  },

  graphql: {
    name: 'GraphQL Language Server',
    languages: ['graphql'],
    filePatterns: ['*.graphql', '*.gql'],
    command: 'graphql-lsp-server',
    args: ['--stdio'],
    installHint: 'npm install -g graphql graphql-language-service-cli',
    requiresInstallation: false,
  },

  terraform: {
    name: 'Terraform Language Server',
    languages: ['hcl', 'terraform'],
    filePatterns: ['*.tf', '*.tfvars'],
    command: 'terraform-ls',
    args: ['serve'],
    installHint: 'Download from https://github.com/hashicorp/terraform-ls/releases',
    requiresInstallation: true,
  },

  lua: {
    name: 'Lua Language Server (sumneko/lua-ls)',
    languages: ['lua'],
    filePatterns: ['*.lua'],
    command: 'lua-language-server',
    args: [],
    installHint: 'Download from https://github.com/LuaLS/lua-language-server/releases',
    requiresInstallation: true,
  },

  ruby: {
    name: 'Ruby Language Server (solargraph)',
    languages: ['ruby'],
    filePatterns: ['*.rb'],
    command: 'solargraph',
    args: ['stdio'],
    installHint: 'gem install solargraph',
    requiresInstallation: false,
  },

  php: {
    name: 'PHP Language Server (intelephense)',
    languages: ['php'],
    filePatterns: ['*.php'],
    command: 'intelephense',
    args: ['--stdio'],
    installHint: 'npm install -g intelephense',
    requiresInstallation: false,
  },
};

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Detect the appropriate LSP server config for a file based on extension.
 */
export function detectForFile(filePath: string): LSPServerConfig | null {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';

  const extToLang: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
    hpp: 'cpp',
    json: 'json',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'css',
    less: 'css',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    vue: 'vue',
    svelte: 'svelte',
    graphql: 'graphql',
    gql: 'graphql',
    tf: 'terraform',
    tfvars: 'terraform',
    lua: 'lua',
    rb: 'ruby',
    php: 'php',
  };

  const lang = extToLang[ext];
  if (!lang) return null;
  return LSPServerConfigs[lang] ?? null;
}

/**
 * Create an LSP client for a given language.
 */
export function createLSPClient(language: string): LSPClient | null {
  const config = LSPServerConfigs[language];
  if (!config) return null;

  const options: LSPClientOptions = {
    command: config.command,
    args: config.args,
    env: config.env,
  };

  return new LSPClient(options);
}

/**
 * Create an LSP client for a given file path.
 */
export function createLSPClientForFile(filePath: string): LSPClient | null {
  const config = detectForFile(filePath);
  if (!config) return null;

  return new LSPClient({
    command: config.command,
    args: config.args,
    env: config.env,
  });
}

/**
 * List all available (pre-configured) LSP servers.
 */
export function listAvailableServers(): LSPServerConfig[] {
  return Object.values(LSPServerConfigs);
}
