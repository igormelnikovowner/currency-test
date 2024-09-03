<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="q-px-md">
        <q-toolbar-title>Конвертер валют</q-toolbar-title>
        <q-btn
          dense
          flat
          label="Главная"
          padding="4px 10px"
          class="mr-4"
          :color="route.fullPath === '/' ? 'info' : 'white'"
          @click="router.push('/')"
        />
        <q-btn
          dense
          flat
          label="Конвертация"
          class="mr-8"
          padding="4px 10px"
          :color="route.fullPath === '/convert' ? 'info' : 'white'"
          @click="router.push('/convert')"
        />
        <q-select
          v-model="selectedCurrency"
          :options="Object.values(MainCurrencies)"
          label="Основная валюта"
          label-color="white"
          class="w-40 title-select"
          hide-bottom-space
          dropdown-icon="keyboard_arrow_down"
          @update:modelValue="updateBaseCurrency"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { MainCurrencies, useBaseCurrencyStore } from 'src/stores/store';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const route = useRoute();

const baseCurrencyStore = useBaseCurrencyStore();

const { getBaseCurrency } = storeToRefs(baseCurrencyStore);

const selectedCurrency = ref(getBaseCurrency.value);

const updateBaseCurrency = (value: MainCurrencies) => {
  selectedCurrency.value = value;
  baseCurrencyStore.changeBaseCurrency(value);
};

watch(
  () => getBaseCurrency.value,
  () => {
    selectedCurrency.value = getBaseCurrency.value;
  }
);
</script>

<style lang="sass">
.title-select .q-field__native span
  color: white

.title-select .q-select__dropdown-icon
  color: white
</style>
