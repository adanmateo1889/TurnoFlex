# Guion para el video final — TurnoFlex

**Duración objetivo:** aproximadamente 17 minutos, incluyendo demostraciones y cambios de pantalla.
**Participantes:** Mateo Israel Adan, Baca Fernando Ezequiel, Mata Botana Raúl Alberto y Yrala Marcelo.
**Enfoque:** novedades de la tercera entrega, con un repaso breve de lo ya presentado en las entregas anteriores.

## Cronograma

| Tiempo | Duración | Integrante | Contenido |
|---|---:|---|---|
| 00:00–03:50 | 3:50 | Mateo Israel Adan | Presentación, evolución, actores, decisiones de arquitectura y diagramas |
| 03:50–07:40 | 3:50 | Baca Fernando Ezequiel | MongoDB local y Atlas, Mongoose, colecciones, usuarios y credenciales |
| 07:40–12:00 | 4:20 | Mata Botana Raúl Alberto | Autenticación, autorización y demostración del ciclo del turno |
| 12:00–15:50 | 3:50 | Yrala Marcelo | Render, pruebas Gemini, límites del asistente y uso de IA en el desarrollo |
| 15:50–17:00 | 1:10 | Los cuatro | Reflexión individual y agradecimiento |
| **Total** | **17:00** |  |  |

Los tiempos incluyen las acciones de pantalla. Si una petición tarda, esperar unos segundos y pasar a la captura de respaldo para no extender el video. No hace falta narrar mientras se carga una pantalla.

## 1. Mateo Israel Adan — 00:00–03:50

**Qué mostrar, en orden:** al inicio, los cuatro integrantes en cámara y el título TurnoFlex. Después, [casos de uso](./diagramas/exportados/02-casos-de-uso.svg), [modelo de clases](./diagramas/exportados/03-modelo-clases.svg) y [arquitectura y despliegue](./diagramas/exportados/01-arquitectura-general-despliegue.svg). Dedicar unos segundos a cada diagrama, sin volver a explicar funcionalidades ya presentadas.

**Texto sugerido para decir:**

> “Hola, somos Mateo Israel Adan, Baca Fernando Ezequiel, Mata Botana Raúl Alberto y Yrala Marcelo. En este video presentamos la tercera entrega de TurnoFlex. Nos vamos a concentrar en qué agregamos en esta etapa y en cómo comprobamos que funciona: autenticación, permisos, persistencia en Atlas, despliegue en Render y el asistente informativo.”
>
> “Para ubicar el proyecto, en la primera entrega construimos las operaciones principales de la agenda. En la segunda organizamos el backend y trabajamos con MongoDB local. En esta tercera mantenemos ese núcleo y lo llevamos a un escenario más completo: agregamos usuarios con roles, una base remota en Atlas, el despliegue y el asistente. No vamos a recorrer otra vez todos los CRUD; vamos a mostrar los cambios y las decisiones que los conectan.”
>
> “Acá vemos los casos de uso. Los actores son coordinador, recepcionista, profesional y cliente. Una decisión importante de Ingeniería de Software fue que estos actores no quedaran solo como nombres en un diagrama: los convertimos en roles de autorización que determinan qué acciones puede hacer cada usuario. También contemplamos la propiedad. Por ejemplo, un cliente trabaja con sus propios turnos, y un profesional con su propia agenda. Así conectamos los requisitos con las reglas que después aplica el backend.”
>
> “En el modelo aparecen los usuarios y los recursos de la agenda. El usuario puede estar relacionado con un cliente o con un profesional, y esas relaciones ayudan a comprobar a quién pertenece un recurso. La arquitectura muestra el recorrido general: la solicitud entra por una ruta, pasa por los controles de autenticación y autorización, llega al controlador y, cuando corresponde, a la persistencia.”
>
> “Para autenticar elegimos JWT porque TurnoFlex ofrece una API REST: el cliente manda el token en cada solicitud protegida y el servidor puede validarlo sin mantener una sesión de usuario en memoria entre peticiones. Por eso no incorporamos sesiones ni Passport; elegimos el flujo de JWT que se ajusta a esta API. Tampoco agregamos WebSocket. Los casos de uso actuales son solicitudes y respuestas normales: no necesitamos comunicación bidireccional en tiempo real, así que una conexión persistente habría agregado complejidad sin resolver una necesidad actual.”

