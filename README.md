# 🍪 CookieStore: Arquitectura Progresiva con React

Este repositorio es un recorrido progresivo para entender cómo funciona una aplicación web escalable en React desde la base, construyendo una tienda en línea de galletas (CookieStore).

El objetivo no es aprender un framework de memoria.

El objetivo es entender el problema antes de usar la solución.

---

## 🧠 Enfoque

Comenzamos desde el nivel más bajo posible en React y vamos subiendo:

* Catálogo estático y estado local básico
* Múltiples páginas y el problema del prop drilling
* Estado global nativo con Context API
* Ciclo de vida y peticiones de datos simuladas
* Manejo de estado complejo con Reducers
* Formularios robustos y validación
* Optimización de rendimiento y renders
* Estado global escalable con Zustand

El diseño visual utiliza **Tailwind CSS** y **shadcn/ui** desde la primera rama. La interfaz es consistente, limpia y profesional a lo largo de todo el recorrido — el foco pedagógico está en React, no en el CSS.

Cada rama representa una capa adicional de abstracción y complejidad.

La idea es poder moverse entre ramas y observar cómo evoluciona la arquitectura de la tienda al enfrentarse a problemas reales.

---

## 🎯 Qué se busca lograr

Que el estudiante entienda:

* Qué resuelve realmente React en el navegador
* Cómo funciona el flujo de datos unidireccional
* El dolor de perder el estado al cambiar de ruta
* Cómo y por qué se debe abstraer el estado global
* El ciclo de vida de los datos desde que el componente se monta
* Cómo centralizar lógica compleja de estado
* Cómo manejar formularios sin sacrificar el rendimiento
* Cuándo y cómo optimizar la aplicación evitando renders innecesarios

---

## 🎨 Diseño

La UI está construida con **Tailwind CSS** y componentes de **shadcn/ui**. Esto permite una interfaz visualmente cuidada y coherente sin distraer al estudiante de los conceptos de React. Los componentes de shadcn/ui se agregan según se necesiten en cada rama.

---

## 💻 Entorno

Todos los ejemplos están preparados para ejecutarse con Docker y Docker Compose.

Cada rama contiene su propio `Dockerfile` y `docker-compose.yml`. Para levantar el proyecto en cualquier rama basta con:

```bash
docker compose up --build
```

No es necesario tener Node instalado localmente. Cada rama construye sobre las dependencias de la anterior — Docker se encarga del entorno de forma consistente.

---

## 📚 Ramas del repositorio

**[01-intro](https://github.com/menene/cookiestore-react/tree/01-intro)**
Catálogo estático y estado básico. Se construye la vista principal iterando un array de galletas y manejando un carrito de compras simple con `useState`.

**[02-router](https://github.com/menene/cookiestore-react/tree/02-router)**
Se introduce React Router v6. La tienda pasa a tener múltiples páginas, demostrando el problema de perder el estado del carrito al navegar y el infierno del prop drilling.

**[03-context](https://github.com/menene/cookiestore-react/tree/03-context)**
Se implementa Context API. Se extrae el estado del carrito a un `CartContext` global, resolviendo el problema de la rama anterior sin utilizar librerías de terceros.

**[04-hooks](https://github.com/menene/cookiestore-react/tree/04-hooks)**
Se simula el consumo de una API. Los datos pasan a un archivo JSON y se utiliza `useEffect` para cargarlos al montar el componente, junto con `useRef` para optimizar el buscador de galletas y un custom hook reutilizable.

**[05-reducers](https://github.com/menene/cookiestore-react/tree/05-reducers)**
Se refactoriza la lógica del carrito. Al crecer la complejidad (cantidades exactas, totales, eliminación específica), se reemplazan múltiples `useState` dispersos por un `useReducer` con acciones explícitas.

**[06-forms](https://github.com/menene/cookiestore-react/tree/06-forms)**
Se construye el flujo de Checkout. Se introduce React Hook Form y Zod para manejar un formulario complejo de dirección y pago, validando datos de manera estricta sin provocar renders en cada pulsación de tecla.

**[07-performance](https://github.com/menene/cookiestore-react/tree/07-performance)**
Se optimiza la aplicación. Se implementan técnicas de memoización (`React.memo`, `useMemo`, `useCallback`) y lazy loading con `React.lazy` y `Suspense` para evitar que todo el catálogo se vuelva a renderizar innecesariamente.

**[08-zustand](https://github.com/menene/cookiestore-react/tree/08-zustand)**
Se reemplaza Context API por Zustand. Se demuestra cómo una librería moderna de estado global reduce drásticamente el código repetitivo y mejora el rendimiento por defecto en aplicaciones que escalan.
