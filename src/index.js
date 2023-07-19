import $ from "jquery";

let config = {
    'v': { // Velocity
        'vd': .3,   // Velocity Decay
        'max': 100, // Max Velocity
    },
    'sd': 200,
    velocityFunction: (n, r) => {
        if (n > 1) n = 1;
        if (n < -1) n = -1
        return n * (config.v.max * r);
    }
}

let mouse = {
    'x': 0,
    'y': 0,
}

let cape = {
    'w': 50,
    'h': 50,
    'x': null, // From center
    'y': null, // From center
    'xini': null,
    'yini': null,
    'v': {
        'x': 0,
        'y': 0,
    }
}

$(document).on("contextmenu", (e) => {
    return false;
});

$(window).on("load", () => {
    ini();
});

function ini() {
    cape.x = window.innerWidth / 2;
    cape.y = window.innerHeight / 2;
    cape.xini = cape.x;
    cape.yini = cape.y;
    updateCapePosition();

    $(window).on("mousemove", (e) => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });

    window.setInterval(() => {
        proximitySensor();
        updateCapePosition();
    }, 10);

    $('#infernalCape').css('opacity', 1);
}

function proximitySensor() {
    
    // Check position difference
    let mouseDistance = Math.sqrt( Math.pow( cape.x - mouse.x, 2 ) + Math.pow( cape.y - mouse.y, 2 ) );
    
    // Apply velocity if we're within sensing distance
    if (mouseDistance <= config.sd) {

        // Set the velocity function on the cape
        let mouseDistancePerc = 1 - (mouseDistance / config.sd);
        let capeRatioX = (cape.x - mouse.x) / Math.abs(cape.y - mouse.y);
        let capeRatioY = (cape.y - mouse.y) / Math.abs(cape.x - mouse.x);

        let capeVX = config.velocityFunction(capeRatioX, mouseDistancePerc);
        let capeVY = config.velocityFunction(capeRatioY, mouseDistancePerc);
        
        cape.v.x = capeVX;
        cape.v.y = capeVY;

    }

}

function updateCapePosition() {

    // Adjust cape by position
    cape.x += cape.v.x;
    cape.y += cape.v.y;

    // Set cape visual position
    $('#infernalCape').css({
        'left': cape.x - (cape.w / 2),
        'top': cape.y - (cape.h / 2)
    });

    // Decay velocity on cape
    if (cape.v.x > 0) {
        cape.v.x -= config.v.vd;
        if (cape.v.x < 0) cape.v.x = 0;
    } else if (cape.v.x < 0) {
        cape.v.x += config.v.vd;
        if (cape.v.x > 0) cape.v.x = 0;
    }

    if (cape.v.y > 0) {
        cape.v.y -= config.v.vd;
        if (cape.v.y < 0) cape.v.y = 0;
    } else if (cape.v.y < 0) {
        cape.v.y += config.v.vd;
        if (cape.v.y > 0) cape.v.y = 0;
    }

}