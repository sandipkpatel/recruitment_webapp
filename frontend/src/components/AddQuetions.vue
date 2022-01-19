<template>
  <v-layout justify-center>
    <v-flex xs12 sm8 md8>
      <v-card class="elevation-12">
        <v-toolbar dark color="success">
          <v-toolbar-title>Add Questions</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div v-for="(question, index) in questions" :key="index">
            <v-row>
              <v-col md="11">
                <v-textarea
                  outlined
                  label="Question text"
                  value=""
                  v-model="question.question_txt"
                ></v-textarea>
              </v-col>
              <v-col md="1">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="red"
                  @click="removeQuestions(index)"
                >
                  <v-icon dark> mdi-close </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <h3>
                  Add Options
                  <v-btn
                    class="mx-2"
                    fab
                    dark
                    color="indigo"
                    small
                    @click="addNewOption(question)"
                  >
                    <v-icon dark> mdi-plus </v-icon>
                  </v-btn>
                </h3>
                <v-row>
                  <v-col
                    md="3"
                    v-for="(opt, index) in question.options"
                    :key="index"
                  >
                    <v-text-field
                      label="Option Name"
                      outlined
                      v-model="opt.val"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions> </v-card-actions>
        <v-row>
          <v-col md="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <div class="text-center">
              <v-btn depressed color="primary" @click="addQuestion">
                Add Another
                <v-icon right dark> mdi-plus </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <div class="text-center">
              <v-btn
                large
                color="success"
                @click="saveIt"
                v-if="questions.length > 0"
                >SAVE</v-btn
              >
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Question Id</th>
                    <th class="text-left">Question</th>
                    <th class="text-left">Options</th>
                    <th class="text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in saved_questions" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.quetion }}</td>
                    <td>
                      <span v-for="(opt, index) in item.options" :key="index"
                        >{{ opt }},</span
                      >
                    </td>
                    <td>
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        small
                        color="red"
                        @click="deleteQuestion(item.id)"
                      >
                        <v-icon dark> mdi-close </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
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
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  name: "AddQuestions",
  data: () => ({
    activator: null,
    questions: [
      {
        question_txt: "",
        options: [
          {
            val: "",
          },
        ],
      },
    ],
    snackbar: false,
    text: "",
    overlay: false,
    saved_questions: [],
  }),
  methods: {
    addQuestion() {
      this.questions.push({
        question_txt: "",
        options: [],
      });
    },
    removeQuestions(index) {
      this.questions.splice(index, 1);
    },
    addNewOption(question) {
      question.options.push({
        val: "",
      });
    },
    saveIt() {
      const data = this.questions.map((q) => {
        return {
          quetion: q.question_txt,
          options: JSON.stringify(
            q.options.filter((x) => x.val != "").map((x) => x.val)
          ),
        };
      });
      if (data.filter((x) => x.quetion == "").length > 0) {
        this.text = "Question field can't be empty!";
        this.snackbar = true;
        return;
      }
      this.overlay = true;
      const headers = { "Content-Type": "application/json" };
      axios
        .post("/api/question", data, { headers: headers })
        .then((response) => {
          console.log(response.data);
          this.overlay = false;
          if (response.data.status == "success") {
            this.text = "Questions submitted!";
            this.snackbar = true;
            this.getQuestions();
          } else {
            this.text = "Failed!";
            this.snackbar = true;
          }
        });
    },
    getQuestions() {
      axios.get(`/api/questions`).then((res) => {
        this.saved_questions = res.data.data.map((x) => {
          x.options = JSON.parse(x.options);
          return x;
        });
      });
    },
    deleteQuestion(id) {
      axios.delete(`/api/question/${id}`).then((res) => {
        if (res.data.status == "success") {
          this.text = "Question deleted!";
          this.snackbar = true;
          this.getQuestions();
        }
      });
    },
  },
  created() {
    this.getQuestions();
  },
};
</script>
