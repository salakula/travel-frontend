<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import TripCard from "../components/TripCardComponent.vue";
import TripServices from "../services/TripServices.js";

const trips = ref([]);
const isAdd = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newTrip = ref({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
});

onMounted(async () => {
  await getTrips();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getTrips() {
  user.value = JSON.parse(localStorage.getItem("user"));
  try {
    if (user.value !== null && user.value.id !== null) {
      const response = await TripServices.getTripsByUserId(user.value.id);
      trips.value = response.data;
    } else {
      const response = await TripServices.getTrips();
      trips.value = response.data;
    }
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

async function addTrip() {
  isAdd.value = false;
  newTrip.value.userId = user.value.id;
  try {
    await TripServices.addTrip(newTrip.value);
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = `${newTrip.value.name} added successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getTrips();
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold">Trips</v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="primary" @click="openAdd">Add</v-btn>
        </v-col>
      </v-row>

      <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" @deletedList="getLists" />

      <v-dialog v-model="isAdd" max-width="500px">
        <v-card>
          <v-card-title class="headline mb-2">Add Trip</v-card-title>
          <v-card-text>
            <v-text-field v-model="newTrip.name" label="Name" required></v-text-field>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="newTrip.startDate" label="Start Date" type="date"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="newTrip.endDate" label="End Date" type="date"></v-text-field>
              </v-col>
            </v-row>
            <v-textarea v-model="newTrip.description" label="Description"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="closeAdd">Close</v-btn>
            <v-btn color="primary" @click="addTrip">Add Trip</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="closeSnackBar">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
