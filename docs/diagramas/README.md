# Diagramas TurnoFlex

Estos siete archivos `.mmd` son extractos literales de los bloques Mermaid de `docs/ENTREGA_FINAL.md`, sección 9, en el mismo orden y sin cambios de significado. Se exportaron a SVG en `docs/diagramas/exportados/` con Mermaid CLI invocado temporalmente por `npx.cmd`; no se modificaron `package.json` ni el lockfile.

Las imágenes generadas deben abrirse y revisarse visualmente para comprobar que las etiquetas sean legibles al tamaño final del PDF.

## Regeneración opcional

Con Node.js 24 y conexión a Internet, desde la raíz del repositorio se puede regenerar un SVG de forma temporal, sin añadir dependencias al proyecto:

```powershell
npx.cmd --yes --package @mermaid-js/mermaid-cli mmdc -i docs/diagramas/01-arquitectura-general-despliegue.mmd -o docs/diagramas/exportados/01-arquitectura-general-despliegue.svg
```

Repetir para los demás archivos `.mmd`, cambiando el nombre de entrada/salida.

## Índice

1. `01-arquitectura-general-despliegue.mmd`
2. `02-casos-de-uso.mmd`
3. `03-modelo-clases.mmd`
4. `04-secuencia-login-jwt.mmd`
5. `05-secuencia-reserva.mmd`
6. `06-secuencia-cancelacion.mmd`
7. `07-secuencia-asistente-gemini.mmd`

Los SVG con los mismos nombres base están en `exportados/`.
