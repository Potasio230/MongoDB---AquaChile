// AquaChile - Evaluación 3 - VS Code MongoDB Playground
// Base AISLADA. No usa ni modifica aquachile.
use('aquachile_taller_base_datos');
if (db.getName() !== 'aquachile_taller_base_datos') {
  throw new Error('Base incorrecta. Ejecución detenida.');
}
// Ejecutar primero. Si ya hay una colección, se detiene sin borrar ni sobrescribir.
if (db.getCollectionNames().includes('evaluaciones')) {
  throw new Error('evaluaciones ya existe. No se modificó. Revise la colección antes de repetir la carga.');
}
db.createCollection('evaluaciones', {
 validationLevel: 'strict', validationAction: 'error',
 validator: {$jsonSchema: {
  "bsonType": "object",
  "required": [
    "_id",
    "fecha_solicitud",
    "estado",
    "candidato",
    "cargo",
    "analista",
    "documentos",
    "etiquetas",
    "gestiones_contacto",
    "activo",
    "origen",
    "entrevista"
  ],
  "properties": {
    "_id": {
      "bsonType": "string"
    },
    "fecha_solicitud": {
      "bsonType": "date"
    },
    "estado": {
      "enum": [
        "PENDIENTE",
        "EN_EVALUACION",
        "COMPLETADA",
        "CANCELADA"
      ]
    },
    "candidato": {
      "bsonType": "object",
      "required": [
        "nombre"
      ],
      "properties": {
        "nombre": {
          "bsonType": "string",
          "minLength": 1
        },
        "correo": {
          "bsonType": "string"
        }
      }
    },
    "analista": {
      "bsonType": "object",
      "required": [
        "nombre"
      ],
      "properties": {
        "nombre": {
          "bsonType": "string",
          "minLength": 1
        },
        "correo": {
          "bsonType": "string"
        }
      }
    },
    "cargo": {
      "bsonType": "object",
      "required": [
        "nombre",
        "familia"
      ],
      "properties": {
        "nombre": {
          "bsonType": "string"
        },
        "familia": {
          "bsonType": "string"
        }
      }
    },
    "documentos": {
      "bsonType": "array",
      "items": {
        "bsonType": "object",
        "required": [
          "tipo",
          "fecha_creacion"
        ],
        "properties": {
          "tipo": {
            "bsonType": "string"
          },
          "fecha_creacion": {
            "bsonType": "date"
          }
        }
      }
    },
    "etiquetas": {
      "bsonType": "array",
      "items": {
        "bsonType": "string"
      }
    },
    "gestiones_contacto": {
      "bsonType": [
        "int",
        "long",
        "double",
        "decimal"
      ],
      "minimum": 0
    },
    "activo": {
      "bsonType": "bool"
    },
    "origen": {
      "bsonType": "string"
    },
    "entrevista": {
      "bsonType": [
        "object",
        "null"
      ],
      "required": [
        "fecha",
        "psicologo",
        "informe"
      ],
      "properties": {
        "fecha": {
          "bsonType": "date"
        },
        "psicologo": {
          "bsonType": "object",
          "required": [
            "nombre"
          ],
          "properties": {
            "nombre": {
              "bsonType": "string",
              "minLength": 1
            },
            "correo": {
              "bsonType": "string"
            }
          }
        },
        "observaciones": {
          "bsonType": "string"
        },
        "transcripcion": {
          "bsonType": "string"
        },
        "informe": {
          "bsonType": [
            "object",
            "null"
          ],
          "required": [
            "fecha_generacion",
            "estado"
          ],
          "properties": {
            "fecha_generacion": {
              "bsonType": "date"
            },
            "estado": {
              "enum": [
                "EN_REVISION",
                "COMPLETADO"
              ]
            },
            "contenido": {
              "bsonType": "string"
            }
          }
        }
      }
    }
  }
}}
});
db.evaluaciones.createIndex({estado: 1, fecha_solicitud: -1});
db.evaluaciones.createIndex({'cargo.familia': 1});
// _id = solicitud_id de Oracle. El índice único de _id evita repetir solicitudes.
// Cinco solicitudes del SQL, más cinco casos ficticios señalados en origen.
db.evaluaciones.insertMany([
  {
    "_id": "SOL001",
    "fecha_solicitud": new Date("2026-09-01T00:00:00.000Z"),
    "estado": "COMPLETADA",
    "candidato": {
      "nombre": "Pedro Martínez"
    },
    "cargo": {
      "nombre": "Analista de Datos",
      "familia": "Tecnología"
    },
    "analista": {
      "nombre": "Juan Pérez",
      "correo": "juan.perez@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-01T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-01T00:00:00.000Z")
      },
      {
        "tipo": "Transcripción",
        "fecha_creacion": new Date("2026-09-02T00:00:00.000Z")
      },
      {
        "tipo": "Informe psicolaboral",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "origen_sql",
      "taller"
    ],
    "gestiones_contacto": 0,
    "activo": true,
    "origen": "adaptado_sql",
    "entrevista": {
      "fecha": new Date("2026-09-02T00:00:00.000Z"),
      "observaciones": "El candidato demuestra capacidad analítica y buena comunicación.",
      "transcripcion": "Durante la entrevista explicó su experiencia trabajando con datos y herramientas tecnológicas.",
      "psicologo": {
        "nombre": "Carolina Silva",
        "correo": "carolina.silva@empresa.cl"
      },
      "informe": {
        "fecha_generacion": new Date("2026-09-03T00:00:00.000Z"),
        "contenido": "Evaluación favorable. Presenta competencias analíticas, comunicación efectiva y capacidad de adaptación.",
        "estado": "COMPLETADO"
      }
    }
  },
  {
    "_id": "SOL002",
    "fecha_solicitud": new Date("2026-09-02T00:00:00.000Z"),
    "estado": "COMPLETADA",
    "candidato": {
      "nombre": "Sofía Ramírez"
    },
    "cargo": {
      "nombre": "Asistente Administrativo",
      "familia": "Administración"
    },
    "analista": {
      "nombre": "María González",
      "correo": "maria.gonzalez@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-02T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-02T00:00:00.000Z")
      },
      {
        "tipo": "Transcripción",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "origen_sql",
      "taller"
    ],
    "gestiones_contacto": 0,
    "activo": true,
    "origen": "adaptado_sql",
    "entrevista": {
      "fecha": new Date("2026-09-03T00:00:00.000Z"),
      "observaciones": "Presenta buena disposición y organización.",
      "transcripcion": "El candidato describió experiencias relacionadas con organización de documentos y atención de requerimientos administrativos.",
      "psicologo": {
        "nombre": "Andrés Morales",
        "correo": "andres.morales@empresa.cl"
      },
      "informe": {
        "fecha_generacion": new Date("2026-09-04T00:00:00.000Z"),
        "contenido": "Evaluación favorable. Destaca por organización, responsabilidad y disposición para aprender.",
        "estado": "COMPLETADO"
      }
    }
  },
  {
    "_id": "SOL003",
    "fecha_solicitud": new Date("2026-09-03T00:00:00.000Z"),
    "estado": "PENDIENTE",
    "candidato": {
      "nombre": "Tomás Herrera"
    },
    "cargo": {
      "nombre": "Analista Financiero",
      "familia": "Finanzas"
    },
    "analista": {
      "nombre": "Carlos Soto",
      "correo": "carlos.soto@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "origen_sql",
      "taller"
    ],
    "gestiones_contacto": 0,
    "activo": true,
    "origen": "adaptado_sql",
    "entrevista": null
  },
  {
    "_id": "SOL004",
    "fecha_solicitud": new Date("2026-09-04T00:00:00.000Z"),
    "estado": "COMPLETADA",
    "candidato": {
      "nombre": "Daniela Contreras"
    },
    "cargo": {
      "nombre": "Analista de Recursos Humanos",
      "familia": "Recursos Humanos"
    },
    "analista": {
      "nombre": "Fernanda Muñoz",
      "correo": "fernanda.munoz@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-04T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-04T00:00:00.000Z")
      },
      {
        "tipo": "Transcripción",
        "fecha_creacion": new Date("2026-09-06T00:00:00.000Z")
      },
      {
        "tipo": "Informe psicolaboral",
        "fecha_creacion": new Date("2026-09-07T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "origen_sql",
      "taller"
    ],
    "gestiones_contacto": 0,
    "activo": true,
    "origen": "adaptado_sql",
    "entrevista": {
      "fecha": new Date("2026-09-06T00:00:00.000Z"),
      "observaciones": "Buena comunicación interpersonal y orientación al trabajo en equipo.",
      "transcripcion": "El candidato explicó experiencias relacionadas con selección, comunicación interna y gestión de personas.",
      "psicologo": {
        "nombre": "Felipe Vargas",
        "correo": "felipe.vargas@empresa.cl"
      },
      "informe": {
        "fecha_generacion": new Date("2026-09-07T00:00:00.000Z"),
        "contenido": "Evaluación favorable. Presenta habilidades interpersonales, organización y trabajo en equipo.",
        "estado": "COMPLETADO"
      }
    }
  },
  {
    "_id": "SOL005",
    "fecha_solicitud": new Date("2026-09-05T00:00:00.000Z"),
    "estado": "EN_EVALUACION",
    "candidato": {
      "nombre": "Matías Fuentes"
    },
    "cargo": {
      "nombre": "Ejecutivo Comercial",
      "familia": "Comercial"
    },
    "analista": {
      "nombre": "Diego Rojas",
      "correo": "diego.rojas@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-05T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-05T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "origen_sql",
      "taller"
    ],
    "gestiones_contacto": 0,
    "activo": true,
    "origen": "adaptado_sql",
    "entrevista": {
      "fecha": new Date("2026-09-07T00:00:00.000Z"),
      "observaciones": "Muestra orientación al cliente y habilidades de negociación.",
      "transcripcion": "El candidato describió experiencias en ventas, atención de clientes y cumplimiento de objetivos comerciales.",
      "psicologo": {
        "nombre": "Camila Fuentes",
        "correo": "camila.fuentes@empresa.cl"
      },
      "informe": {
        "fecha_generacion": new Date("2026-09-08T00:00:00.000Z"),
        "contenido": "Evaluación en proceso de revisión. Destaca por orientación al cliente y capacidad de negociación.",
        "estado": "EN_REVISION"
      }
    }
  },
  {
    "_id": "SOL006",
    "fecha_solicitud": new Date("2026-09-03T00:00:00.000Z"),
    "estado": "PENDIENTE",
    "candidato": {
      "nombre": "Candidato ficticio 06"
    },
    "cargo": {
      "nombre": "Analista Financiero",
      "familia": "Finanzas"
    },
    "analista": {
      "nombre": "Carlos Soto",
      "correo": "carlos.soto@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "taller",
      "ficticio",
      "prioritaria"
    ],
    "gestiones_contacto": 1,
    "activo": true,
    "origen": "ficticio_ampliacion",
    "entrevista": null
  },
  {
    "_id": "SOL007",
    "fecha_solicitud": new Date("2026-09-05T00:00:00.000Z"),
    "estado": "EN_EVALUACION",
    "candidato": {
      "nombre": "Candidato ficticio 07"
    },
    "cargo": {
      "nombre": "Ejecutivo Comercial",
      "familia": "Comercial"
    },
    "analista": {
      "nombre": "Diego Rojas",
      "correo": "diego.rojas@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-05T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-05T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "taller",
      "ficticio",
      "prioritaria"
    ],
    "gestiones_contacto": 2,
    "activo": true,
    "origen": "ficticio_ampliacion",
    "entrevista": {
      "fecha": new Date("2026-09-07T00:00:00.000Z"),
      "observaciones": "Muestra orientación al cliente y habilidades de negociación.",
      "transcripcion": "El candidato describió experiencias en ventas, atención de clientes y cumplimiento de objetivos comerciales.",
      "psicologo": {
        "nombre": "Camila Fuentes",
        "correo": "camila.fuentes@empresa.cl"
      },
      "informe": {
        "fecha_generacion": new Date("2026-09-08T00:00:00.000Z"),
        "contenido": "Evaluación en proceso de revisión. Destaca por orientación al cliente y capacidad de negociación.",
        "estado": "EN_REVISION"
      }
    }
  },
  {
    "_id": "SOL008",
    "fecha_solicitud": new Date("2026-09-03T00:00:00.000Z"),
    "estado": "CANCELADA",
    "candidato": {
      "nombre": "Candidato ficticio 08"
    },
    "cargo": {
      "nombre": "Analista Financiero",
      "familia": "Finanzas"
    },
    "analista": {
      "nombre": "Carlos Soto",
      "correo": "carlos.soto@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "taller",
      "ficticio"
    ],
    "gestiones_contacto": 3,
    "activo": false,
    "origen": "ficticio_ampliacion",
    "entrevista": null
  },
  {
    "_id": "SOL009",
    "fecha_solicitud": new Date("2026-09-01T00:00:00.000Z"),
    "estado": "COMPLETADA",
    "candidato": {
      "nombre": "Candidato ficticio 09"
    },
    "cargo": {
      "nombre": "Analista de Datos",
      "familia": "Tecnología"
    },
    "analista": {
      "nombre": "Juan Pérez",
      "correo": "juan.perez@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-01T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-01T00:00:00.000Z")
      },
      {
        "tipo": "Transcripción",
        "fecha_creacion": new Date("2026-09-02T00:00:00.000Z")
      },
      {
        "tipo": "Informe psicolaboral",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "taller",
      "ficticio"
    ],
    "gestiones_contacto": 4,
    "activo": true,
    "origen": "ficticio_ampliacion",
    "entrevista": {
      "fecha": new Date("2026-09-02T00:00:00.000Z"),
      "observaciones": "El candidato demuestra capacidad analítica y buena comunicación.",
      "transcripcion": "Durante la entrevista explicó su experiencia trabajando con datos y herramientas tecnológicas.",
      "psicologo": {
        "nombre": "Carolina Silva",
        "correo": "carolina.silva@empresa.cl"
      },
      "informe": {
        "fecha_generacion": new Date("2026-09-03T00:00:00.000Z"),
        "contenido": "Evaluación favorable. Presenta competencias analíticas, comunicación efectiva y capacidad de adaptación.",
        "estado": "COMPLETADO"
      }
    }
  },
  {
    "_id": "SOL010",
    "fecha_solicitud": new Date("2026-09-03T00:00:00.000Z"),
    "estado": "PENDIENTE",
    "candidato": {
      "nombre": "Candidato ficticio 10"
    },
    "cargo": {
      "nombre": "Analista Financiero",
      "familia": "Finanzas"
    },
    "analista": {
      "nombre": "Carlos Soto",
      "correo": "carlos.soto@empresa.cl"
    },
    "documentos": [
      {
        "tipo": "CV",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      },
      {
        "tipo": "Pauta de entrevista",
        "fecha_creacion": new Date("2026-09-03T00:00:00.000Z")
      }
    ],
    "etiquetas": [
      "taller",
      "ficticio"
    ],
    "gestiones_contacto": 5,
    "activo": true,
    "origen": "ficticio_ampliacion",
    "entrevista": null
  }
]);
// Esperado en la primera carga: 10.
db.evaluaciones.countDocuments({});

