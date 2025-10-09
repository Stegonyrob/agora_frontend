# 📋 PLAN DE TESTEO ÁGORA - COBERTURA 70%+

## 🎯 OBJETIVO
Lograr una cobertura de tests superior al 70% para toda la aplicación Ágora, con tests confiables y mantenibles.

## 🚨 PROBLEMAS ACTUALES IDENTIFICADOS

### 1. Problemas de Configuración
- Tests fallan por falta de contexto de Router
- Tests fallan por falta de Redux Provider
- Referencias a `jest` no definido (usando Vitest)
- Tests no pueden encontrar elementos en el DOM

### 2. Falta de Setup de Testing
- No hay wrappers para contextos (Router, Redux)
- No hay mocks para servicios API
- No hay utilities de testing compartidas

## 🔧 FASE 1: CORRECCIÓN DE INFRASTRUCTURE

### 1.1 Crear Test Utils
- `test-utils.tsx`: Wrapper con todos los providers necesarios
- `mocks/`: Mocks para servicios API y hooks
- `__tests__/setup/`: Configuración de setup común

### 1.2 Corregir Configuración Vitest
- Actualizar imports de jest → vi
- Configurar globals para Vitest
- Asegurar que setupTests.js funcione correctamente

### 1.3 Crear Test Wrappers
- RouterWrapper: Para componentes que usan useNavigate
- ReduxWrapper: Para componentes que usan useDispatch/useSelector
- AllProvidersWrapper: Combinación de todos los contextos

## 📊 FASE 2: ESTRATEGIA DE COBERTURA

### 2.1 Componentes Críticos (Prioridad Alta) - Target: 90%
```
src/assets/Components/Login/
├── FormLogin.tsx ✅ Crítico para autenticación
├── SocialLogin.tsx ✅ Login con Google
└── ResetPasswordPage.tsx ✅ Recuperación de contraseña

src/assets/Components/Register/
└── RegisterForm.tsx ✅ Registro de usuarios

src/assets/Components/NavBar/
└── NavBar.tsx ✅ Navegación principal

src/core/auth/
├── loginRepository.ts ✅ Lógica de autenticación
├── loginService.ts ✅ Servicios de login
└── ILoginDTO.ts ✅ Interfaces críticas
```

### 2.2 Componentes de Negocio (Prioridad Media) - Target: 80%
```
src/assets/Components/Blog/
├── admin/ ✅ Funcionalidades administrativas
├── posts/ ✅ Gestión de posts
└── comments/ ✅ Sistema de comentarios

src/assets/Components/Events/
└── ✅ Gestión de eventos

src/core/
├── posts/ ✅ Lógica de posts
├── events/ ✅ Lógica de eventos
└── comments/ ✅ Lógica de comentarios
```

### 2.3 Utilities y Helpers (Prioridad Media) - Target: 85%
```
src/utils/
├── avatarUtils.ts ✅ Utilidades de avatares
├── eventUtils.ts ✅ Utilidades de eventos
├── validationUtils.ts ✅ Validaciones
└── ImageCompressorToHex.tsx ✅ Compresión de imágenes

src/hooks/
├── useAvatars.tsx ✅ Hook de avatares
├── useEvents.ts ✅ Hook de eventos
├── usePostForm.ts ✅ Hook de formularios
└── useCurrentUser.ts ✅ Hook de usuario actual
```

### 2.4 Servicios y Repositorios (Prioridad Alta) - Target: 95%
```
src/core/
├── auth/ ✅ Autenticación
├── posts/ ✅ Posts
├── events/ ✅ Eventos
├── comments/ ✅ Comentarios
├── profiles/ ✅ Perfiles
└── admin/ ✅ Administración
```

## 🧪 FASE 3: TIPOS DE TESTS POR IMPLEMENTAR

### 3.1 Unit Tests (40% del esfuerzo)
- **Utilities**: Funciones puras, validaciones, transformaciones
- **Hooks**: Custom hooks con lógica de negocio
- **Services**: Servicios API con mocks
- **Stores**: Redux stores y reducers

### 3.2 Integration Tests (35% del esfuerzo)
- **Formularios**: Login, Register, Posts, Events
- **Flows**: Login → Dashboard → Create Post
- **API Integration**: Tests con mocks de API completos

