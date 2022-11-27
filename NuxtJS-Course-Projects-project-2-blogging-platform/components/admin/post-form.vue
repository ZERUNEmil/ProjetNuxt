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
          :id="next.id"
          aria-disabled="false"
          prepend-icon="mdi-minus-circle"
          @click:prepend="deleteTask(next.id,form.id,close)"

        >
      </v-text-field>
        
      </ul>
      <br>
      <br>


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
       <div>
  <span  id="basic-addon1">Task</span>
  <input type="text" id="task"   v-model="form.body"
      :rules="rules.body" placeholder="Example..." aria-label="Username" aria-describedby="basic-addon1">
  <input type="text" id="assigned"   v-model="form.assigned"
      :rules="rules.assigned" placeholder="Assigned to" aria-label="Username" aria-describedby="basic-addon1">    
</div>

    `;
      let formField = document.getElementById("form");
      let oldFieldValue = [];
      let allFieldValue = document.querySelectorAll("#task");
      allFieldValue.forEach((element) => {
        oldFieldValue.push(element.value);
      });
    
      formField.innerHTML += addField;

      allFieldValue = document.querySelectorAll("#task");
      allFieldValue.forEach((element) => {
        let value = oldFieldValue.shift();
        if (value !== undefined) {
          element.value = value;
        }
      });
    },
    deleteTask(taskId,postId,callback){
      const action = {taskId, postId };
      this.$store
        .dispatch("deleteTask", action)
        .then(callback)

        
      },
    submit() {
      var oldFieldValue = [];
      let allFieldValue = document.querySelectorAll("#task");
      allFieldValue.forEach((element) => {
        let task = {
          id: uuidv4(),
          value: element.value,
          done: false,
        };
        oldFieldValue.push(task);
      });
      this.form.body = oldFieldValue;

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
        this.form.id = post.id;
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
