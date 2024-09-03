import { acceptHMRUpdate, defineStore } from 'pinia';

export enum MainCurrencies {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
}

export interface Rates {
  [key: string]: number;
}

interface State {
  baseCurrency: MainCurrencies;
}

export const useBaseCurrencyStore = defineStore('baseCurrencyStore', {
  state: (): State => ({
    baseCurrency: MainCurrencies.RUB,
  }),
  getters: {
    getBaseCurrency: ({ baseCurrency }) => baseCurrency,
  },
  actions: {
    changeBaseCurrency(val: MainCurrencies) {
      this.baseCurrency = val;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBaseCurrencyStore, import.meta.hot)
  );
}
