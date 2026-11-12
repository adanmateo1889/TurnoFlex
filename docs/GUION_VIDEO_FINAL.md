# Guion de video final — TurnoFlex

| Parámetro | Definición |
|---|---|
| Duración objetivo | 17 minutos (admisible: 15–20) |
| Formato | Los cuatro integrantes aparecen en cámara y hablan; la pantalla compartida se usa para la demostración. |
| Énfasis | Novedades de la tercera entrega, evitando explicar lentamente toda la API anterior. |

## Distribución y tiempos

| Tiempo | Duración | Responsable | Contenido |
|---|---:|---|---|
| 00:00–00:45 | 0:45 | Mateo | Presentar proyecto, materia y equipo; todos aparecen en cámara. |
| 00:45–04:15 | 3:30 | Mateo | Caso de uso, evolución breve, objetivo de la tercera entrega, login JWT, duración, `401`/`403` y panorama de roles. |
| 04:15–07:55 | 3:40 | Fernando | Atlas frente a MongoDB local, configuración por entorno sin mostrar valores, modelos, asociación usuario-perfil y bcrypt. |
| 07:55–11:35 | 3:40 | Raúl | Matriz de roles, propiedad, reserva, conflicto, cancelación, `409` repetido y disponibilidad restaurada. Demostración breve de Thunder Client. |
| 11:35–15:35 | 4:00 | Marcelo | Render Live, pruebas principales, Gemini informativo, límites y demostración de las dos consultas. |
| 15:35–17:00 | 1:25 | Todos; cierre Mateo | Aprendizajes, reflexión breve y cierre conjunto con todos visibles en cámara. |

Tiempo de voz aproximado: Mateo 3:45 (incluye apertura y cierre compartido), Fernando 3:40, Raúl 3:40 y Marcelo 4:00. Los demás deben mantenerse visibles en cámara durante el video y participar también en el cierre.

## Guion por intervención

### 00:00–00:45 — Mateo: apertura

**En pantalla:** equipo en cámara; título TurnoFlex.

> “Hola, somos Mateo Israel Adan, Baca Fernando Ezequiel, Mata Botana Raúl Alberto y Yrala Marcelo. Presentamos la tercera entrega de TurnoFlex, un backend para gestionar turnos. Nos vamos a concentrar en las novedades de esta etapa: autenticación y roles, Atlas, despliegue en Render y el asistente informativo.”

### 00:45–04:15 — Mateo: evolución y autenticación

**En pantalla:** diagrama de arquitectura o repositorio brevemente; no navegar por archivos con secretos.

> “TurnoFlex comenzó con persistencia JSON y cuatro recursos: profesionales, clientes, disponibilidades y turnos. En la segunda entrega migramos la persistencia a MongoDB con Mongoose y organizamos el backend en rutas, controladores, modelos y middlewares. En esta tercera etapa sumamos Atlas, Render, usuarios y permisos. Conservamos los IDs numéricos en el contrato.”
>
> “El acceso comienza en `/auth/login`. El servidor compara la contraseña con su hash y entrega un JWT Bearer de una hora. No mostramos ni copiamos el token. En cada solicitud protegida, la API valida el token y vuelve a comprobar que el usuario esté activo. Por eso desactivar una cuenta corta el acceso aunque el token no haya vencido.”
>
> “El `401` corresponde a falta de autenticación válida. El `403` indica que la identidad está autenticada, pero el rol o la propiedad no permite esa acción. Coordinador, recepcionista, profesional y cliente tienen responsabilidades diferentes; luego Raúl va a mostrar cómo esas reglas se conectan con las operaciones.”

**Transición:** “Fernando va a explicar la persistencia remota y cómo vinculamos los usuarios con sus perfiles.”

### 04:15–07:55 — Fernando: Atlas, modelos y usuarios

**En pantalla:** esquema de modelos; luego MongoDB Atlas mostrando solo nombres de colecciones.

> “En el desarrollo inicial se usaba MongoDB local. Para producción, el backend se conecta a MongoDB Atlas a través de Mongoose. La URI se toma de `MONGODB_URI` desde el entorno; no está escrita en el código ni la vamos a mostrar en pantalla.”
>
> “Los modelos son Usuario, Profesional, Cliente, Disponibilidad y Turno. La API sigue usando IDs numéricos para relacionarlos, así que el consumidor no necesita trabajar con ObjectId. Un usuario profesional se vincula a su profesional y un usuario cliente a su cliente. Esos vínculos son importantes para aplicar después restricciones de propiedad.”
>
> “La contraseña no se guarda en texto plano: bcryptjs produce el hash. Los controladores solo lo seleccionan para verificar el login y las respuestas excluyen `passwordHash`. El usuario incluye un estado activo que se consulta en cada request protegido.”
>
> “En Atlas podemos observar las colecciones persistidas. La captura y esta demostración evitan incluir datos personales, la URI y los campos de autenticación.”

**Acción de pantalla:** mostrar brevemente la lista de colecciones; mantener paneles de conexión y credenciales fuera de cuadro.

