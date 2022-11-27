<template>
  <v-card class="post-card mx-auto" height="100%">
    <v-card-text>
      <h4 class="card-title display-1 text--primary">
        {{ post.title }}
      </h4>
      <li class="text--primary" v-for="(next, i) in post.body" :key="i">
        {{ next.value }}
      </li>
      <v-progress-linear color="green" height="25" :value="progression(post)" >{{Math.ceil(progression(post))}}%</v-progress-linear>

    </v-card-text>
    <v-card-actions class="card-actions">
      <template v-if="isAdmin">
        <v-btn
          :to="`admin/post/${post.id}/edit`"
          edit
          text
          color="deep-purple accent-4"
        >
          Edit
        </v-btn>
        <app-modal
          button-label="Delete"
          button-color="error"
          :button-text-style="true"
        >
          <template slot-scope="{ close }">
            <v-card>
              <v-card-title class="headline"> Are you sure? </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="error"
                  :loading="deletePostLoading"
                  text
                  @click="deletePost(post.id, close)"
                >
                  DELETE
                </v-btn>
                <v-btn
                  color="black"
                  :disabled="deletePostLoading"
                  text
                  @click="close"
                >
                  CLOSE
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </app-modal>
      </template>
      <template v-else>
        <v-btn :to="`/post/${post.id}`" text color="deep-purple accent-4">
          <span @click="updateSelectedPost(post.body)"> Read More </span>
        </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppModal from "@/components/shared/app-modal";
export default {
  components: {
    AppModal,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      deletePostLoading: false,
    };
  },
  methods: {
    updateSelectedPost(post) {
      this.$store.commit("updateSelectedPost", post);
    },
    progression(postt) {
      let finish = 0;
      postt.body.forEach((element) => {
        if (element.done == true) {
          finish++;
        }
      });
      let length = postt.body.length;
      let percent = 100 / length;
      return percent * finish;
    },
    deletePost(postId, callback) {
      this.deletePostLoading = true;
      this.$store
        .dispatch("deletePost", postId)
        .then(callback)
        .finally(() => {
          this.deletePostLoading = false;
        });
    },
    edit(id, done, postt, idt) {
      this.deletePost(idt, close);
      postt.id += 1;
      console.log(postt.id);
      if (done === false) {
        postt.body.forEach((element) => {
          if (element.id == id) {
            element.done = true;
          }
        });
      } else if (done === true) {
        postt.body.forEach((element) => {
          if (element.id == id) {
            element.done = false;
          }
        });
      }

      console.log(postt);
      const action = id ? { name: "addPost", payload: postt } : {};
      this.$store
        .dispatch(action.name, action.payload)
        .then(() => {
          this.$router.push("/admin");
        })
        .finally(() => {
          this.addPostLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.post-card {
  padding-bottom: 50px;
  .card-title {
    margin-bottom: 20px;
  }
  .card-actions {
    position: absolute;
    bottom: 0;
  }
}
#myProgress {
  width: 100%;
  background-color: #ddd;
}

#myBar {
  width: 10%;
  height: 30px;
  background-color: #04aa6d;
  text-align: center;
  line-height: 30px;
  color: white;
}
</style>
