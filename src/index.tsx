import { render } from 'solid-js/web'
import { FirebaseProvider } from 'solid-firebase'
import App from './App'

const firebaseConfig = {}

render(
    () => (
        <FirebaseProvider config={firebaseConfig}>
          <App />
        </FirebaseProvider>
    ),
    document.getElementById('root')!!,
)
