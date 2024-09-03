<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Конвертация валют</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="flex">
            <q-select
              v-model="currency1"
              :options="Object.values(MainCurrencies)"
              label="Валюта"
              class="w-40 mr-10"
              dropdown-icon="keyboard_arrow_down"
              @update:model-value="changeBaseCurrency"
            />
            <q-input
              v-model.number="amount1"
              label="Количество"
              type="number"
              class="w-96"
              @update:model-value="convert('amount1')"
            />
          </div>

          <div class="flex">
            <q-select
              v-model="currency2"
              :options="Object.values(MainCurrencies)"
              label="Валюта"
              class="w-40 mr-10"
              dropdown-icon="keyboard_arrow_down"
              @update:model-value="changeTargetCurrency"
            />
            <q-input
              v-model.number="amount2"
              label="Количество"
              type="number"
              class="w-96"
              @update:model-value="convert('amount2')"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBaseCurrencyStore, Rates, MainCurrencies } from 'src/stores/store';
import axios from 'axios';

const baseCurrencyStore = useBaseCurrencyStore();

const { getBaseCurrency } = storeToRefs(baseCurrencyStore);

const currency1 = ref<MainCurrencies>(getBaseCurrency.value);

const currency2 = ref(
  Object.values(MainCurrencies).filter((c) => c !== currency1.value)[0]
);

const fetchRates = async () => {
  await axios
    .get(`https://api.exchangerate-api.com/v4/latest/${currency1.value}`)
    .then((response) => {
      rates.value = response.data.rates;
      convert('currency1');
    })
    .catch((error) => {
      console.error(error);
    });
};

const amount1 = ref(1);

const amount2 = ref(null as unknown as number);

const rates = ref(null as unknown as Rates);

const changeBaseCurrency = () => {
  if (currency1.value === currency2.value) {
    currency2.value = Object.values(MainCurrencies).filter(
      (c) => c !== currency1.value
    )[0];
  }
  baseCurrencyStore.changeBaseCurrency(currency1.value);
  fetchRates();
};

const changeTargetCurrency = () => {
  if (currency2.value === currency1.value) {
    currency1.value = Object.values(MainCurrencies).filter(
      (c) => c !== currency2.value
    )[0];
    baseCurrencyStore.changeBaseCurrency(currency1.value);
    fetchRates();
    return;
  }
  convert('currency2');
};

const convert = (changedField: string) => {
  if (!rates.value) return;
  const rate2 = rates.value[currency2.value];
  if (changedField === 'amount1' || changedField === 'currency1') {
    amount2.value = +(rate2 * amount1.value).toFixed(3);
  } else if (changedField === 'amount2' || changedField === 'currency2') {
    amount1.value = +(amount2.value / rate2).toFixed(3);
  }
};

onMounted(async () => {
  await fetchRates();
});

watch(
  () => getBaseCurrency.value,
  () => {
    currency1.value = getBaseCurrency.value;
    changeBaseCurrency();
  }
);
</script>
