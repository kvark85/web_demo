const startString = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
	<name>track.kml</name>
	<Style id="s_ylw-pushpin">
		<IconStyle>
			<scale>1.1</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
		<LineStyle>
			<color>ff0000ff</color>
		</LineStyle>
	</Style>
	<StyleMap id="m_ylw-pushpin">
		<Pair>
			<key>normal</key>
			<styleUrl>#s_ylw-pushpin</styleUrl>
		</Pair>
		<Pair>
			<key>highlight</key>
			<styleUrl>#s_ylw-pushpin_hl</styleUrl>
		</Pair>
	</StyleMap>
	<Style id="s_ylw-pushpin_hl">
		<IconStyle>
			<scale>1.3</scale>
			<Icon>
				<href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
			</Icon>
			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
		</IconStyle>
		<LineStyle>
			<color>ff0000ff</color>
		</LineStyle>
	</Style>
	<Placemark>
		<name>track</name>
		<description>Описание 1</description>
		<styleUrl>#m_ylw-pushpin</styleUrl>
		<LineString>
			<tessellate>1</tessellate>
			<altitudeMode>absolute</altitudeMode>
			<coordinates>
				`;
const endString = ` 
			</coordinates>
		</LineString>
	</Placemark>
</Document>
</kml>`;

// TODO: fix this cases 14:2:21 (17.11.2018)
const dateFormatter = (date) => {
  if (!date) return;

  switch (typeof date) {
    case 'string':
    case 'number':
      date = new Date(date);
  }

  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
  (${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()})`;
};

const load = () => {
  return JSON.parse(localStorage.getItem('tracks')) || [];
};

const save = (tracks) => {
  localStorage.setItem('tracks', JSON.stringify(tracks));
};

const positionToObject = (position) => {
  const { accuracy, altitude, latitude, longitude, speed } = position.coords;

  return {
    coords: { accuracy, altitude, latitude, longitude, speed },
    timestamp: position.timestamp,
  }
};

const findMinAltitude = (track) => {
  let minAltitude = Infinity;

  track.dots.forEach((dot) => {
    if (dot.coords.altitude > 0 && dot.coords.altitude < minAltitude) {
      minAltitude = dot.coords.altitude;
    };
  });

  return minAltitude;
};

const normalizer = (tracks=[]) => {
  const res = tracks.reduce((memo, track) => {
    const stopTime = track.stopTime || (track.dots[0] && track.dots[0].timestamp) || track.startTime;

    if (track.startTime === stopTime) {
      return [...memo];
    }

    return [ ...memo, { ...track, stopTime }];
  }, []);

  res.forEach((track) => {
    const minAltitude = findMinAltitude(track);

    for(let i = 0; i < track.dots.length; i++) {
      let curDot = track.dots[i];

      if (!curDot.coords.altitude) {
        const startUndefinedIndex = i;
        let endUndefinedIndex = undefined;

        for(let j = startUndefinedIndex; j < track.dots.length; j++) {
          if (track.dots[j].coords.altitude) {
            endUndefinedIndex = j;
            break;
          }
        }

        if (endUndefinedIndex) {
          const startErrorIndex =  (track.dots[startUndefinedIndex - 1] || { coords: { altitude: minAltitude } }).coords.altitude;
          const endErrorIndex =  track.dots[endUndefinedIndex ].coords.altitude;
          const deltaAltitude = (endErrorIndex - startErrorIndex)/(endUndefinedIndex - startUndefinedIndex + 1);

          for(let j = startUndefinedIndex, count = 1; j < endUndefinedIndex; j++, count++) {
            track.dots[j].coords.altitude = startErrorIndex + (deltaAltitude * count);
          }
          i = endUndefinedIndex;
        } else if (startUndefinedIndex > 0) (
          track.dots[startUndefinedIndex].coords.altitude = track.dots[startUndefinedIndex - 1].coords.altitude
        )
      }
    }
  });

  save(res);

  return res;
};

saveTrack = (index) => {
  console.log(index);
  const dotString = load()[index].dots.reduce((memo, dot) => {
    const { altitude, latitude, longitude } = dot.coords;
    return memo + `${longitude},${latitude},${altitude || 0} `;
  }, '');
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(startString + dotString + endString)
  );
  element.setAttribute('download', 'track.kml');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
