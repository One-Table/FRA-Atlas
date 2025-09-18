export const loadIndiaGeoJSON = async () => {
  try {
    const response = await fetch('/data/india-states.geojson');
    return await response.json();
  } catch (error) {
    console.error('Failed to load India GeoJSON:', error);
    return null;
  }
};

export const loadDistrictGeoJSON = async (stateCode: string) => {
  try {
    const response = await fetch(`/data/districts/${stateCode.toLowerCase()}.geojson`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to load ${stateCode} district data:`, error);
    return null;
  }
};
