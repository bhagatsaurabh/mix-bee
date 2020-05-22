var isMenuOpened = false;
var isPadLaunched = false;
var isControlLaunched = false;
var isControlPanelOpened = false;
var isRecording = false;
var isRecordStarted = false;
var isStopped = false;
var isRecordListLaunched = false;
var isStopClicked = false;
var flags = new Array(36);
var switchDup = true;
var progress = 150;
var trackCount = 0;
var recordingCount = 1;
var waitQueue = [];
var tracks = [];
var trackToSoundBind = [];
var sampleList = new Array(36);
var sampleSources = new Array(36);
var sourceBuffers;
var recorder;
var chorus,
    delay,
    phaser,
    overdrive,
    compressor,
    tremolo,
    wahwah,
    bitcrusher,
    moog; 

var context = new (window.AudioContext || window.webkitAudioContext)();
var bufferLoader;
var inputGain = context.createGain();
var outputGain = context.createGain();
var tuna = new Tuna(context);
var analyser = context.createAnalyser();

var userAgent = navigator.userAgent || navigator.vendor || window.opera;

if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || userAgent.match(/Android/i))
{
    alert("Please view on desktop for best experience.");
    document.body.style.display = "none";
    document.body.style.pointerEvents = "none";
    window.close();
}

chorus = new tuna.Chorus({
                rate: 1.5,         //0.01 to 8+
                feedback: 0.2,     //0 to 1+
                delay: 0.0045,     //0 to 1
                bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
            });

delay = new tuna.Delay({
        feedback: 0.45,    //0 to 1+
        delayTime: 150,    //1 to 10000 milliseconds
        wetLevel: 0.25,    //0 to 1+
        dryLevel: 1,       //0 to 1+
        cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
        bypass: 0
    });

phaser = new tuna.Phaser({
        rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
        depth: 0.3,                    //0 to 1
        feedback: 0.2,                 //0 to 1+
        stereoPhase: 30,               //0 to 180
        baseModulationFrequency: 700,  //500 to 1500
        bypass: 0
    });

overdrive = new tuna.Overdrive({
        outputGain: 0.5,         //0 to 1+
        drive: 0.7,              //0 to 1
        curveAmount: 1,          //0 to 1
        algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
        bypass: 0
    });

compressor = new tuna.Compressor({
        threshold: -1,    //-100 to 0
        makeupGain: 1,     //0 and up (in decibels)
        attack: 1,         //0 to 1000
        release: 0,        //0 to 3000
        ratio: 4,          //1 to 20
        knee: 5,           //0 to 40
        automakeup: true,  //true/false
        bypass: 0
    });

tremolo = new tuna.Tremolo({
        intensity: 0.3,    //0 to 1
        rate: 4,         //0.001 to 8
        stereoPhase: 0,    //0 to 180
        bypass: 0
    });

wahwah = new tuna.WahWah({
        automode: true,                //true/false
        baseFrequency: 0.5,            //0 to 1
        excursionOctaves: 2,           //1 to 6
        sweep: 0.2,                    //0 to 1
        resonance: 10,                 //1 to 100
        sensitivity: 0.5,              //-1 to 1
        bypass: 0
    });

bitcrusher = new tuna.Bitcrusher({
        bits: 4,          //1 to 16
        normfreq: 0.1,    //0 to 1
        bufferSize: 4096  //256 to 16384
    });

moog = new tuna.MoogFilter({
        cutoff: 0.065,    //0 to 1
        resonance: 3.5,   //0 to 4
        bufferSize: 4096  //256 to 16384
    });


chorus.bypass = 1;
delay.bypass = 1;
phaser.bypass = 1;
overdrive.bypass = 1;
compressor.bypass = 1;
tremolo.bypass = 1;
wahwah.bypass = 1;
bitcrusher.bypass = 1;
moog.bypass = 1;

inputGain.connect(chorus);
chorus.connect(delay);
delay.connect(phaser);
phaser.connect(overdrive);
overdrive.connect(compressor);
compressor.connect(tremolo);
tremolo.connect(wahwah);
wahwah.connect(bitcrusher);
bitcrusher.connect(moog);
moog.connect(outputGain);
outputGain.connect(analyser);
outputGain.connect(context.destination);

for (var i = 0; i < sampleList.length; i++) {
    flags[i] = false;
    sampleList[i] = "Sounds/" + i + ".ogg";
    sampleSources[i] = context.createBufferSource();
}

