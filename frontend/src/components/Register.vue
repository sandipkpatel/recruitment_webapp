<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="success">
          <v-toolbar-title>Apply</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              prepend-icon="person"
              name="email"
              label="Email"
              type="text"
            ></v-text-field>
            <v-select
              v-model="role"
              :items="items"
              label="Select Role"
              solo
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="checkUser">APPLY</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-overlay :value="overlay" z-index="99999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="snackbar" bottom>
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Questions</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="saveQuestions"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <div v-for="qu in questions" :key="qu.id">
            <h2>{{ qu.quetion }}</h2>
            <v-radio-group v-model="qu.ans">
              <v-radio
                v-for="(n, i) in qu.options"
                :key="i"
                :label="`${n}`"
                :value="n"
              ></v-radio>
            </v-radio-group>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      items: ["Android Developer", "Php Developer", "Frontend Developer"],
      email: "",
      role: "Android Developer",
      overlay: false,
      snackbar: false,
      text: "",
      dialog: false,
      questions: [],
    };
  },
  methods: {
    checkUser() {
      const data = { email: this.email };
      const headers = { "Content-Type": "application/json" };
      if (!data.email) {
        this.text = "Email address is empty";
        this.snackbar = true;
        return;
      }
      this.overlay = true;

      //check user before show questions
      axios
        .post("/api/checkuser", data, { headers: headers })
        .then((response) => {
          this.overlay = false;
          if (response.data.data) {
            //user found
            this.text = "Email address already register with us";
            this.snackbar = true;
          } else {
            //show questions
            this.getQuestions();
          }
        });
    },
    getQuestions() {
      //show questions
      this.overlay = true;
      this.dialog = true;
      axios.get("/api/questions").then((res) => {
        this.questions = res.data.data.map((x) => {
          x.options = JSON.parse(x.options);
          return x;
        });
        this.overlay = false;
      });
    },
    saveQuestions() {
      //save question
      const questions = this.questions.map((que) => {
        return {
          quetion_id: que.id,
          ans: que.ans || "",
        };
      });
      const data = {
        user: {
          email: this.email,
          role: this.role,
        },
        questions: questions,
      };
      this.overlay = true;
      const headers = { "Content-Type": "application/json" };
      axios
        .post("/api/jobapply", data, { headers: headers })
        .then((response) => {
          this.overlay = false;
          if (response.data.status == "success") {
            this.text = "Application has been submited!";
            this.snackbar = true;
            this.dialog = false;
          } else {
            this.text = "Something went wrong!";
            this.snackbar = true;
          }
        });
    },
  },
  created() {
    console.log("register");
  },
};
</script>
