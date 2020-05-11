import { UserGateway } from "../business/gateways/userGateway";
import { BaseDB } from "./baseDB";
import { User } from "../business/entities/user";


export class UserDB extends BaseDB implements UserGateway {
  private userTableName = "FOOD4U_USERS";

  private mapDbDataToUser(input: any): User {
    return new User(
      input.id, 
      input.email, 
      input.password, 
      input.name, 
      input.birthDate
    );
  }

  private mapDateToDbDate(input: Date): string {
    return input.toISOString().slice(0, 19).replace('T', ' ')
  }

  public async createUser(user: User): Promise<void> {
    await this.connection.raw(`
      INSERT INTO ${this.userTableName} (id, email, password, name, birthDate) 
      VALUES(
        '${user.getId()}',
        '${user.getEmail()}',
        '${user.getPassword()}',
        '${user.getName()}',
        '${user.getBirtDate()}'
      );`
    )
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.connection.raw(
      `SELECT * FROM ${this.userTableName} WHERE email='${email}'`
    );

    return result[0][0] && this.mapDbDataToUser(result[0][0]);
  }

  public async getUserById(id: string): Promise<User | undefined> {
    const result = await this.connection.raw(
      `SELECT * FROM ${this.userTableName} WHERE id='${id}'`
    );

    return result[0][0] && this.mapDbDataToUser(result[0][0]);
  }

  public async createUserFollowRelation(followerId: string, followedId: string): Promise<void> {
    await this.connection.raw(`
      INSERT INTO FOOD4U_FOLLOWERS (follower_id, followed_id) 
      VALUES('${followerId}','${followedId}');
    `);

    const recipesResult = await this.connection.raw(`
      SELECT FOOD4U_RECIPES.*, ${this.userTableName}.email, ${this.userTableName}.name 
      FROM FOOD4U_RECIPES
      JOIN ${this.userTableName} on ${this.userTableName}.id = FOOD4U_RECIPES.userId
      WHERE userId= '${followedId}';
    `)

    const promisesArray = recipesResult[0].map(async (recipe: any) => {
      return await this.connection.raw(`
        INSERT INTO FOOD4U_FEED(
          userFeed,
          recipeId,
          title,
          description,
          creationDate,
          authorId,
          authorEmail,
          authorName
        )
        VALUES(
          '${followerId}',
          '${recipe.id}',
          '${recipe.title}',
          '${recipe.description}',
          '${this.mapDateToDbDate(recipe.creationDate)}',
          '${recipe.userId}',
          '${recipe.email}',
          '${recipe.name}'
        );
      `)
    })

    await Promise.all(promisesArray)
  }

  public async changePassword(newPassword: string, userId: string): Promise<void> {
    await this.connection.raw(`
      UPDATE ${this.userTableName} 
      SET password = '${newPassword}'
      WHERE id = '${userId}';
    `)
  }

  public async changeName(newName: string, userId: string): Promise<void> {
    await this.connection.raw(`
      UPDATE ${this.userTableName} 
      SET name = '${newName}'
      WHERE id = '${userId}';
    `)
  }

  public async changeEmail(newEmail: string, userId: string): Promise<void> {
    await this.connection.raw(`
      UPDATE ${this.userTableName} 
      SET email = '${newEmail}'
      WHERE id = '${userId}';
    `)
  }

  public async changeBirthDate(newBirthDate: Date, userId: string): Promise<void> {
    await this.connection.raw(`
      UPDATE ${this.userTableName} 
      SET birthDate = '${newBirthDate}'
      WHERE id = '${userId}';
    `)
  }

  public async updatePasswordTime(passwordTime: Date, userId: string): Promise<void> {
    await this.connection.raw(`
      UPDATE ${this.userTableName} 
      SET passwordTime = '${this.mapDateToDbDate(passwordTime)}'
      WHERE id = '${userId}';
    `)
  }

}