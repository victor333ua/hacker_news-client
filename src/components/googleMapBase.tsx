import React, { useRef, useState, useEffect } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface MapProps extends google.maps.MapOptions {
    onClick?: (e: google.maps.MapMouseEvent) => void;
    children?: React.ReactNode;
};

const Map: React.FC<MapProps> = ({
    onClick,
    children,
    ...options
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    useEffect(() => {
        if (mapRef.current && !map) {
            setMap(new google.maps.Map(mapRef.current, {}));
        }
    }, [mapRef, map]);

    useEffect(() => {
        if (map) map.setOptions(options);
    }, [map, options]);

    useEffect(() => {
        if (map && onClick) {
            google.maps.event.clearListeners(map, 'click')
            map.addListener("click", onClick);
        }   
    }, [map, onClick]);

    return (
        <>
            <div ref={mapRef} style={{ flexGrow: 1, height: "100%" }} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child as React.ReactElement<any>, { map });
                }
            })}  
        </> 
    )
};
interface MapBaseProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    children?: React.ReactNode;
    libraries?: ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
    // libraries?: Libraries
};
export const GoogleMapBase: React.FC<MapBaseProps> = ({
    style,
    onClick,
    children,
    libraries,
    ...options
}) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const render = (status: Status) => {
        return <h1>{status}</h1>;
    };

    return (
        <div style={{ ...style, display:"flex" }}>
            <Wrapper apiKey={apiKey!} libraries={libraries} render={render}>
                <Map onClick={onClick} {...options} >
                    {children}
                </Map>
            </Wrapper>
        </div>
    )
};



  
    