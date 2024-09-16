<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
</script>

<template>
  <VBadge
    dot
    bordered
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VIcon
        size="large"
        icon="tabler-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="350"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <VIcon
                    size="large"
                    icon="fa-user-circle-o"
                  />
                </VBadge>
                <VListItemTitle class="ms-4">
                  {{ user.username }}
                </VListItemTitle>
              </VListItemAction>
            </template>
          </VListItem>
          <PerfectScrollbar :options="{ wheelPropagation: false }">

            <!-- 👉 Personal Info -->
            <VListItem to="/personal-info?view=1" link>
              <template #prepend><FontAwesomeIcon class="me-2" icon="address-card"/></template>
              <VListItemTitle>{{ personalInfoTitle }}</VListItemTitle>
            </VListItem>


            <VDivider class="my-2" />

            <!-- 👉 Profile Settings -->
            <VListItem to="/profile-settings?view=1" link>
              <template #prepend><FontAwesomeIcon class="me-2" icon="fa-gear"/></template>
              <VListItemTitle>{{ settingsTitle }}</VListItemTitle>
            </VListItem>

            <VDivider class="my-2" />

            <!-- 👉 Logout -->
            <VListItem @click="logoutUser">
              <template #prepend><FontAwesomeIcon class="me-2" icon="arrow-right-from-bracket"/></template>
              <VListItemTitle>Αποσύνδεση</VListItemTitle>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<script>

  export default {
    computed: {
        personalInfoTitle() {
          return this.$t("Personal Info")
        },
        settingsTitle() {
          return this.$t("Settings")
        }
    }
  }

</script>
