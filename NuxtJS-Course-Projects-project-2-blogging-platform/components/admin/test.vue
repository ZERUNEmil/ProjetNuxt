<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit">
      <v-text-field
        label="Project Title"
        v-model="form.title"
        :rules="rules.title"
        required
      ></v-text-field>
      <ul v-for="(form, i) in form.body" :key="i">
        <v-textarea
          label="Task"
          v-model="form.value"
          :rules="rules.body"
          id="task"
        ></v-textarea>
      </ul>
      <div id="form"></div>
      <v-btn
        type="submit"
        color="deep-purple accent-4"
        :dark="valid"
        :loading="addPostLoading"
        :disabled="!valid"
      >
        {{ submitButtonText }}
      </v-btn>
    </v-form>
    <v-btn
      type="submit"
      color="deep-purple accent-4"
      :dark="valid"
      :loading="addPostLoading"
      :disabled="!valid"
      v-on:click="complexClickHandler()"
    >
      Add
    </v-btn>
  </div>
</template>

<script>
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
       <div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">Task</span>
  <input type="text" id="task" placeholder="Example..." aria-label="Username" aria-describedby="basic-addon1">
</div>

    `;
      let formField = document.getElementById("form");
      var oldFieldValue = [];
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

    submit() {
      var oldFieldValue = [];
      let allFieldValue = document.querySelectorAll("#task");
      allFieldValue.forEach((element) => {
        let task = {
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
          this.$router.push("/admin");
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

<style></style>
