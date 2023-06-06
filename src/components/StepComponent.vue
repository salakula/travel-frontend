<script setup>
import { onMounted, defineProps, defineEmits } from "vue";

const props = defineProps({
  day: {
    required: true,
  },
});

onMounted(() => {});

const emit = defineEmits(["updateStep", "deleteStep"]);

const handleUpdate = (event) => {
  console.log(event);
  emit("updateStep", event.target);
};

const handleDelete = (event) => {
  emit("deleteStep", event.target);
};
</script>

<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ day.stepNumber }}</v-list-item-title>
      <v-list-item-subtitle>{{ day.instruction }}</v-list-item-subtitle>
    </v-list-item-content>

    <template v-slot:append>
      <v-btn icon @click="handleUpdate(day)">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="handleDelete(day)">
        <v-icon small>mdi-trash-can</v-icon>
      </v-btn>
    </template>
  </v-list-item>
</template>
