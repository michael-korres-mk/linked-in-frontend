<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
  badgeProps: {
    type: null,
    required: false,
    default: undefined,
  },
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
})

const emit = defineEmits([
  'read',
  'unread',
  'remove',
  'click:notification',
])

const totalUnseenNotifications = computed(() => {
  return 7
  return props.notifications.filter(item => item.readDate == null).length
})

const getNotificationColor = kind => {
  switch (kind) {
    case 'CONNECTION_REQUEST':
      return 'info'
    case 'EXPRESSION_OF_INTEREST':
      return 'success'
  }
}

const isHovered = ref(false)
</script>

<template>
    <VBadge
      v-bind="props.badgeProps"
      :model-value="props.notifications.some(n => !n.isSeen)"
      color="error"
      :content="totalUnseenNotifications"
      class="notification-badge"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <VAvatar
        class="cursor-pointer"
        color="primary"
        variant="outlined"
      >
        <FontAwesomeIcon :icon="(!isHovered && !$refs.notificationsMenu?.modelValue)?'far fa-bell' : 'fas fa-bell'"/>
        <VMenu
          ref="notificationsMenu"
          activator="parent"
          width="380px"
          :location="props.location"
          offset="14px"
          close-on-content-click
        >
          <VCard class="d-flex flex-column">
            <!-- 👉 Header -->
            <VCardItem class="notification-section">
              <h1 class="text-lg">
                {{$t('Notifications')}}
              </h1>
            </VCardItem>

            <VDivider />

            <!-- 👉 Notifications list -->
            <PerfectScrollbar
              :options="{ wheelPropagation: false }"
              style="max-block-size: 23.75rem;"
            >
              <VList class="notification-list rounded-0 py-0">
                <template
                  v-for="(notification, index) in props.notifications"
                  :key="notification.title"
                >
                  <VDivider v-if="index > 0" />
                  <VListItem
                    link
                    lines="one"
                    min-height="66px"
                    class="list-item-hover-class"
                    @click="$emit('click:notification', notification)"
                  >
                    <!-- Slot: Prepend -->
                    <!-- Handles Avatar: Image, Icon, Text -->
                    <template #prepend>
                      <VListItemAction start>
                        <VAvatar
                          size="40"
                          :color="getNotificationColor(notification.kind)"
                          :image="notification.img || undefined"
                          :icon="notification.icon || undefined"
                        >
                          <span v-if="notification.text">{{ avatarText(notification.text) }}</span>
                        </VAvatar>
                      </VListItemAction>
                    </template>

                    <VListItemTitle class="font-weight-medium">
                      {{ notification.title }}
                    </VListItemTitle>
                    <VListItemSubtitle>{{ notification.subtitle }}</VListItemSubtitle>
                    <span class="text-xs text-disabled">{{ notification.time }}</span>

                    <!-- Slot: Append -->
                    <template #append>
                      <div class="d-flex flex-column align-center gap-4">
                        <div style="block-size: 28px; inline-size: 28px;">
                          <IconBtn
                            size="small"
                            class="visible-in-hover"
                            @click.stop="$emit('remove', notification.id)"
                          >
                            <VIcon
                              size="20"
                              icon="tabler-x"
                            />
                          </IconBtn>
                        </div>
                      </div>
                    </template>
                  </VListItem>
                </template>
              </VList>
            </PerfectScrollbar>
            <VDivider />
            <!-- 👉 Footer -->
            <VCardActions class="notification-footer">
              <VBtn
                block
                to="/notifications"
              >
                Προβολή όλων των ειδοποιήσεων
              </VBtn>
            </VCardActions>
          </VCard>
        </VMenu>
      </VAvatar>
    </VBadge>

</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}

.notification-footer {
  padding: 6px !important;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}

.notification-list.v-list {
  .v-list-item {
    border-radius: 0 !important;
    margin: 0 !important;

    &[tabindex="-2"]:not(.v-list-item--active) {
      &:hover,
      &:focus-visible {
        color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));

        .v-list-item-subtitle {
          color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
        }
      }
    }
  }
}

// Badge Style Override for Notification Badge
.notification-badge {
  .v-badge__badge {
    /* stylelint-disable-next-line liberty/use-logical-spec */
    min-width: 18px;
    padding: 0;
    block-size: 18px;
  }
}
</style>
