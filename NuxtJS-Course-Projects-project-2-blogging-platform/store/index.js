export default {
  state: () => ({
    posts: [],
    selectedPost: {},
  }),
  mutations: {
    updatePosts(state, posts) {
      state.posts = posts;
    },
    updateSelectedPost(state, post) {
      state.selectedPost = post;
    },
  },
  actions: {
    addPost({ state, commit }, payload) {
      return this.$axios.$post(`/posts`, payload).then((post) => {
        console.log(state.posts, post);
        commit("updatePosts", [...state.posts, post]);
      });
    },
    editPost({ state, commit }, payload) {
      return this.$axios.$put(`/posts/${payload.id}`, payload).then((post) => {
        commit(
          "updatePosts",
          state.posts.map((post) => (post.id == payload.id ? payload : post))
        );
      });
    },
    deletePost({ state, commit }, postId) {
      return this.$axios.$delete(`/posts/${postId}`).then(() => {
        commit(
          "updatePosts",
          state.posts.filter((post) => post.id != postId)
        );
      });
    },
    deleteTask({ state, commit }, action) {
      //console.log("post id  " + action.postId + "  task id " + action.taskId);
      let project = state.posts.find((proj) => proj.id === action.postId);
      let task = project.body.find((task) => task.id === action.taskId);
      let projectIndex = state.posts.findIndex((proj) => proj.id === action.postId);
      let taskIndex = project.body.findIndex((task) => task.id === action.taskId);

      
      //console.log("test ULTIME " + JSON.stringify(project));
      console.log("PROJET INDEX " + (projectIndex));
      console.log("TASK INDEX " + (taskIndex));

      //retire le task que l'on veut supprimer
      //Object.entries(project.body).slice(project.body.indexOf(taskIndex), 1);
      Object.entries(project.body).slice(taskIndex, 1);
      //remplace le projet dans state.posts afin de save ses tasks
      //Object.entries(state.posts).splice(state.posts.indexOf(projectIndex), 1, project);
      let sliced = project.body.slice(taskIndex, 1)


      return this.$axios.$delete(`/posts/${action.postId}`).then(() => {
        commit( 
          "updatePosts",
          project );
      });
    },  
    getPost({ state }, postId) {
      console.log(state);

      const post = state.posts.find((item) => item.id == postId);
      return post
        ? Promise.resolve(post)
        : this.$axios.$get(`/posts/${postId}`);
    },
  },
};
