import { defineThemeConfig } from '@core'
import { Skins } from '@core/enums'
import { breakpointsVuetify } from '@vueuse/core'
import { VIcon } from 'vuetify/components/VIcon'

import logo from '@images/logo.png'
import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    title: 'LinkedIn',
    logo: h('div', {
      innerHTML: `<img src="${logo}" width="15%" alt="logo"/>`,
      style: 'line-height:0; color: rgb(var(--v-global-theme-primary))',
    }),
    contentWidth: ContentWidth.Boxed,
    contentLayoutNav: AppContentLayoutNav.Horizontal,
    overlayNavFromBreakpoint: breakpointsVuetify.md + 16,
    i18n: {
          enable: false,
          defaultLocale: 'el',
          langConfig: [
              {
                  label: 'English',
                  i18nLang: 'en',
                  isRTL: false,
              },
              {
                  label: 'Ελληνικά',
                  i18nLang: 'el',
                  isRTL: false,
              },
          ],
},
    theme: 'light',
    isRtl: false,
    skin: Skins.Default,
    iconRenderer: VIcon,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.Static },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: 'tabler-circle', size: 10 },
    isVerticalNavSemiDark: true,
  },
  horizontalNav: {
    type: 'sticky',
    transition: 'slide-y-reverse-transition',
  },
  icons: {
    chevronDown: { icon: 'tabler-chevron-down' },
    chevronRight: { icon: 'tabler-chevron-right', size: 18 },
    close: { icon: 'tabler-x' },
    verticalNavPinned: { icon: 'tabler-circle-dot' },
    verticalNavUnPinned: { icon: 'tabler-circle' },
    sectionTitlePlaceholder: { icon: 'tabler-separator' },
  },
})