**Transición a Fernando:**

> “Fernando va a mostrar cómo pasamos de la base local a Atlas y qué cambió en el modelo para incorporar usuarios.”

## 2. Baca Fernando Ezequiel — 03:50–07:40

**Qué mostrar, en orden:** primero la lista de colecciones en Atlas, sin abrir documentos; después el [modelo de clases](./diagramas/exportados/03-modelo-clases.svg). Evitar mostrar datos de conexión, usuarios, documentos con datos personales o valores de variables de entorno.

**Texto sugerido para decir:**

> “En la segunda entrega trabajábamos con MongoDB local, que nos servía para desarrollar y probar en nuestra computadora. Para esta tercera entrega conectamos el backend a MongoDB Atlas, que aloja la base de datos de forma remota. La aplicación accede a ella a través de Mongoose. Mongoose nos permite definir modelos, validar la forma de los datos y trabajar con las colecciones desde el código sin tener que escribir todas las operaciones de bajo nivel directamente.”
>
> “Acá se ven las cinco colecciones: `profesionales`, `clientes`, `disponibilidades`, `turnos` y `usuarios`. Las cuatro primeras representan los recursos de la agenda que ya conocíamos. La novedad del modelo es `Usuario`: ahora hay una entidad para las cuentas que inician sesión, su rol y su estado. Eso separa la identidad y la autenticación de los datos del perfil de cliente o profesional.”
>
> “La relación de un usuario con un perfil es opcional: según el caso, puede tener `clienteId` o `profesionalId`. No significa que cada cuenta tenga que apuntar a los dos. Esa asociación se usa luego para aplicar las restricciones de propiedad. El coordinador, por ejemplo, puede tener un rol global sin ser un cliente ni un profesional; una cuenta de cliente se vincula con su cliente, y una cuenta profesional con su perfil profesional.”
>
> “Para las contraseñas usamos bcrypt. No guardamos la contraseña original, porque si alguien pudiera leer la base de datos tendría acceso directo a las credenciales. Guardamos un hash y, durante el login, comparamos la contraseña ingresada con ese hash. La aplicación no necesita recuperar la contraseña original.”
>
> “La URI de Atlas y los secretos de autenticación se configuran mediante variables de entorno. El archivo `.env` se usa para la configuración local, pero no se versiona en Git; así evitamos publicar credenciales junto con el código. En esta grabación mostramos solo los nombres de las colecciones y el modelo, nunca valores reales de conexión o secretos.”
>
> “La diferencia principal entre las entregas, entonces, es que dejamos de depender de una base local para la ejecución desplegada y agregamos usuarios al modelo. Mongoose hace de puente entre las entidades que definimos y las colecciones de MongoDB.”

**Transición a Raúl:**

> “Ahora que vimos dónde se guardan las cuentas y los turnos, Raúl va a mostrar qué respuestas devuelve la API cuando autenticamos, reservamos y cancelamos.”

## 3. Mata Botana Raúl Alberto — 07:40–12:00

**Qué mostrar, en orden:** Thunder Client con solicitudes preparadas. Mostrar login `200`, ruta protegida sin token `401`, captura local/staging del rol insuficiente `403`, reserva `201`, cancelación `200`, segunda cancelación `409` y disponibilidad restaurada. Ocultar tokens y datos personales. No mostrar el JWT completo en ningún momento.

**Texto sugerido para decir:**

