import React from "react";
import { useEffect, useRef } from "react";

export const AutoComplete: React.FC<{ map?: google.maps.Map }> = ({ map }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const autoCompleteRef = useRef<google.maps.places.Autocomplete>();

    useEffect(() => {
        if (map && inputRef.current) {
            autoCompleteRef.current =  new google.maps.places.Autocomplete(
                inputRef.current, {
                fields: ["place_id", 'geometry', "name"],
            });

            autoCompleteRef.current.bindTo("bounds", map);
            map.controls[google.maps.ControlPosition.TOP_LEFT]
                .push(inputRef.current);

            autoCompleteRef.current.addListener("place_changed", function () {
                const place = autoCompleteRef.current!.getPlace();
                if (!place.geometry || !place.geometry.location) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                };
                // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);
            }
                // console.log({ place });
            });
        }    
    }, [map, inputRef]);

    return (
        <div style={{display: 'none'}}>
            <input
                ref={inputRef}
                size={30}
                placeholder='Find your place!'
                style={{
                    fontSize: '1rem', marginTop: '15px', padding: '5px',
                    border: '2px solid black',
                }}
            />
        </div>        
    )
};