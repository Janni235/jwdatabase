<template>
  <div>
    <div class="filter-container">
      <label>Filter by category:</label>
      <select v-model="selectedCategory" class="filter-dropdown">
        <option value="all">All</option>
        <option v-for="category in categories" :key="category.id" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <ul v-if="textboxes" class="textbox-list">
      <li v-for="textbox in textboxes" :key="textbox.id" class="textbox">
        <div class="textbox-header">
          <h3 class="textbox-title">Title: {{ textbox.title }}</h3>
          <div class="textbox-actions">
            <button @click="deleteTextbox(textbox.id)" class="delete-button">Delete</button>
            <button @click="upvoteTextbox(textbox.id)" class="upvote-button">Upvote</button>
            <button @click="downvoteTextbox(textbox.id)" class="downvote-button">Downvote</button>
          </div>
        </div>
        <p class="textbox-description">Short description: {{ textbox.shortDescription }}</p>
        <p class="textbox-bible-text">Bible text: {{ textbox.bibleText }}</p>
        <p class="textbox-categories">Categories: {{ textbox.category }}</p>
      </li>
    </ul>
    <addTextbox :categories="categories" v-on:addTextboxToList="addTextboxToList" />
  </div>
</template>

<script>
import axios from 'axios';
import addTextbox from './AddTextBox.vue'

export default {
  data() {
    return {
      selectedCategory: 'all',
      categories: ['category1', 'category2', 'category3'],
      textboxes: [],
    };
  },
  components: { addTextbox },
  async created() {
    this.textboxes = await this.fetchTextboxes();
  },
  methods: {
    async addTextboxToList(textbox) {
      try {
        // add the textbox to the list of textboxes
        this.textboxes.push(textbox);
        // send the textbox to the server
        const response = await axios.post('http://localhost:8080/api/textboxes', textbox);
        // update the textbox with the ID returned by the server
        textbox.id = response.data.id;
      } catch (error) {
        // handle error
        console.error(error);
      }
    },
    async fetchTextboxes() {
      try {
        const response = await axios.get('http://localhost:8080/api/textboxes');
        this.textboxes = response.data.data;
      } catch (error) {
        // handle error
      }
    },
    async deleteTextbox(id) {
      if (confirm('Bist du sicher?')) {
        try {
          // Delete the textbox from the database
          const response = await axios.delete(`http://localhost:8080/api/textboxes/${id}`);
          // Check if the deletion was successful
          if (response.ok) {
            // Remove the textbox from the page
            const textboxIndex = this.textboxes.findIndex((t) => t.id === id);
            this.textboxes.splice(textboxIndex, 1);
          } else {
            throw new Error('Could not delete textbox');
          }
        } catch (error) {
          // Display an error message
          alert(`There was a problem deleting the textbox: ${error.message}`);
        }
      }
    },
    async upvoteTextbox(id) {
      try {
        const response = await axios.put(`http://localhost:8080/api/textboxes/${id}/upvote`);
        const textbox = response.data;

        // Update the textbox on the page
        const textboxIndex = this.textboxes.findIndex((t) => t.id === id);
        this.textboxes.splice(textboxIndex, 1, textbox);

        // Sort the textboxes by upvotes
        this.textboxes.sort((a, b) => b.upvotes - a.upvotes);
      } catch (error) {
        // handle error
      }
    },
    async downvoteTextbox(id) {
      try {
        const response = await axios.put(`http://localhost:8080/api/textboxes/${id}/downvote`);
        const textbox = response.data;

        // Update the textbox on the page
        const textboxIndex = this.textboxes.findIndex((t) => t.id === id);
        this.textboxes.splice(textboxIndex, 1, textbox);

        // Sort the textboxes by upvotes
        this.textboxes.sort((a, b) => b.upvotes - a.upvotes);
      } catch (error) {
        // handle error
      }
    }
  },
  watch: {
    selectedCategory: {
      // watch the value of selectedCategory and filter the textboxes
      // whenever it changes
      async handler(newValue) {
        try {
          // get the list of textboxes from the server
          const response = await axios.get('http://localhost:8080/api/textboxes');
          this.textboxes = response.data.data;

          // filter the list of textboxes based on the selected category
          if (newValue !== 'all') {
            this.textboxes = this.textboxes.filter(
              (textbox) => textbox.category === newValue
            );
          }
        } catch (error) {
          // handle error
        }
      },
      // call the watcher immediately when it is registered
      immediate: true,
    },
  },
}
</script>

<style>
  .filter-container {
    display: flex;
    align-items: center;
    margin: 20px;
    list-style: none;
  }

  .filter-dropdown {
    font-size: 14px;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .textbox-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    margin: 20px;
    list-style: none;
  }

  .textbox {
    border: 1px solid black;
    margin: 0.5em;
    padding: 0.5em;
    width: 30%;
  }

  .textbox-title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }

  .textbox-actions {
    display: flex;
    justify-content: flex-end;
  }

  .delete-button {
    background-color: #ff0000;
    border: none;
    color: white;
    padding: 0.25em 0.5em;
    border-radius: 4px;
  }

  .upvote-button {
    background-color: #00ff00;
    border: none;
    color: white;
    padding: 0.25em 0.5em;
    border-radius: 4px;
  }

  .downvote-button {
    background-color: #0000ff;
    border: none;
    color: white;
    padding: 0.25em 0.5em;
    border-radius: 4px;
  }

  .add-button {
    background-color: #aaaaaa;
    border: none;
    color: white;
    padding: 0.25em 0.5em;
  }
</style>
