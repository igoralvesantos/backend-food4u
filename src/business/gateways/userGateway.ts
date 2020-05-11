import { User } from "../entities/user";

export interface UserGateway {
  createUser(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUserFollowRelation(followerId: string, followedId: string): Promise<void>;
  changePassword(newPassword: string, userId: string): Promise<void>;
  changeBirthDate(newBirthDate: Date, userId: string): Promise<void>;
  changeEmail(newEmail: string, userId: string): Promise<void>;
  changeName(newName: string, userId: string): Promise<void>;
  updatePasswordTime(passwordTime: Date, userId: string): Promise<void>;
}
