const v = new Vue({
  el: '#app',
  data: {
    isRecording: false,
    buttonText: 'Start',
    currentStartTime: undefined,
    trackIndexForDeleting: undefined,
    point: {
      coords: {},
    },
    tracks: [],
    deltaTime: 0, // speed test
  },
  methods: {
    toggleRecordStatus: function () {
      if(this.isRecording) {
        this.isRecording = false;
        this.buttonText = 'Start';
        this.currentStartTime = undefined;
        this.currentStartTime = new Date();
        const tracks = load();
        tracks[0].stopTime = new Date();
        save(tracks);
        this.tracks = tracks;
      } else {
        this.isRecording = true;
        this.buttonText = 'Stop';
        this.currentStartTime = new Date();
        const newTrack = {
          startTime: this.currentStartTime,
          stopTime: undefined,
          dots: [],
        };
        let tracks = load();
        tracks = [newTrack, ...tracks];
        save(tracks);
        this.tracks = tracks;
      }
    },
    dateFormatter,
    saveTrack,
    openDeleteDialog: function(index) {
      this.trackIndexForDeleting = index;

    },
    closeDeleteDialog: function() {
      this.trackIndexForDeleting = undefined;
    },
    deleteTrack: function() {
      const tracks = load();
      tracks.splice(this.trackIndexForDeleting, 1);
      save(tracks);
      this.tracks = tracks;
      this.closeDeleteDialog();
    }
  },
  mounted: function() {
    this.tracks = normalizer(load());

    if(navigator.geolocation){
      navigator.geolocation.watchPosition(
        (position) => {
          const start = +new Date(); // speed test
          this.point = position;
          if(this.isRecording) {
            const tracks = load();
            tracks[0].dots.push(positionToObject(position));
            save(tracks);
            this.tracks = tracks;
          }
          const end =  +new Date(); // speed test
          this.deltaTime = end - start; // speed test
        },
        () => {},
        { maximumAge:0, enableHighAccuracy: true },
      )
    }
  }
});
