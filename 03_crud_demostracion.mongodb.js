// AquaChile - Evaluación 3 - VS Code MongoDB Playground
// Base AISLADA. No usa ni modifica aquachile.
use('aquachile_taller_base_datos');
if (db.getName() !== 'aquachile_taller_base_datos') {
  throw new Error('Base incorrecta. Ejecución detenida.');
}

// DEMOSTRACIÓN DE ESCRITURA. Ejecutar por bloques, en orden.
// Solo escribe sobre DEMO-E3-* creados aquí; no cambia SOL001..SOL010.
// Para repetir: el bloque final elimina exclusivamente estas tres pruebas.
// BLOQUE 1 - CREATE insertOne: crear una solicitud ficticia de prueba.
db.evaluaciones.insertOne({
 _id: 'DEMO-E3-001', 
 fecha_solicitud: new Date('2026-11-24T10:00:00Z'),
 estado: 'PENDIENTE',
 activo: true, 
 origen: 'demo_crud',
 candidato: {nombre: 'Luis Fermin'},
 cargo: {nombre: 'Analista de Datos', familia: 'Tecnología'},
 analista: {nombre: 'Analista de demostración', correo: 'analista@example.com'},
 documentos: [{tipo: 'CV', fecha_creacion: new Date('2026-11-24T10:00:00Z')}],
 etiquetas: ['taller', 'prueba'], entrevista: null,
 gestiones_contacto: 0
});

// Verificación: debe aparecer el documento.
db.evaluaciones.find({_id: 'DEMO-E3-001'});

// BLOQUE 2 - CREATE insertMany: agregar dos fichas de prueba
db.evaluaciones.insertMany([
  {
    _id: 'DEMO-E3-002',
    fecha_solicitud: new Date('2026-11-24T10:00:00Z'),
    estado: 'PENDIENTE',
    activo: true,
    origen: 'demo_crud',
    candidato: { nombre: 'Raúl Ferrini' },
    cargo: { nombre: 'Analista Financiero', familia: 'Finanzas' },
    analista: { nombre: 'Analista de demostración' },
    documentos: [],
    etiquetas: ['taller', 'prueba'],
    entrevista: null,
    gestiones_contacto: 0
  },
  {
    _id: 'DEMO-E3-003',
    fecha_solicitud: new Date('2026-11-24T10:00:00Z'),
    estado: 'PENDIENTE',
    activo: true,
    origen: 'demo_crud',
    candidato: { nombre: 'Benjamin Agüero' },
    cargo: { nombre: 'Analista Financiero', familia: 'Finanzas' },
    analista: { nombre: 'Analista de demostración' },
    documentos: [],
    etiquetas: ['taller', 'prueba'],
    entrevista: null,
    gestiones_contacto: 0
  }
]);

// BLOQUE 3 - UPDATE: modificar tres solicitudes de prueba.
// updateOne actualiza solamente el primer documento que cumple el filtro.
// $set cambia los valores de estado y activo; $inc suma 1 a gestiones_contacto;
// $unset elimina el campo observacion_temporal si existiera.
db.evaluaciones.updateOne(
  { _id: "DEMO-E3-001", origen: "demo_crud", estado: "PENDIENTE" },
  { $set: { estado: "CANCELADA", activo: false },
    $inc: { gestiones_contacto: 1 },
    $unset: { observacion_temporal: "" } }
);

 
// updateMany actualiza todos los documentos DEMO-E3-002 y DEMO-E3-003.
db.evaluaciones.updateMany(
  { _id: { $in: ["DEMO-E3-002", "DEMO-E3-003"] }, origen: "demo_crud" },
  { $inc: { gestiones_contacto: 1 } }
);

// BLOQUE 4 - FIND: consultar solicitudes según criterios específicos.
// Buscar solicitudes entre dos fechas, con estado PENDIENTE o EN_EVALUACION, y que no sean de la familia Comercial.
db.evaluaciones.find(
  { fecha_solicitud: { $gte: ISODate("2026-09-02"), $lte: ISODate("2026-09-05") },
    estado: { $in: ["PENDIENTE", "EN_EVALUACION"] },
    "cargo.familia": { $nin: ["Comercial"] } },
  { _id: 0, estado: 1, "candidato.nombre": 1, "cargo.familia": 1 }
).sort({ fecha_solicitud: -1 }).limit(5);
 
db.evaluaciones.find({ etiquetas: { $all: ["origen_sql", "taller"] } });
db.evaluaciones.find({ $or: [{ estado: "PENDIENTE" }, { etiquetas: "prioritaria" }] });
db.evaluaciones.distinct("cargo.familia");


// BLOQUE 5 - DELETE - Elimina un solo documento en específico.
db.evaluaciones.deleteOne({_id: 'DEMO-E3-001', origen: 'demo_crud', estado: 'CANCELADA', activo: false});
 
db.evaluaciones.deleteMany({
  _id: { $in: ["DEMO-E3-002", "DEMO-E3-003"] },
  origen: "demo_crud", estado: "CANCELADA", activo: false
});

// Verificación final: 0 pruebas y 10 documentos de carga original.
db.evaluaciones.countDocuments({origen: 'demo_crud'});
db.evaluaciones.countDocuments({});
