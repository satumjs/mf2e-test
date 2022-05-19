import {
  register,
  start,
  use,
  MidwareName,
  corsRuleLabel,
} from '@satumjs/core';
import {
  simpleSandboxMidware,
  mountNodeMidware,
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

use((system, _, next) => {
  system.set(MidwareName.urlOption, {
    corsRule: `https://cors-server-test.com/?target=${corsRuleLabel}`,
  });
  next();
});

use(simpleSandboxMidware);
use(mountNodeMidware);
use(singleSpaMidware);

export { register, start };
