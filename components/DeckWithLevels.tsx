import React from "react";
import {Text, View} from 'react-native'
import {IDeck, ILevelData} from "@/services/types/types";

interface DeckWithLevelsProps {
    deck: IDeck
    levels: ILevelData[]
}

const DeckWithLevels = ({
    deck,
    levels
}: DeckWithLevelsProps)=>{
    return (
        <View><Text>ama deck! {deck.name}. Levels: {levels.length}</Text></View>
    )
}

export default DeckWithLevels