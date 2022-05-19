import {
  register,
  start as coreStart,
  use,
  MidwareName,
  corsRuleLabel,
  KeyObject,
} from '@satumjs/core';
import {
  simpleSandboxMidware,
  mountNodeMidware,
  simpleCacheMidware,
} from '@satumjs/simple-midwares';
import singleSpaMidware from '@satumjs/midware-single-spa';

use((system, microApps, next) => {
  system.set(
    MidwareName.proxyEntry,
    (entry: string | string[], appName: string) => {
      const proxyMap = {};
      const proxySetting = localStorage.getItem('proxyEntries') || '';
      const proxyData = proxySetting.replace(/\s/g, '').split(',');

      proxyData.forEach((item) => {
        const [itemAppName, proxyUrl] = item.split('|');
        if (itemAppName && proxyUrl) proxyMap[itemAppName] = proxyUrl;
      });

      const currentApp = microApps.find((item) => item.name === appName);
      return currentApp && proxyMap[appName] ? proxyMap[appName] : entry;
    }
  );
  next();
});

function start(options: KeyObject<any>) {
  const { enableCache, corsServerUrl, ...opts } = options || {};

  if (enableCache) use(simpleCacheMidware, opts);

  use((system, _, next) => {
    system.set(MidwareName.urlOption, {
      corsRule: `${corsServerUrl}?target=${corsRuleLabel}`,
    });
    next();
  });

  use(simpleSandboxMidware, opts);
  use(mountNodeMidware, opts);
  use(singleSpaMidware, opts);

  coreStart(opts);
}

export { register, start };
