
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authprovider';

const publicVapidKey = "BFMhZ9ldmjS_8OootooMRKbdnsa4CIp6RsNzLCi7zncVAqmwo2limPNUl0QM4qxE-FLv2CyWT9ISbunGhmrdv_I"; // Synced from backend .env

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const useWebPush = () => {
    const [authUser] = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (authUser) {
            registerServiceWorkerAndSubscribe();
        }
    }, [authUser]);

    const registerServiceWorkerAndSubscribe = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const register = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker Registered...');

                // Check functionality
                const subscription = await register.pushManager.getSubscription();

                if (!subscription) {
                    console.log('No subscription detected, subscribing...');
                    await subscribe(register);
                } else {
                    // Check if the applicationServerKey matches our current key
                    // This handles cases where VAPID keys were rotated or mismatched
                    const currentKey = urlBase64ToUint8Array(publicVapidKey);

                    // The subscription options key is an ArrayBuffer, convert to Uint8Array for comparison
                    const existingKey = new Uint8Array(subscription.options.applicationServerKey);

                    const keysMatch = currentKey.length === existingKey.length &&
                        currentKey.every((v, i) => v === existingKey[i]);

                    if (!keysMatch) {
                        console.log('VAPID key mismatch detected, re-subscribing...');
                        await subscription.unsubscribe();
                        await subscribe(register);
                    } else {
                        console.log('Already subscribed with correct keys');
                        await sendSubscriptionToBackend(subscription);
                        setIsSubscribed(true);
                    }
                }
            } catch (err) {
                console.error('Service Worker Registration Error:', err);
            }
        } else {
            console.warn('Push notifications not supported in this browser');
        }
    };

    const subscribe = async (register) => {
        try {
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            console.log('Push Subscribed...');
            await sendSubscriptionToBackend(subscription);
            setIsSubscribed(true);
        } catch (err) {
            console.error('Subscription Error:', err);
        }
    };

    const sendSubscriptionToBackend = async (subscription) => {
        try {
            await axios.post('/api/notifications/subscribe', {
                subscription
            });
            console.log('Subscription sent to backend');
        } catch (err) {
            console.error('Error sending subscription to backend:', err);
        }
    };

    return { isSubscribed };
};

export default useWebPush;
