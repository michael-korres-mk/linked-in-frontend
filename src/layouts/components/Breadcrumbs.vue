<template>
  <div
    v-if="breadcrumbTitles()"
    class="breadcrumbs-container bg-breadcrumbs sticky-breadcrumbs mb-3"
  >
    <v-breadcrumbs
      :items="breadcrumbItems"
      divider=">"
    >
      <template #item="{ item }">

        <VBreadcrumbsItem
          class="bClass"
          :disabled="item.disabled"
          @click="navigate(item)"
          active-color="#FF0000"
        >
          {{ $t(item.title) }}
        </VBreadcrumbsItem>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
import breadcrumbTitles from '@/utils/breadcrumb-titles.js'

export default {
  computed: {
    breadcrumbItems() {
      const breadcrumbs = []

      const isHomeRoute = this.$route.name === 'home'

      breadcrumbs.push({
        title: breadcrumbTitles.get('home'),
        disabled: isHomeRoute,
        to: '/home',
        class: 'bClass'
      })

      if (!isHomeRoute) {
        let fullPath = ''

        this.$route.matched.filter(seg => seg.name !== undefined).forEach((routeRecord, index, matchedRoutes) => {
          fullPath += routeRecord.path
          let isLastSegmentNumeric = !isNaN(fullPath.split('/').pop())

          if (
            !isLastSegmentNumeric ||
            index !== this.$route.matched.length - 1
          ) {
            breadcrumbs.push({
              title: breadcrumbTitles.get(routeRecord.name) || routeRecord.name,
              disabled: false,
              to: fullPath,
              class: 'bClass'
            })
          }

          // If it's the last item in the matched routes, disable it
          if (index === matchedRoutes.length - 1) {
            breadcrumbs[breadcrumbs.length - 1].disabled = true
          }
        })
      }

      return breadcrumbs
    },
  },
  methods: {
    breadcrumbTitles() {
      return breadcrumbTitles.has(this.$route.name) && this.$route.name !== 'home'
    },
    navigate(item) {
      if (!item.disabled) {
        this.$router.push(item.to)
      }
    },
  },
}
</script>

<style>
.bClass:hover {
  color: #FFFFFF;
  text-decoration:underline;
  cursor: pointer;
}

.breadcrumbs-container {
  border-radius: 15px;
  background-color: rgb(31, 78, 121);
  color: #FFFFFF;
}

a {
  color: #D0D4F1C7;
}

a:hover {
  color: #FFFFFF;
  text-underline: #FFFFFF;
}
</style>