bufferLoader = new BufferLoader(context, sampleList, finishedLoading);
bufferLoader.load();

function finishedLoading(bufferList) {
    sourceBuffers = bufferList;
    for (var i = 0; i < sampleSources.length; i++) {
        sampleSources[i].buffer = bufferList[i];
        sampleSources[i].connect(inputGain);
    }
    setInterval(startPlayingAll, 4350);
    setInterval(updateProgress, 150);
}

function padTouched(x) {
    var started = flags[x];
    if (!started) {
        joinAudio(x);
        flags[x] = true;
    } else {
        var index = trackToSoundBind.indexOf(x);
        tracks.splice(index * 2, 2);
        trackToSoundBind.splice(index, 1);
        flags[x] = false;
        trackCount--;
    }
}

function joinAudio(x) {
    var audioOdd = context.createBufferSource();
    var audioEven = context.createBufferSource();
    audioOdd.buffer = sourceBuffers[x];
    audioOdd.connect(inputGain);
    audioEven.buffer = sourceBuffers[x];
    audioEven.connect(inputGain);
    tracks.push(audioEven);
    tracks.push(audioOdd);
    trackToSoundBind.push(x);
    trackCount++;
}

function startPlayingAll() {
    var oldGraph1 = document.getElementById("graph1");
    var newGraph1 = oldGraph1.cloneNode(true);
    oldGraph1.parentNode.replaceChild(newGraph1, oldGraph1);
    var oldGraph2 = document.getElementById("graph2");
    var newGraph2 = oldGraph2.cloneNode(true);
    oldGraph2.parentNode.replaceChild(newGraph2, oldGraph2);
    if (switchDup) {
        for (var i = 0; i < tracks.length; i += 2) {
            tracks[i].start();
            tracks[i + 1] = context.createBufferSource();
            tracks[i + 1].buffer = tracks[i].buffer;
            tracks[i + 1].connect(inputGain);
        }
        switchDup = false;
    }
    else {
        for (var i = 1; i < tracks.length; i += 2) {
            tracks[i].start();
            tracks[i - 1] = context.createBufferSource();
            tracks[i - 1].buffer = tracks[i].buffer;
            tracks[i - 1].connect(inputGain);
        }
        switchDup = true;
    }
    progress = 0;
    for (var i = 0; i < waitQueue.length; i++) {
        var temp = waitQueue[i];
        if (flags[temp - 1]) {
            document.getElementById("hexapad" + temp).className = "started";
        } else {
            document.getElementById("hexapad" + temp).className = "stopAnimation";
        }
    }
    if (isRecordStarted) {
        isRecordStarted = false;
        recorder = new Recorder(outputGain);
        recorder && recorder.record();
        isRecording = true;
        document.getElementById("button_record").value = "Recording...";
        document.getElementById("button_record").style.opacity = "0.5";
        document.getElementById("button_record").style.pointerEvents = "none";
    }
    if (isRecording && isStopped) {
        isRecording = false;
        isStopped = false;
        recorder && recorder.stop();
        createDownloadLink();
        recorder.clear();
        document.getElementById("button_record").value = "Record";
        document.getElementById("button_record").style.pointerEvents = "all";
        document.getElementById("button_record").style.opacity = "1";
        document.getElementById("button_save").value = "Save";
        document.getElementById("button_save").style.pointerEvents = "all";
        document.getElementById("button_save").style.opacity = "1";
    }
    if (isStopClicked) {
        document.getElementById("button_stop").value = "Stop";
        document.getElementById("button_stop").style.pointerEvents = "all";
        document.getElementById("button_stop").style.opacity = "1";
        isStopClicked = false;
    }
}

function updateProgress() {
    if (trackCount > 0) {
        document.getElementById("refer").style.visibility = "visible";
        document.getElementById("graph1").style.visibility = "visible";
        document.getElementById("graph2").style.visibility = "visible";
    } else {
        document.getElementById("refer").style.visibility = "hidden";
        document.getElementById("graph1").style.visibility = "hidden";
        document.getElementById("graph2").style.visibility = "hidden";
    }
    var curr = progress - 150;
    var update = setInterval(function () {
            if (curr >= progress) {
                clearInterval(update);
            }
            document.getElementById("refer").value = curr;
            curr += 10;
        }, 10);
    if (progress >= 4500) progress = 0;
    else progress += 150;
}

