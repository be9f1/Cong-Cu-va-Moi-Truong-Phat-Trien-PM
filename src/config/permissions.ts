export const ALL_PERMISSIONS = {
  CINEMAS: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/cinemas', module: "CINEMAS" },
      CREATE: { method: "POST", apiPath: '/api/v1/cinemas', module: "CINEMAS" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/cinemas/:id', module: "CINEMAS" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/cinemas/:id', module: "CINEMAS" },
  },
  ROOMS: {
    GET_PAGINATE: { method: "GET", apiPath: '/api/v1/rooms', module: "ROOMS" },
    CREATE: { method: "POST", apiPath: '/api/v1/rooms', module: "ROOMS" },
    UPDATE: { method: "PATCH", apiPath: '/api/v1/rooms/:id', module: "ROOMS" },
    DELETE: { method: "DELETE", apiPath: '/api/v1/rooms/:id', module: "ROOMS" },
},
  FILMS: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/films', module: "FILMS" },
      CREATE: { method: "POST", apiPath: '/api/v1/films', module: "FILMS" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/films/:id', module: "FILMS" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/films/:id', module: "FILMS" },
  },
  PERMISSIONS: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
      CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
  },
  TICKETS: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/tickets', module: "TICKETS" },
      CREATE: { method: "POST", apiPath: '/api/v1/tickets', module: "TICKETS" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/tickets/:id', module: "TICKETS" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/tickets/:id', module: "TICKETS" },
  },
  ROLES: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
      CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/roles/:id', module: "ROLES" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/roles/:id', module: "ROLES" },
  },
  USERS: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
      CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/users/:id', module: "USERS" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/users/:id', module: "USERS" },
  },
}