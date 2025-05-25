import React from "react";
import { Text, View } from 'react-native';
import { IDeck, ILevelData } from "@/services/types/types";

interface DeckWithLevelsProps {
    deck: IDeck;
    levels: ILevelData[];
}

export const DeckWithLevels: React.FC<DeckWithLevelsProps> = ({
    deck,
    levels
}) => {
    return (
        <View><Text>ama deck! {deck.name}. Levels: {levels.length}</Text></View>
    );
}; 