import { createI18n } from 'vue-i18n'

const messages = Object.fromEntries(Object.entries(import.meta.glob('./locales/*.json', { eager: true }))
  .map(([key, value]) => [key.slice(10, -5), value.default]))

let _i18n = null
export const getI18n = () => {
  if (_i18n === null) {
    _i18n = createI18n({
      legacy: false,
      locale: 'el',
      fallbackLocale: 'el',
      messages,
    })
  }
  
  return _i18n
}
export default function (app) {
  app.use(getI18n())
}
