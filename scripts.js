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
  const diasVacaciones = vacacionesChecked ? parseInt(document.getElementById('diasVacaciones').value) || 30 : 0; // Por defecto 0 días si no se marca el checkbox
  const tipoDespido = document.getElementById('tipoDespido').value;

  if (isNaN(salarioBruto) || isNaN(diasHuelga) || isNaN(diasVacaciones) || isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
    document.getElementById('resultado').innerHTML = '<p class="text-danger">Por favor, complete todos los campos correctamente.</p>';
    return;
  }

  const salarioDiario = salarioBruto / 365;

  // Cálculo de días de indemnización
  let diasIndemnizacion = 0;
  let diasIndemnizacionPorAny = [];

  let currentDate = new Date(fechaInicio);
  const endYear = fechaFin.getFullYear();

  while (currentDate <= fechaFin) {
    const any = currentDate.getFullYear();
    const startOfYear = new Date(any, 0, 1);
    const endOfYear = new Date(any, 11, 31);
    const start = currentDate > startOfYear ? currentDate : startOfYear;
    const end = fechaFin < endOfYear ? fechaFin : endOfYear;

    const diasEnAny = Math.floor((end - start + 1) / (1000 * 60 * 60 * 24)) + 1;
    const indemnizacionAnual = (diasEnAny / 365) * (tipoDespido === 'objetivo' ? 20 : tipoDespido === 'improcedente' ? 33 : 0); // Días de indemnización redondeados a 20 o 33 según el tipo de despido

    if (diasEnAny > 0) {
      diasIndemnizacion += indemnizacionAnual;
      diasIndemnizacionPorAny.push(`<li>${any}: ${Math.round(indemnizacionAnual)} días</li>`);
    }

    currentDate = new Date(any + 1, 0, 1);
  }

  const diasVacacionesPendientes = vacacionesChecked ? diasVacaciones - (diasHuelga / 365 * diasVacaciones) : 0;
  const pagoVacaciones = diasVacacionesPendientes * salarioDiario;
  const descuentoHuelga = (diasHuelga / 365 * diasVacaciones) * salarioDiario;
  const descuentoHuelgaDias = Math.round(diasHuelga / 365 * diasVacaciones); // Días descontados por huelga
  const indemnizacion = diasIndemnizacion * salarioDiario;
  const finiquitoTotal = pagoVacaciones + indemnizacion;

  // Crear la lista de indemnización por any
  const listaIndemnizacion = diasIndemnizacionPorAny.join('');

  document.getElementById('resultado').innerHTML = `
    <h4>Resultado del finiquito:</h4>
    <ul style="list-style-type: none; padding: 0;">
      <li>
        Días de indemnización: ${Math.round(diasIndemnizacion)} días
        <ul style="list-style-type: none; padding-left: 20px;">
          ${listaIndemnizacion}
        </ul>
      </li>
      <li>Pago por vacaciones no disfrutadas: ${pagoVacaciones.toFixed(2)} €</li>
      <li>Descuento de vacaciones por días de huelga: ${descuentoHuelga.toFixed(2)} € (${descuentoHuelgaDias} días)</li>
      <li>Indemnización: ${indemnizacion.toFixed(2)} €</li>
    </ul>
    <p><strong>Finiquito total: ${finiquitoTotal.toFixed(2)} €</strong></p>
  `;
});
