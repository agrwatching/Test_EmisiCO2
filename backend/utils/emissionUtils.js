function getEmissionCategory(co2_emission) {
  if (co2_emission < 100) return "Aman";
  if (co2_emission > 200) return "Tidak Aman";
  return "Sedang";
}

module.exports = { getEmissionCategory };
