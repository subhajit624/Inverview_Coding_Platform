import React from 'react';
import { Show, SignInButton, SignOutButton, UserButton} from '@clerk/react'
import toast from 'react-hot-toast';

const Home = () => {
  return (
    <div>
      <h1 className='btn btn-secondary' onClick={() => toast.success('this is toast message')}>welcome</h1>

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

export default Home
