var fs = require('fs');

try {

    // JSON-LD Context
    var context = {
        "@context": {
            "features" : "@graph",
            "properties" : "@graph",
            "xsd" : "http://www.w3.org/2001/XMLSchema#",
            "published" : {
                "@id" : "http://www.w3.org/ns/activitystreams#published",
                "@type" : "xsd:dateTime"
            },
            "latitude" : {
                "@id" : "http://www.w3.org/ns/activitystreams#latitude",
                "@type" : "xsd:float"
            },
            "longitude" : {
                "@id" : "http://www.w3.org/ns/activitystreams#longitude",
                "@type" : "xsd:float"
            },
            "altitude" : {
                "@id" : "http://www.w3.org/ns/activitystreams#altitude",
                "@type" : "xsd:float"
            },
            "radius" : {
                "@id" : "http://www.w3.org/ns/activitystreams#radius",
                "@type" : "xsd:float"
            },
            "Like" : {
                "@id" : "http://www.w3.org/ns/activitystreams#Like"
            },
            "Dislike" : {
                "@id" : "http://www.w3.org/ns/activitystreams#Dislike"
            },
            "object" : {
                "@id" : "http://www.w3.org/ns/activitystreams#object"
            },
            "license" : {
                "@id" : "http://purl.org/dc/terms/license",
                "@type" : "@id"
            }
        },
        "@id" : "https://smart.flanders.be/data/team-scheire-c-me.geojson",
        "license" : "https://creativecommons.org/publicdomain/zero/1.0/",
        "type" : "FeatureCollection",
        "features" : ""
    };

    var graph = [];

    // Read json-file
    var objectArray = JSON.parse(fs.readFileSync('./files/becme_data_v2.json', 'utf-8'));
    for(var i = 0 ; i < objectArray.length ; i++){

        if(objectArray[i].payload.includes("BTN")){
            var color = objectArray[i].payload.substring(4, objectArray[i].payload.length);
            var template = {
                "type" :  "Feature",
                "geometry" : {
                    "type" : "Point",
                    "coordinates" : [objectArray[i].geoloc.longitude, objectArray[i].geoloc.latitude]
                },
                "style" : {
                    "fill" : color.toLowerCase()
                },

                // +7200 because there's 2 hours difference with GMT (during summer there's only 1 hour time difference)
                // *1000 because the timestamp is a UNIX timestamp
                "properties" : {
                    "@id" : "https://smart.flanders.be/data/team-scheire-c-me.geojson#" + objectArray[i].timestamp,
                    "published" : new Date((objectArray[i].timestamp + 7200) *1000).toISOString(),
                    "@type" : color === 'GREEN' ? 'Like' : 'Dislike',
                    "marker-color" : color === 'GREEN' ? '#008000' : "#ff0000",
                    'object' : {
                        "longitude" : objectArray[i].geoloc.longitude,
                        "latitude" : objectArray[i].geoloc.latitude,
                        "altitude" : objectArray[i].geoloc.altitude,
                        "radius" : objectArray[i].geoloc.accuracy
                    }
                }
            }

            graph.push(template);
            template = {};
        }

    }

    context["features"] = graph;
    const data = JSON.stringify(context, null, 2);
    fs.writeFileSync("becme_linked_open_data.jsonld", data);

} catch (e) {
    console.log(e);
}
