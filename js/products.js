import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

//實體化
let delProductModal = null;
let productModal = null;

const app = createApp ({
  components: {
    pagination
  },
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'bella_vue',
      products:[],
      isNew: false,
      tempProduct:{
        imagesUrl: []
      },
      pagination: {},
    }
  },methods: {
    checkLogin() {
      // 確認是否登入
      axios.post(`${this.url}/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          //cookie不存在會導回登入頁面
          window.location = 'index.html';
        })
    }, 
    getProducts(page = 1) {
      axios.get(`${this.url}/api/${this.path}/admin/products/?page=${page}`)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },       
    openModal(isNew, item) {
      if(isNew === 'add'){
        this.tempProduct = {
          imagesUrl: []
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    removeProduct() {
      axios.delete(`${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`)
      .then((res) => {
        alert(res.data.message);
        delProductModal.hide();
        this.getProducts();
      })
      .catch((err) => {
        alert(err.data.message);
        console.log(err);
      })
    }
  },
  mounted() {
    // 取得 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log('get Cookie token', token);
    axios.defaults.headers.common['Authorization'] = token;

    // 確認是否登入
    this.checkLogin();

    //bootstrap實體
    productModal = new bootstrap.Modal(document.getElementById('productModal')) //新增、編輯
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal')) //刪除
  }
})

app.component('productModal', {
  props: ['tempProduct', 'isNew'],
  template: '#templateForProductModal',
  methods: {
    updateProduct() {
      let url = `${this.url}/api/${this.path}/admin/product`;
      let method = 'post';
      if(!this.isNew) {
        url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
        method = 'put'
      }

      axios[method](url, {data: this.tempProduct})
        .then(res => {
          this.$emit('get-products');
          productModal.hide();
        })
        .catch(err => {
          alert(err.data.message);
        })
    },
  },
})

app.mount("#app");

