import { observable, syncState } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncObservable } from "@legendapp/state/sync";

export type State = {
    translation: string;
    favoriteVerses: Record<string, string>;
};

export const state = observable<State>({
    translation: "DRC",
    favoriteVerses: {},
});

syncObservable(state, {
    persist: {
        name: "state",
        plugin: ObservablePersistLocalStorage,
    }
});

export const stateSyncStatus = syncState(state);