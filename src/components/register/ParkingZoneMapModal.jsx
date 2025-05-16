// components/ParkingZoneMapModal.jsx
import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import "../../css/registerStyle.css"; 

const ParkingZoneMapModal = ({
  parkingZones,
  onClose,
  onZoneSelect,
}) => {
  const handlePlacemarkClick = (zone) => {
    onZoneSelect(zone);
  };

  return (
    <div className="mapModal">
      <div className="mapClose" onClick={onClose}>✖</div>
      <div className="mapContainer">
        <YMaps>
          <Map defaultState={{ center: [51.533562, 46.034257], zoom: 13 }} width="100%" height="100%">
            {parkingZones.map((zone) => (
              <Placemark
                key={zone.id}
                geometry={[zone.latitude, zone.longitude]}
                properties={{
                  iconContent: `${zone.parkingSpacesCount} мест`,
                }}
                options={{
                  preset: 'islands#blueCircleIconWithCaption',
                  cursor: 'pointer',
                }}
                onClick={() => handlePlacemarkClick(zone)}
              />
            ))}
          </Map>
        </YMaps>
      </div>
    </div>
  );
};

export default ParkingZoneMapModal;
