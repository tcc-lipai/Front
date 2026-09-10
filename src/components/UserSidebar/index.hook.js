import { useState } from "react";

export const useUserSidebar = () => {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      console.log("Arquivo pronto para enviar pro servidor:", file);
    }
  };

  return {
    avatar,
    handleAvatarUpload,
  };
};
