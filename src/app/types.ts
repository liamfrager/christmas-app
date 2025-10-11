import { DocumentData } from "firebase/firestore"

export type NewGift = {
    name: string,
    isWishedByID: string,
    details?: string,
    url?: string,
    isClaimedByID?: string,
    isWishedByUser?: User,
    isWishedOnListID: string,
}
export interface Gift extends NewGift {
    id: string,
    status: 'claimed' | 'purchased' | 'delivered' | 'wrapped' | 'under tree',
    isWishedByUser: User,
    isClaimedByUser?: User,
    isCustom?: boolean,
    isDeleted?: boolean,
}

export type Gifts = Map<string, Gift>

export interface User extends DocumentData {
    id: string,
    displayName: string,
    searchName: string,
    email: string,
    pfp: string,
}
export interface UserProfile extends User {
    groups?: string[],
    bio?: string,
    mood?: string,
}

export interface Friend extends User {
    status: 'incoming'| 'outgoing' | 'friends',
}

export type NewGroup = {
    name: string;
    description: string;
}

export interface Group extends NewGroup {
    id: string;
    members?: User[];
    giftExchangeMap?: Map<string, User>;
    giftExchangeRestrictions?: Map<string, User[]>;
}

export type NewList = {
    name: string,
    owner: User,
    isArchived: boolean,
}

export interface List extends NewList {
    id: string,
    type: 'wish' | 'shopping' | 'error' | 'not-friends',
    giftsByUser?: {
        [userID: string]: {
            gifts: Gifts,
            user: User,
        },
    },
}

export type WishLists = {
    type: 'valid' | 'error' | 'not-friends',
    owner: User,
    lists: List[],
}

export type Settings = {
    showHeader: boolean,
}