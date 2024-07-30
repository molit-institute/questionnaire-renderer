import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'questionnaire-renderer',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  extras: {
    // depricated in newer stencil versions, once updated use enableImportInjection: true
    experimentalImportInjection: true
  }
};
