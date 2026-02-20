
console.log("Starting Simple Test");

try {
    console.log("Importing Leaflet Engine...");
    require("@/lib/engines/leaflet-engine");
    console.log("Leaflet Engine Imported");
} catch (e) {
    console.error("Leaflet Import Failed", e);
}

try {
    console.log("Importing Brochure Engine...");
    require("@/lib/engines/brochure-engine");
    console.log("Brochure Engine Imported");
} catch (e) {
    console.error("Brochure Import Failed", e);
}

try {
    console.log("Importing Poster Engine...");
    require("@/lib/poster/poster-engine");
    console.log("Poster Engine Imported");
} catch (e) {
    console.error("Poster Import Failed", e);
}

console.log("Finished Simple Test");
