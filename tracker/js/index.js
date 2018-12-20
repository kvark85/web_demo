const maxAccuracy = 20;

const v = new Vue({
  el: '#app',
  data: {
    isRecording: false,
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
        this.tracks[0].stopTime = new Date();
        save(this.tracks);
      } else {
        this.isRecording = true;
        this.tracks = [
          {
            startTime: new Date(),
            stopTime: undefined,
            dots: [],
          },
          ...this.tracks
        ];
      }
    },
    dateFormatter,
    speedFormatter: (speed) => Math.round(speed || 0),
    getButtonText: (isRecording) => isRecording ? 'Stop': 'Start',
    saveTrack,
    openDeleteDialog: function(index) {
      this.trackIndexForDeleting = index;
      this.$refs.deleteModal.show()

    },
    deleteTrack: function() {
      const tracks = load();
      tracks.splice(this.trackIndexForDeleting, 1);
      save(tracks);
      this.tracks = tracks;
      this.$refs.deleteModal.hide()
    }
  },
  mounted: function() {
    this.tracks = stopTimeNormalizer(load());
    save(this.tracks);

    if(navigator.geolocation){
      navigator.geolocation.watchPosition(
        (position) => {
          const start = +new Date(); // speed test
          this.point = position;
          if(this.isRecording && position.coords.accuracy <= maxAccuracy) {
            this.tracks[0].dots.push(positionToObject(position));
            save(this.tracks);
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
