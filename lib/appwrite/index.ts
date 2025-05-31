"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async() => {
    
    // Create a new Appwrtite client instance, and set the endpointUrl and projectID
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);

    // Get the cookie from the request headers: appwrite-session
    const session = (
        await cookies()
    ).get("appwrite-session")
    
    console.log("Session cookie:", session);

    if (!session) {
        throw new Error("No session found");
    };

    // Set the session cookie in the Appwrite client
    client.setSession(session.value);
    console.log("Client session set:", session.value);

    // Return the Appwrite client instance with the session set
    return {
        account: new Account(client),
        databases: new Databases(client),
    }
}

export const createAdminClient = async() => {

    // Create a new Appwrite client instance, and set the endpointUrl and projectID
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);

    // Set the session cookie in the Appwrite client
    return {
        account: new Account(client),
        avatars: new Avatars(client),
        databases: new Databases(client),
        storage: new Storage(client),
    }
}