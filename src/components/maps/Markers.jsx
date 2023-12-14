import { Marker, Popup } from 'react-leaflet';

const markers = [
  {
    name: 'Oficina de Alumnos',
    position: {
      lat: -29.430422,
      lng: -66.868745,
    },
    icon: '/vite.svg',
  },
  {
    name: 'Comedor Universitario',
    position: {
      lat: -29.429487,
      lng: -66.871146,
    },
    icon: '/vite.svg',
  },
  {
    name: 'Biblioteca',
    position: {
      lat: -29.429927,
      lng: -66.86888,
    },
    icon: '/vite.svg',
  },
];

function Markers() {
  return markers.map((marker) => {
    return (
      <Marker key={marker.name} position={marker.position}>
        <Popup>{marker.name}</Popup>
      </Marker>
    );
  });
}

export default Markers;