> “Voy a mostrar el flujo sin repetir todos los endpoints. Primero hacemos login con una cuenta de demostración. La respuesta es `200`, que indica que la autenticación fue correcta. La API devuelve un JWT para las solicitudes protegidas; lo mantenemos oculto, porque es una credencial y no queremos que quede expuesta en el video.”
>
> “Ahora consultamos una ruta protegida sin enviar token y recibimos `401`. Ese código significa que no hay una autenticación válida: puede faltar el token o no ser válido. Todavía no estamos hablando de permisos; primero la API tiene que saber quién está haciendo la solicitud.”
>
> “Esta otra evidencia es un `403` y está tomada en local o staging. En este caso sí hay una identidad autenticada, pero el rol no tiene permiso para esa operación. Además, la autorización no depende solamente del rol. Cuando corresponde, también verificamos la propiedad: un cliente no debería poder operar sobre el turno de otro cliente y un profesional solo debería administrar sus propios recursos. Por eso autenticación, rol y propiedad se comprueban como partes relacionadas, no como una sola condición.”
>
> “Ahora reservamos una disponibilidad de demostración. La respuesta es `201`, que indica que se creó el turno. La operación también marca esa disponibilidad como ocupada para evitar que se reserve de nuevo mientras el turno sigue activo.”
>
> “Cancelamos el turno y recibimos `200`. No borramos el registro: lo dejamos con estado cancelado para conservar el resultado de la operación. Al mismo tiempo liberamos la disponibilidad, porque ya no hay una reserva activa que bloquee ese horario. Así ese espacio puede volver a estar disponible.”
>
> “Repetimos exactamente la cancelación y recibimos `409`. La solicitud tiene una forma válida, pero entra en conflicto con el estado actual del recurso: ese turno ya está cancelado. El `409` comunica mejor esta situación que responder como si se hubiera cancelado una segunda vez.”
>
> “Por último, consultamos la disponibilidad y vemos que volvió a estar libre. Esta prueba junta varias reglas: el turno mantiene su historial, la cancelación no se repite y el horario queda consistente con el estado del turno.”

**Acciones de pantalla y tiempo aproximado:**

1. **07:40–08:15 — Login:** `POST /auth/login` → `200`; ocultar el token.
2. **08:15–08:35 — Sin token:** ruta protegida sin header `Authorization` → `401`; confirmar que no haya un token heredado.
3. **08:35–09:00 — Rol insuficiente:** mostrar `403` local/staging, identificado como tal.
4. **09:00–09:40 — Reserva:** ejecutar la solicitud demo → `201`.
5. **09:40–10:15 — Cancelación:** cancelar el turno → `200`.
6. **10:15–10:40 — Repetición:** repetir la misma cancelación → `409`.
7. **10:40–11:00 — Disponibilidad:** consultar y mostrar `disponible: true`.
8. **11:00–12:00 — Explicación:** señalar brevemente las respuestas; si alguna petición tarda, usar la captura de respaldo y dejar tiempo para el cambio de pantalla.

**Transición a Marcelo:**

> “Con este flujo vimos cómo los permisos y las reglas de negocio se reflejan en respuestas concretas. Marcelo va a cerrar con el servicio en Render y el asistente, que tiene un alcance distinto al de estas operaciones.”

## 4. Yrala Marcelo — 12:00–15:50

**Qué mostrar, en orden:** Render con estado **Live** y la URL pública `https://turnoflex-kygy.onrender.com`; después `POST /asistente` con “¿Cómo reservo un turno?” y con “Cancelá mi turno”, ambos con respuesta `200`; finalmente, [secuencia del asistente Gemini](./diagramas/exportados/07-secuencia-asistente-gemini.svg). No abrir variables, logs sensibles ni credenciales.

**Texto sugerido para decir:**

