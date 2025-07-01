import { ESLint } from 'eslint';
import { beforeEach, describe, expect, it } from 'vitest';

import { defineConfig } from '../../index';

describe('CSS Configuration', () => {
  let eslint: ESLint;

  beforeEach(() => {
    eslint = new ESLint({
      overrideConfigFile: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      baseConfig: defineConfig() as any,
    });
  });

  describe('Tailwind CSS v4 Syntax', () => {
    it('should parse @apply with basic utilities', async () => {
      const code = `
        .button {
          @apply rounded-md px-4 py-2;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with hover modifiers', async () => {
      const code = `
        .button {
          @apply bg-blue-500 hover:bg-blue-600;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with focus modifiers', async () => {
      const code = `
        .input {
          @apply border-gray-300 focus:border-blue-500 focus:ring-2;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with dark mode modifiers', async () => {
      const code = `
        .card {
          @apply bg-white dark:bg-gray-800;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with responsive modifiers', async () => {
      const code = `
        .container {
          @apply px-4 sm:px-6 md:px-8 lg:px-10;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with CSS variable values', async () => {
      const code = `
        .themed {
          @apply bg-[--color-primary] text-[--color-text];
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with arbitrary values', async () => {
      const code = `
        .custom {
          @apply p-[1.5rem] text-[18px] shadow-[0_2px_4px_rgba(0,0,0,0.1)];
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with combined modifiers', async () => {
      const code = `
        .interactive {
          @apply text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with fraction values', async () => {
      const code = `
        .layout {
          @apply w-1/2 md:w-1/3 lg:w-1/4;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @apply with negative values', async () => {
      const code = `
        .offset {
          @apply -mt-4 -ml-2;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('@theme directive', () => {
    it('should parse @theme with CSS custom properties', async () => {
      const code = `
        @theme {
          --color-primary: #3b82f6;
          --color-secondary: #10b981;
          --spacing-card: 1.5rem;
          --font-sans: system-ui, -apple-system, sans-serif;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('@layer directive', () => {
    it('should parse @layer base', async () => {
      const code = `
        @layer base {
          body {
            @apply bg-gray-50 text-gray-900;
          }
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @layer components', async () => {
      const code = `
        @layer components {
          .btn {
            @apply px-4 py-2 rounded-md;
          }
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @layer utilities', async () => {
      const code = `
        @layer utilities {
          .content-auto {
            content-visibility: auto;
          }
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('@import directive', () => {
    it('should parse @import "tailwindcss"', async () => {
      const code = `
        @import "tailwindcss";
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('CSS nesting', () => {
    it('should parse CSS nesting with &', async () => {
      const code = `
        .button {
          @apply bg-blue-500 text-white;
          
          &:hover {
            @apply bg-blue-600;
          }
          
          &:focus {
            @apply ring-2 ring-blue-500;
          }
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('Media queries with @apply', () => {
    it('should parse @apply within media queries', async () => {
      const code = `
        .container {
          @apply px-4;
          
          @media (min-width: 640px) {
            @apply px-6;
          }
          
          @media (min-width: 1024px) {
            @apply px-8;
          }
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('@tailwind directive', () => {
    it('should parse @tailwind base', async () => {
      const code = '@tailwind base;';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @tailwind components', async () => {
      const code = '@tailwind components;';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @tailwind utilities', async () => {
      const code = '@tailwind utilities;';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @tailwind variants', async () => {
      const code = '@tailwind variants;';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('@config directive', () => {
    it('should parse @config with relative path', async () => {
      const code = '@config "./tailwind.config.js";';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @config with absolute path', async () => {
      const code = '@config "../../../tailwind.config.ts";';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('Extended variant prefixes', () => {
    it('should parse state variant prefixes', async () => {
      const code = `
        .element {
          @apply hover:scale-105 focus:outline-none active:scale-95;
          @apply disabled:opacity-50 visited:text-purple-600;
          @apply focus-visible:ring-2 focus-within:bg-gray-50;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse pseudo-element variants', async () => {
      const code = `
        .content {
          @apply before:content-[''] after:content-[''];
          @apply first-letter:text-4xl first-line:font-bold;
          @apply placeholder:text-gray-400 selection:bg-blue-200;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse structural pseudo-class variants', async () => {
      const code = `
        .list-item {
          @apply first:mt-0 last:mb-0 odd:bg-gray-50 even:bg-white;
          @apply only:mx-auto empty:hidden;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse form state variants', async () => {
      const code = `
        .form-input {
          @apply required:border-red-500 invalid:border-red-600;
          @apply valid:border-green-500 in-range:border-blue-500;
          @apply out-of-range:border-orange-500;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse print and motion variants', async () => {
      const code = `
        .printable {
          @apply print:text-black print:bg-white;
          @apply motion-safe:transition-all motion-reduce:transition-none;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse accessibility variants', async () => {
      const code = `
        .accessible {
          @apply sr-only focus:not-sr-only;
          @apply forced-colors:border-[ButtonText];
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse RTL and orientation variants', async () => {
      const code = `
        .directional {
          @apply ltr:pl-4 rtl:pr-4;
          @apply portrait:h-screen landscape:h-auto;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse container query variants', async () => {
      const code = `
        .responsive-card {
          @apply @container:p-4 @sm:p-6 @md:p-8;
          @apply @lg:grid-cols-2 @xl:grid-cols-3;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse supports query variants', async () => {
      const code = `
        .feature-detect {
          @apply supports-[display:grid]:grid;
          @apply supports-[backdrop-filter]:backdrop-blur;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse has variants', async () => {
      const code = `
        .parent {
          @apply has-[:checked]:bg-blue-50;
          @apply has-[:focus]:ring-2;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse aria variants', async () => {
      const code = `
        .interactive {
          @apply aria-expanded:rotate-180;
          @apply aria-selected:bg-blue-100;
          @apply aria-disabled:opacity-50;
          @apply aria-busy:animate-pulse;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse data attribute variants', async () => {
      const code = `
        .data-driven {
          @apply data-[state=open]:block;
          @apply data-[state=closed]:hidden;
          @apply data-[size=large]:text-xl;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('Stacked modifiers', () => {
    it('should parse multiple stacked modifiers', async () => {
      const code = `
        .complex {
          @apply sm:hover:text-blue-600;
          @apply dark:md:hover:bg-gray-700;
          @apply group-hover:focus:ring-2;
          @apply peer-checked:hover:after:bg-blue-500;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('Arbitrary variants', () => {
    it('should parse arbitrary variants', async () => {
      const code = `
        .custom-variants {
          @apply [&:nth-child(3)]:bg-blue-500;
          @apply [&>span]:text-red-500;
          @apply [@media(min-width:900px)]:flex;
          @apply [@supports(display:grid)]:grid;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('Tailwind v4 directives', () => {
    it('should parse @source directive', async () => {
      const code = '@source "./src/**/*.{html,js}";';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @utility directive', async () => {
      const code = `
        @utility content-auto {
          content-visibility: auto;
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @variant directive', async () => {
      const code = `
        @variant hocus {
          &:hover,
          &:focus {
            @apply underline;
          }
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @custom-variant directive', async () => {
      const code = `
        @custom-variant children {
          & > * {
            @apply mb-4;
          }
        }
      `;
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @reference directive', async () => {
      const code = '@reference "./tokens.css";';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse @plugin directive', async () => {
      const code = '@plugin "./custom-plugin.js";';
      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });

  describe('Complex Tailwind patterns', () => {
    it('should parse complex gradient utilities', async () => {
      const code = `
        .gradient-text {
          @apply bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse utilities with opacity modifiers', async () => {
      const code = `
        .overlay {
          @apply bg-black/50 backdrop-blur-sm;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });

    it('should parse group and peer modifiers', async () => {
      const code = `
        .group-item {
          @apply opacity-0 group-hover:opacity-100;
        }
        
        .peer-element {
          @apply peer-checked:bg-blue-500;
        }
      `;

      const results = await eslint.lintText(code, { filePath: 'test.css' });
      expect(results[0].errorCount).toBe(0);
    });
  });
});
