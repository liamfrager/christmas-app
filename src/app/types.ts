import { DocumentData } from "firebase/firestore"

export type NewGift = {
    name: string,
    isWishedBy: string,
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
    uid: string,
    displayName: string,
    email: string,
    pfp: string,
    family: string[],
}

export type List = {
    [userID: string]: {
        gifts: Gifts,
        user: User,
    },
}