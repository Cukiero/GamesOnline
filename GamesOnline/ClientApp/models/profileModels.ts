export interface Friend {
    id: number;
    userFriend: User;
    date: Date;
    isSender: boolean;
}

export interface FriendInvite {
    id: number;
    inviter: User;
    date: Date;
}

export interface UserInvite {
    id: number;
    userInvited: User;
    date: Date;
}

export interface User {
    userId: string;
    userName: string;
    avatarPath: string;
}