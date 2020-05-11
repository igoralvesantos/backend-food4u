import { RecipeFeed } from "../entities/recipeFeed";

export interface FeedGateway {
    getFeed(userId: string): Promise<RecipeFeed[]>
}