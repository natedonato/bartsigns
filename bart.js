
var etds;
var res;
var platforms;

//this is the public bart API key not my own personal key!
function fetchEtas(station = "embr") {
    return (fetch(`https://api.bart.gov/api/etd.aspx?cmd=etd&orig=${station}&key=MW9S-E7SL-26DU-VV8V&json=y`)
        .then(function (response) {
            let json = response.json();
            return json;
        }).then(function (myJson) {
                res = myJson;
                etds = res.root.station[0].etd;
                console.log(etds);
                platforms = parseEtds(etds);
        }));
}


fetchEtas();
setInterval(fetchEtas, 3000);



function parseEtds(etds){
    let platforms = [[],[],[],[]];

    etds.forEach(destination => {
        let destName = destination.destination;
        let platform = destination.estimate[0].platform;
        let times = [];
        destination.estimate.forEach(train => {
            if(train.minutes === "Leaving"){
                train.minutes = "0";
            }
            times.push(train.minutes);
        });
        platforms[platform].push({name: destName, times: times});

    });

    platforms.forEach(plat => {
        plat.sort( (a, b)=> {
            return (a.times[0] - b.times[0]);
        });
    });
    displayEtds(platforms);
    return platforms;
}


function displayEtds(platforms){
    let p1 = document.getElementById("platform1");
    let p2 = document.getElementById("platform2");
    let str = "";
    let str2 = "";

    platforms[1].forEach(dest =>{
        name = "<div id=line> <span>" + dest.name + ": " + "</span>";
        time = "<span>" + dest.times[0];
        if(dest.times[1]!== undefined){
            time += ", " + dest.times[1];
        }
        time += " min";
        str += name + time + "</div>";
    });

    platforms[2].forEach(dest =>{
        name = "<div id=line> <span>" + dest.name + ": " + "</span>";
        time = "<span>" + dest.times[0];
        if (dest.times[1] !== undefined) {
            time += ", " + dest.times[1];
        }
        time += " min";
        str2 += name + time + "</div>";
    });

    p1.innerHTML = str;
    p2.innerHTML = str2;

};