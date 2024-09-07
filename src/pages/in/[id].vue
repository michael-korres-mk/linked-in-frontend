<template>

  <header>
    <div class="profile-header">
      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="Profile Picture" class="profile-picture">
      <h1> {{ entity.title }}</h1>
      <h2> {{ entity.jobTitle}}</h2>
    </div>
  </header>

  <section class="about">
    <h3>About Me</h3>
    <p>
      I’m a passionate Front-End Developer with over 5 years of experience building responsive
      and dynamic web applications using modern frameworks like Vue.js. My expertise lies in
      creating scalable, maintainable solutions, from single-page applications to complex user interfaces.
    </p>
  </section>

  <section class="experience">
    <h3>Experience</h3>

    <div class="job">
      <h4>Front-End Developer | Company Name</h4>
      <p><em>Month/Year – Present</em></p>
      <ul>
        <li>Led front-end development for several high-traffic single-page applications using Vue.js</li>
        <li>Integrated Vuex for state management, improving application efficiency by 30%</li>
        <li>Collaborated with back-end teams to integrate RESTful APIs</li>
      </ul>
    </div>

    <div class="job">
      <h4>Junior Developer | Another Company</h4>
      <p><em>Month/Year – Month/Year</em></p>
      <ul>
        <li>Developed components using Vue.js for a large-scale enterprise app</li>
        <li>Migrated legacy systems from Angular to Vue.js, reducing load time by 40%</li>
        <li>Utilized Vue Router to handle multi-page navigation seamlessly</li>
      </ul>
    </div>
  </section>

  <section class="skills">
    <h3>Skills</h3>
    <ul class="skills-list">
      <li>Vue.js</li>
      <li>Vuex</li>
      <li>Nuxt.js</li>
      <li>JavaScript (ES6+)</li>
      <li>HTML5 / CSS3</li>
      <li>TailwindCSS / Bootstrap</li>
    </ul>
  </section>

  <section class="projects">
    <h3>Projects</h3>
    <div class="project">
      <h4>E-commerce Dashboard (Vue.js, Vuex, Firebase)</h4>
      <p>Developed a full-stack e-commerce dashboard for managing products, orders, and customers.</p>
    </div>
    <div class="project">
      <h4>Social Media Platform (Vue.js, Node.js, GraphQL)</h4>
      <p>Built a social media platform with user authentication, real-time messaging, and media sharing.</p>
    </div>
  </section>

  <section class="certifications">
    <h3>Certifications & Courses</h3>
    <ul>
      <li>Vue Mastery – “Intro to Vue 3”</li>
      <li>Udemy – “Vue.js 3: From Beginner to Advanced”</li>
    </ul>
  </section>

  <footer>
    <p>&copy; 2024 John Doe. All rights reserved.</p>
  </footer>
</template>

<script>
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";

export default {
  name: "[id]",
  data() {
    return {
      entity: {},
      entityStore: defineStore('users', useGenericEntityStore('users'))()
    }
  },
  mounted() {
    this.fetchEntity()
  },
  methods:{
    async fetchEntity() {
      const entityID = this.$route.params.id
      this.entity = await this.entityStore.getEntity(entityID)
    }
  }
}
</script>

<style scoped lang="scss">

/* General styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  color: #333;
  margin: 0;
  padding: 0;
}


/* Header styles */
header {
  top: 0; /* Background effect covers the bottom half */
  left: 0;
  right: 0;
  bottom: 50%;
  background: rgb(var(--v-theme-primary)); /* Background effect (color overlay) */
  z-index: 1;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
}

.profile-picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}

h1 {
  margin: 10px 0;
}

h2 {
  font-weight: normal;
}

/* About Section */
.about {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about p {
  line-height: 1.6;
}

/* Experience Section */
.experience {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.job {
  margin-bottom: 20px;

  h4 {
    margin-bottom: 5px;
    color: #42b883;
  }

  ul {
    list-style-type: square;
    margin-left: 20px;
  }
}

/* Skills Section */
.skills {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style-type: none;
  padding: 0;
}

.skills-list li {
  background-color: #42b883;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}

/* Projects Section */
.projects {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project {
  margin-bottom: 20px;
}

/* Certifications Section */
.certifications {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.certifications ul {
  list-style-type: disc;
  margin-left: 20px;
}

/* Footer */
footer {
  text-align: center;
  padding: 10px;
  background-color: #2c3e50;
  color: #fff;
  margin-top: 20px;
}


</style>
