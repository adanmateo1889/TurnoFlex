# TurnoFlex
## Documentación técnica — Tercera entrega

**Desarrollo Web Backend · Node.js y Express**

> **Estado:** contenido fuente listo para revisión editorial y posterior maquetado. No es el PDF definitivo. Completar los campos de video y Drive y validar la propuesta de responsabilidades y reflexión con el equipo antes de exportar.

- **Institución:** [Completar]
- **Materia / comisión:** [Completar]
- **Docente:** [Completar]
- **Fecha de entrega:** [Completar]

---

## 1. Portada

TurnoFlex es una API REST para administrar profesionales, clientes, disponibilidades y turnos. Este documento describe el alcance técnico de la tercera entrega, la evolución del sistema, su despliegue y las pruebas reportadas por el equipo.

| Recurso | Enlace |
|---|---|
| Repositorio | https://github.com/adanmateo1889/TurnoFlex |
| Backend desplegado | https://turnoflex-kygy.onrender.com |
| Video final | [ENLACE AL VIDEO FINAL] |
| Carpeta Drive final | [ENLACE A CARPETA DRIVE FINAL] |

## 2. Integrantes

- Mateo Israel Adan
- Baca Fernando Ezequiel
- Mata Botana Raúl Alberto
- Yrala Marcelo

La distribución de responsabilidades propuesta para la tercera entrega se presenta en la sección 24 y requiere validación del equipo.

## 3. Caso de estudio: TurnoFlex

TurnoFlex organiza la agenda de un centro de atención. Permite consultar profesionales y horarios, gestionar clientes, reservar turnos y cancelar reservas. Las reglas de negocio evitan duplicaciones, conflictos de horario y reservas sobre disponibilidades ocupadas. Los cuatro actores del sistema son coordinador, recepcionista, profesional y cliente.

## 4. Objetivo de la tercera entrega

Consolidar el backend modular de las entregas previas, migrar la persistencia de desarrollo a MongoDB Atlas, desplegar el servicio en Render e incorporar usuarios con autenticación JWT y permisos por rol/propiedad. Como extensión informativa, se incorporó un asistente Gemini que responde preguntas de uso sin operar sobre turnos ni datos.

## 5. Evolución de las tres entregas

| Entrega | Alcance |
|---|---|
| Primera | Node.js, Express, API REST, persistencia JSON en `src/data/db.json`, profesionales, clientes, disponibilidades, turnos y reglas de reserva/cancelación. |
| Segunda | MongoDB local con Mongoose y `async/await`; arquitectura modular con rutas, controladores, modelos, middlewares, validaciones y manejo de errores. |
| Tercera | MongoDB Atlas, despliegue Render, usuarios, JWT, autorización por roles y propiedad, hashes bcryptjs y asistente informativo Gemini. |

Se preservan los recursos y los IDs numéricos del contrato API. `src/data/db.json` permanece como respaldo histórico y no se importa automáticamente a MongoDB.

## 6. Arquitectura actual

El cliente HTTP consume una API Express ejecutada en Render. Las rutas públicas atienden el estado raíz, la vista y el login. En las rutas protegidas, el middleware valida el JWT y la existencia/estado activo del usuario; los middlewares de autorización comprueban rol y propiedad. Los controladores aplican validaciones y reglas de negocio mediante modelos Mongoose. Estos modelos persisten en MongoDB Atlas. El controlador del asistente envía el texto validado a Gemini, sin acceso a los modelos ni a MongoDB.

**Insertar diagrama:** arquitectura y despliegue (D1 en la sección 19).

## 7. Tecnologías utilizadas

Node.js (rango declarado `>=22.0.0 <25`; Render usa Node 24; el entorno local de etapas anteriores utilizó Node 26, fuera del rango), Express 5, JavaScript, MongoDB Atlas, Mongoose, JWT (`jsonwebtoken`), bcryptjs, dotenv, Pug, Gemini API y Render. Para una grabación local, se recomienda usar Node 24.

## 8. Modelo de datos

La persistencia se compone de cinco modelos:

- **Usuario:** ID numérico, email, hash, rol, estado activo y asociación opcional con profesional o cliente.
- **Profesional** y **Cliente:** ID numérico, nombre y apellido.
- **Disponibilidad:** ID numérico, profesional, fecha, hora y estado libre/ocupado.
- **Turno:** ID numérico, profesional, cliente, disponibilidad, fecha, hora y estado (`reservado`, `cancelado` o `atendido`).

Las relaciones se expresan mediante IDs numéricos, no mediante ObjectId en el contrato de la API. Los turnos cancelados conservan su registro.

**Insertar diagrama:** modelos/clases (D3 en la sección 19).

## 9. Autenticación y autorización

