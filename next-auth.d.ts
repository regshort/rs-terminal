import "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      defaultWorkspaceId: string
      image: string
      name: ReactNode
      isModerator: boolean
      isAdmin: boolean
      id: string
      /** The user's postal address. */
      canAccess: boolean
    }
  }
}
