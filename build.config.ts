import { newUnbuildHooks } from '@kagal/build-tsdoc';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  hooks: {
    ...newUnbuildHooks(),
  },
});
