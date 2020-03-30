import { Domain, Effect } from "effector";

export const logDomain = (domain: Domain) => {
  const log = (name: string, ...args: any[]) => console.log(`[${name}]`, ...args);
  domain.onCreateEffect((effect) => {
    effect.pending.watch((payload) => log(effect.compositeName.fullName, `pending`, payload));
    effect.done.watch((payload) => log(effect.compositeName.fullName, `done`, payload));
    effect.fail.watch((payload) => log(effect.compositeName.fullName, `fail`, payload));
  });
  domain.onCreateEvent((event) =>
    event.watch((payload) => log(event.compositeName.fullName, event, payload))
  );
  domain.onCreateStore((store) =>
    store.watch((payload) => log(store.compositeName.fullName, payload))
  );
};
