// Función para activar o desactivar campos según checkbox
function toggleField(checkboxId, fieldId) {
  const checkbox = document.getElementById(checkboxId);
  const field = document.getElementById(fieldId);
  field.disabled = !checkbox.checked;
  if (!checkbox.checked) {
    field.value = '';
  }
}

document.getElementById('huelgaCheck').addEventListener('change', function() {
  toggleField('huelgaCheck', 'diasHuelga');
});

document.getElementById('vacacionesCheck').addEventListener('change', function() {
  toggleField('vacacionesCheck', 'diasVacaciones');
});

document.getElementById('finiquitoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const salarioBruto = parseFloat(document.getElementById('salarioBruto').value) || 0;
  const fechaInicio = new Date(document.getElementById('fechaInicio').value);
  const fechaFin = new Date(document.getElementById('fechaFin').value);
  const huelgaChecked = document.getElementById('huelgaCheck').checked;
  const diasHuelga = huelgaChecked ? parseInt(document.getElementById('diasHuelga').value) || 0 : 0;
  const vacacionesChecked = document.getElementById('vacacionesCheck').checked;
  const diasVacaciones = vacacionesChecked ? parseInt(document.getElementById('diasVacaciones').value) || 30 : 30; // Por defecto 30 días si no se desmarca
  const tipoDespido = document.getElementById('tipoDespido').value;

  if (isNaN(salarioBruto) || isNaN(diasHuelga) || isNaN(diasVacaciones) || isNaN(fechaInicio) || isNaN(fechaFin)) {
    document.getElementById('resultado').innerHTML = '<p class="text-danger">Por favor, complete todos los campos correctamente.</p>';
    return;
  }

  const tiempoTrabajado = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24 * 365);
  const anosTrabajados = Math.floor(tiempoTrabajado);
  const salarioDiario = salarioBruto / 365;

  const diasVacacionesPendientes = diasVacaciones - (diasHuelga / 365 * diasVacaciones);
  const pagoVacaciones = diasVacacionesPendientes * salarioDiario;

  let indemnizacion = 0;

  if (tipoDespido === 'objetivo') {
    indemnizacion = 20 * anosTrabajados * salarioDiario;
  } else if (tipoDespido === 'improcedente') {
    indemnizacion = 33 * anosTrabajados * salarioDiario;
  }

  const finiquitoTotal = pagoVacaciones + indemnizacion;

  document.getElementById('resultado').innerHTML = `
    <h4>Resultado del finiquito:</h4>
    <p>Pago por vacaciones no disfrutadas: ${pagoVacaciones.toFixed(2)} €</p>
    <p>Indemnización: ${indemnizacion.toFixed(2)} €</p>
    <p><strong>Finiquito total: ${finiquitoTotal.toFixed(2)} €</strong></p>
  `;
});