### 3.3 Component Tests (25% del esfuerzo)
- **Rendering**: Componentes se renderizan correctamente
- **User Interactions**: Clicks, form submissions, navegación
- **Conditional Rendering**: Estados de loading, error, success

## 📈 FASE 4: MÉTRICAS Y TARGETS

### 4.1 Targets de Cobertura por Categoría
```
Overall Target: 70%+

Breakdown:
- Statements: 75%
- Branches: 70%
- Functions: 80%
- Lines: 75%

Por Directorio:
- src/core/: 85%+ (lógica crítica)
- src/utils/: 90%+ (funciones puras)
- src/hooks/: 80%+ (lógica de estado)
- src/assets/Components/: 65%+ (UI components)
```

### 4.2 Tests por Semana (Cronograma 4 semanas)
```
Semana 1: Infrastructure + Core Services
- Setup de testing utils ✅
- Tests de auth services ✅
- Tests de validation utils ✅
- Target: 30% cobertura

Semana 2: Critical Components
- Login/Register components ✅
- Navigation components ✅
- Post/Event forms ✅
- Target: 50% cobertura

Semana 3: Business Logic
- Hooks testing ✅
- Store testing ✅
- Integration flows ✅
- Target: 65% cobertura

Semana 4: Coverage Completion
- Remaining components ✅
- Edge cases ✅
- Performance tests ✅
- Target: 75%+ cobertura
```

## 🛠️ FASE 5: HERRAMIENTAS Y CONFIGURACIÓN

### 5.1 Testing Stack
```
- Framework: Vitest ✅
- Coverage: V8 ✅
- DOM Testing: @testing-library/react ✅
- User Events: @testing-library/user-event
- Mocking: vi (Vitest) ✅
- Assertions: expect (Vitest) ✅
```

### 5.2 Configuraciones Necesarias
```
vitest.config.ts:
- jsdom environment ✅
- coverage thresholds (70%) ✅
- test file patterns ✅
- setup files ✅

setupTests.js:
- @testing-library/jest-dom ✅
- global mocks ✅
- custom matchers ✅
```

## 📋 FASE 6: CHECKLIST DE IMPLEMENTACIÓN

### Tests Infrastructure ✅
- [ ] Crear test-utils.tsx con all providers wrapper
- [ ] Configurar mocks para API services
- [ ] Configurar mocks para React Router
- [ ] Configurar mocks para Redux
- [ ] Actualizar setupTests.js

### Critical Path Tests
- [ ] FormLogin component tests
- [ ] SocialLogin component tests
- [ ] RegisterForm component tests
- [ ] NavBar component tests
- [ ] LoginRepository service tests
- [ ] AuthService tests

### Business Logic Tests
- [ ] usePostForm hook tests
- [ ] useEvents hook tests
- [ ] useCurrentUser hook tests
- [ ] EventStore tests
- [ ] Post CRUD tests
- [ ] Comment system tests

### Utility Tests
- [ ] avatarUtils tests
- [ ] eventUtils tests
- [ ] validationUtils tests
- [ ] ImageCompressor tests

### Integration Tests
- [ ] Login flow tests
- [ ] Post creation flow tests
- [ ] Event management flow tests
- [ ] Admin dashboard flow tests

## 🚀 COMANDOS PARA EJECUTAR

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests de un directorio específico
npm run test src/core/auth/

# Verificar cobertura mínima
npm run test:coverage -- --reporter=text --reporter=html
```

## 📊 REPORTES Y MONITORING

### Reportes de Cobertura
- HTML Report: `coverage/index.html`
- JSON Report: `coverage/coverage-final.json`
- Text Report: Console output

### CI/CD Integration
- Tests deben pasar antes de merge
- Cobertura mínima 70% requerida
- Reports automáticos en PRs

---

## 📝 NOTAS IMPORTANTES

1. **Priorizar tests que fallen actualmente**: Comenzar arreglando la infrastructure
2. **Usar mocks apropiados**: No hacer calls reales a APIs en tests
3. **Tests determinísticos**: Evitar tests que dependan de timing o estado externo
4. **Documentar casos edge**: Comentar tests complejos y casos límite
5. **Mantener tests simples**: Un test por concepto, nombres descriptivos

**Inicio estimado**: Inmediato
**Completion target**: 4 semanas
**Cobertura objetivo**: 75%+