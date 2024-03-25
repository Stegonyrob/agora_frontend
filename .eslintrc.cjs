module.exports = {
   root: true, // Esto indica que ESLint debe detenerse de buscar en archivos de configuración en directorios superiores.
   env: {
       browser: true, // Esto indica que el código se ejecutará en un entorno de navegador.
       es2020: true, // Esto indica que el código utiliza características de ES2020.
   },
   extends: [
       'eslint:recommended', // Utiliza las reglas recomendadas por ESLint.
       'plugin:react/recommended', // Utiliza las reglas recomendadas para proyectos de React.
       'plugin:react/jsx-runtime', // Asegura que ESLint pueda analizar JSX.
       'plugin:react-hooks/recommended', // Utiliza las reglas recomendadas para Hooks de React.
       'plugin:jest/recommended', // Utiliza las reglas recomendadas para Jest.
   ],
   ignorePatterns: ['dist', '.eslintrc.cjs'], // Ignora los archivos y directorios especificados.
   parserOptions: {
       ecmaVersion: 'latest', // Utiliza la versión más reciente de ECMAScript.
       sourceType: 'module', // Permite el uso de importaciones y exportaciones de módulos.
   },
   settings: {
       react: {
         version: '18.2', // Especifica la versión de React que estás utilizando.
       },
   },
   plugins: ['react-refresh', 'jest'], // Lista de plugins adicionales.
   rules: {
       'react-refresh/only-export-components': [
         'warn', // Muestra una advertencia si se exporta algo que no sea un componente React.
         { allowConstantExport: true }, // Permite exportaciones constantes.
       ],
       // Aquí puedes agregar o sobrescribir reglas específicas de Jest si es necesario.
   },
   globals: {
       "module": "readonly"
   }
  };