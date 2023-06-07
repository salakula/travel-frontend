<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import TripCard from "../components/TripCardComponent.vue";
import TripServices from "../services/TripServices.js";

const router = useRouter();
const user = ref(null);
const title = ref("Travel Itinerary");
const drawer = ref(false);


const showingUsers = ref(false);
const showingTrips = ref(false);
const showingPlaces = ref(false);
const showingHotels = ref(false);

async function showUsers() {
    showingUsers.value = true;
    showingTrips.value = false;
    showingPlaces.value = false;
    showingHotels.value = false;
    await getUsers();
    drawer.value = false;
}

async function showTrips() {
    showingUsers.value = false;
    showingTrips.value = true;
    showingPlaces.value = false;
    showingHotels.value = false;
    await getTrips();
    drawer.value = false;
}

async function showPlaces() {
   router.push({ name: "places" });
}

async function showHotels() {
    showingUsers.value = false;
    showingTrips.value = false;
    showingPlaces.value = false;
    showingHotels.value = true;
}

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const userList = ref([]);

async function getUsers() {
    UserServices.getUsers()
        .then((data) => {
            userList.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const trips = ref([]);

async function getTrips() {
    TripServices.getTrips()
        .then((data) => {
            trips.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

async function makeAdmin(user) {
    user.role = "admin";
    UserServices.makeAdmin(user)
        .then((data) => {
            console.log(data);
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "User made admin successfully!";
            getUsers();
        })
        .catch((error) => {
            console.log(error);
        });
}

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem("user"));

    if (user.value === null) {
        router.push({ name: "login" });
    }
    else {
        await getTrips();
        showTrips();
    }
});

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

function closeSnackBar() {
    snackbar.value.value = false;
}
</script>
<template>
    <v-app-bar color="teal" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ title }}</v-app-bar-title>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="right" temporary>
        <v-list>
            <v-list-item prepend-icon="mdi-account" v-if="user" :title="user.firstName + ' ' + user.lastName"></v-list-item>
            <v-list-item prepend-icon="mdi-account-details" @click="showUsers()" title="Users"></v-list-item>
            <v-list-item prepend-icon="mdi-airplane" @click="showTrips()" title="Trips"></v-list-item>
            <v-list-item prepend-icon="mdi-map-marker" @click="showPlaces()" title="Places"></v-list-item>
            <v-list-item prepend-icon="mdi-home-city" @click="showHotels()" title="Hotels"></v-list-item>
            <v-list-item style="color: red;" @click="logout()" prepend-icon="mdi-logout-variant"
                title="Logout"></v-list-item>
        </v-list>
    </v-navigation-drawer>

    <template v-if="showingUsers">
        <v-container>
            <v-card-title>
                <h2>Users</h2>
            </v-card-title>
            <v-card class="rounded-lg elevation-5 mb-8" v-for="user in userList" :key="user.id" prepend-icon="mdi-account"
                :title="user.firstName + ' ' + user.lastName" :subtitle="user.email">
                <v-card-actions v-if="user.role === 'user'">
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="teal" text @click="makeAdmin(user)">Make admin</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </template>

    <template v-if="showingTrips">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card-title>
                        <h2>Trips</h2>
                    </v-card-title>
                    <v-card-text v-if="trips.length > 0">
                        <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" @deletedList="getLists" />
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>

    </template>

    <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
            <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>
