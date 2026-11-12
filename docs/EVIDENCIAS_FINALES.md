# Evidencias finales TurnoFlex

Las siguientes capturas deben obtenerse manualmente durante la revisión o grabación. Usar cuentas y datos ficticios de demostración. Las validaciones de las etapas anteriores no sustituyen capturas recientes ni deben presentarse como una nueva ejecución.

| Archivo sugerido | Qué debe verse / qué demuestra | Sección del PDF | Ocultar o evitar |
|---|---|---|---|
| `01-render-live.png` | Servicio TurnoFlex con estado **Live** y URL pública `https://turnoflex-kygy.onrender.com`. | 13. Despliegue en Render | Panel de Environment Variables, valor de secretos, logs con datos, otras pestañas personales. |
| `02-atlas-colecciones.png` | Lista de colecciones `profesionales`, `clientes`, `disponibilidades`, `turnos` y `usuarios`, en la base correcta. | 12. MongoDB Atlas | Credenciales, URI, panel de conexión, usuarios/correos, documentos con datos personales. |
| `03-login-200.png` | En Thunder Client, `POST /auth/login` y estado `200`; respuesta obtenida sin mostrar token. | 9. Autenticación / 20. Pruebas | Body con password, email identificable y campo/valor `token` de respuesta. Mostrar solo status y, si hace falta, `tipo`/`expiraEn` sin el token. |
| `04-sin-token-401.png` | Solicitud a una ruta protegida sin header `Authorization`; status `401`. | 20. Pruebas | Tokens previos, headers heredados y datos personales del response. |
| `05-local-staging-rol-insuficiente-403.png` | **Prueba controlada local o staging, no producción:** usuario autenticado con rol no autorizado; por ejemplo, cliente consulta `GET /clientes`; status `403`. | 10. Roles y permisos / 20. Pruebas, identificada como local/staging | JWT, email del usuario y datos de clientes. Rotular visiblemente "Local" o "Staging". |
| `06-reserva-201.png` | `POST /turnos` con IDs del conjunto demo y status `201`; el turno queda reservado. | 11. Funcionalidades / 20. Pruebas | JWT, emails, datos personales y cualquier valor de autenticación. Usar solo IDs de demo. |
| `07-cancelacion-200.png` | `PATCH /turnos/:id/cancelar` para el turno de demo y status `200`, estado `cancelado`. | 11. Funcionalidades / 20. Pruebas | JWT, nombres/datos personales y valores de autenticación. |
| `08-segunda-cancelacion-409.png` | Repetición de la cancelación del mismo turno; status `409 Conflict` y mensaje que indica que ya estaba cancelado. | 20. Pruebas | JWT, datos personales y valores de autenticación. |
| `09-disponibilidad-restaurada.png` | Consulta de la disponibilidad usada y campo `disponible: true` luego de cancelar. | 11. Funcionalidades / 20. Pruebas | JWT, cualquier dato personal y valores de autenticación. |
| `10-asistente-reserva-200.png` | `POST /asistente` con “¿Cómo reservo un turno?”, status `200` y respuesta informativa en español. | 14. Asistente Gemini | JWT, credenciales y texto que accidentalmente contenga datos personales. |
| `11-asistente-no-ejecuta-cancelacion.png` | `POST /asistente` con “Cancelá mi turno”, status `200` y respuesta aclarando que no puede efectuar la cancelación. | 14. Asistente Gemini | JWT, credenciales y datos reales del turno/persona. |

## Reglas para capturas

- Ocultar siempre JWT completos, contraseña de login, `GEMINI_API_KEY`, `JWT_SECRET`, `MONGODB_URI` y credenciales de Atlas/Render.
- No mostrar `.env`, valores del panel de Render ni URI en una barra de direcciones.
- No incluir nombres, correos, teléfonos u otros datos reales. Preferir cuentas y registros claramente demo.
- En login, capturar el estado `200` con el token cubierto antes de guardar la imagen; no confiar solo en que el token no se lea por el tamaño.
- Evitar que Thunder Client reutilice un token al capturar el caso `401`; verificar el header antes de la toma.
- Recortar pestañas y ventanas no relacionadas; revisar cada imagen después de guardarla.
- Preferir un mosaico de capturas relacionadas solo si cada código y respuesta siguen legibles.

## Revisión de datos demo en Atlas (solo lectura)

Se hizo una lectura de conteos y de marcadores de demostración sin modificar documentos ni mostrar nombres. En el momento de la revisión había:

- 1 profesional y 1 cliente; ambos coinciden con un marcador textual de demo/prueba.
- 1 disponibilidad libre y ninguna ocupada; la disponibilidad libre pertenece al profesional demo.
- 0 turnos reservados, 1 cancelado y 0 atendidos.
- 1 usuario coordinador activo; no hay usuarios activos asociados al cliente o profesional demo.

El conjunto actual tiene las entidades necesarias para una demostración básica de agenda, pero no un turno reservado activo. La disponibilidad libre permite mostrar la reserva y luego la cancelación si el equipo decide ejecutar ese flujo. La cancelación conservará el registro del turno cancelado; no borrar ni alterar datos existentes para “limpiar” la evidencia sin autorización.

### Recomendación para grabar

1. No crear un profesional ni un cliente adicionales: ya existe un registro demo de cada uno.
2. No crear ni borrar datos/usuarios para la evidencia 403 en Atlas productivo. Preparar una prueba controlada local o en staging con un rol insuficiente; por ejemplo, un cliente autenticado solicita GET /clientes y recibe 403. Rotular claramente el entorno en la captura y el PDF.
3. Antes de grabar el flujo de producción, comprobar que la disponibilidad demo sigue libre y pertenece al profesional demo. El cliente demo puede usarse con la cuenta coordinador existente para POST /turnos; la creación de turnos para otros clientes corresponde al coordinador.
4. Reservar usando los IDs demo y la disponibilidad libre: esperar 201. Anotar el ID numérico del turno recién creado solo en el entorno de trabajo de la demo.
5. Cancelar ese turno con PATCH /turnos/:id/cancelar: esperar 200 y estado cancelado.
6. Repetir exactamente la cancelación: esperar 409.
7. Consultar la disponibilidad usada y verificar disponible: true. El flujo deja un nuevo turno cancelado en Atlas; ese residuo demo es aceptable como evidencia. No borrar el turno ni cambiar otros datos.
8. Si la disponibilidad ya no está libre, no modificar registros para forzarla: aplazar la grabación y acordar otro conjunto demo de forma explícita.

La evidencia 403 es exclusivamente local/staging; las demás capturas de esta tabla corresponden a producción según resultados previamente reportados. No presentar la prueba controlada como una petición ejecutada contra Render.

El resumen anterior es una instantánea de solo lectura y puede cambiar antes de grabar. No se publicaron nombres, correos, contraseñas, hashes, URI o tokens.
