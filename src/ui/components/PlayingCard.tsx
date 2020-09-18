import React, { useRef } from 'react';
import { Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import CardFlip from 'react-native-card-flip';
import CardImgs from '../assets/img/cards';

interface FlippableCardProps {
  upFaceImg: ImageSourcePropType;
  downFaceImg: ImageSourcePropType;
}
const FlipableCard: React.FC<FlippableCardProps> = ({
  upFaceImg,
  downFaceImg,
}) => {
  const card = useRef<CardFlip>(null);
  return (
    <CardFlip ref={card} perspective={5000} duration={325} style={styles.card}>
      <TouchableOpacity onPress={() => card.current!.flip()}>
        <Image source={upFaceImg} resizeMode="contain" style={styles.card} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => card.current!.flip()}>
        <Image source={downFaceImg} resizeMode="contain" style={styles.card} />
      </TouchableOpacity>
    </CardFlip>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    height: 350,
  },
});

interface PlayingCardProps {
  suit: CardSuit;
  rank: CardRank;
  faceDown?: boolean;
}
const PlayingCard: React.FC<PlayingCardProps> = ({ suit, rank, faceDown }) => {
  const [upImg, downImg] = faceDown
    ? [CardImgs.back, CardImgs[suit][rank]]
    : [CardImgs[suit][rank], CardImgs.back];
  return <FlipableCard upFaceImg={upImg} downFaceImg={downImg} />;
};

const CardBack: React.FC = () => (
  <Image
    source={CardImgs.back}
    resizeMode="contain"
    style={{ width: '100%', height: '100%' }}
  />
);

export { CardBack };
export default PlayingCard;
