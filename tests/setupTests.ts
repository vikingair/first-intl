import { beforeEach } from 'vitest';
import { Spy } from 'spy4js';

Spy.configure({ enforceOrder: true });
beforeEach(Spy.resetAll);
