import { selectSession } from "@/core/auth/sessionSelector";
import { useSelector } from "react-redux";

/**
 * Custom hook to get current user session data
 * Follows React hooks best practices and provides session data
 */
export const useCurrentUser = () => {
  const session = useSelector(selectSession);

  return {
    userId: session.userId,
    userName: session.userName,
    userRole: session.role,
    isLoggedIn: session.isLoggedIn,
    useremail: session.useremail,
    isAdmin: session.role === "ROLE_ADMIN",
    isUser: session.role === "ROLE_USER",
  };
};
