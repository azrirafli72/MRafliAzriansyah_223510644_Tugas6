<template>
  <div class="app-container">
    <h1>Article Management by RafliAzri</h1>
    <form @submit.prevent="save" class="form-container">
      <input type="text" v-model="form.title" placeholder="Title" class="form-input" required /><br />
      <textarea v-model="form.content" placeholder="Content" class="form-textarea" required></textarea><br />
      <button type="submit" class="btn-save">{{ form.id ? 'Update' : 'Save' }}</button>
      <button @click="resetForm" type="button" class="btn-cancel" v-if="form.id">Cancel</button>
    </form>
    <ul class="article-list">
      <li v-for="article in articles" :key="article.id" class="article-item">
        <h2>{{ article.title }}</h2>
        <p>{{ article.content }}</p>
        <button @click="edit(article)" class="btn-edit">Edit</button>
        <button @click="deleteArticle(article.id)" class="btn-delete">Delete</button>
      </li>
    </ul>
    <button @click="load" class="btn-load">Load Articles</button>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const form = reactive({
      id: null,
      title: '',
      content: '',
    });

    const articles = ref([]);
    const currentId = ref(0);

    async function load() {
      try {
        const response = await axios.get('http://localhost:3000/articles');
        articles.value = response.data;

        if (articles.value.length > 0) {
          currentId.value = Math.max(...articles.value.map(article => parseInt(article.id, 10))) || 0;
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    }

    async function save() {
      try {
        const url = form.id ? `http://localhost:3000/articles/${form.id}` : 'http://localhost:3000/articles';
        const method = form.id ? 'put' : 'post';

        if (!form.id) {
          currentId.value += 1;
          form.id = currentId.value.toString();  // Simpan ID sebagai string
        }

        const response = await axios[method](url, form);

        if (form.id && method === 'put') {
          articles.value = articles.value.map((article) =>
            article.id === form.id ? response.data : article
          );
        } else {
          articles.value.push(response.data);
        }

        resetForm();
      } catch (error) {
        console.error('Error saving article:', error);
      }
    }

    function edit(article) {
      form.id = article.id;
      form.title = article.title;
      form.content = article.content;
    }

    async function deleteArticle(id) {
      try {
        await axios.delete(`http://localhost:3000/articles/${id}`);
        articles.value = articles.value.filter(article => article.id !== id);
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }

    function resetForm() {
      form.id = null;
      form.title = '';
      form.content = '';
    }

    onMounted(load);

    return { form, articles, save, edit, deleteArticle, load, resetForm };
  },
};
</script>

<style>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #2c3e50; /* Warna background container lebih gelap */
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* Meningkatkan bayangan untuk memperjelas perbedaan */
  color: #ecf0f1; /* Warna teks yang kontras dengan background */
}

h1 {
  color: #ecf0f1; /* Warna teks yang kontras dengan background */
}

.form-container {
  margin: 20px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  border: 1px solid #34495e; /* Border warna lebih gelap */
  border-radius: 4px;
  font-size: 16px;
  background-color: #34495e; /* Warna background input lebih gelap */
  color: #ecf0f1; /* Warna teks input yang kontras */
}

.btn-save, .btn-edit, .btn-delete, .btn-load, .btn-cancel {
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}

.btn-save {
  background-color: #27ae60; /* Hijau terang */
}

.btn-edit {
  background-color: #2980b9; /* Biru terang */
}

.btn-delete {
  background-color: #e74c3c; /* Merah terang */
}

.btn-load {
  background-color: #3498db; /* Biru muda */
}

.btn-cancel {
  background-color: #95a5a6; /* Abu-abu */
}

.article-list {
  list-style-type: none;
  padding: 0;
}

.article-item {
  background-color: #34495e; /* Warna background lebih gelap */
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #2c3e50; /* Border warna lebih gelap */
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #ecf0f1; /* Warna teks yang kontras */
  overflow: hidden; /* Menyembunyikan konten yang meluap */
  word-wrap: break-word; /* Memastikan kata yang panjang dipotong dan dibungkus */
  overflow-wrap: break-word; /* Alternatif untuk word-wrap */
}

.article-item h2 {
  margin: 10px;
  font-size: 18px;
  color: #ecf0f1; /* Warna teks yang kontras */
}

.article-item p {
  margin: 10px;
  font-size: 14px;
  color: #bdc3c7; /* Warna teks konten yang lebih ringan */
  max-height: 200px; /* Batasi tinggi maksimum konten */
  overflow: hidden; /* Menyembunyikan konten yang meluap */
  text-overflow: ellipsis; /* Menambahkan elipsis jika konten terlalu panjang */
  word-wrap: break-word; /* Memastikan kata yang panjang dipotong dan dibungkus */
  overflow-wrap: break-word; /* Alternatif untuk word-wrap */
}
</style>
