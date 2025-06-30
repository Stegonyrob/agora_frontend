-- Script para insertar avatares del sistema en la base de datos
-- Avatar 1 es el default para usuarios nuevos
-- Avatar onron es exclusivo del admin pero NO es default del sistema
INSERT INTO
    avatars (
        image_name,
        image_data,
        preloaded,
        is_default,
        display_name,
        image_url
    )
VALUES
    -- Avatar default para usuarios nuevos
    (
        '1.png',
        NULL,
        true,
        true,
        'Avatar amarillo sonriente',
        '/images/avatars/1.png'
    ),
    -- Resto de avatares regulares
    (
        '2.png',
        NULL,
        true,
        false,
        'Avatar 2',
        '/images/avatars/2.png'
    ),
    (
        '3.png',
        NULL,
        true,
        false,
        'Avatar 3',
        '/images/avatars/3.png'
    ),
    (
        '4.png',
        NULL,
        true,
        false,
        'Avatar 4',
        '/images/avatars/4.png'
    ),
    (
        '5.png',
        NULL,
        true,
        false,
        'Avatar 5',
        '/images/avatars/5.png'
    ),
    (
        '6.png',
        NULL,
        true,
        false,
        'Avatar 6',
        '/images/avatars/6.png'
    ),
    (
        '7.png',
        NULL,
        true,
        false,
        'Avatar 7',
        '/images/avatars/7.png'
    ),
    (
        '8.png',
        NULL,
        true,
        false,
        'Avatar 8',
        '/images/avatars/8.png'
    ),
    (
        '9.png',
        NULL,
        true,
        false,
        'Avatar 9',
        '/images/avatars/9.png'
    ),
    (
        '10.png',
        NULL,
        true,
        false,
        'Avatar 10',
        '/images/avatars/10.png'
    ),
    (
        '11.png',
        NULL,
        true,
        false,
        'Avatar 11',
        '/images/avatars/11.png'
    ),
    (
        '12.png',
        NULL,
        true,
        false,
        'Avatar 12',
        '/images/avatars/12.png'
    ),
    (
        '13.png',
        NULL,
        true,
        false,
        'Avatar 13',
        '/images/avatars/13.png'
    ),
    (
        '14.png',
        NULL,
        true,
        false,
        'Avatar 14',
        '/images/avatars/14.png'
    ),
    (
        '15.png',
        NULL,
        true,
        false,
        'Avatar 15',
        '/images/avatars/15.png'
    ),
    (
        '16.png',
        NULL,
        true,
        false,
        'Avatar 16',
        '/images/avatars/16.png'
    ),
    (
        '17.png',
        NULL,
        true,
        false,
        'Avatar 17',
        '/images/avatars/17.png'
    ),
    (
        '18.png',
        NULL,
        true,
        false,
        'Avatar 18',
        '/images/avatars/18.png'
    ),
    (
        '19.png',
        NULL,
        true,
        false,
        'Avatar 19',
        '/images/avatars/19.png'
    ),
    (
        '20.png',
        NULL,
        true,
        false,
        'Avatar 20',
        '/images/avatars/20.png'
    ),
    (
        '21.png',
        NULL,
        true,
        false,
        'Avatar 21',
        '/images/avatars/21.png'
    ),
    (
        '22.png',
        NULL,
        true,
        false,
        'Avatar 22',
        '/images/avatars/22.png'
    ),
    (
        '23.png',
        NULL,
        true,
        false,
        'Avatar 23',
        '/images/avatars/23.png'
    ),
    (
        '24.png',
        NULL,
        true,
        false,
        'Avatar 24',
        '/images/avatars/24.png'
    ),
    (
        '25.png',
        NULL,
        true,
        false,
        'Avatar 25',
        '/images/avatars/25.png'
    ),
    (
        '26.png',
        NULL,
        true,
        false,
        'Avatar 26',
        '/images/avatars/26.png'
    ),
    (
        '27.png',
        NULL,
        true,
        false,
        'Avatar 27',
        '/images/avatars/27.png'
    ),
    (
        '28.png',
        NULL,
        true,
        false,
        'Avatar 28',
        '/images/avatars/28.png'
    ),
    -- Avatar exclusivo del admin (NO es default del sistema)
    (
        'onron.png',
        NULL,
        true,
        false,
        'Avatar Onron (Admin)',
        '/images/avatars/onron.png'
    );

-- Verificar que se insertaron correctamente
SELECT
    COUNT(*) as total_avatars
FROM
    avatars
WHERE
    preloaded = true;

SELECT
    COUNT(*) as default_avatars
FROM
    avatars
WHERE
    is_default = true;