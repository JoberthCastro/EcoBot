const fs = require('fs');
const path = require('path');

async function main() {
  const response = await fetch(
    'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BRA.geo.json'
  );
  const featureCollection = await response.json();
  const ring = featureCollection.features[0].geometry.coordinates[0];

  const bounds = {
    north: -Infinity,
    south: Infinity,
    west: Infinity,
    east: -Infinity,
  };

  ring.forEach(([lng, lat]) => {
    bounds.north = Math.max(bounds.north, lat);
    bounds.south = Math.min(bounds.south, lat);
    bounds.west = Math.min(bounds.west, lng);
    bounds.east = Math.max(bounds.east, lng);
  });

  const width = 520;
  const height = 560;
  const padding = 24;

  const points = ring.map(([lng, lat]) => {
    const x = padding + ((lng - bounds.west) / (bounds.east - bounds.west)) * (width - padding * 2);
    const y = padding + ((bounds.north - lat) / (bounds.north - bounds.south)) * (height - padding * 2);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  });

  let outlinePath = `M ${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length; index += 1) {
    outlinePath += ` L ${points[index][0]} ${points[index][1]}`;
  }
  outlinePath += ' Z';

  const output = `export const BRAZIL_MAP = ${JSON.stringify(
    { width, height, padding, bounds, outlinePath },
    null,
    2
  )};

export function projectCity(lat, lng) {
  const { width, height, padding, bounds } = BRAZIL_MAP;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  return {
    x: padding + ((lng - bounds.west) / (bounds.east - bounds.west)) * plotWidth,
    y: padding + ((bounds.north - lat) / (bounds.north - bounds.south)) * plotHeight,
  };
}
`;

  const target = path.join(__dirname, '../frontend/src/constants/brazilMap.js');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
  console.log(`Generated ${target} (${points.length} points)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
