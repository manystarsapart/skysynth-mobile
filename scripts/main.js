// registering service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
        .then(registration => {
        console.log('ServiceWorker registration successful');
        })
        .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {



    document.addEventListener('touchstart', (e) => {
        if (e.target === document.documentElement) {
            e.preventDefault();
        }
    }, { passive: false });
  
    window.addEventListener('resize', () => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.documentElement.style.height = window.innerHeight + 'px';
        }
    });


    // getting from DOM & assigning variables
    let messages = [];
    let noteHistory = [];
    let transposeValue = 0;
    let stopAudioWhenReleased = 0;
    const statusDiv = document.getElementById("status-div");
    const notesDiv = document.getElementById("notes-div");
    const transposeValueBox = document.getElementById("transpose-value");
    const scaleValueBox = document.getElementById("scale-value");
    const scaleValueBox2 = document.getElementById("scale-value-2");
    const octaveValueBox = document.getElementById("octave-value");
    const clearStatusButton = document.getElementById("clear-status-button");
    const clearNoteHistoryButton = document.getElementById("clear-note-history-button")
    const stopAudioWhenReleasedButton = document.getElementById("stop-audio-when-released-button");

    // ===========================================
    // MENU TOGGLE

    // const navbar = document.getElementById("navbar");
    // const menuTitle = document.getElementById("menu-title");
    // const navContent = navbar.querySelectorAll("li > div");
    // const acknowledgements = document.getElementById("acknowledgements");

    // function toggleMenu() {
    //     navbar.classList.toggle("w-[400px]");
    //     navbar.classList.toggle("hover:w-[400px]");
    //     menuTitle.classList.toggle("hidden");
    //     menuTitle.classList.toggle("group-hover:block");
    //     navContent.forEach(div => {
    //         div.classList.toggle("hidden");
    //         div.classList.toggle("group-hover:block");
    //     });
    //     acknowledgements.classList.toggle("hidden");
    //     acknowledgements.classList.toggle("group-hover:block");
    // }

    // ===========================================
    // RECORDING FUNCTIONALITY

    // let mediaRecorder;
    // let audioChunks = [];
    // let hasRecording = false;
    // let isRecording = false;
    // let audio;
    // let audioUrl;
    
    // const startRecordButton = document.getElementById('start-record-button');
    // const stopRecordButton = document.getElementById('stop-record-button');
    // const playRecordButton = document.getElementById('play-record-button');
    // const saveRecordButton = document.getElementById('save-record-button');
    // const stopPlaybackButton = document.getElementById("stop-playback-button");
    // // const clearRecordButton = document.getElementById('clear-record-button');
    
    // startRecordButton.addEventListener('click', startRecording);
    // stopRecordButton.addEventListener('click', stopRecording);
    // playRecordButton.addEventListener('click', playRecording);
    // saveRecordButton.addEventListener('click', saveRecording);
    // stopPlaybackButton.addEventListener('click', stopPlayback)
    // // clearRecordButton.addEventListener('click', clearRecording);
    
    // function startRecording() {
    //     if (isRecording) {
    //         alert("Recording already in progress!");
    //         return;
    //     }
    //     hasRecording = false;
    //     isRecording = true;
    //     startRecordButton.style.backgroundColor = "#F08080";
    //     audioChunks = [];
    //     const audioStream = Tone.context.createMediaStreamDestination();
    //     volumeNode.connect(audioStream);
        
    //     mediaRecorder = new MediaRecorder(audioStream.stream);
    //     mediaRecorder.ondataavailable = (e) => {
    //         audioChunks.push(e.data);
    //     };
    //     mediaRecorder.onstop = () => {
    //         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    //         audioUrl = URL.createObjectURL(audioBlob);
    //         audio = new Audio(audioUrl);
    //         hasRecording = true;
    //         isRecording = false;
    //         alert("Recording stopped!");
    //         startRecordButton.style.backgroundColor = "";
    //         // TODO: something is wrong here. i forgot what i was going to fix
    //         // i will come back to fixing this later
    //     };
    //     mediaRecorder.start();
    //     alert("Recording started...");
    // }
    
    // function stopRecording() {
    //     mediaRecorder.stop();
    // }
    
    // function playRecording() {
    //     if (hasRecording && audio) {
    //         audio.onended = () => {
    //             alert("Recording playback finished.");
    //         }
    //         audio.play();
    //         alert("Playing recording...");
    //     } else if (isRecording) {
    //         alert("There is a recording in progress! Cannot play!");
    //     } else {
    //         alert("No stored recording.");
    //     }
    // }

    // // TODO: ADD STOP PLAYBACK BUTTON
    // function stopPlayback() {
    //     if (audio) {
    //         audio.pause();
    //         audio.currentTime = 0;
    //         alert("Playback stopped.");
    //     }
    // }

    // function saveRecording() {
    //     alert("Saving recording...");
    //     const link = document.createElement('a');
    //     link.href = audioUrl;
    //     link.download = 'recording.wav';
    //     link.click();
    // }

    // function clearRecording() {
    //     // THIS IS BENCHED UNTIL FURTHER ACTION BECAUSE THE CLEAR BUTTON ALSO CLEARS EVERY AUDIO THING
    //     // I WILL FIX THIS SOON
    //     hasRecording = false;
    //     audioChunks = [];
    //     if (audio) {
    //         audio.pause();
    //         audio.src = '';
    //         audio.removeAttribute('src');
    //         audio = null;
    //     }
    //     if (audioUrl) {
    //         URL.revokeObjectURL(audioUrl);
    //         audioUrl = null;
    //     }
    //     alert("Recording cleared!");
    // }

    // ===========================================
    // MAPS FOR KEY --- MIDINOTE

    alert("Initialised!");
    
    // for double music pad
    const dbLetterMap = {
        'q': 48, 'w': 50, 'e': 52, 'r': 53, 't': 55,
        'a': 57, 's': 59, 'd': 60, 'f': 62, 'g': 64,
        'z': 65, 'x': 67, 'c': 69, 'v': 71, 'b': 72,
        'y': 60, 'u': 62, 'i': 64, 'o': 65, 'p': 67,
        'h': 69, 'j': 71, 'k': 72, 'l': 74, ';': 76,
        'n': 77, 'm': 79, ',': 81, '.': 83, '/': 84,
    };

    // for keys pressed to initiate transposing
    const pitchMap = {
        '`': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, 
        '6': 6, '7': 7, '8': 8, '9': 9, '0':10, '-': 11, 
        '=': 12
    };

    // TODO: MAKE THIS INTO A DROPDOWN TO SELECT IN MENU INSTEAD

    // shows exact scale of tranposed key
    // JUST FOR VISUAL GUIDE
    // note that this is separate because pitchMap values are the ones used in the midiNotes
    const transposeMap = {
        '0': "C", 
        '1': "C#",
        '2': "D", 
        '3': "D#",
        '4': "E", 
        '5': "F", 
        '6': "F#",
        '7': "G", 
        '8': "G#",
        '9': "A", 
        '10': "Bb",
        '11': "B", 
        '12': "C"
    };


    // ===========================================
    // OCTAVE CHANGE

    let lastPressedTransposeKey = "`";
    // ` 1 2 3 4 5 6 7 8 9 0 - =
    let octave = 0;
    let octaveAdjustment = 0;

    function octaveUp() {
        if (octave >= 3) {
            alert("Already at maximum octave!");
            return;
        }
        octave++;
        octaveAdjustment += 12;
        octaveValueBox.innerHTML = octave;
        alert(`Octave shift updated to: ${octave}`);
        updateVisualGuide(lastPressedTransposeKey);
    }

    function octaveDown() {
        if (octave <= -2) {
            alert("Already at minimum octave!");  
            return;
        }
        octave--;
        octaveAdjustment -= 12;
        octaveValueBox.innerHTML = octave; 
        alert(`Octave shift updated to: ${octave}`);
        updateVisualGuide(lastPressedTransposeKey); 
    }

    // ===========================================
    // FOR VISUAL GUIDE FOR NOTE NAMES
    
    const notesDivL = document.getElementById("notes-div-left");
    const notesDivR = document.getElementById("notes-div-right")

    let realOctaveLeft = octave + 3;
    let realOctaveRight = realOctaveLeft + 1;

    const mapNumbersToNotesOctaves = {
        'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'Bb', 'C'],
        'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
        'D#': ['D#', 'F', 'G', 'G#', 'Bb', 'C', 'D'],
        'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
        'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
        'F#': ['F#', 'G#', 'Bb', 'B', 'C#', 'D#', 'F'],
        'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
        'G#': ['G#', 'Bb', 'C', 'C#', 'D#', 'F', 'G'],
        'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
        'Bb': ['Bb', 'C', 'D', 'D#', 'F', 'G', 'A'],
        'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'Bb']
    };

    const preserveKeyIDLeft = {
        '0':'q', '1':'w', '2':'e', '3':'r', '4':'t', 
        '5':'a', '6':'s', '7':'d', '8':'f', '9':'g', 
        '10':'z', '11':'x', '12':'c', '13':'v', '14':'b'
    };

    const preserveKeyIDRight = {
        '0':'y', '1':'u', '2':'i', '3':'o', '4':'p',
        '5':'h', '6':'j', '7':'k', '8':'l', '9':';',
        '10':'n', '11':'m', '12':',', '13':'.', '14':'/'
    };

    const mapNumbersToNotesMapping = [
        [1, 2, 3, 4, 5],
        [6, 7, 1, 2, 3],
        [4, 5, 6, 7, 8]
    ];

    function mapNumbersToNotes(currentKey, leftright) {    
        realOctaveLeft = octave + 2;
        realOctaveRight = realOctaveLeft + 1;
        const keyNotes = mapNumbersToNotesOctaves[currentKey];
        const octaveBase = leftright === 0 ? realOctaveLeft : realOctaveRight;
        const mappingFlattened = mapNumbersToNotesMapping.flat();
        let countC = 0;
        let keyIDcount = 0;
        const elements = mappingFlattened.map(num => {
            keyIDcount++;
            const isC = (num - 1) % 7 === 0;
            if (isC) countC++;
            const noteIndex = (num - 1) % 7;
            const note = keyNotes[noteIndex];
            const currentOctave = octaveBase + (countC - 1);
            if (leftright == 0) {
                return `<div id="${preserveKeyIDLeft[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                    <div>
                    ${note}<sub class="text-lg">${currentOctave}</sub>
                    </div>
                    <span class="text-2xl">${preserveKeyIDLeft[keyIDcount-1].toUpperCase()}</span>
                </div>`;
            } else {
                return `<div id="${preserveKeyIDRight[keyIDcount-1]}" class="flex flex-col items-center justify-center p-2 rounded-4xl border-3 text-center h-30 w-30 relative bg-white/80">
                <div>
                    ${note}<sub class="text-lg">${currentOctave}</sub>
                </div>
                <span class="text-2xl">${preserveKeyIDRight[keyIDcount-1].toUpperCase()}</span>
                </div>`;
            }
        });
        // console.log(elements);
        return elements.join('');
    }

    // ^^^ THIS FUNCTION WAS IMPROVED BY DEEPSEEK R1 TO HELP DISPLAY EACH OCTAVES NUMBER CORRECTLY
    // ALL HAIL OUR AI OVERLORDS

    function updateVisualGuide(key) {
        notesDivL.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 0);
        notesDivR.innerHTML = mapNumbersToNotes(transposeMap[pitchMap[key]], 1);
    }

    // ===========================================
    // CHOOSING INSTRUMENTS & EFFECTS
    
    const instrumentSelection = document.getElementById("instrument-selection");
    const effectSelection = document.getElementById("effect-selection");
    const effectLevelControl = document.getElementById("effect-level-control");
    let effectLevel = 50;
    
    let effectNodes = [
        null, // 0 no effect
        new Tone.Distortion(), // 1
        new Tone.AutoWah(),    // 2
        new Tone.BitCrusher(),  // 3
        new Tone.Freeverb(), // 4

    ];
    
    const instruments = [
        new Tone.Sampler({ 
            urls: {
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "A7": "a7.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
                "D#7": "ds7.mp3"
            },
            baseUrl: "../assets/audio/piano/",
            onload: () => {
                console.log("piano samples loaded");
            }, 
        }), // 0 piano sampler
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "D#3": "ds3.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
            },
            baseUrl: "../assets/audio/eguitar/",
            onload: () => {
                console.log("e-guitar samples loaded");
            }, 
        }), // 1 eguitar sampler
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
                "D#7": "ds7.mp3"
            },
            baseUrl: "../assets/audio/musicbox/",
            onload: () => {
                console.log("musicbox samples loaded");
            }, 
        }), // 2 musicbox sampler
        new Tone.Sampler({ 
            urls: {
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
            },
            baseUrl: "../assets/audio/flute/",
            onload: () => {
                console.log("flute samples loaded");
            }, 
        }), // 3 flute sampler
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "D#3": "ds3.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
            },
            baseUrl: "../assets/audio/horn/",
            onload: () => {
                console.log("horn samples loaded");
            }, 
        }), // 4 horn sampler
        new Tone.Sampler({ 
            urls: {
                "A4": "a4.mp3",
                "A5": "a5.mp3",
                "A6": "a6.mp3",
                "D#4": "ds4.mp3",
                "D#5": "ds5.mp3",
                "D#6": "ds6.mp3",
            },
            baseUrl: "../assets/audio/bugle/",
            onload: () => {
                console.log("bugle samples loaded");
            }, 
        }), // 5 bugle sampler
        new Tone.PolySynth(Tone.Synth), // 6
        new Tone.PolySynth(Tone.DuoSynth), // 7
        new Tone.PolySynth(Tone.FMSynth), // 8
        new Tone.PolySynth(Tone.AMSynth), // 9
        new Tone.Sampler({ 
            urls: {
                "A3": "a3.mp3",
                "B2": "b2.mp3",
                "B4": "b4.mp3",
                "B5": "b5.mp3",
                "C4": "c4.mp3",
                "D#4": "ds4.mp3",
                "F3": "f3.mp3",
                "F4": "f4.mp3",
                "F5": "f5.mp3"
            },
            baseUrl: "../assets/audio/meow/",
            onload: () => {
                console.log("meow samples loaded");
            }, 
        }), // 10 meow sampler
        new Tone.Sampler({ 
            urls: {
                "F3": "f3.wav",
                "A3": "a3.wav",
                "C4": "c4.wav",
                "F4": "f4.wav",
                "Bb4": "bb4.wav",
                "C5": "c5.wav",
                "F5": "f5.wav",
                "C6": "c6.wav",
                "F6": "f6.wav",
            },
            baseUrl: "../assets/audio/otto-doo/",
            onload: () => {
                console.log("otto doo samples loaded");
            }, 
        }), // 11 otto doo
        new Tone.Sampler({ 
            urls: {
                "C3": "c3.wav",
                "F3": "f3.wav",
                "C4": "c4.wav",
                "F4": "f4.wav",
                "Bb4": "bb4.wav",
                "C5": "c5.wav",
                "F5": "f5.wav",
                "C6": "c6.wav",
                "F6": "f6.wav",
            },
            baseUrl: "../assets/audio/otto-synth/",
            onload: () => {
                console.log("otto synth samples loaded");
            }, 
        }), // 12 otto synth

        // todo: explore & add more
    ];

    const instrumentNames = [
        "Piano (Sampler)",
        "E-Guitar (Sampler)",
        "Music Box (Sampler)",
        "Flute (Sampler)",
        "Horn (Sampler)",
        "Bugle (Sampler)",
        "Synth",
        "Duo Synth",
        "FM Synth",
        "AM Synth",
        "Meow",
        "Otto - Doo",
        "Otto - Synth",
    ]

    // // dynamically update select elements
    // for (var i = 0; i < instrumentNames.length; i++) {
    //     instrumentSelection.appendChild(
    //         Object.assign(
    //             document.createElement("option"),
    //             { value: i, innerHTML: instrumentNames[i] }
    //         )
    //     );
    // }

    // for (var i = 0; i < effectNodes.length; i++) {
    //     effectSelection.appendChild(
    //         Object.assign(
    //             document.createElement("option"),
    //             { value: i, innerHTML: effectNodes[i] != null ? effectNodes[i].name : "None" }
    //         )
    //     )
    // }
  
    // effectNodes[4].dampening = 5000; // or 1000 if you want a rough sound

    // default: synth & no effect
    let currentInstrument = instruments[0];
    const volumeNode = new Tone.Volume().toDestination();
    currentInstrument.connect(volumeNode);
    let currentEffectNode = effectNodes[0];
  
    // // changing EFFECTS
    // effectSelection.addEventListener("input", (e) => {
    //     const selectedID = parseInt(e.target.value); 
    //     getEffectLevelInput(effectNodes[selectedID]); 
    //     // ^^read from slider BEFORE setting new effect. this ensures we are setting things for the correct node

    //     let newEffectNode = effectNodes[selectedID]; // set new effect 

    //     // rewiring to include new effect node
    //     currentInstrument.disconnect();
    //     if (currentEffectNode) { // if existing effect is connected, unwire
    //         currentEffectNode.disconnect(volumeNode);
    //     }
    //     currentEffectNode = newEffectNode; 
    //     if (currentEffectNode) { // rewire to new effect
    //         currentInstrument.connect(currentEffectNode); // rewire only for
    //         currentEffectNode.connect(volumeNode);
    //     } else {
    //         currentInstrument.connect(volumeNode);
    //     }
    // });


    // // update again to realise new connection
    // effectSelection.dispatchEvent(new Event('input'));

    // // changing INSTRUMENTS
    // instrumentSelection.addEventListener("input", (e) => {
    //     // the actual changing
    //     currentInstrument = instruments[e.target.value]; 
    //     // rewiring
    //     currentInstrument.disconnect();
    //     if (currentEffectNode) currentInstrument.connect(currentEffectNode);
    //     else currentInstrument.connect(volumeNode);
    //     if (currentInstrument == "Sampler" && e.target.value != 1 && e.target.value != 12) {
    //         // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
    //         stopAudioWhenReleased = false;
    //         stopAudioWhenReleasedButton.style.backgroundColor = "#F08080";
    //         stopAudioWhenReleasedButton.textContent = "false"
    //     } 
    //     else {
    //         stopAudioWhenReleased = true;
    //         stopAudioWhenReleasedButton.style.backgroundColor = "#588157";
    //         stopAudioWhenReleasedButton.textContent = "true"
    //     } 
    // });

    // stopAudioWhenReleasedButton.addEventListener("click", (e) => {
    //     if (stopAudioWhenReleased == true) {
    //         stopAudioWhenReleased = false;
    //         stopAudioWhenReleasedButton.style.backgroundColor = "#F08080";
    //         stopAudioWhenReleasedButton.textContent = "false"
    //     } else {
    //         stopAudioWhenReleased = true;
    //         stopAudioWhenReleasedButton.style.backgroundColor = "#588157";
    //         stopAudioWhenReleasedButton.textContent = "true"
    //     }
    // })

    // effectLevelControl.addEventListener("input", (e) => {effectSelection.dispatchEvent(new Event('input'))});

    // update
    // instrumentSelection.dispatchEvent(new Event('input'));

    // // read from slider
    // function getEffectLevelInput(node) {
    //     if (node == null) {
    //         console.log("No effect.");
    //         effectLevelControl.style.display = "none";
    //         return;
    //     }

    //     effectLevel = parseInt(effectLevelControl.value);

    //     effectLevelControl.style.display = "inline-block";
    //     console.log(node.name);
    //     switch (node.name) {
    //         case "Distortion":
    //             effectNodes[1].distortion = effectLevel / 100;
    //             // sounds better around mid range
    //             break;
    //         case "AutoWah":
    //             effectNodes[2].sensitivity = effectLevel / 100 * 60 - 60;
    //             // effect more apparent at higher values
    //             break;
    //         case "BitCrusher":
    //             effectNodes[3].bits = effectLevel / 100 * 15 + 1;
    //             // sounds better at higher values
    //             break;
    //         case "Freeverb":
    //             effectNodes[4].roomSize = effectLevel / 100;
    //             // sounds better for me at lower values
    //             break;
    //     }
    // }

    // ===========================================
    // HANDLING KEYPRESSES

    // grabs set of KEYS PRESSED
    let letterMap = dbLetterMap;
    // const pressedKeys = new Set();
    
    // when any key is pressed
    function handleKeyDown(e) {

        // note / transpose logic (works for all keys)
        if (key in letterMap && !pressedKeys.has(key)) { 

            // key in noteplaying map: play MIDI note
            pressedKeys.add(key);
            let midiNote = letterMap[key] + transposeValue + octaveAdjustment;

            currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"));
            document.getElementById(key).style.backgroundColor = "#588157"; // lights up key to green
            incrementCumKeypress();
        } else if (key in pitchMap && !pressedKeys.has(key)) {
            // detecting for transposing. number keys
            lastPressedTransposeKey = key;
            transposeValue = pitchMap[key]; // in semitones
            transposeValueBox.innerHTML = pitchMap[key]; // returns semitone count
            scaleValueBox.innerHTML = transposeMap[pitchMap[key]]; // returns scale ("C", "D", etc)
            scaleValueBox2.innerHTML = transposeMap[pitchMap[key]]; // returns the same scale for better visualisation
            updateVisualGuide(key);
            console.log(`transpose value updated to: ${pitchMap[key]}`);
        } 
        
        // THIS IS HERE IF I NEED IT IN THE FUTURE
        // else if (e.key == 'CapsLock') {
        //     if (stopAudioWhenReleased === true) {
        //         stopAudioWhenReleased = false;
        //         stopAudioWhenReleasedButton.style.backgroundColor = "#F08080";
        //         stopAudioWhenReleasedButton.textContent = "false"
        //     } else {
        //         stopAudioWhenReleased = true;
        //         stopAudioWhenReleasedButton.style.backgroundColor = "#588157";
        //         stopAudioWhenReleasedButton.textContent = "true"
        //     }
        // } 

        // // detect arrow key: octave change
        // switch(e.key) {
        //     case 'ArrowLeft':
        //         octaveDown(pitchMap[key]);
        //         break;
        //     case 'ArrowDown':
        //         octaveDown(pitchMap[key]);
        //         break;
        //     case 'ArrowRight':
        //         octaveUp(pitchMap[key]);
        //         break;
        //     case 'ArrowUp':
        //         octaveUp(pitchMap[key]);
        //         break;
        // }         
    }

    // ===========================================
    // LOGGING: NOTE PLAYING HISTORY

    function midiToSPN(midiNumber) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
        const noteIndex = midiNumber % 12;
        const octave = Math.floor((midiNumber - 12) / 12) - 1;
        return noteNames[noteIndex] + octave;
    }

    // ===========================================
    // MOBILE MOBILE MOBILE

    const keyString = "qwertasdfgzxcvbyuiophjkl;nm,./";
    

    for (let mobileKeyID = 0; mobileKeyID < 30; mobileKeyID++) {
        let mobileKey = keyString[mobileKeyID];
        const mobileKeyDiv = document.getElementById(mobileKey);

        mobileKeyDiv.addEventListener('touchstart', (e) => {
            let midiNote = letterMap[mobileKey] + transposeValue + octaveAdjustment;
            console.log(`mobile key pressed: ${mobileKey}, ${midiToSPN(midiNote)}`);
            currentInstrument.triggerAttack(Tone.Frequency(midiNote, "midi"));
            mobileKeyDiv.style.backgroundColor = "#588157"; // lights up key to green

        })
        
        mobileKeyDiv.addEventListener('touchend', (e) => {
            mobileKeyDiv.style.backgroundColor = "";
            let midiNote = letterMap[mobileKey] + transposeValue + octaveAdjustment
            if (stopAudioWhenReleased == false) return; // IF SAMPLER && NOT E-GUITAR && NOT OTTO-SYNTH
            else;
            currentInstrument.triggerRelease(Tone.Frequency(midiNote, "midi"));
        })
    }


    
    // updateVisualGuide(key); key: `,1,2,3,4,5,6,7,8,9,0,-,=
    // TODO: MAKE THIS INTO A DROPDOWN


});

