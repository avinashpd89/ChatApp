
import webpush from 'web-push';
import fs from 'fs';

const vapidKeys = webpush.generateVAPIDKeys();

const content = `VAPID_PUBLIC_KEY=${vapidKeys.publicKey}\nVAPID_PRIVATE_KEY=${vapidKeys.privateKey}\nWEB_PUSH_EMAIL=mailto:test@test.com`;
fs.writeFileSync('keys.env', content);