**Transición:** “Raúl va a mostrar cómo las asociaciones y los roles se convierten en reglas concretas para turnos.”

### 07:55–11:35 — Raúl: autorización y reglas de negocio

**En pantalla:** matriz de roles y Thunder Client con un entorno previamente preparado; ocultar credenciales/tokens.

> “Los permisos reflejan los actores del sistema. El coordinador tiene alcance global. Recepción administra clientes y operaciones de turnos. El profesional gestiona solo su agenda y puede marcar sus propios turnos como atendidos. El cliente consulta y administra sus propias reservas. Además del rol, el middleware comprueba la propiedad cuando corresponde.”
>
> “Para reservar, la API verifica que existan el profesional, el cliente y la disponibilidad, que la disponibilidad pertenezca a ese profesional y que siga libre. También evita un solapamiento para el profesional o el cliente. Si la reserva se crea, responde `201` y la disponibilidad pasa a ocupada.”
>
> “Al cancelar, el turno no se elimina: cambia a `cancelado` y la disponibilidad vuelve a estar libre. Si repetimos la cancelación, la API responde `409 Conflict`. Vamos a mostrar el comportamiento con datos de demostración controlados.”

**Acciones de pantalla, en este orden:**

1. Mostrar una ruta protegida sin token: `401`.
2. Mostrar una operación autorizada y segura: `200`.
3. Mostrar una operación con rol insuficiente: `403`.
4. Mostrar reserva `201`, cancelación `200` y segunda cancelación `409`, solo si se preparó un conjunto de demostración no crítico.
5. Mostrar disponibilidad restaurada en una consulta.

Si no hay datos demo preparados, usar capturas previamente obtenidas o narrar los resultados reportados; no crear/eliminar cuentas ni alterar datos reales durante la grabación.

**Transición:** “Marcelo cierra con el despliegue, las pruebas y el alcance del asistente.”

### 11:35–15:35 — Marcelo: Render, pruebas y Gemini

**En pantalla:** Render Live; luego Thunder Client y la respuesta del asistente.

> “El servicio se ejecuta en Render desde la rama `tercera-entrega`. Render proporciona el puerto de ejecución; la conexión Atlas y las claves se guardan en variables de entorno. No abrimos ese panel ni los logs durante la grabación porque no hace falta mostrar secretos para probar el servicio.”
>
> “La etapa de despliegue se validó con la ruta raíz, autenticación, permisos y operaciones de turnos. El equipo confirmó que Atlas conserva los cambios. La URL pública es `https://turnoflex-kygy.onrender.com`.”
>
> “La tercera entrega incorpora `POST /asistente`. Requiere JWT y está disponible para los cuatro roles. Tiene un límite de mil caracteres y controles de entrada; Gemini recibe el mensaje y una instrucción fija, no el JWT. El asistente no consulta Atlas y no puede ejecutar reservas ni cancelaciones.”
>
> “Ante ‘¿Cómo reservo un turno?’ esperamos una orientación en español. Ante ‘Cancelá mi turno’, debe aclarar que solo informa y que no puede efectuar la cancelación. La reserva o cancelación, si el usuario la necesita, debe realizarse mediante las rutas de negocio y sus permisos.”
>
> “Durante las pruebas hubo respuestas externas temporales `503`; después se confirmó una respuesta real `200` en Render. La documentación registra ambas cosas para no presentar una disponibilidad externa constante como garantía.”

**Acciones de pantalla:**

1. Mostrar Render indicando Live y la URL pública.
2. Probar `POST /asistente` con “¿Cómo reservo un turno?”: mostrar `200` y texto en español.
3. Probar “Cancelá mi turno”: mostrar `200` y la negativa a ejecutar.
4. Mantener fuera de cuadro `.env`, variables de Render, logs sensibles, JWT y contraseñas.

### 15:35–17:00 — cierre compartido

**En pantalla:** los cuatro integrantes en cámara.

**Mateo:** “La evolución de TurnoFlex nos permitió mantener las reglas centrales y sumar persistencia remota y control de acceso.”

**Fernando:** “Aprendimos a configurar Atlas y a separar perfiles, usuarios y credenciales.”

**Raúl:** “La autorización por rol y propiedad nos ayudó a traducir los actores a permisos verificables.”

**Marcelo:** “Y el asistente agrega orientación sin reemplazar las operaciones protegidas del backend.”

**Mateo:** “Gracias por ver la presentación.”

## Preparación segura de la demostración

- Usar datos ficticios identificados como demo y cuentas temporales ya autorizadas para la presentación.
- Preferir entorno o recursos de demostración aislados; no crear ni borrar datos productivos sin aprobación y plan de limpieza.
- Preparar requests de Thunder Client con variables de entorno privadas; ocultar el valor del token durante la grabación.
- Tener capturas de respaldo para errores de red, cold start o cuota Gemini.
- Revisar el video final cuadro a cuadro para detectar claves, JWT, contraseñas, URI, datos personales o query strings sensibles.
- Mantener a los cuatro integrantes visibles en la introducción/cierre y con intervenciones habladas. No mostrar `.env`, valores de Render ni la URI Atlas.
