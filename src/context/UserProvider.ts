// import React, { createContext, useEffect, useState } from "react";
// import UserContext from "./UserContext";
// import IProfileDTO from "../core/profiles/IProfileDTO";
// import ProfileService from "../core/profiles/ProfileService";
// import { Provider } from 'react-redux';

// interface UserProviderProps {
//   children: React.ReactNode;
//   profile: IProfileDTO | null;
// }

// const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//   const [profile, setProfile] = useState<IProfileDTO | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const profileData = await ProfileService.getProfileById(1); // Assuming a default ID for the example
//         setProfile(profileData);
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <UserContext.Provider value={{ profile }}>
//       <Provider store={store}>
//         {children}
//       </Provider>
//     </UserContext.Provider>
//   );
//   }, []);

// export default UserProvider;
