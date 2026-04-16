/**
 * Test básico para las utilidades de avatar
 * Ejecutar este archivo para verificar que todo funciona correctamente
 */

import {
  getAvatarList,
  getAvatarNameBySrc,
  getRandomDefaultAvatar,
} from "../src/utils/avatarUtils";

console.log("🧪 Probando utilidades de avatar...\n");

// Test 1: Obtener avatar aleatorio
console.log("1. Obteniendo avatar aleatorio:");
for (let i = 0; i < 5; i++) {
  const randomAvatar = getRandomDefaultAvatar();
  console.log(`   Avatar ${i + 1}: ${randomAvatar}`);
}

// Test 2: Obtener lista de avatares
console.log("\n2. Lista de avatares disponibles:");
const avatarList = getAvatarList();
console.log(`   Total de avatares: ${avatarList.length}`);
console.log(`   Primeros 3 avatares:`, avatarList.slice(0, 3));

// Test 3: Obtener nombre por src
console.log("\n3. Obteniendo nombres por src:");
console.log(`   Avatar 1: ${getAvatarNameBySrc("/images/avatars/1.png")}`);
console.log(
  `   Avatar personalizado: ${getAvatarNameBySrc("https://custom-avatar.jpg")}`
);

console.log("\n✅ Todos los tests completados!");
