import { useState } from 'react';

export const useUserSidebar = (initialTab = 'perfil') => {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [avatar, setAvatar] = useState(null); 
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl); 
      
      console.log("Arquivo pronto para enviar pro servidor:", file);
    }
  };

  return {
    currentTab,
    avatar,
    handleTabChange,
    handleAvatarUpload,
  };
};