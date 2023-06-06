<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";


const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});
const showPassword = ref(false);

onMounted(() => {
  if (localStorage.getItem("user") !== null) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "admin") {
      router.push({ name: "admin" });
    } else {
      router.push({ name: "user" });
    }
  }
});

async function createAccount() {
  try {

    if (user.value.firstName === "" || user.value.lastName === "" || user.value.email === "" || user.value.password === "") {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Please fill all the fields!";
      return;
    }
    await UserServices.addUser(user.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Account created successfully!";
    router.push({ name: "login" });
    isCreateAccount.value = false;
  } catch (error) {
    console.error(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

async function login() {
  try {
    if (user.value.email === "" || user.value.password === "") {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Please fill all the fields!";
      return;
    }
    window.localStorage.removeItem("user");
    const data = await UserServices.loginUser(toRaw(user));
    window.localStorage.setItem("user", JSON.stringify(data.data));
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Login successful!";
    console.log(data.data);
    if (data.data.role === "admin") {
      console.log("admin");
      router.push({ name: "admin" });
    } else {
      console.log("user");
      router.push({ name: "user" });
    }
  } catch (error) {
    console.error(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>


<template>
  <v-container fill-height>

    <v-row rows="3" sm="2" justify="center" align="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title class="headline mb-2">Login </v-card-title>
          <v-card-text>
            <v-text-field v-model="user.email" label="Email" required></v-text-field>

            <v-text-field v-model="user.password" label="Password" required type="password"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="flat" color="white" @click="openCreateAccount()">Create Account</v-btn>
            <v-spacer></v-spacer>

            <v-btn variant="flat" color="teal" @click="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>





    <v-dialog persistent v-model="isCreateAccount" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Create Account </v-card-title>
        <v-card-text>
          <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

          <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

          <v-text-field v-model="user.email" label="Email" required></v-text-field>

          <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeCreateAccount()">Close</v-btn>
          <v-btn variant="flat" color="teal" @click="createAccount()">Create Account</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
