export class User {
  constructor(
    private id: string,
    private email: string,
    private password: string,
    private name: string,
    private birthDate: Date,
    private passwordTime?: Date
  ) { }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPassword(): string {
    return this.password
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getName(): string {
    return this.name
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getBirtDate(): Date {
    return this.birthDate
  }

  public setBirtDate(birthDate: Date): void {
    this.birthDate = birthDate;
  }

  public getPasswordTime(): Date | undefined{
    return this.passwordTime
  }

  public setPasswordTime(passwordTime: Date): void {
    this.passwordTime = passwordTime;
  }
}
