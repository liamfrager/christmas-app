import { DocumentData } from "firebase/firestore"

export type NewGift = {
    name: string,
    isWishedBy: string | User,
    details?: string,
    url?: string,
    status?: string,
    isClaimedBy?: string,
}
export interface Gift extends NewGift {
    id: string,
    status: string,
}

export type Gifts = {[giftID: string]: Gift}

export interface User extends DocumentData {
    id: string,
    displayName: string,
    email: string,
    pfp: string,
    family?: string[],
}

export type List = {
    type: string,
    owner: User,
    giftsByUser: {
        [userID: string]: {
            gifts: Gifts,
            user: User,
        },
    }
}