<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import TripCard from "../components/TripCardComponent.vue";
import TripCardRegister from "../components/TripCardRegisterComponent.vue";
import TripServices from "../services/TripServices.js";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";


const router = useRouter();

const trips = ref([]);
const isAdd = ref(false);
const title = ref("Travel Itinerary");
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
  if (user.value === null) {
    router.push({ name: "login" });
  }
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
    newTrip.value = {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
    };
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

function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
}

const toggle = ref(0);

const allTrips = ref([]);
async function getAllTrips() {
  try {
    const response = await TripServices.getTrips();
    allTrips.value = response.data;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

async function showProfile() {
    router.push({ name: "profile" });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-app-bar color="teal" prominent>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-avatar class="mr-5" @click="showProfile" v-if="user != null" color="white">{{ user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() }}
    </v-avatar>
      <v-btn color="white" @click="logout()" text>Logout</v-btn>
    </v-app-bar>
    <div class="d-flex flex-column align-center pa-6">
      <v-btn-toggle v-model="toggle" color="teal" mandatory>
        <v-btn @click="getTrips" prepend-icon="mdi-account-details">My trips</v-btn>
        <v-btn @click="getAllTrips" prepend-icon="mdi-format-list-bulleted">All trips</v-btn>
      </v-btn-toggle>
    </div>

    <div id="body">

      <template v-if="toggle == 0">
        <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" @deletedList="getLists" />
      </template>

      <template v-if="toggle == 1">
        <TripCardRegister v-for="trip in allTrips" :key="trip.id" :trip="trip" @deletedList="getLists" />
      </template>



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
            <v-btn @click="closeAdd">Close</v-btn>
            <v-btn color="teal" variant="flat" @click="addTrip">Add Trip</v-btn>
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