`POST /auth/login` compara la contraseña con el hash bcryptjs y emite un JWT Bearer válido por una hora. En cada solicitud protegida se verifica firma y expiración y se consulta que el usuario siga activo. Desactivar la cuenta invalida el acceso de inmediato, aunque el token no haya expirado. `GET /auth/me` devuelve identidad y rol, nunca `passwordHash`.

El middleware JWT autentica; el middleware de autorización compara el rol permitido y, cuando corresponde, limita la operación al recurso asociado. Un `401` indica falta de autenticación válida; un `403`, autenticación válida sin permiso de rol o propiedad.

**Insertar diagrama:** secuencia login JWT (D4 en la sección 19).

## 10. Roles y permisos

| Rol | Permisos principales |
|---|---|
| Coordinador | Administración global de usuarios y recursos; gestión global de turnos, incluida la transición a atendido. |
| Recepcionista | Consulta profesionales/disponibilidades; administra clientes; crea y cancela turnos. |
| Profesional | Consulta perfil, disponibilidades y turnos propios; administra sus disponibilidades y marca sus turnos propios como atendidos. |
| Cliente | Consulta profesionales/disponibilidades, su perfil y sus turnos; reserva y cancela únicamente sus turnos. |

Los detalles de autorización por endpoint se encuentran en `DOCUMENTACION_API.md`; esta tabla resume las responsabilidades sin repetir la referencia completa de API.

## 11. Funcionalidades principales

- CRUD de profesionales, clientes y disponibilidades, sujeto al rol.
- Consulta de turnos con filtros y restricciones de propiedad.
- Reserva de disponibilidad libre con validación de profesional, cliente y disponibilidad.
- Cancelación sin borrado físico; una segunda cancelación responde `409`.
- Actualización de un turno reservado a atendido para los roles y la propiedad permitidos.
- Inicio de sesión, consulta de sesión y administración de usuarios por el coordinador.
- Asistente informativo disponible para cualquier usuario autenticado.

## 12. MongoDB Atlas

Atlas es la persistencia remota de producción. Mongoose conecta usando `process.env.MONGODB_URI`; las credenciales se configuran fuera del repositorio. La disponibilidad de red y las credenciales de base de datos deben estar configuradas para que Render se conecte. La conexión y persistencia fueron confirmadas por el equipo durante el cierre de despliegue.

**Evidencia sugerida:** captura de Atlas con nombres de colecciones, sin mostrar URI, credenciales ni datos personales.

## 13. Despliegue en Render

El servicio Node.js está desplegado en Render y utiliza el puerto entregado por `process.env.PORT`. La rama publicada es `tercera-entrega`. Las variables de aplicación necesarias se configuran como Environment Variables en Render; no se incluyen en el repositorio ni en esta documentación. La URL pública es https://turnoflex-kygy.onrender.com.

**Evidencia sugerida:** página del servicio indicando estado Live, con paneles de variables y logs sensibles fuera de cuadro.

## 14. Asistente Gemini

`POST /asistente` requiere JWT y admite a los cuatro roles. Recibe `{"mensaje":"..."}` y devuelve `{"respuesta":"..."}`. Utiliza Gemini para orientar sobre el uso de TurnoFlex en español.

El asistente no reserva, cancela, crea ni modifica datos, no consulta MongoDB y no recibe el JWT. El mensaje debe contener entre 1 y 1000 caracteres. Se rechazan bodies con estructura incorrecta, patrones de credenciales e intentos explícitos detectados de eludir permisos. El timeout externo es de 15 segundos; fallos, cuota y timeout se traducen en respuestas de error controladas.

Ejemplos de demostración:

- “¿Cómo reservo un turno?”: explica el proceso de consultar y seleccionar una disponibilidad libre.
- “Cancelá mi turno”: aclara que solo puede orientar y no ejecutar la cancelación.

## 15. Seguridad

- Contraseñas almacenadas como hash bcryptjs; no se devuelven hashes.
- JWT con vencimiento y verificación de cuenta activa en cada solicitud.
- Restricción por roles y propiedad de recursos.
- `.env` ignorado por Git; las variables de producción se administran fuera del repositorio.
- URI de Atlas, `JWT_SECRET`, claves, contraseñas y JWT no deben mostrarse en capturas, logs, PDF o video.
- El middleware de logging registra método y URL solicitada, no headers ni bodies. Por eso tampoco se deben colocar secretos en query strings.
- La IA tiene alcance informativo; la API no le delega operaciones ni acceso a datos.

## 16. Requerimientos funcionales

