<script setup>
import { onMounted } from "vue";

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
    {{ day.stepNumber }}

    {{ day.instruction }}

    <template v-slot:append>
      <v-icon
        size="x-small"
        icon="mdi-pencil"
        @click="handleUpdate(day)"
      ></v-icon>
      <v-icon
        size="x-small"
        icon="mdi-trash-can"
        @click="handleDelete(day)"
      ></v-icon>
    </template>

    <v-row>
      <!-- {{ day.tripPlace }} -->
    </v-row>
  </v-list-item>
</template>
