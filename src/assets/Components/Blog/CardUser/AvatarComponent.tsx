import React, { ChangeEvent, useRef, useState } from 'react';
import styles from './AvatarComponent.module.scss';

interface AvatarProps {
  avatar: string;
}
const AvatarComponent: React.FC<AvatarProps> = ({ avatar }) => {
  const [avatarSrc, setAvatarSrc] = useState<string>('../../../../../public/images/avatar.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);





  const handleImageChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event: ProgressEvent<FileReader>) {
        setAvatarSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div >
      <img className={styles.avatar} src={avatarSrc} alt="Avatar por defecto" />

      <i className="bi bi-plus-circle" style={{ width: "5px" }} onClick={handleImageChange}></i>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarComponent;
// import React, { ChangeEvent, createContext, useCallback, useRef, useState } from 'react';
// import styles from './AvatarComponent.module.scss';

// interface AvatarProps {
//   avatar: string;
// }

// const AvatarContext = createContext({
//   setAvatar: (file: File | null) => { },
// });

// const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [avatarSrc, setAvatarSrc] = useState<string>('../../../public/images/avatar.jpg');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target?.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (event: ProgressEvent<FileReader>) {
//         if (event.target?.result) {
//           setAvatarSrc(event.target.result as string);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   const handleAvatarChange = (file: File | null) => {
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (event: ProgressEvent<FileReader>) {
//         if (event.target?.result) {
//           setAvatarSrc(event.target.result as string);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <AvatarContext.Provider value={{ setAvatar: handleAvatarChange }}>
//       <div>
//         <img className={styles.avatar} src={avatarSrc} alt="Avatar por defecto" />

//         <i className="bi bi-plus-circle" style={{ width: "5px" }} onClick={() => fileInputRef.current?.click()} />

//         <input
//           type="file"
//           ref={fileInputRef}
//           style={{ display: 'none' }}
//           onChange={handleFileChange}
//         />
//         {children}
//       </div>
//     </AvatarContext.Provider>
//   );
// };

// export { AvatarContext, AvatarProvider };
