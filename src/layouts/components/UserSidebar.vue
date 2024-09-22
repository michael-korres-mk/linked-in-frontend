<template>
  <aside class="sidebar card-wrapper card-body">
    <div class="profile-section">
      <v-avatar color="grey" rounded="25" size="160">
        <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
      </v-avatar>
      <h3 class="text-white">{{ user.username }}</h3>
      <h4 class="text-info">{{ 'ola ola' }}</h4>
    </div>

    <ul class="sidebar-menu">
      <li><RouterLink :to="`/in/${this.user.id}?view=1`" >{{ $t('My Profile') }}</RouterLink></li>
      <v-divider color="#ccc" />
      <li><RouterLink :to="'/network'" >{{ $t('My Network') }}</RouterLink></li>
    </ul>

<!--    <ul class="sidebar-submenu">-->
<!--      <li><a href="#">{{ $t('Settings') }}</a></li>-->
<!--      <li><a href="#">{{ $t('Sign Out') }}</a></li>-->
<!--    </ul>-->
  </aside>
</template>

<script>
export default {
  name: "UserSidebar",
};
</script>

<style scoped lang="scss">
.sidebar {
  width: 250px;
  background-color: rgb(var(--v-theme-primary)); /* LinkedIn's sidebar background */
  padding: 20px;
  margin-top: 45px;
  margin-right: 20px;
  height: 320px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */

  .profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 1.2rem;
      color: rgb(var(--v-theme-primary));
    }
  }

  .sidebar-menu,
  .sidebar-submenu {
    list-style: none;
    padding: 0;

    li {

      a {
        color: rgb(var(--v-theme-info));
        text-decoration: none;
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }
    }
  }

  .sidebar-submenu {
    margin-top: 20px;
    padding-top: 10px;

    li {
      margin-bottom: 10px;

      a {
        color: #adb5bd;
      }
    }
  }
}
</style>
