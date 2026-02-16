
import Subscription from "../models/subscription.model.js";

export const subscribeToPush = async (req, res) => {
    try {
        const { subscription } = req.body;
        const userId = req.user._id;

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return res.status(400).json({ error: "Invalid subscription object" });
        }

        // Use findOneAndUpdate with upsert to handle potential race conditions or re-subscriptions
        // We match by endpoint because a user might have multiple devices (endpoints)
        // If a new user logs into the same browser/device, the endpoint might be sending a new user correlation?
        // Actually, endpoint is unique per browser profile. 
        // If User A logs out and User B logs in on same browser, endpoint is same. 
        // We should update the userId for that endpoint.

        const newSubscription = await Subscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            {
                userId: userId,
                endpoint: subscription.endpoint,
                keys: subscription.keys
            },
            { upsert: true, new: true }
        );

        console.log("Subscription saved/updated successfully in pushsubscriptions collection");

        res.status(201).json({ message: "Subscribed to push notifications", subscription: newSubscription });

    } catch (error) {
        console.log("Error in subscribeToPush", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
