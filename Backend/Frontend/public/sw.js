
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || '/vite.svg',
            badge: data.badge || '/vite.svg',
            vibrate: [200, 100, 200], // Vibration pattern
            tag: data.tag, // Group notifications by conversation
            renotify: true, // Vibrate even if another notification with same tag is open
            data: {
                url: data.data?.url || '/',
                chatId: data.data?.chatId
            }
        };
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.');
    event.notification.close();

    const urlToOpen = event.notification.data.url;

    // Open the app or focus the window
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // Check if window is already open
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                // Check if the URL matches (simplistic check, can be improved)
                if (client.url && 'focus' in client) {
                    // Optionally navigate the client if needed, or just focus
                    if (urlToOpen && client.navigate) {
                        client.navigate(urlToOpen);
                    }
                    return client.focus();
                }
            }
            // If app is closed, open it
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen || '/');
            }
        })
    );
});