function openMenu() {
    if (!isMenuOpened) {
        document.getElementById("menu").style.left = "15px";
        isMenuOpened = true;
    } else {
        document.getElementById("menu").style.left = "-250px";
        isMenuOpened = false;
    }
}

function launchPad() {
    if (!isPadLaunched) {
        document.getElementById("synth_pad").style.top = "130px";
        document.getElementById("menu").style.left = "-250px";
        document.getElementById("welcome").style.right = "-1000px";
        setTimeout(animateLoading, 500);
        isMenuOpened = false;
        isPadLaunched = true;
    }
}

function launchControl() {
    if (!isControlLaunched && isPadLaunched) {
        document.getElementById("effect_container").style.right = "-20px";
        document.getElementById("effects_burger_menu").style.transform = "rotate(180deg)";
        isMenuOpened = false;
        isControlLaunched = true;
    } else {
        document.getElementById("effect_container").style.right = "-325px";
        document.getElementById("effects_burger_menu").style.transform = "rotate(0deg)";
        isMenuOpened = false;
        isControlLaunched = false;
    }
}

var i = 1;
function animateLoading() {
    document.getElementById("hexapad" + i).className = "hexapad";
    i++;
    if(i <= 36)
        setTimeout(animateLoading, 50);
}

function waitingForCompletion(x) {
    document.getElementById("hexapad" + (x + 1)).className = "animate";
    waitQueue.push(x+1);
}

function stopTracks() {
    if (trackCount == 0) return;
    tracks.splice(0, tracks.length);
    trackToSoundBind.splice(0, trackToSoundBind.length);
    for (var i = 0; i < flags.length; i++) {
        document.getElementById("hexapad" + (i + 1)).className = "animate";
        waitQueue.push(i+1);
        flags[i] = false;
    }
    if (!isStopClicked && trackCount > 0) {
        isStopClicked = true;
        document.getElementById("button_stop").value = "Stopping...";
        document.getElementById("button_stop").style.pointerEvents = "none";
        document.getElementById("button_stop").style.opacity = "0.5";
    }
    trackCount = 0;
}

setInterval(welcome, 6000);
var k = 0;
function welcome() {
    if (!isPadLaunched) {
        document.getElementById("welcome0").style.opacity = "0";
        setTimeout(over, 2000);
    }
}

function over() {
    document.getElementById("welcome0").setAttribute("src", "Images/welcome" + (k % 3) + ".jpg");
    k++;
    document.getElementById("welcome0").style.opacity = "1";
}

function chorusFilter() {
    if (chorus.bypass == 1) {
        chorus.bypass = 0;
        document.getElementById('chorus_panel').style.height = '90px';
        document.getElementById('chorus_panel').style.opacity = '1';
        document.getElementById('chorus_panel').style.pointerEvents = 'all';
    } else {
        chorus.bypass = 1;
        document.getElementById('chorus_panel').style.pointerEvents = 'none';
        document.getElementById('chorus_panel').style.opacity = '0';
        document.getElementById('chorus_panel').style.height = '0';
    }
}

function delayFilter() {
    if (delay.bypass == 1) {
        delay.bypass = 0;
        document.getElementById('delay_panel').style.height = '130px';
        document.getElementById('delay_panel').style.opacity = '1';
        document.getElementById('delay_panel').style.pointerEvents = 'all';
    } else {
        delay.bypass = 1;
        document.getElementById('delay_panel').style.pointerEvents = 'none';
        document.getElementById('delay_panel').style.opacity = '0';
        document.getElementById('delay_panel').style.height = '0';
    }
}

function phaserFilter() {
    if (phaser.bypass == 1) {
        phaser.bypass = 0;
        document.getElementById('phaser_panel').style.height = '130px';
        document.getElementById('phaser_panel').style.opacity = '1';
        document.getElementById('phaser_panel').style.pointerEvents = 'all';
    } else {
        phaser.bypass = 1;
        document.getElementById('phaser_panel').style.pointerEvents = 'none';
        document.getElementById('phaser_panel').style.opacity = '0';
        document.getElementById('phaser_panel').style.height = '0';
    }
}

function overdriveFilter() {
    if (phaser.bypass == 1) {
        phaser.bypass = 0;
        document.getElementById('overdrive_panel').style.height = '80px';
        document.getElementById('overdrive_panel').style.opacity = '1';
        document.getElementById('overdrive_panel').style.pointerEvents = 'all';
    } else {
        phaser.bypass = 1;
        document.getElementById('overdrive_panel').style.pointerEvents = 'none';
        document.getElementById('overdrive_panel').style.opacity = '0';
        document.getElementById('overdrive_panel').style.height = '0';
    }
}

