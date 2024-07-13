import { DocumentData } from "firebase/firestore"

export type NewGift = {
    name: string,
    isWishedByID: string,
    details?: string,
    url?: string,
    status?: string,
    isClaimedBy?: string,
}
export interface Gift extends NewGift {
    id: string,
    status: string,
    isWishedByUser?: User,
}

export type Gifts = {[giftID: string]: Gift}

export interface User extends DocumentData {
    id: string,
    displayName: string,
    email: string,
    pfp: string,
    friends?: string[],
}

export type List = {
    type: string,
    owner: User,
    giftsByUser?: {
        [userID: string]: {
            gifts: Gifts,
            user: User,
        },
    }
}