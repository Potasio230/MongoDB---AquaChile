// AquaChile - Evaluación 3 - VS Code MongoDB Playground
use('aquachile_taller_base_datos');
if (db.getName() !== 'aquachile_taller_base_datos') {
  throw new Error('Base incorrecta. Ejecución detenida.');
}

// SOLO LECTURA. Seleccionar una consulta y ejecutarla para ver su resultado.
// 1. Vista general con proyección, orden y límite.
db.evaluaciones.find({}, {_id: 0, estado: 1, 'candidato.nombre': 1, 'cargo.familia': 1})
  .sort({fecha_solicitud: -1}).limit(5);

// 2. Rango de fechas BSON: esperado 4 sobre la carga inicial.
db.evaluaciones.find({fecha_solicitud: {$gte: new Date('2026-09-02T00:00:00Z'), $lte: new Date('2026-09-05T00:00:00Z')}, origen: 'adaptado_sql'});

// 3. Estados incluidos: esperado 5.
db.evaluaciones.find({estado: {$in: ['PENDIENTE', 'EN_EVALUACION']}});

// 4. Arreglo que contiene ambas etiquetas: esperado 5.
db.evaluaciones.find({etiquetas: {$all: ['origen_sql', 'taller']}});

// 5. Excluir estados: esperado 5.
db.evaluaciones.find({estado: {$nin: ['COMPLETADA', 'CANCELADA']}});

// 6. Campo dentro de un subdocumento: esperado 2.
db.evaluaciones.find({'cargo.familia': 'Tecnología'});

// 7. Alternativas de negocio: esperado 4.
db.evaluaciones.find({$or: [{estado: 'PENDIENTE'}, {etiquetas: 'prioritaria'}]});

// 8. Valores diferentes de familias: esperado 5 familias.
db.evaluaciones.distinct('cargo.familia');

// 9. Número de gestiones entre 2 y 4: esperado 3.
db.evaluaciones.find({gestiones_contacto: {$gte: 2, $lte: 4}});

// 10. Documento embebido dentro de un arreglo: esperado 10.
db.evaluaciones.find({'documentos.tipo': 'CV'}, {_id: 1, documentos: 1});
