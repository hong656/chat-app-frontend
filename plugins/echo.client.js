// ~/plugins/echo.client.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios'; 

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const token = ref('');

  window.Pusher = Pusher;

  if (process.client) {
    token.value = localStorage.getItem('token') || '';
  }

  const echo = new Echo({
    broadcaster: 'reverb',
    key: config.public.reverbAppKey,
    wsHost: config.public.reverbHost,
    wsPort: config.public.reverbPort,
    wssPort: config.public.reverbPort,
    forceTLS: config.public.reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],

    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      withCredentials: true,
    }
  });

  return {
    provide: {
      echo,
    }
  }
});