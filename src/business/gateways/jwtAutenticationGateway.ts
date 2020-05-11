export interface JWTAutenticationGateway {
	generateToken(userId: string): string
	verifyToken(token: string): string
}