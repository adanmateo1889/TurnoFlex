# TurnoFlex

## Descripción

TurnoFlex es un backend para gestionar los turnos de un centro de atención. El proyecto busca reemplazar el manejo basado en planillas y mensajes, evitando duplicaciones, errores de horarios y dificultades para consultar o cancelar reservas.

## Funcionalidades

- Gestión de profesionales.
- Gestión de clientes.
- Gestión de disponibilidades horarias.
- Reserva de turnos.
- Consulta de turnos.
- Cancelación de turnos.
- Registro de turnos atendidos.
- Filtros mediante query parameters.
- Validación de reglas de negocio.

## Reglas principales

- Un profesional no puede tener dos turnos en el mismo horario.
- Un cliente no puede reservar dos veces el mismo turno.
- Solo pueden reservarse horarios disponibles.
- Los estados permitidos son `reservado`, `cancelado` y `atendido`.
- Cancelar modifica el estado del turno y libera la disponibilidad.
- Atender mantiene la disponibilidad ocupada.

## Tecnologías utilizadas

- Node.js.
- Express.
- JavaScript.
- Pug.
- Persistencia mediante JSON.
- Thunder Client para pruebas.

Además, el proyecto utiliza:

- `async/await` y Promises para la lectura y escritura de datos.
- Módulos CommonJS.
- POO mediante clases para representar las entidades principales.
- Middleware de logging.
- Middleware para el manejo de errores internos.

## Estructura del proyecto

```text
src/
├── controllers/
├── data/
├── middlewares/
├── models/
├── routes/
├── utils/
├── views/
├── app.js
└── server.js
```

- `controllers/`: contiene la lógica de cada recurso, sus validaciones y respuestas.
- `data/`: contiene el archivo JSON utilizado para guardar la información.
- `middlewares/`: contiene el logging de solicitudes y el manejo general de errores.
- `models/`: contiene las clases de Profesional, Cliente, Disponibilidad y Turno.
- `routes/`: define las rutas disponibles para cada recurso.
- `utils/`: contiene las funciones para leer y escribir el archivo JSON.
- `views/`: contiene la plantilla Pug utilizada por la vista de presentación.
- `app.js`: configura Express, los middlewares, las rutas y el motor de vistas.
- `server.js`: inicia el servidor en el puerto 3000.

## Instalación

1. Tener Node.js instalado.
2. Clonar o descargar el repositorio.
3. Abrir una terminal en la carpeta raíz del proyecto.
4. Ejecutar:

```bash
npm install
```

5. Iniciar el servidor:

```bash
npm start
```

6. El servidor funciona en:

```text
http://localhost:3000
```

7. La vista Pug puede consultarse en:

```text
http://localhost:3000/vista
```

## Endpoints principales

### Profesionales

- `GET /profesionales`
- `GET /profesionales/:id`
- `POST /profesionales`
- `PUT /profesionales/:id`
- `DELETE /profesionales/:id`

### Clientes

- `GET /clientes`
- `GET /clientes/:id`
- `POST /clientes`
- `PUT /clientes/:id`
- `DELETE /clientes/:id`

### Disponibilidades

- `GET /disponibilidades`
- `GET /disponibilidades/:id`
- `POST /disponibilidades`
- `PUT /disponibilidades/:id`
- `DELETE /disponibilidades/:id`

Los filtros disponibles para `GET /disponibilidades` son:

- `profesionalId`
- `fecha`
- `disponible`

Ejemplo:

```text
GET /disponibilidades?profesionalId=1&fecha=2026-10-15&disponible=true
```

### Turnos

- `GET /turnos`
- `GET /turnos/:id`
- `POST /turnos`
- `PUT /turnos/:id`
- `PATCH /turnos/:id/cancelar`

Los filtros disponibles para `GET /turnos` son:

- `profesionalId`
- `clienteId`
- `fecha`
- `estado`

Ejemplo:

```text
GET /turnos?profesionalId=1&estado=reservado
```

No existe `DELETE` físico de turnos porque la cancelación conserva el registro y modifica su estado a `cancelado`.

En `PUT /turnos/:id` solamente se permite cambiar un turno de `reservado` a `atendido`. La cancelación se realiza mediante `PATCH /turnos/:id/cancelar`.

## Códigos HTTP utilizados

- `200 OK`: consulta o modificación realizada correctamente.
- `201 Created`: recurso creado correctamente.
- `204 No Content`: eliminación realizada correctamente sin contenido de respuesta.
- `400 Bad Request`: datos incorrectos o inválidos.
- `404 Not Found`: recurso inexistente.
- `409 Conflict`: conflicto con una regla de negocio o una operación no permitida.
- `500 Internal Server Error`: error interno no controlado.

## Persistencia

En esta instancia académica, la información se almacena en:

```text
src/data/db.json
```

La lectura y escritura se realizan de manera asíncrona mediante Promises y `async/await`.

## Pruebas

Los endpoints fueron probados con Thunder Client, incluyendo:

- Casos correctos.
- Datos inválidos.
- Registros inexistentes.
- Turnos duplicados.
- Disponibilidad ocupada.
- Cancelación de turnos.
- Atención de turnos.
- Operaciones no permitidas.

## Integrantes y responsabilidades

El proyecto se presenta como un trabajo grupal y las tareas de desarrollo, pruebas, revisión y documentación corresponden al equipo en su conjunto.

**Integrantes:**

- Mateo Israel Adan
- Baca Fernando Ezequiel
- Lamas Carmen Leonela
- Mata Botana Raúl Alberto
- Yrala Marcelo

**Responsabilidades compartidas:** desarrollo e integración del backend, revisión de módulos, pruebas de endpoints, validación de reglas de negocio, documentación y comprobación final del proyecto.

## Uso de herramientas de IA

Se utilizaron herramientas de asistencia basadas en inteligencia artificial como apoyo para la revisión, depuración y organización del proyecto. El código fue revisado y comprendido por el equipo.

## Fuentes

- Material de la materia.
- Documentación oficial de Node.js.
- Documentación oficial de Express.
- Documentación oficial de Pug.
