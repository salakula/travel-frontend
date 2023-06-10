<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";


const router = useRouter();

const title = ref("Travel Itinerary");
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
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

async function updateAccount() {
  try {
    await UserServices.updateUser(user.value);
    // save user to local storage
    localStorage.setItem("user", JSON.stringify(user.value));
    
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = "Account updated successfully";
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-app-bar color="teal" prominent>
      <v-app-bar-nav-icon icon="mdi-arrow-left" @click="router.back()"></v-app-bar-nav-icon>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn color="white" @click="logout()" text>Logout</v-btn>
    </v-app-bar>
    

    <v-card class="rounded-lg elevation-5 px-5 py-5">
      <v-card-title class="headline mb-2">User profile</v-card-title>

      <v-row>
        <v-col class="d-flex justify-center align-center" cols="4">
          <v-avatar cover size="200">
            <v-img src="https://cdn.pixabay.com/photo/2021/02/12/07/03/icon-6007530_1280.png"></v-img>
          </v-avatar>
        </v-col>
        <v-col cols="8">
          <v-card-text v-if="user!=null">
          <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

          <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

          <v-text-field v-model="user.email" label="Email" required></v-text-field>

        </v-card-text>
        </v-col>
      </v-row>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="teal" @click="updateAccount()">Update profile</v-btn>
        </v-card-actions>
      </v-card>


      <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="closeSnackBar">Close</v-btn>
        </template>
      </v-snackbar>
  </v-container>
</template>
