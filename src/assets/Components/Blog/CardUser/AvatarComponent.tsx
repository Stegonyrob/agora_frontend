import React, { ChangeEvent, useRef, useState } from 'react';
import styles from './AvatarComponent.module.scss';
const AvatarComponent: React.FC = () => {
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
      
        <i className="bi bi-plus-circle"  style={{ width: "5px" }}onClick={handleImageChange}></i>
     
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