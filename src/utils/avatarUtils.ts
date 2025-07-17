/**
 * Utilidades para el manejo de avatares en Ágora
 * Incluye funciones para selección aleatoria de avatares por defecto
 */

// Lista de avatares predefinidos - Colección Ágora 3D/Cartoon generados por IA
const avatarList = [
  { name: "Avatar Aventurero", src: "/images/avatars/1.png" },
  { name: "Avatar Creativo", src: "/images/avatars/2.png" },
  { name: "Avatar Explorador", src: "/images/avatars/3.png" },
  { name: "Avatar Genial", src: "/images/avatars/4.png" },
  { name: "Avatar Brillante", src: "/images/avatars/5.png" },
  { name: "Avatar Amigable", src: "/images/avatars/6.png" },
  { name: "Avatar Divertido", src: "/images/avatars/7.png" },
  { name: "Avatar Curioso", src: "/images/avatars/8.png" },
  { name: "Avatar Alegre", src: "/images/avatars/9.png" },
  { name: "Avatar Ingenioso", src: "/images/avatars/10.png" },
  { name: "Avatar Estudioso", src: "/images/avatars/11.png" },
  { name: "Avatar Entusiasta", src: "/images/avatars/12.png" },
  { name: "Avatar Optimista", src: "/images/avatars/13.png" },
  { name: "Avatar Colaborativo", src: "/images/avatars/14.png" },
  { name: "Avatar Motivado", src: "/images/avatars/15.png" },
  { name: "Avatar Innovador", src: "/images/avatars/16.png" },
  { name: "Avatar Sonriente", src: "/images/avatars/17.png" },
  { name: "Avatar Energético", src: "/images/avatars/18.png" },
  { name: "Avatar Pensativo", src: "/images/avatars/19.png" },
  { name: "Avatar Inspirador", src: "/images/avatars/20.png" },
  { name: "Avatar Empático", src: "/images/avatars/21.png" },
  { name: "Avatar Reflexivo", src: "/images/avatars/22.png" },
  { name: "Avatar Determinado", src: "/images/avatars/23.png" },
  { name: "Avatar Perseverante", src: "/images/avatars/24.png" },
  { name: "Avatar Sociable", src: "/images/avatars/25.png" },
  { name: "Avatar Paciente", src: "/images/avatars/26.png" },
  { name: "Avatar Valiente", src: "/images/avatars/27.png" },
  { name: "Avatar Sabio", src: "/images/avatars/28.png" },
];

/**
 * Obtiene un avatar aleatorio de la colección para usuarios nuevos
 * @returns {string} URL del avatar seleccionado aleatoriamente
 */
export const getRandomDefaultAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * avatarList.length);
  return avatarList[randomIndex].src;
};

/**
 * Obtiene la lista completa de avatares disponibles
 * @returns {Array} Lista de avatares con nombre y src
 */
export const getAvatarList = () => {
  return [...avatarList];
};

/**
 * Obtiene el nombre de un avatar basado en su src
 * @param {string} src - URL del avatar
 * @returns {string} Nombre del avatar o "Avatar Personalizado" si no se encuentra
 */
export const getAvatarNameBySrc = (src: string): string => {
  const avatar = avatarList.find((avatar) => avatar.src === src);
  return avatar ? avatar.name : "Avatar Personalizado";
};
export function getAvatarUrlByUserId(
  userId: number,
  profiles: any[],
  avatars: any[]
): string {
  const profile = profiles.find((p) => p.userId === userId);
  if (!profile) return "/images/avatarGeneric.png";
  const avatar = avatars.find((a) => a.id === profile.avatar_id);
  return avatar?.imagePath || "/images/avatarGeneric.png";
}
