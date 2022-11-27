<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit">
      <v-text-field
        label="Project Title"
        v-model="form.title"
        :rules="rules.title"
        required
      ></v-text-field>
      <ul v-for="(next, i) in form.body" :key="i">
        <v-text-field
          label="Task"
          :value="next.value"
          :rules="rules.body"
          aria-disabled="false"
          prepend-icon="mdi-minus-circle"
          :id="next.id"
          class="form_task"
          @click:prepend="deleteTask(form.id)"
        >
        </v-text-field>
      </ul>
      <br />
      <br />

      <label for="checkbox"></label>
      <div id="form"></div>
      <v-btn
        class="addsubmit"
        type="submit"
        color="deep-purple accent-4"
        :dark="valid"
        :loading="addPostLoading"
        :disabled="!valid"
      >
        {{ submitButtonText }}
      </v-btn>
      <br />
    </v-form>
    <div class="addtask">
      <v-btn
        type="submit"
        color="deep-purple accent-4"
        :dark="valid"
        :disabled="!valid"
        v-on:click="complexClickHandler()"
      >
        Add Task
      </v-btn>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
export default {
  name: "test",
  mounted() {
    this.postId && this.getPost();
  },
  data() {
    return {
      valid: false,
      addPostLoading: false,
      form: {
        title: "",
        body: [],
      },
      rules: {
        title: [(v) => !!v || "Title is required"],
      },
    };
  },
  computed: {
    postId() {
      return +this.$route.params.id;
    },
    submitButtonText() {
      return this.postId ? "Save" : "Submit";
    },
  },
  methods: {
    complexClickHandler(event) {
      let addField = `
       <div class="form_task">
  <span  id="basic-addon1">Task</span>
  <input type="text" v-id="form.body.id"   v-model="form.body.body"
      :rules="rules.body" placeholder="Example..." aria-label="Username" aria-describedby="basic-addon1">
  <input type="text" id="assigned"   v-model="form.body.assigned"
      :rules="rules.assigned" placeholder="Assigned to" aria-label="Username" aria-describedby="basic-addon1">    
</div>

    `;
      let formField = document.getElementById("form");
      let oldFieldValue = [];
      let allFieldValue = document.querySelectorAll(".form_task");
      allFieldValue.forEach((element) => {
        console.log(element);
        oldFieldValue.push({
          body: element.children[1].value,
          assigned: element.children[2].value,
        });
      });

      formField.innerHTML += addField;

      allFieldValue = document.querySelectorAll(".form_task");
      allFieldValue.forEach((element) => {
        let value = oldFieldValue.shift();
        if (value !== undefined) {
          console.log(element);
          element.children[1].value = value["body"];
          element.children[2].value = value["assigned"];
        }
      });
    },

    submit() {
      console.log("heeloo");
      var oldFieldValue = [];
      let allFieldValue = document.querySelectorAll(".form_task");

      allFieldValue.forEach((element) => {
        let task;

        if (element.children[1].childElementCount!=0) {


         let input= element.children[1].querySelector("input");
         console.log(input.value);
         console.log(element.children[1]);

          task = {
            id: element.children[1].id,
            value: input.value,
            done: false,
            assigned: element.children[2].value,
          };
        } else {
         task = {
            id: uuidv4(),
            value: element.children[1].value,
            done: false,
            assigned: element.children[2].value,
          };
        }
        console.log(task);
        oldFieldValue.push(task);
      });
      this.form.body = oldFieldValue;
      console.log(this.form.body);

      this.addPostLoading = true;
      const action = this.postId
        ? { name: "editPost", payload: { ...this.form, id: this.postId } }
        : { name: "addPost", payload: this.form };
      this.$store
        .dispatch(action.name, action.payload)
        .then(() => {
          this.$router.push("/");
        })
        .finally(() => {
          this.addPostLoading = false;
        });
    },

    getPost() {
      this.$store.dispatch("getPost", this.postId).then((post) => {
        this.form.title = post.title;
        this.form.body = post.body;
      });
    },
  },
};
</script>

<style>
.addtask {
  position: relative;
  padding-top: 1%;
  align-items: flex-end;
}
</style>
