import React, { createContext, useState } from 'react'
import { MeQuery } from '../generated/graphql';

export type Me =  MeQuery | undefined | null;

export const MeContext =
   createContext<{
        me: Me,
        setMe: (me: Me) => void
    }>({ me: null, setMe: () => {} });
   

export const MeProvider: React.FC = ({ children }) => {
    const [me, setMe] = useState<Me>(null);
   
    return (
        <MeContext.Provider value={{ me, setMe }}>
            {children}
        </MeContext.Provider>
    );
}