import { init } from '@rematch/core';
import { models } from './models';
import { doc } from './doc';

export const store = init<any>({
  models,
});

doc.subscribe(() => {
  const doc2 = doc;
  store.dispatch.model.set(doc2.data);
});

doc.on('op', (op: any) => {
  const doc2 = doc;
  store.dispatch.model.set(doc2.data);
  store.dispatch.model.onOp(op);
});
