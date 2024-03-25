module.exports = {
   presets: [
     '@babel/preset-env',
     '@babel/preset-react',
     '@babel/preset-typescript',
   ],
   plugins: [
     '@babel/plugin-transform-modules-commonjs', // Agregar soporte para módulos ECMAScript
   ],
 };