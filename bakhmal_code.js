// ==========================================
// JIZZAX VILOYATI BAXMAL TUMANI LULC KODI
// ==========================================

// 1. Dunyo tumanlari (Level 2) bazasidan Baxmal tumani chegarasini olish
var baxmal = ee.FeatureCollection("FAO/GAUL/2015/level2")
  .filter(ee.Filter.eq('ADM1_NAME', 'Jizzakh'))   // Jizzax viloyati
  .filter(ee.Filter.eq('ADM2_NAME', 'Bakhmal'));  // Baxmal tumani

// 2. Xaritani Baxmal tumani markaziga qaratish (Masshtab: 10)
Map.centerObject(baxmal, 10);

// 3. Baxmal tumani chegarasini xaritada qizil chiziq bilan belgilash
var boundaryVis = ee.Image().byte().paint({
  featureCollection: baxmal,
  color: 1,
  width: 2
});
Map.addLayer(boundaryVis, {palette: 'red'}, 'Baxmal Tumani Chegarasi');

// 4. Sentinel-2 sun'iy yo'ldosh tasvirlarini chaqirish va filtrlash
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(baxmal)
  .filterDate('2024-05-01', '2024-09-01') // Yozgi mavsum
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) // Bulutlilik < 10%
  .median(); // Eng toza/ochiq tasvir

// 5. Tasvirni Baxmal tumani chegarasi bo'yicha qirqish (CLIP)
var baxmalSentinel = sentinel2.clip(baxmal);

// 6. Qirqib olingan Sentinel-2 tasvirini xaritaga chiqarish (Tabiiy ranglar: RGB = B4, B3, B2)
var visParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000
};

Map.addLayer(baxmalSentinel, visParams, 'Baxmal Sentinel-2 Tasviri');
