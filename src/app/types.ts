import { DocumentData } from "firebase/firestore"

export type NewGift = {
    name: string,
    isWishedByID: string,
    details?: string,
    url?: string,
    status?: string,
    isClaimedByID?: string,
}
export interface Gift extends NewGift {
    id: string,
    status: 'claimed' | 'bought' | 'ordered' | 'wrapped' | 'under tree' | 'deleted',
    isWishedByUser?: User,
    isClaimedByUser?: User,
    isCustom?: boolean,
}

export type Gifts = Map<string, Gift>

export interface User extends DocumentData {
    id: string,
    displayName: string,
    email: string,
    pfp: string,
    friends?: string[],
    groups?: string[]
}

export interface Friend extends User {
    status: 'incoming'| 'outgoing' | 'friends',
}

export type List = {
    type: 'wish' | 'shopping' | 'error',
    owner: User,
    giftsByUser?: {
        [userID: string]: {
            gifts: Gifts,
            user: User,
        },
    }
}