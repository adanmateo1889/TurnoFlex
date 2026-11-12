# Preparación de entrega final — TurnoFlex

## Checklist

### Repositorio y código

- [ ] Repositorio GitHub público y accesible: `https://github.com/adanmateo1889/TurnoFlex`.
- [ ] Rama de entrega final confirmada: `tercera-entrega`.
- [ ] `README.md` y `DOCUMENTACION_API.md` actualizados.
- [ ] Código necesario para inspección incluido; `node_modules` excluido del ZIP.
- [ ] No hay secretos en Git, historial/documentos nuevos ni archivos de entrega.
- [ ] Versiones de primera, segunda y tercera entrega identificadas y separadas.
- [ ] Verificar `.gitignore`, `.env` y que no se incluyan archivos de credenciales.

### Backend y datos

- [ ] URL de Render responde: `https://turnoflex-kygy.onrender.com`.
- [ ] Servicio Render en estado Live.
- [ ] Atlas conectado y colecciones persistentes.
- [ ] Login JWT y endpoints protegidos funcionando.
- [ ] Respuestas `401`, `403`, `201`, `200` y `409` verificadas con datos demo.
- [ ] Cancelación restaura disponibilidad.
- [ ] Asistente Gemini disponible y limitado a orientación informativa.
- [ ] Nunca mostrar `.env`, claves, URI, contraseñas, JWT completos ni datos personales.

### Documentación y PDF

- [ ] PDF final revisado desde `docs/CONTENIDO_PDF_FINAL.md`.
- [ ] Portada con institución, materia/comisión, docente y fecha completados.
- [ ] Cuatro integrantes incluidos; propuesta de responsabilidades validada o identificada claramente como propuesta.
- [ ] RF/RNF y bibliografía presentes.
- [ ] Diagramas Mermaid exportados y legibles en el PDF.
- [ ] Capturas seleccionadas, recortadas y anonimizadas.
- [ ] Resultados de prueba identificados como comprobados o reportados; no afirmar pruebas nuevas si no se ejecutaron.
- [ ] Uso de IA declarado de forma honesta.
- [ ] Enlaces del video y carpeta Drive completos y probados; no conservar placeholders en el PDF final.
- [ ] PDF revisado visualmente y los enlaces verificados después de exportar.

### Video

- [ ] Duración total entre 15 y 20 minutos (objetivo: 17).
- [ ] Mateo, Fernando, Raúl y Marcelo aparecen en cámara y hablan.
- [ ] Distribución de tiempos razonablemente equilibrada.
- [ ] Enfoque en novedades de tercera entrega.
- [ ] Render, Atlas, Thunder Client y Gemini demostrados con pantallas preparadas.
- [ ] Video revisado completo; no aparecen secretos, datos sensibles o errores sin explicar.
- [ ] Enlace final accesible y con permisos de visualización adecuados.

### Paquete académico y Drive

- [ ] Carpeta Drive ordenada según la estructura propuesta.
- [ ] Carpeta de código de tercera entrega inspeccionable sin `node_modules`.
- [ ] Archivo individual ZIP/RAR preparado para campus y probado antes de subirlo.
- [ ] El ZIP no contiene `.env`, credenciales, tokens, API keys, dumps sensibles ni `node_modules`.
- [ ] PDF, video, código y documentos finales corresponden a la misma versión.

## Evidencias recomendadas

Limitar el PDF a capturas legibles, complementarias y sin información sensible:

| Captura | Qué demuestra | Sección sugerida |
|---|---|---|
| Render en estado Live con URL del servicio | Despliegue online | 13. Despliegue en Render |
| MongoDB Atlas mostrando solo colecciones | Persistencia remota y recursos | 12. MongoDB Atlas |
| Thunder Client: ruta protegida sin token (`401`) y un rol insuficiente (`403`) | Autenticación y autorización | 9–10. Seguridad / roles; o 20. Pruebas |
| Thunder Client: reserva (`201`), cancelación (`200`), segunda cancelación (`409`) y disponibilidad libre | Reglas de negocio | 11. Funcionalidades / 20. Pruebas |
| `/asistente`: pregunta de reserva con respuesta española (`200`) | Asistencia informativa | 14. Asistente Gemini |
| `/asistente`: petición de cancelar y aclaración de que no ejecuta | Límite seguro del chatbot | 14. Asistente Gemini |