function compressorFilter() {
    if (phaser.bypass == 1) {
        phaser.bypass = 0;
        document.getElementById('compressor_panel').style.height = '130px';
        document.getElementById('compressor_panel').style.opacity = '1';
        document.getElementById('compressor_panel').style.pointerEvents = 'all';
    } else {
        phaser.bypass = 1;
        document.getElementById('compressor_panel').style.pointerEvents = 'none';
        document.getElementById('compressor_panel').style.opacity = '0';
        document.getElementById('compressor_panel').style.height = '0';
    }
}

function tremoloFilter() {
    if (tremolo.bypass == 1) {
        tremolo.bypass = 0;
        document.getElementById('tremolo_panel').style.height = '90px';
        document.getElementById('tremolo_panel').style.opacity = '1';
        document.getElementById('tremolo_panel').style.pointerEvents = 'all';
    } else {
        tremolo.bypass = 1;
        document.getElementById('tremolo_panel').style.pointerEvents = 'none';
        document.getElementById('tremolo_panel').style.opacity = '0';
        document.getElementById('tremolo_panel').style.height = '0';
    }
}

function wahFilter() {
    if (wahwah.bypass == 1) {
        wahwah.bypass = 0;
        document.getElementById('wah_panel').style.height = '130px';
        document.getElementById('wah_panel').style.opacity = '1';
        document.getElementById('wah_panel').style.pointerEvents = 'all';
    } else {
        wahwah.bypass = 1;
        document.getElementById('wah_panel').style.pointerEvents = 'none';
        document.getElementById('wah_panel').style.opacity = '0';
        document.getElementById('wah_panel').style.height = '0';
    }
}

function bitCFilter() {
    if (bitcrusher.bypass == 1) {
        bitcrusher.bypass = 0;
        document.getElementById('bit_panel').style.height = '90px';
        document.getElementById('bit_panel').style.opacity = '1';
        document.getElementById('bit_panel').style.pointerEvents = 'all';
    } else {
        bitcrusher.bypass = 1;
        document.getElementById('bit_panel').style.pointerEvents = 'none';
        document.getElementById('bit_panel').style.opacity = '0';
        document.getElementById('bit_panel').style.height = '0';
    }
}

function moogFilter() {
    if (moog.bypass == 1){
        moog.bypass = 0;
        document.getElementById('moog_panel').style.height = '90px';
        document.getElementById('moog_panel').style.opacity = '1';
        document.getElementById('moog_panel').style.pointerEvents = 'all';
    } else {
        moog.bypass = 1;
        document.getElementById('moog_panel').style.pointerEvents = 'none';
        document.getElementById('moog_panel').style.opacity = '0';
        document.getElementById('moog_panel').style.height = '0';
    }
}

function chorusParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        chorus.rate = value / 100.0;
    } else if (index == 1) {
        chorus.feedback = value / 10.0;
    } else {
        chorus.delay = value / 10000.0;
    }
}

function delayParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        delay.feedback = value / 100.0;
    } else if (index == 1) {
        delay.delayTime = value;
    } else if(index == 2) {
        delay.wetLevel = value / 100.0;
    } else if (index == 3) {
        delay.dryLevel = value / 100.0;
    } else {
        delay.cutoff = value;
    }
}

function phaserParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        phaser.rate = value / 100.0;
    } else if (index == 1) {
        phaser.depth = value / 10.0;
    } else if (index == 2) {
        phaser.feedback = value / 10.0;
    } else if (index == 3) {
        phaser.stereoPhase = value;
    } else {
        phaser.baseModulationFrequency = value;
    }
}

function overdriveParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        overdrive.outputGain = value / 10.0;
    } else if (index == 1) {
        overdrive.drive = value / 10.0;
    } else {
        overdrive.curveAmount = value / 10.0;
    }
}

function compressorParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        compressor.threshold = value;
    } else if (index == 1) {
        compressor.attack = value;
    } else if (index == 2) {
        compressor.release = value;
    } else if (index == 3) {
        compressor.ratio = value;
    } else {
        compressor.knee = value;
    }
}

function tremoloParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        tremolo.intensity = value / 10.0;
    } else if (index == 1) {
        tremolo.rate = value / 1000.0;
    } else {
        tremolo.stereoPhase = value;
    }
}

function wahParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        wahwah.baseFrequency = value / 10.0;
    } else if (index == 1) {
        wahwah.excursionOctaves = value;
    } else if (index == 2) {
        wahwah.sweep = value / 10.0;
    } else if (index == 3) {
        wahwah.resonance = value;
    } else {
        wahwah.sensitivity = value / 10.0;
    }
}

function bitParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        bitcrusher.bits = value;
    } else if (index == 1) {
        bitcrusher.normfreq = value / 10.0;
    } else {
        bitcrusher.bufferSize = value;
    }
}

function moogParams(x, i) {
    var index = parseInt(i);
    var value = parseInt(x);
    if (index == 0) {
        moog.cutoff = value / 1000.0;
    } else if (index == 1){
        moog.resonance = value / 10.0;
    } else {
        moog.bufferSize = value;
    }
}

function launchControlPanel() {
    if (isPadLaunched) {
        if (!isControlPanelOpened) {
            document.getElementById("control_panel").style.top = "40px";
            document.getElementById("control_panel").style.width = "600px";
            document.getElementById("control_panel").style.marginLeft = "-300px";
            document.getElementById("control_panel").style.opacity = "1";
            document.getElementById("control_panel").style.pointerEvents = "all";
            document.getElementById("controls_burger_menu").style.transform = "rotate(180deg)";
            isControlPanelOpened = true;
        } else {
            document.getElementById("control_panel").style.top = "20px";
            document.getElementById("control_panel").style.width = "0";
            document.getElementById("control_panel").style.marginLeft = "0px";
            document.getElementById("control_panel").style.opacity = "0";
            document.getElementById("control_panel").style.pointerEvents = "none";
            document.getElementById("controls_burger_menu").style.transform = "rotate(0deg)";
            isControlPanelOpened = false;
        }
    }
}

function recordTracks() {
    if (trackCount > 0) {
        if (!isRecordStarted) {
            document.getElementById("button_record").value = "Starting...";
            document.getElementById("button_record").opacity = "0.5";
            document.getElementById("button_record").style.pointerEvents = "none";
            isRecordStarted = true;
        }
    }
}

function stopRecordTracks() {
    if (!(trackCount <= 0)) {
        if (!isStopped && isRecording) {
            document.getElementById("button_save").value = "Saving...";
            document.getElementById("button_save").style.pointerEvents = "none";
            document.getElementById("button_save").style.opacity = "0.5";
            isStopped = true;
        }
    }
}
function createDownloadLink() {
    recorder && recorder.exportWAV(function (blob) {
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var img = document.createElement('img');
        var hf = document.createElement('a');

        hf.href = url;
        hf.download = "virtualsynth_record_" + recordingCount.toString();
        li.style.textAlign = "center";
        img.style.marginLeft = "100px";
        img.width = "32";
        img.height = "32";
        img.src = "Images/download_record.svg";
        au.controls = true;
        au.src = url;
        hf.appendChild(img);
        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.appendChild(li);
        recordingCount++;
        document.getElementById("record_notify").style.visibility = "visible";
        if (!isMenuOpened) { openMenu(); }
    });
}

function launchRecordList() {
    if (!isRecordListLaunched) {
        isRecordListLaunched = true;
        document.getElementById("userRecordings").style.width = "100%";
        document.getElementById("userRecordings").style.height = "100%";
        document.getElementById("userRecordings").style.top = "0";
        document.getElementById("userRecordings").style.left = "0";
        document.getElementById("userRecordings").style.pointerEvents = "all";
        document.getElementById("userRecordings").style.opacity = "1";
        document.getElementById("userRecordings").style.zIndex = "18";
        document.getElementById("record_notify").style.visibility = "hidden";
    } else {
        isRecordListLaunched = false;
        document.getElementById("userRecordings").style.width = "0%";
        document.getElementById("userRecordings").style.height = "0%";
        document.getElementById("userRecordings").style.top = "50%";
        document.getElementById("userRecordings").style.left = "50%";
        document.getElementById("userRecordings").style.pointerEvents = "none";
        document.getElementById("userRecordings").style.opacity = "0";
        document.getElementById("userRecordings").style.zIndex = "0";
    }
    document.getElementById("menu").style.left = "-250px";
    isMenuOpened = false;
}