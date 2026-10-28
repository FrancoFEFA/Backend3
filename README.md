# Backend III — Mocking de datos

API Express para generar datos de prueba de usuarios y mascotas. Los documentos y nombres de campos siguen el ejemplo Adoptme del repositorio de referencia.

## Requisitos e inicio

- Node.js 20 o superior.
- MongoDB local o una instancia accesible para guardar datos.

```bash
npm install
```

Copia `.env.example` a `.env` y ajusta la URI según tu instancia. La conexión a MongoDB es opcional para los endpoints de generación en memoria, pero `/api/mocks/generateData` y los GET persistentes requieren conexión.

```env
PORT=1818
MONGO_URL=mongodb://127.0.0.1:27017/backend_iii
```

Inicia el servidor:

```bash
npm start
```

El puerto predeterminado es `3000`; `PORT` permite cambiarlo.

## Endpoints

### `GET /api/mocks/mockingusers`

Genera 50 usuarios por defecto. Se puede indicar otra cantidad con `num` (también acepta `quantity`):

```http
GET /api/mocks/mockingusers?num=10
```

Cada usuario incluye `_id` tipo ObjectId, `first_name`, `last_name`, `email` único, `password` como hash bcrypt de `coder123`, `role` (`user` o `admin`), `pets: []` y `__v`. La respuesta usa `{ "status": "success", "payload": [...] }`.

### `GET /api/mocks/mockingpets`

Genera 100 mascotas por defecto; `?num=N` o `?quantity=N` ajusta la cantidad. Los registros siguen el esquema Adoptme: `name`, `specie`, `birthDate`, `adopted`, `owner` e `image` (los opcionales pueden omitirse).

### `POST /api/mocks/generateData`

Genera e inserta los registros indicados en las colecciones `Users` y `Pets`. Envía JSON con ambos campos numéricos no negativos. El máximo combinado es 10.000 documentos por petición.

```http
POST /api/mocks/generateData
Content-Type: application/json
```

```json
{
  "users": 10,
  "pets": 20
}
```

Responde `201` con el total insertado por colección. Sin MongoDB configurado/conectado devuelve `503`; datos inválidos devuelven `400`.

### Consultar lo insertado

```http
GET /api/users
GET /api/pets
```

Ambos responden `{ "status": "success", "payload": [...] }` con los documentos persistidos en MongoDB.

## Verificación manual

1. Inicia MongoDB y configura `MONGO_URL` en `.env`.
2. Ejecuta `npm start`.
3. Solicita `GET /api/mocks/mockingusers` y comprueba que `payload` tenga 50 elementos.
4. Envía `POST /api/mocks/generateData` con `{ "users": 50, "pets": 30 }`.
5. Consulta `/api/users` y `/api/pets` y verifica que estén disponibles los 50 usuarios y las 30 mascotas.

Las cantidades inválidas en `num` o el cuerpo de generación se rechazan con `400`. La inserción real requiere una base MongoDB accesible; no se incluye una base embebida.

## Pruebas automatizadas

El proyecto usa Jest y Supertest. Las pruebas unitarias y de endpoints no necesitan MongoDB:

```bash
npm test
```

Cubren los generadores de usuarios y mascotas y los endpoints `/api/mocks/mockingusers`, `/api/mocks/mockingpets` y `/api/mocks/generateData`, incluidos sus casos de validación y la respuesta `503` sin conexión.

### Prueba de persistencia (E2E)

La prueba `tests/persistence.e2e.test.js` inserta 50 usuarios y 30 mascotas y luego los consulta con los GET. Se ejecuta solo si existe `MONGO_URL_TEST`; en caso contrario se omite.

Usa una base **descartable**: la prueba borra las colecciones `Users` y `Pets` de esa base antes y después de ejecutarse. Nunca apuntes `MONGO_URL_TEST` a la misma URI que `MONGO_URL`.

```env
MONGO_URL_TEST=mongodb://127.0.0.1:27017/backend_iii_test
```

```bash
npm run test:e2e
```
