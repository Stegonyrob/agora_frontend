-- Corregir avatares default - Solo Avatar 1 debe ser default para usuarios nuevos
-- Avatar onron es exclusivo del admin pero NO es el default del sistema
-- Paso 1: Quitar default a todos los avatares
UPDATE avatars
SET
    is_default = false
WHERE
    is_default = true;

-- Paso 2: Marcar solo Avatar 1 como default del sistema
UPDATE avatars
SET
    is_default = true
WHERE
    image_name = '1.png';

-- Verificar que solo hay un avatar default
SELECT
    id,
    image_name,
    display_name,
    is_default
FROM
    avatars
WHERE
    is_default = true;

-- Verificar que onron está disponible pero no es default
SELECT
    id,
    image_name,
    display_name,
    is_default
FROM
    avatars
WHERE
    image_name = 'onron.png';