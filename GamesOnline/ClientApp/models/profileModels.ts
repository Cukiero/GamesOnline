export interface User {
    userId: string;
    userName: string;
    avatarPath: string;
}

interface SocialFeed {
    date: Date;
}

class FriendInvites implements SocialFeed {
    date = {} as Date;

}