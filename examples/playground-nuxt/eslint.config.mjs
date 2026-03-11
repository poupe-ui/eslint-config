// @ts-check
import { withPoupe } from '@poupe/eslint-config';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withPoupe(withNuxt());
