<template>
  <v-layout justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="success">
          <v-toolbar-title>View History</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Id</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Role</th>
                  <th class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in applications" :key="index">
                  <td>{{ item.id }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.role }}</td>
                  <td>
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      small
                      color="indigo"
                      @click="getQuetions(item.id)"
                    >
                      <v-icon dark> mdi-pencil </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <div v-if="detail.length > 0">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Question Id</th>
                    <th class="text-left">Question</th>
                    <th class="text-left">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in detail" :key="index">
                    <td>{{ item.quetions_id }}</td>
                    <td>{{ item.quetion }}</td>
                    <td>{{ item.answer }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-overlay :value="overlay" z-index="99999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  name: "History",
  data() {
    return {
      applications: [],
      detail: [],
      overlay: false,
    };
  },
  methods: {
    getQuetions(id) {
      this.overlay = true;
      axios.get(`/api/applicant/${id}`).then((res) => {
        this.detail = res.data.data;
        this.overlay = false;
      });
    },
  },
  created() {
    //get all applications
    axios.get("/api/jobapplications").then((res) => {
      this.applications = res.data.data;
    });
  },
};
</script>
