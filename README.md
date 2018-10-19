# Entradas-Extranjeros-Colombia-2012-2018

![alt text](https://raw.githubusercontent.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018/master/img/main-banner.jpg)

- Estudiante: Andres Segura Tinoco
- Código: 201711582
- Curso: Visual Analytics
- Tarea 4: Uso de Datos Temporales
- Fecha: 19/10/2018
- Licencia: MIT

## Datos del Proyecto – What
Descripción: El dataset muestra el consolidado de entradas de extranjeros a Colombia desde el 2012, discriminado por nacionalidad y género.

Los datos provienen de los Datos Abiertos de Colombia www.datos.gov.co, y es un dataset del tipo Temporal, que contiene las siguientes variables (attributes):

- year: ordered, quantitative, sequencial.
- month: ordered, ordinal, cyclic.
- month_num: ordered, ordinal, cyclic.
- date: ordered, quantitative, sequencial (no existen fechas menores a 2012). Variable derivada a partir de year y month.
- nationality: categorical.
- female: ordered, quantitative, sequencial.
- male: ordered, quantitative, sequencial.
- undefined: ordered, quantitative, sequencial.
- total: ordered, quantitative, sequencial.

El link original a los datos, es: https://www.datos.gov.co/Estad-sticas-Nacionales/Entradas-de-extranjeros-a-Colombia/96sh-4v8d/data

## Objetivos del Proyecto - Why

### Tarea Principal
TP1: Crear una visualización web que permita comparar (compare) las tendencias (trend) de los ingresos de extranjeros a Colombia, por género y por países.

### Tareas Secundarias
TS1: Identificar (identify) valores anómalos (outliers) de los ingresos de extranjeros en Colombia, por meses o por años.

TS2: Sumarizar (summarize) el comportamiento global (distribution) de todos los ingresos de personas a Colombia en el tiempo.

TS3: Por último, comparar (compare) específicamente el volumen (distribution) de ingresos de población por países para un año en específico.

TS4: Derivar (derive) una nueva variable (feature) llamado "date", a partir de la fecha y mes de cada registro. Esta variable será usada en los gráficos temporales.

## Marcas y Canales – How
Para la TP1 y la TS1 se utilizó un Line Chart con el siguiente modismo:

- Marcas: puntos unidos por líneas.
- Canales: longitud con respecto al eje vertical, para expresar la cantidad de visitas de extranjeros. Color hue para diferenciar las categorías del género.
- How-Encode: arrange express en ambos ejes.

Para la TS2 se utilizó un Stacked Area Chart con el siguiente modismo:
- Marcas: áreas o formas (shapes).
- Canales: longitud con respecto al eje vertical, para expresar la cantidad de visitas de extranjeros. Color hue para diferenciar las categorías de los países.
- How-Encode: arrange express en ambos ejes.
- How-Reduce: Aggregate.

Para la TS3 se utilizó un Horizont Chart y una Table, con el siguiente modismo:
- Marcas: líneas horizontales.
- Canales: longitud para expresar la cantidad de entradas de extranjeros al país.
- How-Encode: Separete, Order y Align.
- How-Reduce: Aggregate y Filter.

La visualización cuenta con múltiples filtros (por año de análisis o tipo de gráfico) para reducir los datos y ayudar al usuario a realizar un mejor análisis.

Por último, pero no menos importante, se usó como encabezado de la Visualización un título descriptivo con imagen que llamara la atención del usuario, y todos los gráficos cuentan con título y subtítulo.

## Insights
- Aunque más hombres viajan hacia Colombia que mujeres (relación de 60-40), las tendencias son similares y no ha cambiado notoriamente en alguno de los géneros en los últimos años.
- La mayoría de los países, han mantenido casi constante (en los últimos 6 años) su tasa de viajeros hacia Colombia por mes, excepto Venezuela, que ha aumentado considerablemente el número de entradas, de aproximadamente 40mil al mes en el 2016 a 115mil al mes en el 2018.
- Hasta el 2016, USA fue el país del cual Colombia recibía más visitas por año, pero a partir del 2017, la tendencia cambió, y ahora es Venezuela.
- Colombia pasó de recibir aproximadamente 150mil visitas de extranjeros al mes en el 2012 a recibir más de 310mil al mes en el 2018.

## Tecnologías Usadas
Para el desarrollo del proyecto se usaron las siguientes tecnologías:

- Se usó Sublime Text 3 y Notepad++ como IDEs de desarrollo.
- HTML y CSS para maquetar el sitio web.
- Javascript y el framework D3.js para crear los gráficos (de barras y de líneas) y la respectiva interacción con ellos.
- JQuery para crear la tabla con la información de las zonas de latitud.
- GitHub para almacenar el código de la Viz, y de los datos usados. A continuación, el enlace a dicho repositorio principal del proyecto: https://github.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018

## Prerrequisitos
El proyecto depende del acceso a los datos almacenados en el repositorio https://github.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018 y a la disponibilidad del servicio de GitHub Pages, que permite el acceso por medio de un Navegador a la página principal proyecto.

Además, al usar los frameworks D3.js y JQuery, depende de que dichas librerías estén disponibles para ser usadas on-line.

## Uso
- La visualización se cargará completa al ingresar su URL en un navegador web.
- Se puede seleccionar el año a partir del cual se mostrarán los datos de los gráficos de tiempo, en el combo-box Ver datos desde.
- Para el gráfico 3, se puede seleccionar el año de los datos, en el combo-box Año de análisis.
- Para el gráfico 3, se puede seleccionar el tipo de gráfico entre Mensual y Anual, en el combo-box Tipo de Gráfico.

## Autores
El autor de los datos es el Gobierno Nacional. Los datos están actualizados hasta junio del 2018.

El autor de la visualización es Andrés Segura Tinoco, CE 201711582.

## Screenshot
A continuación, se presentan unos pantallazo del proyecto:

![alt text](https://raw.githubusercontent.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018/master/screenshots/Figure1.PNG)

![alt text](https://raw.githubusercontent.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018/master/screenshots/Figure2.PNG)

![alt text](https://raw.githubusercontent.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018/master/screenshots/Figure3.PNG)

![alt text](https://raw.githubusercontent.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018/master/screenshots/Figure4.PNG)

## Links de Interés
- Video de Youtube: https://youtu.be/ezkcyjspbyY
- Tweet: https://twitter.com/SeguraAndres7/status/1049729210607173632
##
