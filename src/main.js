import App from '@/App.vue'
import VueProgressBar from '@aacassandra/vue3-progressbar'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@styles/styles.scss'
import mixins from './mixins'
import useJwt from './plugins/jwt/useJwt'
import { useSessionStore } from './stores/session'
import {router} from "@/router/index.js";

library.add(fas, far)

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)


// Register plugins
registerPlugins(app)
app.mixin(mixins)
app.use(VueProgressBar, {
  color: '#A7844E',
  failedColor: '#874b4b',
  thickness: '5px',
})
app.config.globalProperties.$store = useSessionStore()
app.mount('#app')

app.provide('$store',useSessionStore())
app.provide('$router',router)

const jwtToken = useJwt.getToken()
if (jwtToken) {
  useJwt.setToken(jwtToken)
}

export default app
