import { Recipe } from "./recipe";

export class RecipeFeed extends Recipe {
  constructor(
    id: string,
    title: string,
    description: string,
    creationDate: Date,
    userId: string,
    private userEmail: string,
    private userName: string
  ) { 
    super(id, title, description, creationDate, userId) 
  }
  
  public getUserEmail(): string {
    return this.userEmail;
  }

  public setUserEmail(userEmail: string): void {
    this.userEmail = userEmail;
  }

  public getUserName(): string {
    return this.userName;
  }

  public setUserName(userName: string): void {
    this.userName = userName;
  }
}