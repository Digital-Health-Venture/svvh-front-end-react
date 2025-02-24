import { datadogRum } from '@datadog/browser-rum';

// Determine the environment
const env = ['dev', 'uat'].includes(process.env.BUILD_ENV) ? 'uat' : 'prod';

datadogRum.init({
  applicationId: 'eca2db07-033b-4448-adee-3b2b9585fbfb',
  clientToken: 'puba6d200c43d5285317f5a2ad1422b339c',
  site: 'ap1.datadoghq.com',
  service: 'virtualhospital',  // virtualhospital, bnhhospital
  env: env,  // Set dynamically based on BUILD_ENV
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'allow',  // mask, allow, mask-user-input
});

datadogRum.startSessionReplayRecording();