Se pueden combinar las dos primeras pruebas de autorización en una sola captura si las respuestas se leen claramente. No repetir pantallas de éxito similares ni incluir respuestas que muestren tokens/credenciales. Para Atlas, ocultar datos personales.

## Diagramas a exportar

Fuentes Mermaid en `docs/ENTREGA_FINAL.md`; exportar a SVG o PNG de alta resolución y comprobar tamaño de texto:

1. Arquitectura y despliegue.
2. Casos de uso con los cuatro roles.
3. Modelo/clases y relaciones por IDs numéricos.
4. Secuencia de login JWT y verificación de usuario activo.
5. Secuencia de reserva, incluido conflicto y cambio de disponibilidad.
6. Secuencia de cancelación, restauración y repetición `409`.
7. Secuencia del asistente Gemini, destacando que no recibe JWT ni accede a MongoDB.

## Estructura sugerida de Drive

```text
TurnoFlex - Entrega Final/
├── 01 - Primera Entrega/
├── 02 - Segunda Entrega/
├── 03 - Tercera Entrega/
│   ├── Codigo/
│   ├── Evidencias/
│   └── README - acceso al repositorio.txt
├── 04 - Video Final/
└── 05 - Documentacion Final/
    ├── TurnoFlex - Documentacion Tecnica.pdf
    ├── Fuentes/
    └── Diagramas/
```

La carpeta `03 - Tercera Entrega/Codigo/` debe contener solo el código necesario para inspección y no debe incluir `node_modules`, `.env` ni secretos. La carpeta 05 puede incluir las fuentes Markdown y las imágenes de diagramas como respaldo del PDF.

## Intervenciones manuales pendientes

1. Confirmar con la institución los datos de portada (institución, materia/comisión, docente y fecha).
2. Validar o corregir la distribución propuesta de responsabilidades y la reflexión en primera persona plural.
3. Crear/seleccionar cuentas y datos ficticios seguros para la demostración; acordar limpieza si se usan recursos productivos.
4. Grabar y editar el video con los cuatro integrantes en cámara y con participación hablada.
5. Exportar y revisar los siete diagramas Mermaid.
6. Capturar y anonimizar las evidencias; volver a verificar el servicio si se desea presentarlas como prueba recién ejecutada.
7. Organizar Drive, asignar permisos de lectura y obtener el enlace final.
8. Subir el video, confirmar permisos y obtener el enlace final.
9. Completar ambos enlaces en el contenido fuente y solo entonces generar el PDF.
10. Generar y probar el ZIP/RAR individual para campus, verificando que no contenga secretos ni `node_modules`.

## Inconsistencias / puntos a resolver antes del PDF final

- Los enlaces de video y Drive siguen siendo placeholders por decisión explícita; no generar el PDF definitivo hasta reemplazarlos.
- Las responsabilidades del equipo son una propuesta y deben validarse antes de presentarlas como asignaciones reales.
- La reflexión final es un borrador; el grupo debe ajustarla a su experiencia.
- La evidencia de Render/Atlas/Gemini documentada proviene de cierres previos reportados por el equipo; si se agregan capturas nuevas, indicar fecha y no exponer datos reales.
- El README declara Node `>=22.0.0 <25`; la versión local reportada en una etapa anterior (v26.8.2) queda fuera del rango. Usar una versión compatible para la grabación/validación final.
- La rama publicada es `tercera-entrega`; no hacer merge a `main` sin aprobación.
