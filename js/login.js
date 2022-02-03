const url = 'https://vue3-course-api.hexschool.io/v2';
const path = 'bella_vue';

const App = {
  data() {
    return{
      user:{
        username:'',
        password:''
      }
    }
  },
  methods: {
    login() {
      axios.post(`${url}/admin/signin`, this.user)
      .then((res) => {
        const { token, expired } = res.data; // 將 token 和 expired 存到 cookie
        document.cookie = `hexToken=${ token }; expires=${ new Date(expired) };`;
        window.location = 'products.html';
      })
      .catch((err) => {
        console.log(err.data);
      })
    }
  },
  mounted() {

  }
}

Vue.createApp(App).mount("#app")