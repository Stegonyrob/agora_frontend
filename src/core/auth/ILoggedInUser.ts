
export interface ILoggedInUser {
    token: string | null
    email: string
    username:string
    role:string
    isAuthenticated: boolean
    userId: string
}