- **RF01:** administrar profesionales según permisos.
- **RF02:** administrar clientes según permisos y restricciones de propiedad.
- **RF03:** consultar y administrar disponibilidades sin duplicar profesional, fecha y hora.
- **RF04:** reservar una disponibilidad libre verificando relaciones y conflictos de horario.
- **RF05:** cancelar un turno, mantener su registro y liberar la disponibilidad.
- **RF06:** consultar turnos y filtrar resultados según el rol/propiedad.
- **RF07:** autenticar usuarios por credenciales y emitir JWT.
- **RF08:** permitir al coordinador crear usuarios y activar/desactivar cuentas.
- **RF09:** autorizar acciones por rol y restringir recursos por propiedad.
- **RF10:** consultar la sesión sin exponer información de contraseña.
- **RF11:** ofrecer orientación informativa mediante el asistente IA.

## 17. Requerimientos no funcionales

- **RNF01 — Seguridad:** autenticación, verificación de cuenta activa, autorización y protección de credenciales.
- **RNF02 — Persistencia:** Mongoose y MongoDB Atlas en producción.
- **RNF03 — Mantenibilidad:** separación modular en rutas, controladores, modelos, middlewares y utilidades.
- **RNF04 — Configuración:** secretos y conexión mediante variables de entorno; puerto de hosting provisto por Render.
- **RNF05 — Manejo de errores:** códigos HTTP para validaciones, permisos, conflictos y fallos externos.
- **RNF06 — Despliegue:** servicio Node.js disponible a través de Render.
- **RNF07 — Integración externa acotada:** límite de entrada y salida y timeout para Gemini.
- **RNF08 — Trazabilidad:** logging de método y URL; no se afirma auditoría completa ni métricas de disponibilidad o carga.

## 18. Integración con Ingeniería de Software

Los actores definidos en el modelo conceptual —coordinador, recepcionista, profesional y cliente— se corresponden con los roles técnicos aplicados por el middleware. El modelo de dominio orientó responsabilidades y casos de uso: gestión global para coordinación, tareas operativas para recepción, agenda propia para profesionales y reservas propias para clientes. Las asociaciones entre usuario y perfil sustentan las restricciones de propiedad; rutas y middlewares aplican permisos antes de que los controladores ejecuten reglas de negocio.

## 19. Diagramas

Los siete diagramas Mermaid fueron exportados a SVG en `docs/diagramas/exportados/` mediante Mermaid CLI temporal; no se añadió dependencia al proyecto. Abrir y revisar legibilidad antes de incorporarlos:

1. **D1 — Arquitectura y despliegue:** cliente HTTP, Express/Render, rutas, middleware, controladores, Mongoose/Atlas y Gemini.
2. **D2 — Casos de uso:** actores y acciones permitidas.
3. **D3 — Modelo/clases:** Usuario, Profesional, Cliente, Disponibilidad y Turno; relaciones con IDs numéricos.
4. **D4 — Secuencia de login JWT:** credenciales, bcrypt, emisión del token y verificación de usuario activo.
5. **D5 — Secuencia de reserva:** validaciones, conflicto, ocupación de disponibilidad y alta del turno.
6. **D6 — Secuencia de cancelación:** transición, liberación de disponibilidad y respuesta `409` a una repetición.
7. **D7 — Secuencia de Gemini:** validación, llamada externa sin JWT ni acceso a DB, respuesta informativa.

Las fuentes Mermaid están en `docs/ENTREGA_FINAL.md`. No es necesario añadir diagramas decorativos ni repetirlos en varias secciones.

## 20. Pruebas realizadas

Resultados según las validaciones reportadas al cerrar las etapas anteriores; no representan una nueva ejecución durante la preparación de este documento.

| Entorno | Casos reportados |
|---|---|
| Local | Inicio y conexión, autenticación, permisos, `/auth/me` sin `passwordHash`, reglas de reserva/cancelación. |
| MongoDB Atlas | Conexión remota y persistencia confirmadas durante la preparación del despliegue. |
| Render / producción | `GET /` `200`; ruta protegida sin token `401`; login `200`; reserva `201`; cancelación `200`; segunda cancelación `409`; disponibilidad liberada; Gemini en producción `200` según las validaciones reportadas. |
| Local / staging | Rol insuficiente `403`, como prueba controlada de autorización. No crear usuarios adicionales en Atlas productivo para esta evidencia. |
| Render / Gemini | Sin JWT `401`; consulta informativa `200`; intento de cancelar respondido sin ejecutar; entradas inválidas `400`; ausencia de secretos en respuestas/logs reportada. |

El equipo informó respuestas Gemini `503` transitorias durante pruebas y validación posterior `200`. No se incorporó un framework de testing automatizado como parte de esta entrega.

## 21. Problemas encontrados y soluciones

