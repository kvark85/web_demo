const v = new Vue({
  el: '#app',
  data: {
    isRecording: false,
    buttonText: 'Start',
    currentStartTime: undefined,
    point: {
      coords: {},
    },
    tracks: [],
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
    deleteTrack: function(index) {
      const tracks = load();
      tracks.splice(index, 1);
      save(tracks);
      this.tracks = tracks;
    }
  },
  mounted: function() {
    this.tracks = normalizer(load());

    if(navigator.geolocation){
      navigator.geolocation.watchPosition(
        (position) => {
          this.point = position;

          if(this.isRecording) {
            const tracks = load();
            tracks[0].dots.push(positionToObject(position));
            save(tracks);
            this.tracks = tracks;
          }
        },
        () => {},
        { maximumAge:0, enableHighAccuracy: true },
      )
    }
  }
});
