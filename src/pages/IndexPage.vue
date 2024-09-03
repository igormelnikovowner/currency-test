<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-lg font-bold">
            Курсы валют основные {{ priorRates.join(', ') }} относительно
            {{ getBaseCurrency }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-if="rates" class="flex">
            <div
              v-for="rate in priorRatesValues"
              :key="rate[0]"
              class="w-1/6 pa-2"
            >
              1 {{ rate[0] }} = {{ (1 / rate[1]).toFixed(3) }}
              {{ getBaseCurrency }}
            </div>
          </div>
          <q-spinner v-else />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-lg font-bold">
            Курсы валют относительно {{ getBaseCurrency }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-if="rates" class="flex">
            <div
              v-for="rate in Object.entries(rates).filter(
                (r) => getBaseCurrency !== r[0]
              )"
              :key="rate[0]"
              class="w-1/6 pa-2"
            >
              1 {{ rate[0] }} = {{ (1 / rate[1]).toFixed(3) }}
              {{ getBaseCurrency }}
            </div>
          </div>
          <q-spinner v-else />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBaseCurrencyStore, Rates } from 'src/stores/store';
import axios from 'axios';

const baseCurrencyStore = useBaseCurrencyStore();

const { getBaseCurrency } = storeToRefs(baseCurrencyStore);

const rates = ref(null as unknown as Rates);

const priorRates = computed<string[]>(() =>
  ['RUB', 'USD', 'CNY', 'EUR', 'GBP', 'BYN'].filter(
    (c) => c !== getBaseCurrency.value
  )
);

const priorRatesValues = computed<[string, number][]>(() => {
  if (rates.value) {
    return Object.entries(rates.value).filter((r) =>
      priorRates.value.includes(r[0])
    );
  }
  return [] as [string, number][];
});

const fetchRates = async () => {
  await axios
    .get(`https://api.exchangerate-api.com/v4/latest/${getBaseCurrency.value}`)
    .then((response) => {
      rates.value = response.data.rates;
    })
    .catch((error) => {
      console.error(error);
    });
};

watch(
  () => getBaseCurrency.value,
  async () => {
    await fetchRates();
  }
);

onMounted(async () => {
  await fetchRates();
});
</script>
