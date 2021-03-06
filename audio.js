navigator.webkitGetUserMedia({audio: true, video: false}, function(stream) {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)(); //or webkitAudioContext
    var analyser = audioContext.createAnalyser();
    var microphone = audioContext.createMediaStreamSource(stream);
    var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;
    
    //turn off the speakers
    var volume = audioContext.createGain();
    microphone.connect(volume);
    volume.connect(audioContext.destination);
    volume.gain.value = 0;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    var context = document.getElementById("text");

    javascriptNode.onaudioprocess = function() {
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        var average = values / length;
        
        document.body.style.backgroundColor = "rgb(" + (255 - Math.floor(average * 2)) + "," + 255 + "," + (255 - Math.floor(average * 2)) + ")";
    }
}, function(err) {
    console.log('error', err);
});