
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/Authprovider';

const publicVapidKey = "BINJ3OaiV04mbaV3ZV-h8rXQ8_dL7ic0kTyUfdk1PYTc3VaQWIVN5tJ7k8ob83cSSjO3qzlo4xZB12M9JJ1mvpg"; // Hardcoded from .env for simplicity in frontend

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
                    console.log('Already subscribed');
                    // Optionally update subscription on server ensuring it's linked to current user
                    await sendSubscriptionToBackend(subscription);
                    setIsSubscribed(true);
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
