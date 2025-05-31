"use server";

import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { avatarPlaceholderUrl } from "@/constants";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email', [email] )],
    );

    return result.total > 0 ? result.documents[0] : null;

}

const handleError = (error: unknown, message: string) => {
    console.error(message, error);

    throw error;
}

const sendEmailOTP = async ( { email } : { email: string } ) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    }
    catch (error) {
        handleError(error, "Error sending email OTP");
    }
}

export const createAccount = async ( { fullName, email } : { fullName: string, email: string } ) => {
    console.log('access getUserByEmail', email);
    const existingUser = await getUserByEmail(email);
    console.log('existing user?', existingUser);
    const accountId = await sendEmailOTP( 
        { email } 
    );

    if (!existingUser) {
        console.log('Creating new user in database');
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