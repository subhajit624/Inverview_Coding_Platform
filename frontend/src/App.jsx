import { Show, SignInButton, SignOutButton, UserButton } from '@clerk/react'
import './App.css'


function App() {

  return (
    <div>
      <h1>welcome</h1>

      <Show when="signed-out">
          <SignInButton mode='modal'/>
      </Show>
      <Show when="signed-in">
          <SignOutButton/>
      </Show>
      <Show when="signed-in">
          <UserButton />
      </Show>

    </div>
  )
}

export default App