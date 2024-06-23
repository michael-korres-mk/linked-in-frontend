<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
</script>

<template>
  <VRow
    align="center"
    class="spacer"
    no-gutters
  >
    <VCol
      sm="6"
      md="3"
    >
      <VBadge
        dot
        location="bottom right"
        offset-x="3"
        offset-y="3"
        bordered
        color="success"
      >
        <VAvatar
          class="cursor-pointer"
          color="primary"
          variant="tonal"
        >
          <VImg :src="avatar1" />

          <!-- SECTION Menu -->
          <VMenu
            activator="parent"
            width="230"
            location="bottom end"
            offset="14px"
          >
            <VList>
              <!-- 👉 Profile -->
              <VListItem
                to="/users/profile?view=1"
                color="white"
              >
                <template #prepend>
                  <VIcon
                    class="me-2"
                    icon="tabler-user"
                    size="22"
                  />
                </template>

                <VListItemTitle>
                  Προφίλ
                </VListItemTitle>
              </VListItem>

              <!-- Divider -->
              <VDivider class="my-2" />

              <!-- 👉 Logout -->
              <VListItem
                to="/login-wall"
                color="white"
                @click="logoutUser"
              >
                <template #prepend>
                  <VIcon
                    class="me-2"
                    icon="tabler-logout"
                    size="22"
                  />
                </template>

                <VListItemTitle>
                  Αποσύνδεση
                </VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
          <!-- !SECTION -->
        </VAvatar>
      </VBadge>
    </VCol>
    <VCol
      v-show="showName"
      class="hidden-xs-only text-left"
      sm="6"
      md="9"
    >
      <strong class="text-body-2">{{ user.firstName }} {{ user.lastName }}</strong>
      <span class="text-caption"> <!-- ROLE --> </span>
    </VCol>
  </VRow>
</template>

<script>
export default {
  props: {
    showName: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.v-list{
  border: 1px solid red;
  background-color: #A4C7DA!important;
}

.v-list-item {
  color: var(--v-theme-primary)!important;
  color:#1F4E79!important;
}

.v-list-item:hover {
  background-color: #D14801!important;
  color: white!important;
}
</style>
