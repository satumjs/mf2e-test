import { register, start, use } from '@satumjs/core';
import {
  simpleSandboxMidware,
  mountNodeMidware,
} from '@satumjs/simple-midwares';
import singleSpaMidware from '@satumjs/midware-single-spa';

use(simpleSandboxMidware);
use(mountNodeMidware);
use(singleSpaMidware);

export { register, start };
