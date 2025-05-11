### SportShop - Tienda Deportiva Online



## 📋 Descripción

SportShop es una plataforma de comercio electrónico moderna y completa especializada en productos deportivos. Ofrece una experiencia de compra intuitiva y atractiva con un diseño responsive que se adapta a todos los dispositivos.

## ✨ Características principales

- **Catálogo completo**: Amplia variedad de productos deportivos organizados por categorías
- **Carrito de compras**: Gestión completa del carrito con persistencia de datos
- **Autenticación de usuarios**: Sistema de registro e inicio de sesión
- **Perfil de usuario**: Gestión de información personal y contraseñas
- **Historial de pedidos**: Seguimiento detallado de pedidos realizados
- **Proceso de checkout**: Flujo de pago seguro y optimizado
- **Diseño responsive**: Experiencia óptima en dispositivos móviles y de escritorio
- **Notificaciones toast**: Sistema de notificaciones elegante para feedback al usuario


## 🛠️ Tecnologías utilizadas

- **Frontend**:

- [Next.js 14](https://nextjs.org/) - Framework de React con renderizado del lado del servidor
- [React](https://reactjs.org/) - Biblioteca JavaScript para construir interfaces de usuario
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitario
- [Lucide React](https://lucide.dev/) - Biblioteca de iconos



- **Estado y gestión de datos**:

- Context API - Para gestión de estado global (autenticación, carrito)
- API REST - Comunicación con el backend



- **Herramientas de desarrollo**:

- ESLint - Linter para JavaScript/TypeScript
- Prettier - Formateador de código





## 📦 Instalación

### Requisitos previos

- Node.js (v18 o superior)
- npm o yarn
- Git


### Pasos para la instalación

1. Clonar el repositorio:

```shellscript
git clone https://github.com/tu-usuario/sportshop.git
cd sportshop
```


2. Instalar dependencias:

```shellscript
npm install
# o
yarn install
```


3. Configurar variables de entorno:
   Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:8080
```




## 🚀 Ejecución del proyecto

### Modo desarrollo

```shellscript
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Compilación para producción

```shellscript
npm run build
# o
yarn build
```

### Iniciar versión de producción

```shellscript
npm run start
# o
yarn start
```

## 📁 Estructura del proyecto

```plaintext
sportshop/
├── public/             # Archivos estáticos (imágenes, etc.)
├── src/                # Código fuente
│   ├── app/            # Rutas y páginas (App Router de Next.js)
│   ├── components/     # Componentes React reutilizables
│   │   ├── products/   # Componentes relacionados con productos
│   │   └── ui/         # Componentes de interfaz de usuario
│   ├── context/        # Contextos de React (Auth, Cart)
│   ├── hooks/          # Hooks personalizados
│   ├── lib/            # Utilidades y funciones auxiliares
│   └── services/       # Servicios para comunicación con API
├── .env.local          # Variables de entorno locales
├── next.config.mjs     # Configuración de Next.js
├── package.json        # Dependencias y scripts
├── tailwind.config.js  # Configuración de Tailwind CSS
└── README.md           # Documentación del proyecto
```

## 🔄 API y Endpoints

La aplicación se comunica con un backend a través de una API REST. Los principales endpoints incluyen:

- **Autenticación**:

- `/api/auth/login` - Iniciar sesión
- `/api/auth/register` - Registrar nuevo usuario



- **Usuarios**:

- `/api/users/me` - Obtener/actualizar perfil de usuario
- `/api/users/me/password` - Cambiar contraseña



- **Productos**:

- `/api/products` - Listar productos
- `/api/products/:id` - Detalles de un producto



- **Carrito**:

- `/api/cart` - Obtener carrito
- `/api/cart/items` - Añadir item al carrito
- `/api/cart/items/:id` - Actualizar/eliminar item del carrito



- **Pedidos**:

- `/api/orders` - Listar/crear pedidos
- `/api/orders/:id` - Detalles de un pedido





## 🔧 Configuración

### Variables de entorno

| Variable | Descripción | Valor por defecto
|-----|-----|-----
| `NEXT_PUBLIC_API_URL` | URL base de la API | `http://localhost:8080`


## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
