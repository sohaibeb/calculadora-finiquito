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

  const salarioDiario = salarioBruto / 365;

  // Cálculo de días de indemnización
  let diasIndemnizacion = 0;
  let diasIndemnizacionPorAnio = [];

  let currentDate = new Date(fechaInicio);
  const endYear = fechaFin.getFullYear();

  while (currentDate <= fechaFin) {
    const year = currentDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    const start = currentDate > startOfYear ? currentDate : startOfYear;
    const end = fechaFin < endOfYear ? fechaFin : endOfYear;

    const diasEnAnio = Math.floor((end - start + 1) / (1000 * 60 * 60 * 24));
    const indemnizacionAnual = Math.min(diasEnAnio, 365) / 365 * (tipoDespido === 'objetivo' ? 20 : tipoDespido === 'improcedente' ? 33 : 0); // Días de indemnización redondeados a 20 o 33 según el tipo de despido

    if (diasEnAnio > 0) {
      diasIndemnizacionPorAnio.push(`<li>${year}: ${Math.round(indemnizacionAnual)} días</li>`);
    }

    currentDate = new Date(year + 1, 0, 1);
  }

  // Redondear a 20 o 33 días por año completo
  diasIndemnizacion = diasIndemnizacionPorAnio.reduce((total, item) => {
    const match = item.match(/(\d+) días/);
    return total + (match ? parseInt(match[1]) : 0);
  }, 0);

  const diasVacacionesPendientes = diasVacaciones - (diasHuelga / 365 * diasVacaciones);
  const pagoVacaciones = diasVacacionesPendientes * salarioDiario;
  const descuentoHuelga = (diasHuelga / 365 * diasVacaciones) * salarioDiario;
  const descuentoHuelgaDias = Math.round(diasHuelga / 365 * diasVacaciones); // Días descontados por huelga
  const indemnizacion = diasIndemnizacion * salarioDiario;
  const finiquitoTotal = pagoVacaciones + indemnizacion;

  // Crear la lista de indemnización por año
  const listaIndemnizacion = diasIndemnizacionPorAnio.join('');

  document.getElementById('resultado').innerHTML = `
    <h4>Resultado del finiquito:</h4>
    <ul style="list-style-type: none; padding: 0;">
      <li>
        Días de indemnización: ${diasIndemnizacion} días
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