- **PowerShell y `npm.ps1`:** en el entorno Windows se usó `npm.cmd` cuando la política local impedía ejecutar el script.
- **Versiones de Node:** el proyecto declara Node `>=22.0.0 <25`; el entorno local reportado como v26.8.2 estaba fuera del rango.
- **Configuración `.env`:** se separaron secretos de código y se mantuvo el archivo ignorado por Git.
- **Atlas/Render:** se revisaron conectividad permitida, Network Access y autenticación de base de datos; posteriormente se confirmó conexión estable.
- **GitHub `403`:** se corrigió la cuenta autenticada que no tenía permisos sobre el repositorio.
- **Gemini:** se corrigió la configuración de la clave y se eligió el modelo configurado `gemini-3.5-flash-lite` tras no estar disponible el modelo Gemini 2.5 esperado en el proyecto nuevo.
- **Cuota/servicio Gemini:** respuestas `503` transitorias se siguieron con una validación posterior exitosa `200`.

No se incluyen secretos ni URI completas.

## 22. Uso de IA durante el desarrollo

Se utilizó IA generativa como apoyo al análisis de consignas, propuestas de arquitectura, generación y revisión de código, diagnóstico de errores, preparación de pruebas y documentación. Las propuestas se revisaron; el código se ejecutó y probó; se corrigieron resultados incorrectos; y la decisión final correspondió al equipo. No se aceptaron resultados sin validación.

## 23. Tecnologías no utilizadas y justificación

- **WebSocket:** no se requiere comunicación bidireccional en tiempo real para los casos de uso actuales; HTTP/REST es suficiente.
- **Sessions / Passport:** se eligió JWT Bearer para mantener el backend REST stateless respecto de sesiones del servidor; la cuenta activa se verifica en cada solicitud.
- No se añadieron TypeScript, Docker, frameworks de testing ni capas repository/hexagonales, por no formar parte del alcance de esta entrega.

## 24. Organización del equipo

**Propuesta pendiente de validación individual.** No es un registro definitivo de aportes:

| Integrante | Responsabilidad propuesta para la tercera entrega |
|---|---|
| Mateo Israel Adan | Integración, autenticación JWT y revisión transversal de reglas/contrato API. |
| Baca Fernando Ezequiel | Modelos y operaciones CRUD de profesionales/clientes, validaciones y revisión de datos. |
| Mata Botana Raúl Alberto | Disponibilidades y turnos, reglas de reserva/cancelación y pruebas de conflictos. |
| Yrala Marcelo | Middlewares de roles/propiedad, despliegue, pruebas de aceptación y documentación. |

La revisión de permisos, seguridad y aceptación es colaborativa.

## 25. Reflexión final

**Borrador para revisar entre los integrantes:** Durante las tres entregas aprendimos a pasar de una API con persistencia JSON a un backend modular con MongoDB, autenticación, permisos y despliegue en la nube. La principal dificultad fue coordinar la configuración entre el entorno local, Atlas, Render y el proveedor de IA, además de diagnosticar errores de autenticación y disponibilidad externa. Nos resultó interesante aplicar las reglas de reserva y cancelación junto con los permisos de propiedad, porque obligó a considerar tanto los estados del turno como la disponibilidad. Para seguir mejorando, conviene reforzar pruebas automatizadas, seguridad de APIs y observabilidad. TurnoFlex evolucionó gradualmente: primero resolvió las operaciones centrales, luego formalizó persistencia y arquitectura, y finalmente agregó controles de acceso, despliegue y un asistente que informa sin operar sobre los datos.

## 26. Bibliografía

- Node.js, documentación oficial: <https://nodejs.org/docs/latest/api/>
- Express: <https://expressjs.com/>
- MongoDB Manual: <https://www.mongodb.com/docs/manual/>
- MongoDB Atlas: <https://www.mongodb.com/docs/atlas/>
- Mongoose: <https://mongoosejs.com/docs/>
- RFC 7519 — JSON Web Token: <https://www.rfc-editor.org/rfc/rfc7519>
- `jsonwebtoken`: <https://github.com/auth0/node-jsonwebtoken>
- `bcryptjs`: <https://github.com/dcodeIO/bcrypt.js>
- Render: <https://render.com/docs>
- Gemini API: <https://ai.google.dev/gemini-api/docs>

## 27. Enlaces de entrega

| Recurso | Enlace |
|---|---|
| GitHub | https://github.com/adanmateo1889/TurnoFlex |
| Backend desplegado | https://turnoflex-kygy.onrender.com |
| Video final | [ENLACE AL VIDEO FINAL] |
| Carpeta Drive final | [ENLACE A CARPETA DRIVE FINAL] |

Los placeholders se completan después de cargar y verificar los enlaces finales. No reutilizar enlaces de otras entregas sin confirmación.
