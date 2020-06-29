import React, { useRef } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

import CardFlip from 'react-native-card-flip';
import CardImgs from '../assets/img/cards';

const FlipableCard = ({ upFaceImg, downFaceImg }) => {
  const card = useRef(null);
  return (
    <CardFlip ref={card} perspective={5000} duration={325} style={styles.card}>
      <TouchableOpacity onPress={() => card.current.flip()}>
        <Image source={upFaceImg} resizeMode="contain" style={styles.card} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => card.current.flip()}>
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

const PlayingCard = ({ suit, rank, faceup }) => {
  const [upImg, downImg] = faceup
    ? [CardImgs[suit][rank], CardImgs.back]
    : [CardImgs.back, CardImgs[suit][rank]];
  return <FlipableCard upFaceImg={upImg} downFaceImg={downImg} />;
};

const CardBack = props => (
  <Image
    source={CardImgs.back}
    resizeMode="contain"
    style={{ width: '', aspectRatio: 1.528 }}
  />
);

export { CardBack };
export default PlayingCard;
