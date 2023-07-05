const seApp = Application('System Events');
seApp.includeStandardAdditions = true;
const messagesApp = Application('Messages');
messagesApp.includeStandardAdditions = true;
messagesApp.activate();

var args = $.NSProcessInfo.processInfo.arguments; // NSArray
var argv = [];
var argc = args.count;
for (var i = 4; i < argc; i++) {
    argv.push(ObjC.unwrap(args.objectAtIndex(i)));
}

const number = argv[0];

delay(0.2);

seApp.keystroke('n', { using: 'command down' });
delay(0.1);
seApp.keystroke(number);
delay(0.1);
seApp.keyCode(36); //enter
delay(3);


function pixelColorAtScreenCoord(x, y) {
    ObjC.import('Foundation')
    ObjC.import('AppKit')
    rect = $.CGRectMake(x, y, 1, 1)

    //Get DisplayID from point location.
    var displays = Ref()
    $.CGMainDisplayID() //Fully initialise CoreGraphics Framework
    maxDisplays = 5
    $.CGGetDisplaysWithRect(rect, maxDisplays, displays, null)
    displayID = displays[0]
    displays.release

    image = $.CGDisplayCreateImageForRect(displayID, rect);
    bitmap = $.NSBitmapImageRep.alloc.initWithCGImage(image)
    $.CGImageRelease(image)
    color = bitmap.colorAtXY($(x), $(y))
    bitmap.release
    return [
        parseInt(255 * color.redComponent),
        parseInt(255 * color.greenComponent),
        parseInt(255 * color.blueComponent),
        color.alphaComponent
    ];
}


function check() {
    x = Application("System Events").applicationProcesses.byName("Messages").windows[0].groups[0].groups[0].groups[0].groups[0].groups[0].groups[0].groups[2].properties().position[0];
    y = Application("System Events").applicationProcesses.byName("Messages").windows[0].groups[0].groups[0].groups[0].groups[0].groups[0].groups[0].groups[2].properties().position[1];

    for (let i = 0; i < 5; i++) {
        delay(1);
        let color = pixelColorAtScreenCoord(x + 100, y + 35);
        if (color[0] == 110 || color[0] == 243) {
            return false;
        }
    }
    return true;
}

check();
