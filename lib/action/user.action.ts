"use server";

import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";
import { Query, ID } from "node-appwrite";
import { avatarPlaceholderUrl } from "@/constants";

// This function retrieves a user by thier email address from the Appwrite database
const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email', [email] )],
    );

    return result.total > 0 ? result.documents[0] : null;

}

// This function handles errors by logging them and throwing them
const handleError = (error: unknown, message: string) => {
    console.error(message, error);

    throw error;
}

// This function sends an OTP to the user's email address using Appwrite's account service
export const sendEmailOTP = async ( { email } : { email: string } ) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    }
    catch (error) {
        handleError(error, "Error sending email OTP");
    }
}

// This function creates a new user account or retrieves an existing user by their email address
export const createAccount = async ( { fullName, email } : { fullName: string, email: string } ) => {
    // console.log('access getUserByEmail', email);
    const existingUser = await getUserByEmail(email);
    
    // console.log('existing user?', existingUser);
    const accountId = await sendEmailOTP( 
        { email } 
    );
    // console.debug('accountId', accountId);
    if (!accountId) throw new Error("Failed to send an OTP");

    if (!existingUser) {
        // console.log('Creating new user in database');
        const { databases } = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId,
            }
        )
    }
    
    return parseStringify(
        {accountId}
    )
}

// This function verifies the OTP sent to the user's email address and creates a session for the user
export const verifySercet = async( { accountId, otp }: { accountId: string, otp: string }) => {
    
    try {
        const { account } = await createAdminClient();

        const session = await account.createSession(accountId, otp);

        (
            await cookies()).set("appwrite-session", session.secret, {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            }
        );

        return parseStringify(
            { sessionId: session.$id }
        );
    }

    catch (error) {
        handleError(error, "Error verifying OTP");
    }

}

// This function signs in a user by checking if they exist in the database and sending an OTP to their email address
export const SignInUser = async ({ email }: { email: string }) => {
    
    try{
        const existingUser = await getUserByEmail(email);

        // user exist, send OTP
        if (existingUser) {
            await sendEmailOTP( {email});

            return parseStringify(
                { accountId: existingUser.accountId }
            )
        }
        // console.log("User found", existingUser);

        // user does not exist, return error
        return parseStringify({ accountId: null, error: "User not found" });
    }

    catch (error) {
        handleError(error, "Failed to sign in user");
    }
}

// This function retrieves the current user's account details and their associated user document from the database
export const getCurrentUser = async () => {
    try{
        const { account, databases } = await createSessionClient();

        // get the current user account details
        const result = await account.get();
        // console.log("Current user account details:", result);
    
        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)],
        );
    
        // if user not found, return null
        if (user.total <= 0) return null;
    
        // if user found, return the first document
        return parseStringify(
            user.documents[0]
        );
    }
    
    catch (error) {
        console.error("Error getting current user:", error);
    }
}

export const SignOutUser = async () => {
    const { account } = await createSessionClient();

    try {
        await account.deleteSession("current");
        (await cookies()).delete("appwrite-session");

    }
    
    catch (error) {
        handleError(error, "Failed signing out user");
    }

    finally {
        redirect("/sign-in");
    }
}
