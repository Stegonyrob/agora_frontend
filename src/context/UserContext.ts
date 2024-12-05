import React from "react";
import IProfileDTO from "../core/profiles/IProfileDTO";

interface UserContextType {
  profile: IProfileDTO | null;
}

const UserContext = React.createContext<UserContextType>({ profile: null });

export default UserContext;