> “El backend está desplegado en Render y el servicio aparece Live en esta URL pública. Render entrega las variables de entorno que necesita la aplicación para conectarse y funcionar. Los secretos no están en Git: no hace falta mostrar el panel de configuración para comprobar que el servicio está activo, así que mantenemos esos valores fuera de pantalla.”
>
> “La API propia y Gemini cumplen funciones distintas. TurnoFlex recibe la solicitud, valida la entrada y aplica los controles de acceso. Si corresponde responder una consulta informativa, el backend envía el texto necesario al proveedor Gemini y procesa la respuesta. Gemini no reemplaza a nuestras rutas ni decide si un usuario puede modificar un turno.”
>
> “Probamos primero ‘¿Cómo reservo un turno?’. El asistente responde `200` con una orientación en español. Ahora le pedimos ‘Cancelá mi turno’. También obtenemos `200`, pero la respuesta aclara que no puede efectuar la cancelación. Es importante distinguir un `200` de una operación realizada: acá significa que el asistente respondió correctamente, no que haya cambiado un turno.”
>
> “En la secuencia se ve el límite de la integración. El usuario presenta el JWT a la API de TurnoFlex para autenticarse; Gemini no recibe ese JWT. El backend le envía una instrucción y el mensaje validado. Gemini no consulta MongoDB y no ejecuta reservas ni cancelaciones. Para cambiar el estado de un turno hay que volver a las rutas de negocio, con su autenticación y sus permisos.”
>
> “El diagrama también resume los otros resultados posibles: `400` si la entrada no pasa la validación, `401` si falta o es inválido el JWT, `200` para una respuesta correcta y `502`, `503` o `504` si hay un error o una demora del proveedor. Así podemos separar los errores de nuestra API de los problemas que vienen del servicio externo.”
>
> “Durante el desarrollo también usamos herramientas de IA como apoyo para analizar problemas, proponer código, diagnosticar errores, pensar pruebas y mejorar documentación. No aceptamos esas propuestas automáticamente: el equipo las revisó, las ejecutó y las corrigió cuando hacía falta. La responsabilidad de integrar y verificar los cambios siguió siendo nuestra.”

**Transición al cierre grupal:**

> “Para terminar, cada uno va a compartir brevemente qué aprendizaje se lleva de esta entrega.”

## 5. Cierre grupal — 15:50–17:00

**Qué mostrar:** los cuatro integrantes en cámara. No navegar por el sistema durante el cierre. Dejar unos segundos entre intervenciones para que cada voz se escuche con claridad.

**Texto sugerido para decir:**

- **Mateo:** “En este proyecto vimos cómo una necesidad de gestión se convierte en una arquitectura y en roles concretos. Para mí, una parte importante fue conectar los actores con los permisos y ordenar las responsabilidades de cada componente.”
- **Fernando:** “Yo me llevo el aprendizaje de pasar de una base local a una persistencia remota y de entender que configurar el acceso también implica cuidar las credenciales. No alcanza con que la aplicación funcione: hay que evitar exponer secretos.”
- **Raúl:** “En las pruebas vimos que las reglas de negocio importan tanto como el endpoint. Los códigos `401`, `403` y `409` describen situaciones distintas, y respetar los permisos y el estado del turno mantiene coherente la agenda.”
- **Marcelo:** “También aprendimos a desplegar y a integrar un servicio externo sin delegarle las decisiones del sistema. La IA y Gemini pueden ayudar o informar, pero sus límites tienen que estar claros y sus resultados hay que revisarlos.”
- **Mateo:** “Gracias por acompañarnos y por ver la presentación de TurnoFlex.”

## Preparación antes de grabar

- Confirmar que Render esté Live y preparar capturas de respaldo para el caso de demoras del servicio o de Gemini.
- Comprobar que la disponibilidad demo esté libre antes de grabar. No modificar datos productivos para forzar el flujo.
- La evidencia `403` debe ser de local o staging y estar identificada en pantalla; no presentarla como una petición a Render.
- Revisar que Thunder Client no conserve un token al mostrar el caso `401`. Ocultar el JWT en la respuesta de login y en todas las solicitudes.
- Mostrar en Atlas solamente los nombres de las cinco colecciones. No abrir documentos internos con datos personales.
- No mostrar `.env`, valores de variables de Render, `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, contraseñas, tokens ni credenciales.
- Si se usan capturas en vez de una petición en vivo, decirlo con claridad y no presentarlas como una ejecución recién realizada.
