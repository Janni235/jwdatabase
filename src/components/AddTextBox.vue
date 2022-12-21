<template>
    <div>
      <button @click="showAddPopup = true" class="add-button">Add textbox</button>
      <div v-if="showAddPopup" class="add-popup">
        <h3>Add textbox</h3>
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="newTitle" />
        <label for="short-description">Short description:</label>
        <input type="text" id="short-description" v-model="newShortDescription" />
        <label for="bible-text">Bible text:</label>
        <textarea id="bible-text" v-model="newBibleText"></textarea>
        <label for="category">Category:</label>
        <select id="category" v-model="newCategory">
          <option v-for="category in categories" :key="category.id" :value="category">
            {{ category }}
          </option>
        </select>
        <button @click="addTextboxToList" class="add-button">Add</button>
        <button @click="showAddPopup = false" class="cancel-button">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    props: { categories: Array },
    data() {
      return {
        showAddPopup: false,
        newTitle: '',
        newShortDescription: '',
        newBibleText: '',
        newCategory: '',
      };
    },
    methods: {
      addTextboxToList() {
      const textbox = {
        title: this.newTitle,
        description: this.newShortDescription,
        bible_text: this.newBibleText,
        category: this.newCategory
      };

      // reset the input fields and close the popup
      this.newTitle = '';
      this.newShortDescription = '';
      this.newBibleText = '';
      this.newCategory = '';
      this.showAddPopup = false;

      console.log(textbox, 'what it sends');

      // trigger the 'add' event and pass the new textbox
      this.$emit('addTextboxToList', textbox);
    }
  }
}
</script>